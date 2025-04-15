// app/api/dynamic-models/[modelId]/route.ts
import { handleApi } from "@/lib/apiHandler";
import { dynamicModelSchema } from "@/types/dynamicModel";
import { DynamicModel } from "@/models/Dynamic/DynamicModel";
import { TextInput, CheckboxInput, DateInput, LongTextInput, LookupInput, NumberInput } from "@/models/Dynamic/Fields";

const getModelIncludes = () => [
  { model: TextInput, as: "ModelTextInputs" },
  { model: NumberInput, as: "ModelNumberInputs" },
  { model: DateInput, as: "ModelDateInputs" },
  { model: LongTextInput, as: "ModelLongTextInputs" },
  { model: CheckboxInput, as: "ModelCheckboxInputs" },
  {
    model: LookupInput,
    as: "ModelLookupInputs",
    // through: { attributes: [] },
    // include: [
    //   { association: "searchModalColumns" },
    //   { association: "recordTableColumns" },
    // ],
  },
];

// ✏️ PUT: Update a dynamic model
export const PUT = handleApi(async ({ req, params }) => {
  const json = await req.json();
  const data = dynamicModelSchema.partial().parse(json);

  await DynamicModel.update(data, { where: { id: params?.modelId } });

  const updatedModel = await DynamicModel.findByPk(params?.modelId, { include: getModelIncludes() });
  if (!updatedModel) throw new Error("Model not found");

  const plainModel = updatedModel.get({ plain: true });

  // Flatten nested lookup fields
  // plainModel.ModelLookupInputs = plainModel.ModelLookupInputs.map((lookup: any) => ({
  //   ...lookup,
  //   searchModalColumns: lookup.searchModalColumns?.map((c: any) => c.fieldId) || [],
  //   recordTableColumns: lookup.recordTableColumns?.map((c: any) => c.fieldId) || [],
  // }));

  return plainModel
}, { authRequired: true });

// ❌ DELETE: Delete a dynamic model
export const DELETE = handleApi(async ({ params }) => {
  const deletedCount = await DynamicModel.destroy({ where: { id: params?.modelId } });

  if (deletedCount === 0) {
    throw new Error("DynamicModel not found or already deleted.");
  }

  return { id: params?.modelId };
}, { authRequired: true });

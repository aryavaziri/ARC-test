import { handleApi } from "@/lib/apiHandler";
import { DynamicModel } from "@/models/Dynamic/DynamicModel";
import { TextInput, NumberInput, DateInput, LongTextInput, CheckboxInput, LookupInput } from "@/models/Dynamic/Fields";
import { dynamicModelSchema } from "@/types/dynamicModel";

const getModelIncludes = () => [
  { model: TextInput, as: "ModelTextInputs" },
  { model: NumberInput, as: "ModelNumberInputs" },
  { model: DateInput, as: "ModelDateInputs" },
  { model: LongTextInput, as: "ModelLongTextInputs" },
  { model: CheckboxInput, as: "ModelCheckboxInputs" },
  {
    model: LookupInput,
    as: "ModelLookupInputs",
    through: { attributes: [] },
    include: [
      { association: 'searchModalColumns' },
      { association: 'recordTableColumns' }]
  },
];

// ✅ GET: Fetch all dynamic models with their fields
export const GET = handleApi(async () => {
  const models = await DynamicModel.findAll({ include: getModelIncludes() });
  const cleanModels = models.map((model) => {
    const m = model.get({ plain: true });

    m.ModelLookupInputs = m.ModelLookupInputs.map((lookup: any) => ({
      ...lookup,
      searchModalColumns: lookup.searchModalColumns?.map((c: any) => c.fieldId) || [],
      recordTableColumns: lookup.recordTableColumns?.map((c: any) => c.fieldId) || [],
    }));

    return m;
  });
  return cleanModels;
});

// ✅ POST: Create a new dynamic model (auth required)
export const POST = handleApi(async ({ req }) => {
  const json = await req.json();
  const data = dynamicModelSchema.partial({ id: true }).parse(json);
  const model = await DynamicModel.create(data);
  return model;
}, { authRequired: true });

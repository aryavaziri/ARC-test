import { handleApi } from "@/lib/apiHandler";
import { Dependency } from "@/models/Dynamic/Dependencies";
import { DynamicModel } from "@/models/Dynamic/DynamicModel";
import { TextInput, NumberInput, DateInput, LongTextInput, CheckboxInput, LookupInput } from "@/models/Dynamic/Fields";
import { dynamicModelSchema } from "@/types/dynamicModel";

const getModelIncludes = () => [
  { model: TextInput, as: "ModelTextInputs" },
  { model: NumberInput, as: "ModelNumberInputs" },
  { model: DateInput, as: "ModelDateInputs" },
  { model: LongTextInput, as: "ModelLongTextInputs" },
  { model: CheckboxInput, as: "ModelCheckboxInputs" },
  { model: LookupInput, as: "ModelLookupInputs" },
];

export const GET = handleApi(async () => {
  const models = await DynamicModel.findAll({ include: getModelIncludes() });
  const dependencies = await Dependency.findAll({ raw: true });
  const dependencyMap = new Map<string, any[]>();
  dependencies.forEach(dep => {
    const list = dependencyMap.get(dep.referenceFieldId) ?? [];
    list.push(dep);
    dependencyMap.set(dep.referenceFieldId, list);
  });

  const cleanModels = models.map((model) => {
    const m = model.get({ plain: true });

    m.ModelLookupInputs = m.ModelLookupInputs.map((lookup: any) => ({
      ...lookup,
      dependencies: dependencyMap.get(lookup.id) ?? [],
    }));

    return m;
  });
  return cleanModels;
});

export const POST = handleApi(async ({ req }) => {
  const json = await req.json();
  const data = dynamicModelSchema.partial({ id: true }).parse(json);
  const model = await DynamicModel.create(data);
  return model;
}, { authRequired: true });

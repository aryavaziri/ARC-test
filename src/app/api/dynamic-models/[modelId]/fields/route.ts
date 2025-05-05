// app/api/dynamic-models/[modelId]/fields/route.ts

import { handleApi } from "@/lib/apiHandler";
import sequelize from "@/lib/Sequelize";
import { createFieldSchema, TField } from "@/types/dynamicModel";
import { TextInput, NumberInput, DateInput, LongTextInput, CheckboxInput, LookupInput, LookupInputSearchColumn, LookupInputTableColumn, } from "@/models/Dynamic/Fields";
import { ModelTextInput, ModelNumberInput, ModelDateInput, ModelLongTextInput, ModelCheckboxInput, ModelLookupInput, } from "@/models/Dynamic/M2M";
// import { setStandardSchema } from "@/lib/schemaBuilder";
import { resetRecordLayoutAction, resetStandardSchema } from "@/actions/Dynamic/SchemaReset";

export const POST = handleApi(async ({ req, params }) => {
  const modelId = params?.modelId;
  const json = await req.json();
  const parsed = createFieldSchema.parse(json);
  const { type } = parsed;

  const fieldMap = {
    text: { model: TextInput, junction: ModelTextInput },
    number: { model: NumberInput, junction: ModelNumberInput },
    date: { model: DateInput, junction: ModelDateInput },
    longText: { model: LongTextInput, junction: ModelLongTextInput },
    checkbox: { model: CheckboxInput, junction: ModelCheckboxInput },
    lookup: { model: LookupInput, junction: ModelLookupInput },
  } as const;

  const entry = fieldMap[type as keyof typeof fieldMap];
  if (!entry) throw new Error(`Unsupported field type: ${type}`);

  const createdField = await sequelize.transaction(async (t) => {
    const field = await entry.model.create(parsed, { transaction: t });

    await entry.junction.create(
      {
        modelId: modelId,
        inputId: field.id,
      },
      { transaction: t }
    );

    return field.get({ plain: true });
  });
  if (modelId) {
    const res = await resetStandardSchema(modelId)
    const res2 = await resetRecordLayoutAction(modelId)
  }


  return {
    ...createdField,
    modelId,
    type: type as TField["type"],
  };
}, { authRequired: true });

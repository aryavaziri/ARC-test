// app/api/dynamic-models/[modelId]/fields/route.ts

import { handleApi } from "@/lib/apiHandler";
import sequelize from "@/lib/Sequelize";
import { createFieldSchema, TField } from "@/types/dynamicModel";
import { TextInput, NumberInput, DateInput, LongTextInput, CheckboxInput, LookupInput, LookupInputSearchColumn, LookupInputTableColumn, } from "@/models/Dynamic/Fields";
import { ModelTextInput, ModelNumberInput, ModelDateInput, ModelLongTextInput, ModelCheckboxInput, ModelLookupInput, } from "@/models/Dynamic/M2M";

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

    // For Lookup, add M2M entries
    if (type === "lookup") {
      const { searchModalColumns = [], recordTableColumns = [] } = parsed;

      if (searchModalColumns.length) {
        await LookupInputSearchColumn.bulkCreate(
          searchModalColumns.map((fieldId) => ({
            lookupInputId: field.id,
            fieldId,
          })),
          { transaction: t }
        );
      }

      if (recordTableColumns.length) {
        await LookupInputTableColumn.bulkCreate(
          recordTableColumns.map((fieldId) => ({
            lookupInputId: field.id,
            fieldId,
          })),
          { transaction: t }
        );
      }

      // Reload with associations
      await field.reload({
        include: [{ association: "searchModalColumns" }, { association: "recordTableColumns" }],
        transaction: t,
      });

      // Flatten for frontend
      const plain = field.get({ plain: true }) as any;
      plain.searchModalColumns = plain.searchModalColumns?.map((x: any) => x.fieldId) || [];
      plain.recordTableColumns = plain.recordTableColumns?.map((x: any) => x.fieldId) || [];

      return plain;
    }

    return field.get({ plain: true });
  });

  return {
    ...createdField,
    modelId,
    type: type as TField["type"],
  };
}, { authRequired: true });

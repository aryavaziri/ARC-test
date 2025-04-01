// app/api/dynamic-models/[modelId]/data/route.ts

import { handleApi } from "@/lib/apiHandler";
import sequelize from "@/lib/Sequelize";
import { TRecord } from "@/types/dynamicModel";
import { TextInputRecord, NumberInputRecord, DateInputRecord, LongTextInputRecord, CheckboxInputRecord, LookupInputRecord } from "@/models/Dynamic/Records";
import { LineItem } from "@/models/Dynamic/DynamicModel";

// ✅ GET Model Records
export const GET = handleApi(async ({ params }) => {
  const modelId = params?.modelId;
  if (!modelId) throw new Error("Missing modelId");
  const lineItemList = await LineItem.findAll({ where: { modelId }, raw: true });

  if (!lineItemList.length) throw new Error("No model data found")

  const groupedRecords = await Promise.all(
    lineItemList.map(async (data) => {
      const [text, number, date, longText, checkbox, lookup] = await Promise.all([
        TextInputRecord.findAll({ where: { lineItemId: data.id }, raw: true }),
        NumberInputRecord.findAll({ where: { lineItemId: data.id }, raw: true }),
        DateInputRecord.findAll({ where: { lineItemId: data.id }, raw: true }),
        LongTextInputRecord.findAll({ where: { lineItemId: data.id }, raw: true }),
        CheckboxInputRecord.findAll({ where: { lineItemId: data.id }, raw: true }),
        LookupInputRecord.findAll({ where: { lineItemId: data.id }, raw: true }),
      ]);
      return { lineItemId: data.id, text, number, date, longText, checkbox, lookup };
    })
  );

  return groupedRecords;
});

// ✅ POST Model Records
export const POST = handleApi(async ({ req, params }) => {
  const modelId = params?.modelId;
  if (!modelId) throw new Error("Missing modelId");
  const records: TRecord[] = await req.json();
  if (!Array.isArray(records)) throw new Error("Expected an array of records");

  const result = await sequelize.transaction(async (t) => {
    const lineItem = await LineItem.create({ modelId }, { transaction: t });
    const inserted = await Promise.all(
      records.map(async (record) => {
        const base = {
          lineItemId: lineItem.id,
          fieldId: record.fieldId,
          value: record.value,
        };
        let created;
        switch (record.type) {
          case "text":
            created = await TextInputRecord.create(base, { transaction: t });
            break;
          case "number":
            created = await NumberInputRecord.create(base, { transaction: t });
            break;
          case "date":
            created = await DateInputRecord.create({ ...base, value: new Date(record.value as Date) }, { transaction: t });
            break;
          case "longText":
            created = await LongTextInputRecord.create(base, { transaction: t });
            break;
          case "checkbox":
            created = await CheckboxInputRecord.create(base, { transaction: t });
            break;
          case "lookup":
            created = await LookupInputRecord.create(base, { transaction: t });
            break;
          default:
            throw new Error(`Unsupported input type: ${record.type}`);
        }

        return {
          ...(created.toJSON?.() || created),
          type: record.type,
          label: record.label ?? "",
        };
      })
    );

    return { id: lineItem.id, fields: inserted };
  });

  return result;
}, { authRequired: true });

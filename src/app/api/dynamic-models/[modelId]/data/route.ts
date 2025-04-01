import { handleApi } from "@/lib/apiHandler";
import { LineItem } from "@/models/Dynamic/DynamicModel";
import {TextInputRecord,NumberInputRecord,DateInputRecord,LongTextInputRecord,CheckboxInputRecord,LookupInputRecord} from "@/models/Dynamic/Records";

export const GET = handleApi(async ({ params }) => {
  const modelId = params?.modelId;
  if (!modelId) throw new Error("Missing modelId");

  // ✅ Find all model data records for given modelId
  const lineItemList = await LineItem.findAll({
    where: { modelId },
    raw: true,
  });

  if (!lineItemList.length) return []; // No model data yet

  const groupedRecords = await Promise.all(
    lineItemList.map(async (data) => {
      const lineItemId = data.id;

      const [text, number, date, longText, checkbox, lookup] = await Promise.all([
        TextInputRecord.findAll({ where: { lineItemId }, raw: true }),
        NumberInputRecord.findAll({ where: { lineItemId }, raw: true }),
        DateInputRecord.findAll({ where: { lineItemId }, raw: true }),
        LongTextInputRecord.findAll({ where: { lineItemId }, raw: true }),
        CheckboxInputRecord.findAll({ where: { lineItemId }, raw: true }),
        LookupInputRecord.findAll({ where: { lineItemId }, raw: true }),
      ]);

      const fields = [
        ...text.map((r) => ({ ...r, type: "text" as const })),
        ...number.map((r) => ({ ...r, type: "number" as const })),
        ...date.map((r) => ({ ...r, type: "date" as const })),
        ...longText.map((r) => ({ ...r, type: "longText" as const })),
        ...checkbox.map((r) => ({ ...r, type: "checkbox" as const })),
        ...lookup.map((r) => ({ ...r, type: "lookup" as const })),
      ];

      return {
        id: lineItemId,
        fields,
      };
    })
  );

  return groupedRecords;
});

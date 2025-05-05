// /api/dynamic-models/dependency/[fieldId]/records/route.ts
import { handleApi } from "@/lib/apiHandler";
import { z } from "zod";
// import { getFilteredLineItems } from "@/lib/data/lineItemFilter";
import { LineItem } from "@/models/Dynamic/DynamicModel";
import { CheckboxInputRecord, DateInputRecord, LongTextInputRecord, LookupInputRecord, NumberInputRecord, TextInputRecord } from "@/models/Dynamic/Records";

const requestSchema = z.object({
  controllingFieldId: z.string().uuid(),
  controllingRecordIds: z.array(z.string().uuid())
});

export const POST = handleApi(async ({ req, params }) => {
  const fieldId = params?.fieldId as string;
  if (!z.string().uuid().safeParse(fieldId).success) {
    throw new Error("Invalid referenceFieldId");
  }

  const body = await req.json();
  const { controllingFieldId, controllingRecordIds } = requestSchema.parse(body);
  console.log("controllingFieldId: ", controllingFieldId)

  const modelId = params?.modelId;
  if (!modelId) throw new Error("Missing modelId");
  const lineItemList = await LineItem.findAll({ where: { modelId, }, raw: true });
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

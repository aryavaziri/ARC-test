import { handleApi } from "@/lib/apiHandler";
import {
  TextInputRecord,
  NumberInputRecord,
  DateInputRecord,
  LongTextInputRecord,
  CheckboxInputRecord,
  LookupInputRecord
} from "@/models/Dynamic/Records";
import { LineItem } from "@/models/Dynamic/DynamicModel";

export const PUT = handleApi(async ({ req, params }) => {
  const { lineItemId } = params ?? {};
  if (!lineItemId) throw new Error("Missing lineItemId");

  const fields = await req.json();
  if (!Array.isArray(fields)) throw new Error("Expected an array of field updates");

  // ✅ 1. Perform updates
  const updatePromises = fields.map(async (field: any) => {
    const { id, value, type } = field;
    if (!id || !type) throw new Error("Each field must have an id and type");

    const recordData = { value };

    switch (type) {
      case "text":
        return TextInputRecord.update(recordData, { where: { id } });
      case "number":
        return NumberInputRecord.update(recordData, { where: { id } });
      case "date":
        return DateInputRecord.update({ value: new Date(value) }, { where: { id } });
      case "longText":
        return LongTextInputRecord.update(recordData, { where: { id } });
      case "checkbox":
        return CheckboxInputRecord.update(recordData, { where: { id } });
      case "lookup":
        return LookupInputRecord.update(recordData, { where: { id } });
      default:
        throw new Error(`Unsupported field type: ${type}`);
    }
  });

  await Promise.all(updatePromises);

  // ✅ 2. Fetch updated LineItem fields
  const [text, number, date, longText, checkbox, lookup] = await Promise.all([
    TextInputRecord.findAll({ where: { lineItemId }, raw: true }),
    NumberInputRecord.findAll({ where: { lineItemId }, raw: true }),
    DateInputRecord.findAll({ where: { lineItemId }, raw: true }),
    LongTextInputRecord.findAll({ where: { lineItemId }, raw: true }),
    CheckboxInputRecord.findAll({ where: { lineItemId }, raw: true }),
    LookupInputRecord.findAll({ where: { lineItemId }, raw: true }),
  ]);

  const fieldsGrouped = [
    ...text.map((r) => ({ ...r, type: "text" as const })),
    ...number.map((r) => ({ ...r, type: "number" as const })),
    ...date.map((r) => ({ ...r, type: "date" as const })),
    ...longText.map((r) => ({ ...r, type: "longText" as const })),
    ...checkbox.map((r) => ({ ...r, type: "checkbox" as const })),
    ...lookup.map((r) => ({ ...r, type: "lookup" as const })),
  ];

  return {
    id: lineItemId,
    fields: fieldsGrouped,
  };
}, { authRequired: true });

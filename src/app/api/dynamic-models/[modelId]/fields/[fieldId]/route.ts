// app/api/dynamic-models/[modelId]/fields/[id]/route.ts
import { handleApi } from "@/lib/apiHandler";
import sequelize from "@/lib/Sequelize";
import { TextInput, NumberInput, DateInput, LongTextInput, CheckboxInput, LookupInput, LookupInputSearchColumn, LookupInputTableColumn } from "@/models/Dynamic/Fields";
import { ModelTextInput, ModelNumberInput, ModelDateInput, ModelLongTextInput, ModelCheckboxInput, ModelLookupInput, } from "@/models/Dynamic/M2M";
import { checkboxInputSchema, dateInputSchema, fieldSchema, longTextInputSchema, lookupSchema, numberInputSchema, textInputSchema } from "@/types/dynamicModel";

export const DELETE = handleApi(async ({ params }) => {
  const { fieldId } = params ?? {};

  if (!fieldId) throw new Error("Missing field ID");
  const deletedField = await sequelize.transaction(async (t) => {
    const deleted =
      (await ModelTextInput.destroy({ where: { inputId: fieldId }, transaction: t })) ||
      (await ModelNumberInput.destroy({ where: { inputId: fieldId }, transaction: t })) ||
      (await ModelDateInput.destroy({ where: { inputId: fieldId }, transaction: t })) ||
      (await ModelLongTextInput.destroy({ where: { inputId: fieldId }, transaction: t })) ||
      (await ModelCheckboxInput.destroy({ where: { inputId: fieldId }, transaction: t })) ||
      (await ModelLookupInput.destroy({ where: { inputId: fieldId }, transaction: t }));

    await TextInput.destroy({ where: { id: fieldId }, transaction: t });
    await NumberInput.destroy({ where: { id: fieldId }, transaction: t });
    await DateInput.destroy({ where: { id: fieldId }, transaction: t });
    await LongTextInput.destroy({ where: { id: fieldId }, transaction: t });
    await CheckboxInput.destroy({ where: { id: fieldId }, transaction: t });

    await LookupInputSearchColumn.destroy({ where: { lookupInputId: fieldId }, transaction: t });
    await LookupInputTableColumn.destroy({ where: { lookupInputId: fieldId }, transaction: t });
    await LookupInput.destroy({ where: { id: fieldId }, transaction: t });

    if (!deleted) throw new Error("Field not found or already deleted");

    return { id: fieldId };
  });

  return deletedField;
}, { authRequired: true });

export const PUT = handleApi(async ({ params, req }) => {
  const { fieldId, modelId } = params ?? {};
  const body = await req.json();

  if (!fieldId || !body?.type) throw new Error("Invalid request: Missing field ID or type")

  const { type } = body;
  const updated = await sequelize.transaction(async (t) => {
    let parsed;
    let updatePayload = {};
    let updatedField;

    switch (type) {
      case "text":
        parsed = textInputSchema.partial().parse(body);
        updatePayload = {
          ...(parsed.label !== undefined && { label: parsed.label }),
          ...(parsed.isRequired !== undefined && { isRequired: parsed.isRequired }),
          ...(parsed.maxLength !== undefined && { maxLength: parsed.maxLength }),
        };
        await TextInput.update(updatePayload, { where: { id: fieldId }, transaction: t });
        updatedField = await TextInput.findByPk(fieldId, { transaction: t });
        break;

      case "number":
        parsed = numberInputSchema.partial().parse(body);
        updatePayload = {
          ...(parsed.label !== undefined && { label: parsed.label }),
          ...(parsed.isRequired !== undefined && { isRequired: parsed.isRequired }),
          ...(parsed.min !== undefined && { min: parsed.min }),
          ...(parsed.max !== undefined && { max: parsed.max }),
          ...(parsed.numberType !== undefined && { numberType: parsed.numberType }),
        };
        await NumberInput.update(updatePayload, { where: { id: fieldId }, transaction: t });
        updatedField = await NumberInput.findByPk(fieldId, { transaction: t });
        break;

      case "date":
        parsed = dateInputSchema.partial().parse(body);
        updatePayload = {
          ...(parsed.label !== undefined && { label: parsed.label }),
          ...(parsed.isRequired !== undefined && { isRequired: parsed.isRequired }),
          ...(parsed.startRange !== undefined && { startRange: parsed.startRange }),
          ...(parsed.endRange !== undefined && { endRange: parsed.endRange }),
        };
        await DateInput.update(updatePayload, { where: { id: fieldId }, transaction: t });
        updatedField = await DateInput.findByPk(fieldId, { transaction: t });
        break;

      case "checkbox":
        parsed = checkboxInputSchema.partial().parse(body);
        updatePayload = {
          ...(parsed.label !== undefined && { label: parsed.label }),
          ...(parsed.isRequired !== undefined && { isRequired: parsed.isRequired }),
        };
        await CheckboxInput.update(updatePayload, { where: { id: fieldId }, transaction: t });
        updatedField = await CheckboxInput.findByPk(fieldId, { transaction: t });
        break;

      case "longText":
        parsed = longTextInputSchema.partial().parse(body);
        updatePayload = {
          ...(parsed.label !== undefined && { label: parsed.label }),
          ...(parsed.isRequired !== undefined && { isRequired: parsed.isRequired }),
          ...(parsed.maxLength !== undefined && { maxLength: parsed.maxLength }),
        };
        await LongTextInput.update(updatePayload, { where: { id: fieldId }, transaction: t });
        updatedField = await LongTextInput.findByPk(fieldId, { transaction: t });
        break;

      case "lookup":
        parsed = lookupSchema.partial().parse(body);
        updatePayload = {
          ...(parsed.label !== undefined && { label: parsed.label }),
          ...(parsed.isRequired !== undefined && { isRequired: parsed.isRequired }),
          ...(parsed.lookupModelId !== undefined && { lookupModelId: parsed.lookupModelId }),
          ...(parsed.primaryFieldId !== undefined && { primaryFieldId: parsed.primaryFieldId }),
        };

        await LookupInput.update(updatePayload, { where: { id: fieldId }, transaction: t });

        await LookupInputSearchColumn.destroy({ where: { lookupInputId: fieldId }, transaction: t });
        await LookupInputTableColumn.destroy({ where: { lookupInputId: fieldId }, transaction: t });

        await LookupInputSearchColumn.bulkCreate(
          parsed.searchModalColumns?.map((relatedFieldId) => ({
            lookupInputId: fieldId,
            fieldId: relatedFieldId,
          })) ?? [],
          { transaction: t }
        );

        await LookupInputTableColumn.bulkCreate(
          parsed.recordTableColumns?.map((relatedFieldId) => ({
            lookupInputId: fieldId,
            fieldId: relatedFieldId,
          })) ?? [],
          { transaction: t }
        );
        updatedField = await LookupInput.findByPk(fieldId, {
          include: ['searchModalColumns', 'recordTableColumns'],
          transaction: t,
        });
        if (updatedField) {
          const plain = updatedField.get({ plain: true }) as any;
          plain.searchModalColumns = plain.searchModalColumns?.map((x: any) => x.fieldId) || [];
          plain.recordTableColumns = plain.recordTableColumns?.map((x: any) => x.fieldId) || [];
          return plain;
        }
        break;

      default:
        throw new Error(`Unsupported field type: ${type}`);
    }

    if (!updatedField) throw new Error("Field not found");
    return updatedField.get({ plain: true });
  });

  return { ...updated, modelId, type: body.type };
}, { authRequired: true });

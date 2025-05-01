'use server';

import {
  ModelTextInput, ModelNumberInput, ModelDateInput,
  ModelLongTextInput, ModelCheckboxInput, ModelLookupInput
} from "@/models/Dynamic/M2M";
import { TextInput, NumberInput, DateInput, LongTextInput, CheckboxInput, LookupInput } from "@/models/Dynamic/Fields";
import { DynamicModel, FormLayout, RecordLayout } from "@/models/Dynamic/DynamicModel";
import { handleWithTryCatch, TResponse } from "@/lib/helpers";
import { TFormLayout, TRecordLayout } from "@/types/layouts";
import sequelize from "@/lib/Sequelize";

export async function resetStandardSchema(modelId: string): Promise<TResponse> {
  return handleWithTryCatch(async () => {
    await sequelize.authenticate();
    const inputTypes = [
      { m2m: ModelTextInput, input: TextInput, type: "text" },
      { m2m: ModelNumberInput, input: NumberInput, type: "number" },
      { m2m: ModelDateInput, input: DateInput, type: "date" },
      { m2m: ModelLongTextInput, input: LongTextInput, type: "longText" },
      { m2m: ModelCheckboxInput, input: CheckboxInput, type: "checkbox" },
      { m2m: ModelLookupInput, input: LookupInput, type: "lookup" },
    ];
    let allFields: any[] = [];
    let orderCounter = 0;

    for (const { m2m, input, type } of inputTypes) {
      const joined = await m2m.findAll({ where: { modelId } });

      for (let i = 0; i < joined.length; i++) {
        const relation = joined[i];
        const field = await input.findByPk(relation.inputId);
        if (!field) continue;

        const fieldData: any = {
          fieldId: field.id,
          type,
          order: orderCounter++,
          col: 0
        };

        if (type === "lookup") {
          const lookupField = field as LookupInput;
          fieldData.lookupDetails = {
            lookupModelId: lookupField.lookupModelId,
            searchFields: [],
            fields: [],
            isCustomStyle: false,
          };
        }

        allFields.push(fieldData);
      }
    }

    // console.log(allFields)
    allFields.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    const [layout] = await FormLayout.findOrCreate({
      where: { modelId, label: "Standard" },
      defaults: {
        contentSchema: allFields,
      },
    });

    layout.contentSchema = allFields;
    await layout.save();

    return layout.get({ plain: true }) as TFormLayout;
  });
}

export async function resetRecordLayoutAction(modelId: string): Promise<TResponse> {
  return handleWithTryCatch(async () => {
    await sequelize.authenticate();

    const inputTypes = [
      { m2m: ModelTextInput, input: TextInput, type: "text" },
      { m2m: ModelNumberInput, input: NumberInput, type: "number" },
      { m2m: ModelDateInput, input: DateInput, type: "date" },
      { m2m: ModelLongTextInput, input: LongTextInput, type: "longText" },
      { m2m: ModelCheckboxInput, input: CheckboxInput, type: "checkbox" },
      { m2m: ModelLookupInput, input: LookupInput, type: "lookup" },
    ];

    let allFields: any[] = [];
    let orderCounter = 0;

    for (const { m2m, input, type } of inputTypes) {
      const joined = await m2m.findAll({ where: { modelId } });

      for (let i = 0; i < joined.length; i++) {
        const relation = joined[i];
        const field = await input.findByPk(relation.inputId);
        if (!field) continue;

        const fieldData: any = {
          fieldId: field.id,
          type,
          order: orderCounter++,
        };

        if (type === "lookup") {
          const lookupField = field as LookupInput;
          fieldData.lookupDetails = {
            lookupModelId: lookupField.lookupModelId,
            fields: [], // you can populate this if needed later
          };
        }

        allFields.push(fieldData);
      }
    }

    allFields.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    const [layout] = await RecordLayout.findOrCreate({
      where: { modelId, label: "Standard", isGrid: true },
      defaults: {
        contentSchema: allFields,
      },
    });

    layout.contentSchema = allFields;
    await layout.save();

    return layout.get({ plain: true }) as TRecordLayout;
  });
}

export async function resetAllRecordLayouts(): Promise<TResponse> {
  return handleWithTryCatch(async () => {
    await sequelize.authenticate();

    // 🗑️ Step 1: Delete all existing record layouts
    await RecordLayout.destroy({ where: {}, truncate: true });

    // 📦 Step 2: Get all dynamic model IDs
    const models = await DynamicModel.findAll({ attributes: ['id'] });
    const modelIds = models.map(m => m.id);

    // 🧠 Step 3: Recreate a new "Standard" layout for each model
    for (const modelId of modelIds) {
      await resetRecordLayoutAction(modelId);
    }

    return { success: true, message: `Reset layouts for ${modelIds.length} models.` };
  });
}
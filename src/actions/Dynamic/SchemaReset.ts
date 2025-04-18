'use server';

import {
  ModelTextInput, ModelNumberInput, ModelDateInput,
  ModelLongTextInput, ModelCheckboxInput, ModelLookupInput
} from "@/models/Dynamic/M2M";
import { TextInput, NumberInput, DateInput, LongTextInput, CheckboxInput, LookupInput } from "@/models/Dynamic/Fields";
import { FormLayout } from "@/models/Dynamic/DynamicModel";
import { handleWithTryCatch, TResponse } from "@/lib/helpers";
import { TFormLayout } from "@/types/layouts";
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
          order: orderCounter++, // 👈 use global counter instead of i
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

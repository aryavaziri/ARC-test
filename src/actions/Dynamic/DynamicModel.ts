'use server'

import { handleWithTryCatch } from "@/lib/helpers"
import sequelize from "@/lib/Sequelize"
// import { DynamicModel } from "@/models/Dynamic/DynamicModel"
import { CheckboxInput } from "@/models/Dynamic/Fields/CheckboxInput"
import { DateInput } from "@/models/Dynamic/Fields/DateInput"
import { LongTextInput } from "@/models/Dynamic/Fields/LongTextInput"
import { LookupInput } from "@/models/Dynamic/Fields/LookupInput"
import { NumberInput } from "@/models/Dynamic/Fields/NumberInput"
import { TextInput } from "@/models/Dynamic/Fields/TextInput"
import { ModelCheckboxInput, ModelDateInput, ModelLongTextInput, ModelLookupInput, ModelNumberInput, ModelTextInput } from "@/models/Dynamic/M2M"

export const createInputField = async (data: any) => {
  return handleWithTryCatch(async () => {
    await sequelize.authenticate();
    let res;
    console.log(data);
    switch (data.type) {
      case 'text':
        res = await TextInput.create(data, { raw: true });
        await ModelTextInput.create({
          modelId: data.modelId,
          inputId: res.id,
        });
        break;

      case 'number':
        res = await NumberInput.create(data, { raw: true });
        await ModelNumberInput.create({
          modelId: data.modelId,
          inputId: res.id,
        });
        break;

      case 'checkbox':
        res = await CheckboxInput.create(data, { raw: true });
        await ModelCheckboxInput.create({
          modelId: data.modelId,
          inputId: res.id,
        });
        break;

      case 'longText':
        res = await LongTextInput.create(data, { raw: true });
        await ModelLongTextInput.create({
          modelId: data.modelId,
          inputId: res.id,
        });
        break;

      case 'date':
        res = await DateInput.create(data, { raw: true });
        await ModelDateInput.create({
          modelId: data.modelId,
          inputId: res.id,
        });
        break;

        case 'lookup':
        res = await LookupInput.create(data, { raw: true });
        await ModelLookupInput.create({
          modelId: data.modelId,
          inputId: res.id,
        });
        break;

      // handle more types...

      default:
        throw new Error("Unsupported input type");
    }

    return res;
  });
};

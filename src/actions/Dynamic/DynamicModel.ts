'use server'

import { handleWithTryCatch } from "@/lib/helpers"
import sequelize from "@/lib/Sequelize"
// import { DynamicModel } from "@/models/Dynamic/DynamicModel"
import { CheckboxInput } from "@/models/Dynamic/Fields/CheckboxInput"
import { DateInput } from "@/models/Dynamic/Fields/DateInput"
import { LongTextInput } from "@/models/Dynamic/Fields/LongTextInput"
import { NumberInput } from "@/models/Dynamic/Fields/NumberInput"
import { TextInput } from "@/models/Dynamic/Fields/TextInput"
import { ModelCheckboxInput, ModelDateInput, ModelLongTextInput, ModelNumberInput, ModelTextInput } from "@/models/Dynamic/M2M"

// import { ModelTextInput } from '@/db/models/Fields/Relations/ModelTextInput';
// import { ModelNumberInput } from '@/db/models/Fields/Relations/ModelNumberInput';
// import { ModelDateInput } from '@/db/models/Fields/Relations/ModelDateInput';
// import { ModelLongTextInput } from '@/db/models/Fields/Relations/ModelLongTextInput';


// export const getAllModels = async () => {
//   return handleWithTryCatch(async () => {
//     await sequelize.authenticate();
//     const models = await DynamicModel.findAll({ raw: true })
//     return models
//   })
// }


// export const addSampleModel = async () => {
//   return handleWithTryCatch(async () => {
//     await sequelize.authenticate();
//     await DynamicModel.create({ name: "Sales Orders" })
//     return
//   })
// }

// export const getModelInputs = async (modelId?: string | undefined) => {
//   return handleWithTryCatch(async () => {
//     if (!modelId) return
//     await sequelize.authenticate();

//     const textInputs = await ModelTextInput.findAll({
//       where: { modelId },
//       include: [{ model: TextInput, as: "input" }],
//     });

//     const formatted = textInputs.map((record) => {
//       const plain = record.get({ plain: true });
//       return plain;
//     });

//     return formatted;
//   });
// };

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
        res = await DateInput.create(
          //   {
          //   ...data, startRange: new Date(data.startRange),
          //   endRange: new Date(data.endRange),
          // }
          data, { raw: true });
        await ModelDateInput.create({
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

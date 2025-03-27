import { NextRequest, NextResponse } from "next/server";
import { handleWithTryCatch } from "@/lib/helpers";
import { auth } from "@/auth";
import sequelize from "@/lib/Sequelize";

import { DynamicModel } from "@/models/Dynamic/DynamicModel";
import { TextInput } from "@/models/Dynamic/Fields/TextInput";
import { NumberInput } from "@/models/Dynamic/Fields/NumberInput";
import { DateInput } from "@/models/Dynamic/Fields/DateInput";
import { LongTextInput } from "@/models/Dynamic/Fields/LongTextInput";

// Adjust if you're using through models explicitly:
import {
  TextInputRecord,
  NumberInputRecord,
  DateInputRecord,
  LongTextInputRecord,
} from "@/models/Dynamic/Records";
import { CheckboxInput } from "@/models/Dynamic/Fields/CheckboxInput";

// ✅ GET all models with associated inputs
export async function GET(req: NextRequest) {
  await sequelize.authenticate();

  const res = await handleWithTryCatch(async () => {
    const models = await DynamicModel.findAll({
      include: [
        { model: TextInput, as: "ModelTextInputs" },
        { model: NumberInput, as: "ModelNumberInputs" },
        { model: DateInput, as: "ModelDateInputs" },
        { model: LongTextInput, as: "ModelLongTextInputs" },
        { model: CheckboxInput, as: "ModelCheckboxInputs" },
      ],
    });

    return models;
  });

  return NextResponse.json(res, { status: res.success ? 200 : 500 });
}

// ✅ POST: create model and associate inputs
export async function POST(req: NextRequest) {
  await sequelize.authenticate();
  const session = await auth();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const res = await handleWithTryCatch(async () => {
    const json = await req.json();
    const { name, layoutType, description, TextInputs = [], NumberInputs = [], DateInputs = [], LongTextInputs = [] } = json;

    const model = await sequelize.transaction(async (t) => {
      const dynamic = await DynamicModel.create(
        { name, layoutType, description },
        { transaction: t }
      );

      // Link M2M inputs (TextInputs, etc.)
      for (const input of TextInputs) {
        await TextInputRecord.create(
          { modelId: dynamic.id, inputId: input.id },
          { transaction: t }
        );
      }

      for (const input of NumberInputs) {
        await NumberInputRecord.create(
          { modelId: dynamic.id, inputId: input.id },
          { transaction: t }
        );
      }

      for (const input of DateInputs) {
        await DateInputRecord.create(
          { modelId: dynamic.id, inputId: input.id },
          { transaction: t }
        );
      }

      for (const input of LongTextInputs) {
        await LongTextInputRecord.create(
          { modelId: dynamic.id, inputId: input.id },
          { transaction: t }
        );
      }

      return dynamic;
    });

    return model;
  });

  return NextResponse.json(res, { status: res.success ? 200 : 500 });
}

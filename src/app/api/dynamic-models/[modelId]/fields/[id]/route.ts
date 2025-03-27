import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import sequelize from '@/lib/Sequelize';
import { handleWithTryCatch } from '@/lib/helpers';

// Models
import { TextInput } from '@/models/Dynamic/Fields/TextInput';
import { NumberInput } from '@/models/Dynamic/Fields/NumberInput';
import { DateInput } from '@/models/Dynamic/Fields/DateInput';
import { CheckboxInput } from '@/models/Dynamic/Fields/CheckboxInput';
import { LongTextInput } from '@/models/Dynamic/Fields/LongTextInput';

import {
  ModelTextInput,
  ModelNumberInput,
  ModelDateInput,
  ModelCheckboxInput,
  ModelLongTextInput,
} from '@/models/Dynamic/M2M';

export async function DELETE(_: NextRequest, { params }: { params: { modelId: string; id: string } }) {
  await sequelize.authenticate();
  const session = await auth();
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const res = await handleWithTryCatch(async () => {
    const { id: fieldId } = params;


    // Try delete from all input types (safe approach)
    console.log(fieldId)
    const deleted =
      (await ModelTextInput.destroy({ where: { inputId: fieldId } })) ||
      (await ModelNumberInput.destroy({ where: { inputId: fieldId } })) ||
      (await ModelDateInput.destroy({ where: { inputId: fieldId } })) ||
      (await ModelLongTextInput.destroy({ where: { inputId: fieldId } })) ||
      (await ModelCheckboxInput.destroy({ where: { inputId: fieldId } }));

    // Also delete the actual input field if it exists
    await TextInput.destroy({ where: { id: fieldId } });
    await NumberInput.destroy({ where: { id: fieldId } });
    await DateInput.destroy({ where: { id: fieldId } });
    await LongTextInput.destroy({ where: { id: fieldId } });
    await CheckboxInput.destroy({ where: { id: fieldId } });

    if (!deleted) throw new Error('Field not found or already deleted.');

    return { id: fieldId };
  });

  return NextResponse.json(res, { status: res.success ? 200 : 500 });
}

import { NextRequest, NextResponse } from 'next/server';
import sequelize from '@/lib/Sequelize';
import { handleWithTryCatch } from '@/lib/helpers';
import { auth } from '@/auth';

import { TextInputRecord, NumberInputRecord, DateInputRecord, LongTextInputRecord, CheckboxInputRecord } from '@/models/Dynamic/Records'
import { TRecord } from '@/types/dynamicModel';
import { LineItem } from '@/models/Dynamic/DynamicModel';

export async function DELETE(_: NextRequest, { params }: { params: { lineItemId: string } }) {
  await sequelize.authenticate();
  const session = await auth();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const res = await handleWithTryCatch(async () => {
    const deletedCount = await LineItem.destroy({
      where: { id: params.lineItemId },
    });

    if (deletedCount === 0) {
      throw new Error("LineItem not found or already deleted.");
    }

    return { id: params.lineItemId };
  });

  return NextResponse.json(res, { status: res.success ? 200 : 500 });
}

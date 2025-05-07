// api/dynamic-models/[modelId]/data/[lineItemId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import sequelize from '@/lib/Sequelize';
import { handleWithTryCatch } from '@/lib/helpers';
import { auth } from '@/auth';
import { TextInputRecord, NumberInputRecord, DateInputRecord, LongTextInputRecord, CheckboxInputRecord, LookupInputRecord } from '@/models/Dynamic/Records'
import { LineItem } from '@/models/Dynamic/DynamicModel';
import { handleApi } from '@/lib/apiHandler';

export async function DELETE(_: NextRequest, { params }: { params: { lineItemId: string } }) {
  await sequelize.authenticate();
  const session = await auth();
  if (!session) { return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 }) }

  const res = await handleWithTryCatch(async () => {
    const deletedCount = await LineItem.destroy({ where: { id: params.lineItemId } });
    if (deletedCount === 0) { throw new Error("LineItem not found or already deleted.") }
    return { id: params.lineItemId };
  });
  return NextResponse.json(res, { status: res.success ? 200 : 500 });
}

export const POST = handleApi(async ({ params, req }) => {
  const { lineItemId } = params ?? {};
  const { primaryFieldId } = await req.json();

  if (!lineItemId) throw new Error("Missing field ID");

  const lineItem = await LineItem.findByPk(lineItemId);
  if (!lineItem) throw new Error("No Matching LineItem");

  const tryModels = async () => {
    let res;
    res = await TextInputRecord.findAll({ where: { lineItemId, fieldId: primaryFieldId }, raw: true });
    if (res.length) return res;
    res = await NumberInputRecord.findAll({ where: { lineItemId, fieldId: primaryFieldId }, raw: true });
    if (res.length) return res;
    res = await DateInputRecord.findAll({ where: { lineItemId, fieldId: primaryFieldId }, raw: true });
    if (res.length) return res;
    res = await LongTextInputRecord.findAll({ where: { lineItemId, fieldId: primaryFieldId }, raw: true });
    if (res.length) return res;
    res = await CheckboxInputRecord.findAll({ where: { lineItemId, fieldId: primaryFieldId }, raw: true });
    if (res.length) return res;
    res = await LookupInputRecord.findAll({ where: { lineItemId, fieldId: primaryFieldId }, raw: true });
    if (res.length) return res;
    return []; // Fallback if no results found
  };
  const test = await tryModels();
  return String(test[0].value)
}, { authRequired: true });
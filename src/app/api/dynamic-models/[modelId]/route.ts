import { NextRequest, NextResponse } from 'next/server';
import { dynamicModelSchema } from '@/types/dynamicModel'; // Adjust path if needed
import { handleWithTryCatch } from '@/lib/helpers';
import { DynamicModel } from '@/models/Dynamic/DynamicModel';
import sequelize from '@/lib/Sequelize';
import { auth } from '@/auth';

export async function PUT(req: NextRequest, { params }: { params: { modelId: string } }) {
  await sequelize.authenticate();
  const session = await auth();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const res = await handleWithTryCatch(async () => {
    const json = await req.json();
    const parsed = dynamicModelSchema.partial().parse(json); // Validate partial update
    await DynamicModel.update(parsed, { where: { id: params.modelId } });

    const updated = await DynamicModel.findByPk(params.modelId, { raw: true });
    return updated;
  });

  return NextResponse.json(res, { status: res.success ? 200 : 500 });
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  await sequelize.authenticate();
  const session = await auth();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const res = await handleWithTryCatch(async () => {
    const deletedCount = await DynamicModel.destroy({
      where: { id: params.id },
    });

    if (deletedCount === 0) {
      throw new Error("DynamicModel not found or already deleted.");
    }

    return { id: params.id };
  });

  return NextResponse.json(res, { status: res.success ? 200 : 500 });
}

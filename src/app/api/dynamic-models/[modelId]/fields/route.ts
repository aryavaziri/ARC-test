// app/api/dynamic-models/[modelId]/fields/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createInputField } from '@/actions/Dynamic/DynamicModel';
import { auth } from '@/auth';

export async function POST(req: NextRequest, { params }: { params: { modelId: string } }) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const modelId = params.modelId;
  // console.log(params)

  const result = await createInputField({ ...body, modelId });
  return NextResponse.json(result, { status: result.success ? 200 : 500 });
}

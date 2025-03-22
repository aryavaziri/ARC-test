import { NextRequest, NextResponse } from 'next/server';
import { customerSchema } from '@/types/customer';
import { handleWithTryCatch } from '@/lib/helpers';
import { Customer } from '@/models/Customer/Customer'; // adjust path as needed
import sequelize from '@/lib/Sequelize';
import { auth } from '@/auth';
import { getToken } from "next-auth/jwt";

export async function POST(req: NextRequest) {
  await sequelize.authenticate();
  const session = await auth();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  const res = await handleWithTryCatch(async () => {
    const json = await req.json();
    const parsed = customerSchema.partial({ id: true }).parse(json);
    const customer = await Customer.create({ ...parsed });
    return customer;
  });

  return NextResponse.json(res, { status: res.success ? 200 : 500 });
}

export async function GET(req: NextRequest) {
  await sequelize.authenticate();
  const res = await handleWithTryCatch(async () => {
    const customers = await Customer.findAll({ raw: true })
    return customers;
  });
  return NextResponse.json(res, { status: res.success ? 200 : 500 });
}

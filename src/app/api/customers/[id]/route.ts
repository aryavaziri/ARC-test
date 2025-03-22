import { NextRequest, NextResponse } from 'next/server';
import { customerSchema } from '@/types/customer';
import { handleWithTryCatch } from '@/lib/helpers';
import { Customer } from '@/models/Customer/Customer';
import sequelize from '@/lib/Sequelize';
import { auth } from '@/auth';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    await sequelize.authenticate();
    const session = await auth();
    if (!session) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    const res = await handleWithTryCatch(async () => {
        const json = await req.json();
        const parsed = customerSchema.partial().parse(json);
        await Customer.update(parsed, { where: { id: params.id } })
        const updatedCustomer = await Customer.findByPk(params.id, { raw: true })
        return updatedCustomer;
    });
    return NextResponse.json(res, { status: res.success ? 200 : 500 });
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    await sequelize.authenticate();
    const res = await handleWithTryCatch(async () => {
        const deletedCount = await Customer.destroy({
            where: { id: params.id },
        });
        if (deletedCount === 0) {
            throw new Error("Customer not found or already deleted.");
        }
        return { id: params.id };
    });

    return NextResponse.json(res, { status: res.success ? 200 : 500 });
}

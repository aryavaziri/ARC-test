import { NextRequest, NextResponse } from 'next/server';
import sequelize from '@/lib/Sequelize';
import { handleWithTryCatch } from '@/lib/helpers';
import { auth } from '@/auth';

import { TextInputRecord, NumberInputRecord, DateInputRecord, LongTextInputRecord, CheckboxInputRecord } from '@/models/Dynamic/Records'
export async function GET(_: NextRequest, { params }: { params: { modelId: string } }) {
    await sequelize.authenticate();

    const res = await handleWithTryCatch(async () => {
        const { modelId } = params;

        const [text, number, date, longText, checkbox] = await Promise.all([
            TextInputRecord.findAll({ where: { modelId }, raw: true }),
            NumberInputRecord.findAll({ where: { modelId }, raw: true }),
            DateInputRecord.findAll({ where: { modelId }, raw: true }),
            LongTextInputRecord.findAll({ where: { modelId }, raw: true }),
            CheckboxInputRecord.findAll({ where: { modelId }, raw: true }),
        ]);

        return { text, number, date, longText, checkbox };
    });
    console.log(res.data)

    return NextResponse.json(res, { status: res.success ? 200 : 500 });
}

export async function POST(req: NextRequest, { params }: { params: { modelId: string } }) {
    await sequelize.authenticate();
    const session = await auth();
    if (!session) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const res = await handleWithTryCatch(async () => {
        const { modelId } = params;
        const records = await req.json();

        if (!Array.isArray(records)) {
            throw new Error("Expected an array of records");
        }

        const results = await Promise.all(
            records.map(async (record: any) => {
                const base = {
                    modelId,
                    fieldId: record.fieldId,
                    value: record.value,
                };

                switch (record.type) {
                    case 'text':
                        return await TextInputRecord.create(base);
                    case 'number':
                        return await NumberInputRecord.create(base);
                    case 'date':
                        return await DateInputRecord.create({ ...base, value: new Date(record.value) });
                    case 'longText':
                        return await LongTextInputRecord.create(base);
                    case 'checkbox':
                        return await CheckboxInputRecord.create(base);
                    default:
                        throw new Error(`Unsupported input type: ${record.type}`);
                }
            })
        );

        return results;
    });

    return NextResponse.json(res, { status: res.success ? 200 : 500 });
}

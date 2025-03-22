import { NextRequest, NextResponse } from 'next/server'

export const GET = async (request: NextRequest) => {
    console.log(request)
    return NextResponse.json({ data: 'Sample data' }, { status: 200 })
}

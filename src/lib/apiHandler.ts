import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { auth } from "@/auth";
import sequelize from "@/lib/Sequelize";

// 🧠 Handler context type
type HandlerContext = {
    req: NextRequest;
    params?: Record<string, string>;
    session?: any;
};

// 🔁 Main wrapper
export function handleApi<T = any>(
    fn: (ctx: HandlerContext) => Promise<T>,
    options: { authRequired?: boolean } = { }
) {
    return async (req: NextRequest, context: { params?: Record<string, string> }) => {
        try {
            await sequelize.authenticate();

            let session;
            if (options.authRequired!!) {
                session = await auth(); // now it correctly uses the imported function
                if (!session) {
                    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
                }
            }

            const data = await fn({ req, params: context.params, session });

            return NextResponse.json({ success: true, data }, { status: 200 });
        } catch (error) {
            // console.error("API Error:", (error as Error).message);
            console.error("API Error:", (error as Error));

            if (error instanceof ZodError) {
                return NextResponse.json(
                    { success: false, error: "Validation Error: " + error.errors.map(e => e.message).join(", ") },
                    { status: 400 }
                );
            }

            return NextResponse.json(
                { success: false, error: (error as Error).message || "Unexpected error" },
                { status: 500 }
            );
        }
    };
}

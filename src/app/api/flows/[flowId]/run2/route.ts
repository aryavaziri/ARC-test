import { NextRequest, NextResponse } from "next/server";
import { DynamicModel, FormLayout, RecordLayout } from "@/models/Dynamic/DynamicModel";
import { Flow } from "@/models/Flow/Flow";
import sequelize from "@/lib/Sequelize";
import { auth } from "@/auth";
import { PageLayout } from "@/models/Layout/PageLayout";

function normalizeInput(input: Record<string, any>): any {
  if (typeof input === "string") {
    try {
      return JSON.parse(input);
    } catch (err) {
      return { raw: input };
    }
  }

  if (typeof input === "object" && input !== null) {
    return input;
  }

  return { raw: input };
}



export const POST = async (req: NextRequest, context: { params?: Record<string, string> }) => {
  try {
    await sequelize.authenticate();

    const session = await auth();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const flowId = context.params?.flowId;
    if (!flowId) {
      return NextResponse.json({ success: false, error: "Missing flowId" }, { status: 400 });
    }

    const flow = await Flow.findByPk(flowId);
    if (!flow?.script) {
      return NextResponse.json({ success: false, error: "Flow not found or missing script" }, { status: 404 });
    }

    let input: any = undefined;

    try {
      input = await req.json();
      // console.log(body);
      // input = normalizeInput(body.input);
      // inputStore = typeof input === 'object' && input !== null ? { ...input } : {};
    } catch (err) {
      console.warn("⚠️ Failed to parse request JSON, input will be undefined.");
    }

    // console.log(input);
    const { values: formValues, pageLayoutId, formLayoutId } = input ?? {}
    // console.log(formValues);
    const rawParams = req.nextUrl.searchParams;
    const params = Object.fromEntries(rawParams.entries());
    // console.log(params);

    // console.log("Get Value", getValue(input));

    const fn = new Function("deps", `
      const { DynamicModel, FormLayout,RecordLayout, PageLayout, input, params, formValues,formLayoutId } = deps;
      return (async () => {
        ${flow.script}
      })();
    `);

    const result = await fn({
      input,
      DynamicModel, FormLayout, RecordLayout, PageLayout,
      params,
      formValues,
      formLayoutId
    });

    if (result instanceof NextResponse) {
      return result;
    }

    return NextResponse.json({ success: true, data: result }, { status: 200 });

  } catch (error) {
    console.error("API Error:", (error as Error).message);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
};

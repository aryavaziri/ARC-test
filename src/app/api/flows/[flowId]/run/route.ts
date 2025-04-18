import { handleApi } from "@/lib/apiHandler";
import { DynamicModel } from "@/models/Dynamic/DynamicModel";
import { Flow } from "@/models/Flow/Flow";


export const PUT = handleApi(async ({ req, params }) => {
  const flowId = params?.flowId;
  if (!flowId) throw new Error("Missing flowId in params");

  const flow = await Flow.findByPk(flowId);
  if (!flow?.script) throw new Error("Flow not found or missing script");

  const input = await req.json();

  const fn = new Function("deps", `
    const { DynamicModel, input } = deps;
    return (async () => {
      ${flow.script}
    })();
  `);

  const result = await fn({ input, DynamicModel });
  return result;
}, { authRequired: true });

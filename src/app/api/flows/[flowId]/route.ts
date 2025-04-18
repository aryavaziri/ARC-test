import { handleApi } from "@/lib/apiHandler";
import { Flow } from "@/models/Flow/Flow";
import { flowSchema } from "@/types/flow";

export const PUT = handleApi(async ({ req, params }) => {
    const json = await req.json();
    const data = flowSchema.omit({ id: true }).parse(json);

    const flowId = params?.flowId;
    if (!flowId) throw new Error("Missing flowId in params");

    const flow = await Flow.findByPk(flowId);
    if (!flow) throw new Error("Flow not found");

    await flow.update(data);
    return flow.get({ plain: true });
}, { authRequired: true });

export const DELETE = handleApi(async ({ params }) => {
    const deletedCount = await Flow.destroy({ where: { id: params?.flowId } });
    if (deletedCount === 0) throw new Error("Flow not found or already deleted.");
    return { id: params?.flowId };
}, { authRequired: true });

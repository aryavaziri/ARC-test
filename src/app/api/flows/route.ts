import { handleApi } from "@/lib/apiHandler";
import { Flow } from "@/models/Flow/Flow";
import { flowSchema } from "@/types/flow";

export const GET = handleApi(async () => {
    const flows = await Flow.findAll();
    return flows.map((flow) => flow.get({ plain: true }));
});

export const POST = handleApi(async ({ req }) => {
    const json = await req.json();
    const data = flowSchema.partial({ id: true }).parse(json);
    const createdFlow = await Flow.create(data);
    return createdFlow;
}, { authRequired: true });

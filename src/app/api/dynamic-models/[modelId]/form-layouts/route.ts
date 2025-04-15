import { handleApi } from "@/lib/apiHandler";
import { FormLayout } from "@/models/Dynamic/DynamicModel";
import { formLayoutSchema } from "@/types/layouts";

export const GET = handleApi(async ({ params }) => {
    const modelId = params?.modelId;
    if (modelId == 'all') {
        const layouts = await FormLayout.findAll();
        return layouts.map(p => p.get({ plain: true }))
    } else {
        const layouts = await FormLayout.findAll({ where: { modelId } });
        return layouts.map(p => p.get({ plain: true }))
    }
});

export const POST = handleApi(async ({ req }) => {
    const json = await req.json();
    const data = formLayoutSchema.partial({ id: true, contentSchema: true }).parse(json);
    const layout = await FormLayout.create({ ...data, contentSchema: [] });
    return layout;
}, { authRequired: true });

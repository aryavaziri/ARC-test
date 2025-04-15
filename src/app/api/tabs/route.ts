import { handleApi } from "@/lib/apiHandler";
import { TabModel } from "@/models/Layout/Tabs";
import { tabSchema } from "@/types/layouts";

export const GET = handleApi(async () => {
    const models = await TabModel.findAll();
    return models.map((model) => model.get({ plain: true }));
});

export const POST = handleApi(async ({ req }) => {
    const json = await req.json();
    const data = tabSchema.partial({ id: true }).parse(json);
    const model = await TabModel.create(data);
    return model;
}, { authRequired: true });

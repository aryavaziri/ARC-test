import { handleApi } from "@/lib/apiHandler";
import { TabModel } from "@/models/Layout/Tabs";
import { tabSchema } from "@/types/layouts";

export const PUT = handleApi(async ({ req, params }) => {
    const json = await req.json();
    const data = tabSchema.omit({ id: true }).parse(json);
    const tabId = params?.tabId;
    if (!tabId) throw new Error("Missing tabId in params");
    const tab = await TabModel.findByPk(tabId);
    if (!tab) throw new Error("Tab not found");
    await tab.update({ ...data });
    return tab.get({ plain: true });
}, { authRequired: true });

export const DELETE = handleApi(async ({ params }) => {
    const deletedCount = await TabModel.destroy({ where: { id: params?.tabId } });
    if (deletedCount === 0) throw new Error("Tab not found or already deleted.");
    return { id: params?.tabId };
}, { authRequired: true });

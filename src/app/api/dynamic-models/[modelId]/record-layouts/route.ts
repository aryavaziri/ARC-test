import { handleApi } from "@/lib/apiHandler";
import { RecordLayout } from "@/models/Dynamic/DynamicModel"; // adjust if it's a separate file
import { recordLayoutSchema } from "@/types/layouts";

export const GET = handleApi(async ({ params }) => {
  const modelId = params?.modelId;

  if (modelId === "all") {
    const layouts = await RecordLayout.findAll();
    return layouts.map((l) => l.get({ plain: true }));
  } else {
    const layouts = await RecordLayout.findAll({ where: { modelId } });
    return layouts.map((l) => l.get({ plain: true }));
  }
});

export const POST = handleApi(async ({ req }) => {
  const json = await req.json();
  const data = recordLayoutSchema.partial({ id: true, contentSchema: true }).parse(json);
  const layout = await RecordLayout.create({ ...data, contentSchema: [] });
  return layout;
}, { authRequired: true });

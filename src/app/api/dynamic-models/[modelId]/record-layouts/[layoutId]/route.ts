import { handleApi } from '@/lib/apiHandler';
import sequelize from '@/lib/Sequelize';
import { RecordLayout } from '@/models/Dynamic/DynamicModel'; // adjust path if necessary
import { recordLayoutSchema } from '@/types/layouts';

export const DELETE = handleApi(async ({ params }) => {
  const { layoutId } = params ?? {};

  if (!layoutId) throw new Error("Missing layout ID");

  const deletedLayout = await sequelize.transaction(async (t) => {
    const deleted = await RecordLayout.destroy({ where: { id: layoutId }, transaction: t });

    if (!deleted) throw new Error("RecordLayout not found or already deleted");

    return { id: layoutId };
  });

  return deletedLayout;
}, { authRequired: true });

export const PUT = handleApi(async ({ params, req }) => {
  const { layoutId } = params ?? {};
  if (!layoutId) throw new Error("Missing layout ID");

  const body = await req.json();
  const layout = await RecordLayout.findByPk(layoutId);
  if (!layout) throw new Error("Layout not found");

  const data = recordLayoutSchema.partial().parse(body);
  await layout.update(data);
  return layout.get({ plain: true });
}, { authRequired: true });

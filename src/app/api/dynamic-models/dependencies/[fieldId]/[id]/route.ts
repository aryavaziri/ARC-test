import { handleApi } from "@/lib/apiHandler";
import { Dependency } from "@/models/Dynamic/Dependencies";
import { dependencySchema } from "@/types/dynamicModel";
import { z } from "zod";

// ✅ DELETE: Remove a dependency by ID
export const DELETE = handleApi(async ({ params }) => {
  const id = params?.id as string;

  if (!z.string().uuid().safeParse(id).success) {
    throw new Error("Invalid dependency ID");
  }

  const deleted = await Dependency.destroy({ where: { id } });

  if (!deleted) throw new Error("Dependency not found or already deleted");

  return { success: true };
}, { authRequired: true });

// ✅ PUT: Update a dependency by ID
export const PUT = handleApi(async ({ req, params }) => {
  const id = params?.id as string;

  if (!z.string().uuid().safeParse(id).success) {
    throw new Error("Invalid dependency ID");
  }

  const json = await req.json();
  const data = dependencySchema.omit({ id: true }).partial().parse(json);

  const [updatedCount, updatedRows] = await Dependency.update(data, {
    where: { id },
    returning: true,
  });

  if (updatedCount === 0) throw new Error("Dependency not found");

  return updatedRows[0];
}, { authRequired: true });

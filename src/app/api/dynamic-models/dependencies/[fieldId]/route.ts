// /api/dynamic-models/dependency/[fieldId]/route.ts
import { handleApi } from "@/lib/apiHandler";
import { Dependency } from "@/models/Dynamic/Dependencies";
import { dependencySchema } from "@/types/dynamicModel";
import { z } from "zod";

// ✅ GET: Fetch all dependencies for a given referenceFieldId
export const GET = handleApi(async ({ params }) => {
  const fieldId = params?.fieldId as string;
  if (!z.string().uuid().safeParse(fieldId).success) {
    throw new Error("Invalid fieldId");
  }

  const dependencies = await Dependency.findAll({
    where: { referenceFieldId: fieldId },
  });

  return dependencies;
});

// ✅ POST: Create a new dependency for this field
export const POST = handleApi(async ({ req, params }) => {
  const fieldId = params?.fieldId as string;
  if (!z.string().uuid().safeParse(fieldId).success) {
    throw new Error("Invalid fieldId");
  }

  const json = await req.json();
  const parsed = dependencySchema
    .omit({ id: true, referenceFieldId: true })
    .parse(json);

  const created = await Dependency.create({
    ...parsed,
    referenceFieldId: fieldId,
  });

  return created;
}, { authRequired: true });

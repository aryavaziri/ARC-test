// /app/settings/objectManager/[objectId]/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ObjectsLayout from "@/components/Objects/Objects";

interface Props {
  params: { objectId: string };
}

const Page = async ({ params }: Props) => {
  const session = await auth();
  if (!session?.user) redirect(`/login`);

  return (
    <div className="p-12 flex flex-col">
      <ObjectsLayout objectId={params.objectId} />
    </div>
  );
};

export default Page;

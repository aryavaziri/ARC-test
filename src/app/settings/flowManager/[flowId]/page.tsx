// /app/settings/objectManager/[objectId]/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";

interface Props {
  params: { flowId: string };
}

const Page = async ({ params }: Props) => {
  const session = await auth();
  if (!session?.user) redirect(`/login`);

  return (
    <div className="p-12 flex flex-col">
      Flow ID: {params.flowId}
    </div>
  );
};

export default Page;

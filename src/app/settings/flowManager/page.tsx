import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Flows from "@/components/Flows/Flows";

const FlowManager = async () => {
  const session = await auth()
  if (!session?.user) redirect(`/login`)
  return (
    <div className="p-12">
      <div className="bg-primary-100/5 flex gap-8">
        <Flows />
      </div>

    </div>
  )
}

export default FlowManager
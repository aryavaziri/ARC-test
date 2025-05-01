import { auth } from "@/auth";
import Configurations from "@/components/Configurations/Configurations";
import { redirect } from "next/navigation";

const FlowManager = async () => {
  const session = await auth()
  if (!session?.user) redirect(`/login`)
  return (
    <div className="p-12">
      <div className="bg-primary-100/5 flex gap-8">
        <Configurations />
      </div>

    </div>
  )
}

export default FlowManager
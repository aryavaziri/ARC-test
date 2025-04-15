import { auth } from "@/auth";
import { redirect } from "next/navigation";
import DynamicModelGrid from "@/components/Dynamic/DynamicModel/DynamicModelGrid";

const ObjectManager = async () => {
    const session = await auth()
    if (!session?.user) redirect(`/login`)
    return (
        <div className="p-12">
            <div className="bg-primary-100/5 flex gap-8">
                <DynamicModelGrid />
                <div className={`con`} >
                    <p className="text-xl font-semibold mb-2">Flows</p>
                </div>
            </div>

        </div>
    )
}

export default ObjectManager
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import DynamicTable from "@/components/Dynamic/DynamicModelFields";
import ModelFormLayout from "@/components/Dynamic/ModelFormLayout";

const Page = async () => {
    const session = await auth()
    if (!session?.user) redirect(`/login`)
    return (
        <div className="p-12">
            <div className="mt-8 con">
                <DynamicTable />
            </div>
            <div className="mt-8 con">
                <ModelFormLayout />
            </div>

        </div>
    )
}

export default Page



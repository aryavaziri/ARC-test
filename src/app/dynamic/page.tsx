import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ModelFormLayout from "@/components/Dynamic/ModelFormLayout";
import DynamicModelGrid from "@/components/Dynamic/DynamicModel/DynamicModelGrid";
import FieldsGrid from "@/components/Dynamic/DynamicModel/FieldsGrid";
import DynamicRecordForm from '@/components/Dynamic/DynamicRecordTable'

const Page = async () => {
    const session = await auth()
    if (!session?.user) redirect(`/login`)
    return (
        <div className="p-12">
            <div className="bg-primary-100/5 flex gap-8">
                <DynamicModelGrid />
                <FieldsGrid />
            </div>
            <div className="mt-8 bg-primary-100/5 flex gap-8 flex-col">
                <ModelFormLayout />
                <DynamicRecordForm />
            </div>

        </div>
    )
}

export default Page



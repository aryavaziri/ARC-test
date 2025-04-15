import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ModelFormLayout from "@/components/Dynamic/ModelFormLayout";
import DynamicModelGrid from "@/components/Dynamic/DynamicModel/DynamicModelGrid";
import FieldsGrid from "@/components/Dynamic/DynamicModel/FieldsGrid";
import DynamicRecordForm from '@/components/Dynamic/DynamicRecordTable'
import Tabs from "@/components/Tabs/Tabs";
import LayoutList from "@/components/Layout/LayoutList";

const LayoutManager = async () => {
    const session = await auth()
    if (!session?.user) redirect(`/login`)
    return (
        <div className="p-12">
            <div className="bg-primary-100/5 flex gap-8">
                <Tabs />
                <LayoutList />
            </div>

        </div>
    )
}

export default LayoutManager
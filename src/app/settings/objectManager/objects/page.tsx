import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ModelFormLayout from "@/components/Dynamic/ModelFormLayout";
import DynamicModelGrid from "@/components/Dynamic/DynamicModel/DynamicModelGrid";
import FieldsGrid from "@/components/Dynamic/DynamicModel/FieldsGrid";
import ObjectsLayout from "@/components/Objects/Objects";

const Objects = async () => {
    const session = await auth()
    if (!session?.user) redirect(`/login`)

    return (
        <div className="p-12 flex flex-col">
            <ObjectsLayout />
        </div>
    )
}

export default Objects
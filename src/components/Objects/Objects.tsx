// /components/Objects/Objects.tsx

"use client";

import { useEffect, useState } from "react";
import FieldsGrid from "@/components/Dynamic/DynamicModel/FieldsGrid";
import Details from "@/components/Objects/Details";
import FormLayouts from "@/components/Objects/FormLayouts/FormLayout";
import { useDynamicModel } from "@/store/hooks/dynamicModelsHooks";
import { useRouter } from "next/navigation";
import { IoChevronBackSharp } from "react-icons/io5";
import Link from "next/link";
import RecordLayouts from "./RecordLayouts/RecordLayout";
import DependencyLayout from "./Dependency/DependencyLayout";

const tabOptions = [
  { label: "Details", value: "Details" },
  { label: "Fields", value: "Fields" },
  { label: "Form Layouts", value: "FormLayouts" },
  { label: "Record Layouts", value: "RecordLayouts" },
  { label: "Dependency", value: "Dependency" },
];

const ObjectsLayout = ({ objectId }: { objectId: string }) => {
  const [selected, setSelected] = useState("Fields");
  const { models, setSelectedModel, selectedModel, getData } = useDynamicModel();
  const router = useRouter();

  // Load the model based on objectId
  useEffect(() => {
    if (!models.length) return;
    
    console.log(objectId)
    const foundModel = models.find((m) => m.id === objectId);
    if (foundModel) {
      setSelectedModel(foundModel);
      getData();
    } else {
      router.push(`/settings/objectManager`);
    }
  }, [models, objectId]);
  useEffect(() => {
  }, []);

  const renderSelectedTab = () => {
    switch (selected) {
      case "Details":
        return <Details />;
      case "Fields":
        return <FieldsGrid />;
      case "FormLayouts":
        return <FormLayouts />;
      case "RecordLayouts":
        return <RecordLayouts />;
      case "Dependency":
        return <DependencyLayout />;
      default:
        return null;
    }
  };

  if (!selectedModel) return null;

  return (
    <div className="bg-primary-100/5 gap-8 grow con">
      <div className={`flex gap-4 items-center`}>
        <Link className="btn-icon" href={`/settings/objectManager`}><IoChevronBackSharp /></Link>
        <div className={`text-xl font-semibold uppercase`}>
          {selectedModel?.name} Object
        </div>
      </div>
      <div className="flex gap-4 items-center">
        {tabOptions.map((tab) => (
          <p
            key={tab.value}
            onClick={() => setSelected(tab.value)}
            className={`cursor-pointer btn rounded-full ${selected === tab.value ? "btn-secondary" : ""}`}
          >
            {tab.label}
          </p>
        ))}
      </div>
      <div className="flex-grow">{renderSelectedTab()}</div>
    </div>
  );
};

export default ObjectsLayout;

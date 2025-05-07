"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { IoChevronBackSharp } from "react-icons/io5";

import FieldsGrid from "@/components/Dynamic/DynamicModel/FieldsGrid";
import Details from "@/components/Objects/Details";
import FormLayouts from "@/components/Objects/FormLayouts/FormLayout";
import RecordLayouts from "./RecordLayouts/RecordLayout";
import Scripts from "./Scripts/Scripts";
import { useDynamicModel } from "@/store/hooks/dynamicModelsHooks";

const tabOptions = [
  { label: "Details", value: "Details" },
  { label: "Fields", value: "Fields" },
  { label: "Form Layouts", value: "FormLayouts" },
  { label: "Record Layouts", value: "RecordLayouts" },
];

const ObjectsLayout = ({ objectId }: { objectId: string }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { models, setSelectedModel, selectedModel, getLineItems } = useDynamicModel();

  const tabFromUrl = searchParams.get("tab");
  const [selected, setSelected] = useState(tabFromUrl ?? "Fields");

  // Load the model based on objectId
  useEffect(() => {
    if (!models.length) return;

    const foundModel = models.find((m) => m.id === objectId);
    if (foundModel) {
      setSelectedModel(foundModel);
      getLineItems(foundModel.id);
    } else {
      router.push(`/settings/objectManager`);
    }
  }, [models, objectId]);

  // Sync with URL param changes (when back/forward pressed)
  useEffect(() => {
    if (tabFromUrl && tabFromUrl !== selected) {
      setSelected(tabFromUrl);
    }
  }, [tabFromUrl]);

  const handleTabClick = (tab: string) => {
    setSelected(tab);
    router.push(`?tab=${tab}`, { scroll: false });
  };

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
      default:
        return null;
    }
  };

  if (!selectedModel) return null;

  return (
    <div className="bg-primary-100/5 gap-8 grow con">
      <div className="flex gap-4 items-center">
        <Link className="btn-icon" href={`/settings/objectManager`}>
          <IoChevronBackSharp />
        </Link>
        <div className="text-xl font-semibold uppercase">
          {selectedModel?.name} Object
        </div>
      </div>
      <div className="flex gap-4 items-center">
        {tabOptions.map((tab) => (
          <p
            key={tab.value}
            onClick={() => handleTabClick(tab.value)}
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

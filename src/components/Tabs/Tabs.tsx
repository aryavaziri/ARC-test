'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTab } from "@/store/hooks/tabsHooks";
import { iconMap } from "@/store/slice/iconMap";
import CustomModal from "../Modals/CustomModal2";
import AddEditTabForm, { TabFormType } from "./AddEditTab";
import { IoMdAdd, IoMdCreate } from "react-icons/io";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { RiDeleteBin7Fill } from "react-icons/ri";
import { FiLayout } from "react-icons/fi";

const Tabs = () => {
  const { tabs, activeTab, activeLayout, pageLayouts, selectTab, deleteTab } = useTab();

  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedTabForEdit, setSelectedTabForEdit] = useState<TabFormType | null>(null);

  const handleEdit = (tab: TabFormType) => {
    setSelectedTabForEdit(tab);
    setShowModal(true);
  };

  return (
    <div className="con max-w-[500px]">
      <div className="flex justify-between items-center mb-4">
        <p className="text-xl font-semibold">Tabs</p>
        <button
          onClick={() => {
            setSelectedTabForEdit(null);
            setShowModal(true);
          }}
          className="btn-icon btn-primary text-xl font-semibold"
        >
          <IoMdAdd />
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {tabs.map((tab) => {
          const Icon = iconMap[tab.iconName];
          const isActive = activeTab === tab.label;

          return (
            <div
              key={tab.id}
              className={`rounded border transition-all duration-300 overflow-hidden 
                ${isActive ? "bg-primary-50 border-primary" : "hover:bg-primary/5"}`}
            >
              <div
                className={`flex justify-between items-center p-4 ${isActive ? `` : `cursor-pointer`}`}
                onClick={() => selectTab(tab.label)}
              >
                <div className="flex items-center gap-2 font-semibold text-lg">
                  {Icon && <Icon className="text-xl" />}
                  {tab.label}
                </div>
                {isActive ? <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // prevent triggering tab selection
                      handleEdit(tab);
                    }}
                    className="btn-icon text-muted hover:text-dark"
                  >
                    <IoMdCreate />
                  </button>
                  <button
                    onClick={async () => await deleteTab(tab.id)}
                    className="btn-icon hover:bg-red-400 p-[5px] border-none shadow shadow-border text-md"
                  >
                    <RiDeleteBin7Fill />
                  </button>
                </div> : <></>}
              </div>

              {/* Layout links */}
              <div
                className={`transition-all duration-300 ease-in-out ${isActive ? "max-h-[5000px] p-4 pt-0" : "max-h-0 overflow-hidden"
                  }`}
              >
                <div className="ml-4 text-sm text-muted flex flex-col gap-2">
                  {tab.layouts.map((layout, index) => (
                    <div key={index} className="flex justify-between items-center group px-3 h-10 rounded bg-primary-100/30 hover:bg-primary-100/50 shadow">
                      <p
                        key={layout.label}
                        // onClick={() => handleLayoutClick(tab.label, layout.label, layout.route)}
                        className={`${activeLayout === layout.label ? "font-semibold text-primary" : ""}`}
                      >
                        {layout.label}
                      </p>
                      <p className={`rounded-full bg-secondary-600 text-light py-1 px-3`}>
                        {pageLayouts.find(p => p.id === layout.layoutId)?.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <DndProvider backend={HTML5Backend}>
        <CustomModal
          Component={() => (
            <AddEditTabForm
              onClose={() => setShowModal(false)}
              defaultValues={selectedTabForEdit ?? undefined}
            />
          )}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          header="Add/Edit Tab"
        />
      </DndProvider>
    </div>
  );
};

export default Tabs;

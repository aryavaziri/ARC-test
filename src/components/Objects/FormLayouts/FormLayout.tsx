'use client'
import { useDynamicModel } from '@/store/hooks/dynamicModelsHooks';
import React, { useEffect, useState } from 'react';
import CustomModal from '@/components/Modals/CustomModal2';
import AddEditFormLayout from './AddEditFormLayout';
import FormSchemaLayout from './FormSchemaLayout';
import { MdEdit } from 'react-icons/md';
import { RiDeleteBin7Fill } from 'react-icons/ri';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { BiReset } from "react-icons/bi";

const FormLayouts = () => {
  const { models, selectedModel, formLayouts, setSelectedField, removeFormLayout, resetFormLayout } = useDynamicModel();

  const [showLayoutModal, setShowLayoutModal] = useState(false);
  const [editMode, setEditMode] = useState<"add" | "edit">("add");
  const [selectedLayoutId, setSelectedLayoutId] = useState<string | null>(null);

  const layouts = formLayouts.filter(f => f.modelId === selectedModel?.id)

  const handleOpenModal = (mode: "add" | "edit", layoutId?: string) => {
    setEditMode(mode);
    setSelectedLayoutId(layoutId ?? null);
    setShowLayoutModal(true);
  };

  const handleCloseModal = () => {
    setShowLayoutModal(false);
    setSelectedLayoutId(null);
    setEditMode("add");
    setSelectedField(null);
  };

  if (!selectedModel) return null;

  return (
    <div className="flex grow">
      <div className="flex flex-col gap-4 grow con">
        <div className="flex gap-8 w-full overflow-x-auto">
          <div className="con w-1/3 min-w-fit">
            <div className="flex items-center gap-2 mb-4">
              <p className="font-semibold mr-auto text-xl">
                {models.find(m => m.id === selectedModel?.id)?.name || "Model"} Form Layouts
              </p>
              <button className="btn btn-secondary" onClick={() => handleOpenModal("add")}>
                Add Layout
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="my-table w-full">
                <tbody>
                  {layouts.length > 0 ? (
                    layouts.map((layout) => (
                      <tr
                        key={layout.id}
                        className={`transition-colors ${layout.id === selectedLayoutId ? 'row-selected' : ' cursor-pointer'}`}
                        onClick={() => setSelectedLayoutId(layout.id)}
                      >
                        <td>
                          <div className="flex justify-between w-full items-center">
                            <p>{layout.id.substring(0, 4)}...</p>
                          </div>
                        </td>
                        <td>
                          <div className="flex justify-between w-full items-center">
                            <p className={`font-semibold`}>{layout.label}</p>
                            <div className={`flex gap-1`}>
                              {layout.label.toLowerCase() !== "standard" ? (
                                <>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleOpenModal('edit', layout.id);
                                    }}
                                    className="btn-icon hover:bg-lime-400 p-[5px] border-none shadow shadow-border text-md"
                                  >
                                    <MdEdit />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation(); // 🛑 prevent row click from firing
                                      removeFormLayout(layout.id);
                                    }}
                                    className="btn-icon hover:bg-red-400 p-[5px] border-none shadow shadow-border text-md"
                                  >
                                    <RiDeleteBin7Fill />
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation(); // 🛑 prevent row click from firing
                                    resetFormLayout(layout.modelId);
                                  }}
                                  className="btn-icon hover:bg-amber-600 p-[5px] border-none shadow shadow-border text-md"
                                >
                                  <BiReset />
                                </button>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={2} className="text-center text-gray-500 py-4">
                        No layouts found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {selectedLayoutId &&
            <DndProvider backend={HTML5Backend}>
              <FormSchemaLayout selectedLayoutId={selectedLayoutId} />
            </DndProvider>
          }
        </div>
      </div>

      <CustomModal
        isOpen={showLayoutModal}
        onClose={handleCloseModal}
        header={editMode === "add" ? "Add Layout" : "Edit Layout"}
        className="w-[500px]"
        Component={AddEditFormLayout}
        componentProps={{
          layoutId: selectedLayoutId,
          mode: editMode,
          onClose: handleCloseModal

        }}
      />
    </div>
  );
};

export default FormLayouts;

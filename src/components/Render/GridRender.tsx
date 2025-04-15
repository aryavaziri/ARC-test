"use client";

import { useState } from "react";
import { TiDelete } from "react-icons/ti";
import { TLineItem } from "@/types/dynamicModel";
import FormLayoutBlock from "./FormLayoutBlock";
import EditFormLayoutBlock from "./EditFormLayoutBlock";
import CustomModal from "../Modals/CustomModal2";

interface GridRenderProps {
  modelId: string;
  records: TLineItem[];
  fieldHeaders: {
    id: string;
    label: string;
    isLookup?: boolean;
    parentFieldId?: string;
  }[];
  getDisplayValue: (
    item: TLineItem,
    header: GridRenderProps["fieldHeaders"][number]
  ) => string;
  removeLineItem: (id: string) => Promise<void>;
}

const GridRender = ({
  modelId,
  records,
  fieldHeaders,
  getDisplayValue,
  removeLineItem,
}: GridRenderProps) => {
  const [selectedRecord, setSelectedRecord] = useState<TLineItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // ✏️ Open Edit Modal
  const handleRowClick = (record: TLineItem) => {
    setSelectedRecord(record);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedRecord(null);
  };

  // ➕ Open Add Modal
  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);

  return (
    <>
      <div className="overflow-x-auto">
        <table className="my-table whitespace-nowrap">
          <thead>
            <tr>
              <th>#</th>
              {fieldHeaders.map((field, idx) => (
                <th key={`${field.id}-${idx}`}>{field.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.map((record, index) => (
              <tr
                key={record.id}
                className="group cursor-pointer hover:bg-primary-50 transition"
                onClick={() => handleRowClick(record)}
              >
                <td className="relative !w-[40px]" onClick={(e) => e.stopPropagation()}>
                  <div className="flex justify-evenly items-center">
                    <p className="group-hover:hidden">{index + 1}</p>
                    <div
                      onClick={async () => await removeLineItem(record.id)}
                      className="-left-100 group-hover:inset-1 flex cursor-pointer items-center justify-center absolute text-rose-500 duration-200 hover:scale-[1.1] z-1"
                    >
                      <TiDelete size={36} />
                    </div>
                  </div>
                </td>
                {fieldHeaders.map((header, hIdx) => (
                  <td key={`${header.id}-${record.id}-${hIdx}`}>
                    {getDisplayValue(record, header)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4">
        <button className="btn btn-primary" onClick={openAddModal}>
          Add Record
        </button>
      </div>

      {/* ➕ Add Modal */}
      <CustomModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        Component={() =>
          <div className="p-6 max-w-3xl w-full min-w-[600px]">
            <h2 className="text-lg font-bold mb-4 text-primary">
              Add New Record
            </h2>
            <FormLayoutBlock
              modelId={modelId}
              layoutLabel="Standard"
              onSave={closeAddModal}
              onCancel={closeAddModal}
            />
          </div>
        }
      />

      {/* ✏️ Edit Modal */}
      <CustomModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        Component={() =>
          <div className="p-6 max-w-3xl w-full min-w-[600px]">
              <h2 className="text-lg font-bold mb-4 text-primary">
                Edit Record – {selectedRecord?.id.slice(0, 6)}...
              </h2>
              <EditFormLayoutBlock
                modelId={modelId}
                layoutLabel="Standard"
                recordId={selectedRecord?.id??""}
                onSave={closeEditModal}
                onCancel={closeEditModal}
                />
            </div>
        }
      />
    </>
  );
};

export default GridRender;

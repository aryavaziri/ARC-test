"use client";

import Select from "react-select";
import { TLineItem } from "@/types/dynamicModel";
import RecordDetails from "./RecordDetails";
import CustomModal from "../Modals/CustomModal2";
import { useState, useMemo } from "react";
import FormLayoutBlock from "./FormLayoutBlock";
import EditFormLayoutBlock from "./EditFormLayoutBlock";

interface SingleRecordRenderProps {
  layoutId: string;
  records: TLineItem[];
  fieldHeaders: {
    id: string;
    label: string;
    isLookup?: boolean;
    parentFieldId?: string;
  }[];
  getDisplayValue: (
    item: TLineItem,
    header: SingleRecordRenderProps["fieldHeaders"][number]
  ) => string;
  selectedRecordId: string | null;
  setSelectedRecordId: (id: string | null) => void;
  modelId: string;
  layoutLabel: string;
}

const SingleRecordRender = ({
  records,
  fieldHeaders,
  getDisplayValue,
  selectedRecordId,
  setSelectedRecordId,
  layoutId,
  modelId,
  layoutLabel,
}: SingleRecordRenderProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const selectedRecord = useMemo(
    () => records.find((r) => r.id === selectedRecordId) || null,
    [selectedRecordId, records]
  );

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);

  const openEditModal = () => {
    if (selectedRecordId) setIsEditModalOpen(true);
  };
  const closeEditModal = () => setIsEditModalOpen(false);

  return (
    <div className="mb-4">
      <Select
        options={records}
        getOptionValue={(item) => item.id}
        value={selectedRecord}
        onChange={(option) => setSelectedRecordId(option?.id ?? null)}
        placeholder="Select a record..."
        isClearable
        formatOptionLabel={(item) => (
          <div className="flex justify-between gap-2 text-sm">
            {fieldHeaders.map((header, idx) => (
              <div
                key={`${header.id}-${item.id}-${idx}`}
                className="text-muted-foreground"
              >
                {getDisplayValue(item, header)}
              </div>
            ))}
          </div>
        )}
        menuPortalTarget={typeof window !== "undefined" ? document.body : null}
        styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
      />

      {selectedRecordId && (
        <RecordDetails layoutId={layoutId} recordId={selectedRecordId} />
      )}

      <div className="mt-4 flex gap-2">
        <button className="btn btn-primary" onClick={openAddModal}>
          Add Record
        </button>

        {selectedRecordId && (
          <button className="btn btn-secondary" onClick={openEditModal}>
            Edit Record
          </button>
        )}
      </div>

      {/* ➕ Add Modal */}
      <CustomModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        componentProps={{}}
        Component={() => (
          <div className="p-6 max-w-3xl w-full min-w-[600px]">
            <h2 className="text-lg font-bold mb-4 text-primary">
              Add New Record
            </h2>
            <FormLayoutBlock
              modelId={modelId}
              onSave={closeAddModal}
              onCancel={closeAddModal}
            />
          </div>
        )}
      />

      {/* ✏️ Edit Modal */}
      <CustomModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        componentProps={{}}
        Component={() => {
          if (!selectedRecord) return null;
          return (
            <div className="p-6 max-w-3xl w-full min-w-[600px]">
              <h2 className="text-lg font-bold mb-4 text-primary">
                Edit Record – {selectedRecord.id.slice(0, 6)}...
              </h2>
              <EditFormLayoutBlock
                modelId={modelId}
                layoutLabel="Standard"
                recordId={selectedRecord.id}
                onSave={closeEditModal}
                onCancel={closeEditModal}
              />
            </div>
          );
        }}
      />
    </div>
  );
};

export default SingleRecordRender;

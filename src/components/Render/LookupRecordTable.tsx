'use client';

import React, { useMemo, useState } from 'react';
import { TLineItem } from '@/types/dynamicModel';
import CustomModal from '../Modals/CustomModal2';
import FormLayoutBlock from './FormLayoutBlock';
import { useDynamicModel } from '@/store/hooks/dynamicModelsHooks';

type LookupRecordTableProps = {
  data: TLineItem[];
  fieldHeaders: { id: string; label: string }[];
  onSelect: (record: TLineItem) => void;
  modelId: string
};


const LookupRecordTable: React.FC<LookupRecordTableProps> = ({ data, onSelect, fieldHeaders, modelId }) => {
  const [search, setSearch] = useState('');
  const {models} = useDynamicModel()
  const model = models.find(m => m.id === modelId);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const closeAddModal = () => setIsAddModalOpen(false);
  const openAddModal = () => setIsAddModalOpen(true);

  const filteredData = useMemo(() => {
    const lower = search.toLowerCase();
    return data.filter(record =>
      record.fields.some(field =>
        String(field.value).toLowerCase().includes(lower)
      )
    );
  }, [search, data]);

  return (
    <div className="p-8 min-w-[500px] gap-8 flex flex-col">
      <div className="flex justify-between gap-2 items-center">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="grow rounded px-2 py-1 border border-gray-400/70 text-dark focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <div onClick={openAddModal} className={`aspect-square btn-icon font-bold h-8 bg-text/70 hover:bg-text text-bg text-2xl`}>+</div>
      </div>

      <table className="my-table">
        <thead>
          <tr>
            <th>#</th>
            {fieldHeaders.map((field) => (
              <th key={field.id}>{field.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredData.map((record, index) => (
            <tr key={record.id} className="cursor-pointer" onClick={() => onSelect(record)}>
              <td>{index + 1}</td>
              {fieldHeaders.map((header) => {
                const matched = record.fields.find((f) => f.fieldId === header.id);
                return <td key={header.id}>{matched ? String(matched.value) : '-'}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <CustomModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        header={`Add ${model?.name??"Model"}`}
        className={`min-w-[500px]`}
        Component={() =>
          <FormLayoutBlock
            modelId={modelId}
            layoutLabel="Standard"
            onSave={closeAddModal}
            onCancel={closeAddModal}
          />
        }
      />
    </div>
  );
};

export default LookupRecordTable
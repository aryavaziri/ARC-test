'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { TLineItem } from '@/types/dynamicModel';
import CustomModal from '../Modals/CustomModal3';
import FormLayoutBlock from './FormLayoutBlock';
import { useDynamicModel } from '@/store/hooks/dynamicModelsHooks';

type LookupRecordTableProps = {
  data: TLineItem[];
  fieldHeaders: { id: string; label: string }[];
  onSelect: (record: TLineItem) => void;
  modelId: string;
  onAddNew?: () => void;
};


const LookupRecordTable: React.FC<LookupRecordTableProps> = ({ data, onSelect, fieldHeaders, modelId,onAddNew }) => {
  const [search, setSearch] = useState('');
  const { models, formLayouts } = useDynamicModel()
  const formLayoutId = formLayouts.filter(f => f.modelId === modelId)?.find(f => f.label === 'Standard')?.id;
  const model = models.find(m => m.id === modelId);

  const filteredData = useMemo(() => {
    const lower = search.toLowerCase();
    return data.filter(record =>
      record.fields.some(field =>
        String(field.value).toLowerCase().includes(lower)
      )
    );
  }, [search, data]);

  if (!formLayoutId) return <div className="text-sm text-muted italic">Loading...</div>

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
        {onAddNew && (
    <div onClick={onAddNew} className="aspect-square btn-icon font-bold h-8 bg-text/70 hover:bg-text text-bg text-2xl">+</div>
  )}
        {/* <div onClick={openAddModal} className={`aspect-square btn-icon font-bold h-8 bg-text/70 hover:bg-text text-bg text-2xl`}>+</div> */}
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
    </div>
  );
};

export default LookupRecordTable
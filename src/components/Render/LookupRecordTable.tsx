'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { TLineItem } from '@/types/dynamicModel';
import { useDynamicModel } from '@/store/hooks/dynamicModelsHooks';

type LookupRecordTableProps = {
  data: TLineItem[];
  fieldHeaders: { id: string; label: string }[];
  onSelect: (record: TLineItem) => void;
  modelId: string;
  onAddNew?: () => void;
  allowAddingRecord?: boolean
};


const LookupRecordTable: React.FC<LookupRecordTableProps> = ({ data, onSelect, fieldHeaders, modelId, onAddNew, allowAddingRecord }) => {
  const [search, setSearch] = useState('');
  const [loadingLookups, setLoadingLookups] = useState(false);
  const { models, formLayouts, getLineItems, allFields, lineItem } = useDynamicModel()
  const formLayoutId = formLayouts.filter(f => f.modelId === modelId)?.find(f => f.label === 'Standard')?.id;

  const filteredData = useMemo(() => {
    const lower = search.toLowerCase();
    return data.filter(record =>
      record.fields.some(field =>
        String(field.value).toLowerCase().includes(lower)
      )
    );
  }, [search, data]);

  useEffect(() => {
    const lookupIds = data.reduce<string[]>((acc, record) => {
      record.fields.forEach(field => {
        if (field.type === "lookup") {
          const matchedField = allFields.find(f => f.id === field.fieldId);
          const lookupModelId = matchedField?.type === "lookup" ? matchedField.lookupModelId : undefined;
          if (lookupModelId && !acc.includes(lookupModelId)) {
            acc.push(lookupModelId);
          }
        }
      });
      return acc;
    }, []);

    const fetchLookups = async () => {
      if (lookupIds.length > 0) {
        setLoadingLookups(true);
        try {
          await Promise.all(lookupIds.map(id => getLineItems(id)));
        } catch (error) {
          console.error("Failed to fetch lookup records:", error);
        }
        setLoadingLookups(false);
      }
    };

    fetchLookups();
  }, [data, allFields]);



  if (!formLayoutId || loadingLookups) return <div className="text-sm text-muted italic text-center items-center pt-24">Loading...</div>

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
        {allowAddingRecord && onAddNew && (
          <div onClick={onAddNew} className="aspect-square btn-icon font-bold h-8 bg-text/70 hover:bg-text text-bg text-2xl">+</div>
        )}
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
                const model = models.find(m => m.id === modelId);
                const primaryFieldId = model?.ModelLookupInputs?.find(f => f.id === matched?.fieldId)?.primaryFieldId;
                const lookup = lineItem?.find(f => f.id === matched?.value)?.fields?.find(f => f.fieldId == primaryFieldId)?.value ?? matched?.value
                const val = matched?.type !== "lookup"
                  ? String(matched?.value ?? '-')
                  : String(lookup);
                return <td key={header.id}>{val}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LookupRecordTable
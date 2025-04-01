'use client';

import React, { useMemo, useState } from 'react';
import { TLineItem } from '@/types/dynamicModel';

type LookupRecordTableProps = {
  data: TLineItem[];
  fieldHeaders: { id: string; label: string }[];
  onSelect: (record: TLineItem) => void;
};


const LookupRecordTable: React.FC<LookupRecordTableProps> = ({ data, onSelect, fieldHeaders }) => {
  const [search, setSearch] = useState('');

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
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="full rounded px-2 py-1 border border-gray-400/70 text-dark focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

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
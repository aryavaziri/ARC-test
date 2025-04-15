'use client';

import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { Controller, Control, FieldError } from 'react-hook-form';
import { FieldType, TLineItem } from '@/types/dynamicModel';
import { useDynamicModel } from '@/store/hooks/dynamicModelsHooks';
import CustomModal from '@/components/Modals/CustomModal2';
import { MdOutlineSearch } from 'react-icons/md';
import LookupRecordTable from './LookupRecordTable';

type LookupProps = {
  field: {
    id: string;
    label: string;
    type: FieldType;
    fieldId?: string;
    lookupDetails?: {
      lookupModelId: string;
      primaryField: string;
      fields?: string[];
    };
  };
  control: Control<any>;
  error?: FieldError;
};

const Lookup: React.FC<LookupProps> = ({ field, control, error }) => {
  const { inputFields, models, getLookupLineItem, allFields } = useDynamicModel();
  const [lineItem, setLineItem] = useState<TLineItem[]>([]);
  const [fieldHeaders, setFieldHeaders] = useState<{ id: string; label: string }[]>([]);
  const [primaryFieldId, setPrimaryFieldId] = useState<string | null>(null);
  const [showTable, setShowTable] = useState(false);

  useEffect(() => {
    console.log(field)
    const fetchData = async () => {
      const lookupField = field.lookupDetails;

      if (lookupField) {
        const result = await getLookupLineItem(lookupField.lookupModelId);
        setLineItem(result);

        const model = models.find(m => m.id === lookupField.lookupModelId);
        if (model) {
          setPrimaryFieldId(lookupField.primaryField);
          const searchColumnIds = lookupField.fields?.length
            ? lookupField.fields
            : [lookupField.primaryField];

          const headers = allFields
            .filter(input => searchColumnIds.includes(input.id))
            .map(input => ({ id: input.id, label: input.label }));

          setFieldHeaders(headers);
        }
      }

    };

    fetchData();
  }, [models]);

  const getPrimaryLabel = (record: TLineItem) => {
    if (!primaryFieldId) return '';
    const primaryField = record.fields.find(f => f.fieldId === primaryFieldId);
    return primaryField ? String(primaryField.value) : '';
  };

  const selectOptions = lineItem.map(opt => ({
    label: getPrimaryLabel(opt),
    value: opt.id,
  }));

  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="font-medium">{field.label}</label>
      <Controller
        name={field.id}
        control={control}
        render={({ field: controllerField }) => (
          <div className="flex gap-2 items-center w-full">
            <div className="w-full">
              <Select
                {...controllerField}
                options={selectOptions}
                value={selectOptions.find(o => o.value === controllerField.value) || null}
                onChange={(option) => controllerField.onChange(option?.value)}
                className="w-full"
                classNamePrefix="react-select"
                menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
                styles={{
                  control: (base) => ({
                    ...base,
                    borderColor: error ? '#ef4444' : base.borderColor,
                    minHeight: '1rem',
                  }),
                  input: (base) => ({
                    ...base,
                    paddingTop: 0,
                    paddingBottom: 0,
                  }),
                  dropdownIndicator: (base) => ({
                    ...base,
                    padding: '0.25rem',
                  }),
                  menuPortal: base => ({ ...base, zIndex: 9999 }),
                }}
              />
            </div>
            <div className="btn-icon aspect-square" onClick={() => setShowTable(true)}>
              <MdOutlineSearch />
            </div>
            <CustomModal
              Component={() => (
                <LookupRecordTable
                  data={lineItem}
                  fieldHeaders={fieldHeaders}
                  onSelect={(record) => {
                    controllerField.onChange(record.id);
                    setShowTable(false);
                  }}
                />
              )}
              isOpen={showTable}
              onClose={() => setShowTable(false)}
              header={`Select ${field.label}`}
            />
          </div>
        )}
      />

      {error && <p className="text-red-500 text-sm">{error.message}</p>}
    </div>
  );
};

export default Lookup;

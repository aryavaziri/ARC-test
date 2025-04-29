import React, { useEffect, useMemo, useState } from 'react';
import Select from 'react-select';
import { useDynamicModel } from '@/store/hooks/dynamicModelsHooks';
import { flattenModelFields } from '@/store/slice/dynamicModelSlice';
import CustomGridBuilder from './CustomGridBuilder'; // Not a form!

type LookupOptionsProps = {
  lookupId: string;
  initialFields: string[][];
  initialSearchFields?: string[];
  initialIsCustomStyle: boolean;
  initialAllowAddingRecord: boolean;
  onChange: (data: {
    fields: string[][];
    searchFields?: string[];
    isCustomStyle: boolean;
    allowAddingRecord: boolean;
  }) => void;
};

const LookupOptions: React.FC<LookupOptionsProps> = ({
  lookupId,
  initialSearchFields = [],
  initialFields,
  initialIsCustomStyle,
  initialAllowAddingRecord,
  onChange
}) => {
  const { models } = useDynamicModel();
  const [styleType, setStyleType] = useState<'dropdown' | 'custom'>(
    initialIsCustomStyle ? 'custom' : 'dropdown'
  );
  const [localFields, setLocalFields] = useState<string[][]>(initialFields || [[]]);
  const [searchFields, setSearchFields] = useState<string[]>(initialSearchFields || []);
  const [allowAddingRecord, setAllowAddingRecord] = useState(initialAllowAddingRecord);
  const [useSameFields, setUseSameFields] = useState(() =>
    arraysEqual(initialSearchFields ?? [], initialFields.flat())
  );

  function arraysEqual(a: string[], b: string[]) {
    if (a.length !== b.length) return false;
    const sortedA = [...a].sort();
    const sortedB = [...b].sort();
    return sortedA.every((val, idx) => val === sortedB[idx]);
  }


  useEffect(() => {
    if (useSameFields) {
      setSearchFields(localFields.flat());
    }
  }, [localFields, useSameFields]);

  const selectedModel = useMemo(() => models.find(m => m.id === lookupId), [lookupId, models]);
  const fieldOptions = useMemo(() => flattenModelFields(selectedModel || {} as any).map(f => ({
    label: f.label,
    value: f.id,
    id: f.id,
  })), [selectedModel]);

  const handleStyleChange = (option: { value: 'dropdown' | 'custom' } | null) => {
    if (!option) return;
    setStyleType(option.value);
    if (option.value === 'dropdown') {
      const flat = [localFields.flat()];
      setLocalFields(flat);
    }
  };

  const handleSearchFieldChange = (selected: any) => {
    const selectedIds = selected.map((opt: any) => opt?.value);
    setSearchFields(selectedIds);
  };

  const handleDropdownChange = (selected: any) => {
    const updated = [selected.map((opt: any) => opt?.value)];
    setLocalFields(updated);
  };

  return (
    <div className="flex flex-col gap-4 p-6 min-w-[400px]">
      <div className="flex flex-col gap-1 ">
        <label className="text-sm font-medium">Display Style</label>
        <Select
          value={{ label: styleType === 'custom' ? 'Custom Layout' : 'Dropdown', value: styleType }}
          options={[
            { label: 'Dropdown', value: 'dropdown' },
            { label: 'Custom Layout', value: 'custom' },
          ]}
          onChange={handleStyleChange}
          classNamePrefix="react-select"
        />
      </div>

      {styleType === 'custom' ? (
        <CustomGridBuilder
          fields={localFields}
          allOptions={fieldOptions}
          onChange={setLocalFields}
        />
      ) : (
        <Select
          isMulti
          options={fieldOptions}
          value={(localFields[0] || []).map(id => fieldOptions.find(opt => opt.value === id)).filter(Boolean)}
          onChange={handleDropdownChange}
          classNamePrefix="react-select"
          menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
          styles={{
            menuPortal: base => ({ ...base, zIndex: 9999 }),
            menu: base => ({ ...base, position: 'absolute' }),
          }}
        />
      )}

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Search Table Fields</label>
        <label className="inline-flex items-center gap-2 text-sm mb-2">
          <input
            type="checkbox"
            checked={useSameFields}
            onChange={(e) => {
              const checked = e.target.checked;
              setUseSameFields(checked);
              if (checked) {
                setSearchFields(localFields.flat());
              }
            }}
          />
          Same as display fields
        </label>

        {!useSameFields && (
          <Select
            isMulti
            options={fieldOptions}
            value={searchFields.map(id => fieldOptions.find(opt => opt.id === id)).filter(Boolean)}
            onChange={handleSearchFieldChange}
            classNamePrefix="react-select"
            menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
            styles={{
              menuPortal: base => ({ ...base, zIndex: 9999 }),
              menu: base => ({ ...base, position: 'absolute' }),
            }}
          />
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Additional Options</label>
        <label className="inline-flex items-center gap-2 text-sm mb-2">
          <input
            type="checkbox"
            checked={allowAddingRecord}
            onChange={(e) => setAllowAddingRecord(e.target.checked)}
          />
          Allow adding new record?
        </label>
      </div>

      <div className="flex justify-end pt-4">
        <button
          className="btn btn-primary"
          onClick={() => onChange({
            fields: localFields,
            searchFields,
            isCustomStyle: styleType === 'custom',
            allowAddingRecord
          })}
        >
          Save
        </button>
      </div>
    </div>
  );
};


export default LookupOptions;

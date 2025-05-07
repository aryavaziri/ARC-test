'use client';

import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import { useForm } from 'react-hook-form';
import { useDynamicModel } from '@/store/hooks/dynamicModelsHooks';
import { useDependency } from '@/store/hooks/dependencyHooks';
import { TLineItem, TLookupField, dependencySchema } from '@/types/dynamicModel';
import DependencyList from './DependencyList';

type SelectOption = { value: string; label: string };

interface Props {
  onClose: () => void;
}

const Dependencies: React.FC<Props> = ({ onClose }) => {
  const { selectedModel, selectedField, getLineItems, models } = useDynamicModel();
  const { createDependency, dependencies, fetchDependencies, deleteDependency } = useDependency(selectedField?.id ?? '');
  const { handleSubmit } = useForm();

  const [dependentField, setDependentField] = useState<SelectOption | null>(null);
  const [controllingField, setControllingField] = useState<SelectOption | null>(null);
  const [useManualFilter, setUseManualFilter] = useState(false);
  const [selectedLineItemOptions, setSelectedLineItemOptions] = useState<SelectOption[]>([]);

  const lookupField = selectedField?.type === 'lookup' ? selectedField as TLookupField : null;
  const targetModel = models.find(m => m.id === lookupField?.lookupModelId);
  const dependentFields = targetModel?.ModelLookupInputs ?? [];
  const outerFields = selectedModel?.ModelLookupInputs ?? [];

  const controllingOptions = dependentField
    ? outerFields
      .filter(f => f.lookupModelId === dependentFields.find(df => df.id === dependentField.value)?.lookupModelId)
      .map(f => ({ value: f.id, label: f.label }))
    : [];

  useEffect(() => {
    if (!controllingOptions.length) setUseManualFilter(true);
  }, [dependentField]);

  useEffect(() => {
    fetchDependencies()
  }, [deleteDependency, createDependency]);

  const loadLineItemOptions = async (inputValue: string) => {
    const fieldMeta = dependentFields.find(f => f.id === dependentField?.value);
    if (!fieldMeta?.lookupModelId || !fieldMeta.primaryFieldId) return [];

    const records = await getLineItems(fieldMeta.lookupModelId);
    const options = records.map(record => {
      const value = record.fields.find(f => f.fieldId === fieldMeta.primaryFieldId)?.value;
      return { value: record.id, label: String(value ?? record.id) };
    });

    return options.filter(option =>
      option.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  const onSave = handleSubmit(async () => {
    const parsed = dependencySchema
      .omit({ id: true, referenceFieldId: true })
      .parse({
        dependantFieldId: dependentField?.value,
        controllingFieldId: useManualFilter ? undefined : controllingField?.value,
        referenceLineItemIds: useManualFilter ? selectedLineItemOptions.map(o => o.value) : [],
      });

    const newDep = await createDependency({ ...parsed, referenceFieldId: selectedField!.id });

    if (newDep.success) {
      setDependentField(null);
      setControllingField(null);
      setSelectedLineItemOptions([]);
    }
  });

  if (!lookupField) return null;

  return (
    <div className="p-6 flex flex-col gap-5">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Field Dependency</h2>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">Reference Field</label>
        <Select
          value={dependentField}
          onChange={(val) => {
            setDependentField(val);
            setControllingField(null);
            setSelectedLineItemOptions([]);
          }}
          options={dependentFields.map(f => ({ value: f.id, label: f.label }))}
          placeholder="Select a reference field"
        />
      </div>

      {dependentField && controllingOptions.length > 0 && (
        <>
          <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              checked={useManualFilter}
              onChange={() => {
                setUseManualFilter(prev => !prev);
                setControllingField(null);
                setSelectedLineItemOptions([]);
              }}
            />
            <label className="text-sm text-gray-700">Use manual reference filter</label>
          </div>

          {!useManualFilter && (
            <div className="mt-2">
              <label className="text-sm font-medium text-gray-700 mb-1 block">Controlling Field</label>
              <Select
                value={controllingField}
                onChange={(val) => setControllingField(val)}
                options={controllingOptions}
                placeholder="Select controlling field"
              />
            </div>
          )}
        </>
      )}

      {useManualFilter && dependentField && (
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Reference Values</label>
          <AsyncSelect
            key={dependentField.value}
            isMulti
            cacheOptions
            defaultOptions
            value={selectedLineItemOptions}
            loadOptions={loadLineItemOptions}
            onChange={(selected) => setSelectedLineItemOptions([...(selected || [])])}
            placeholder="Select value(s)..."
            classNamePrefix="react-select"
            styles={{
              control: base => ({ ...base, minHeight: 36 }),
              menuPortal: base => ({ ...base, zIndex: 9999 }),
            }}
            menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
          />
        </div>
      )}

      <div className="flex justify-end gap-2 pt-4">
        <button onClick={onSave} className="btn btn-primary">
          Save
        </button>
        <button onClick={onClose} className="btn btn-secondary">
          Close
        </button>
      </div>

      <DependencyList dependencies={dependencies} deleteDependency={deleteDependency} />
    </div>
  );
};

export default Dependencies;

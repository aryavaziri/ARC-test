import React, { useCallback, useEffect, useMemo, useState } from 'react';
import AsyncSelect from 'react-select/async';
import { useDynamicModel } from '@/store/hooks/dynamicModelsHooks';
import { TLookupField } from '@/types/dynamicModel';

interface Props {
  onClose: () => void;
}

type SelectOption = { value: string; label: string };

const Dependencies: React.FC<Props> = ({ onClose }) => {
  const { selectedModel, models, selectedField, getLineItems } = useDynamicModel();

  const [useManualFilter, setUseManualFilter] = useState(false);
  const [dependentFieldId, setDependentFieldId] = useState<string | null>(null);
  const [controllingFieldId, setControllingFieldId] = useState<string | null>(null);
  const [selectedLineItemOptions, setSelectedLineItemOptions] = useState<SelectOption[]>([]);

  const selectedFieldTargetModel = models.find(
    (m) => m.id === (selectedField as TLookupField)?.lookupModelId
  );

  const innerLookups = selectedFieldTargetModel?.ModelLookupInputs ?? [];
  const outerLookups = selectedModel?.ModelLookupInputs ?? [];

  const dependentFieldOptions = innerLookups.map((field) => ({
    id: field.id,
    label: field.label,
    lookupModelId: field.lookupModelId,
    primaryFieldId: field.primaryFieldId,
  }));

  const selectedDependentField = useMemo(
    () => dependentFieldOptions.find((f) => f.id === dependentFieldId),
    [dependentFieldId, dependentFieldOptions]
  );

  const controllingFieldOptions = useMemo(() => {
    if (!selectedDependentField) return [];
    return outerLookups
      .filter((outer) => outer.lookupModelId === selectedDependentField.lookupModelId)
      .map((field) => ({ id: field.id, label: field.label }));
  }, [outerLookups, selectedDependentField]);
  useEffect(() => {
    if (
      // dependentFieldId &&
      // !useManualFilter
      controllingFieldOptions.length === 0
    ) {
      setUseManualFilter(true);
    }
  }, [controllingFieldOptions.length, dependentFieldId]);

  const loadLineItemOptions = useCallback(
    async (inputValue: string): Promise<SelectOption[]> => {
      if (!selectedDependentField?.lookupModelId || !selectedDependentField.primaryFieldId) return [];

      const records = await getLineItems(selectedDependentField.lookupModelId);

      return records
        .map((record: any) => {
          const field = record.fields?.find(
            (f: any) => f.fieldId === selectedDependentField.primaryFieldId
          );
          const label = field?.value || record.label || record.name || record.id;
          return {
            value: record.id,
            label: String(label),
          };
        })
        .filter((option) =>
          option.label.toLowerCase().includes(inputValue.toLowerCase())
        );
    },
    [selectedDependentField, getLineItems]
  );

  return (
    <div className="p-6 flex flex-col gap-5">
      <p className="text-2xl font-semibold text-gray-800">Field Dependency</p>

      {/* Step 1: Always Show Reference Field First */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Reference Field (Nested in Target Model)</label>
        <select
          className="border border-gray-300 rounded px-2 py-1"
          value={dependentFieldId ?? ''}
          onChange={(e) => {
            const newValue = e.target.value || null;
            setDependentFieldId(newValue);
            setControllingFieldId(null);
            setSelectedLineItemOptions([]);
            // Reset checkbox state
            const selectedDep = dependentFieldOptions.find(f => f.id === newValue);
            const availableControlling = outerLookups.filter(
              (outer) => outer.lookupModelId === selectedDep?.lookupModelId
            );
            setUseManualFilter(availableControlling.length === 0);
          }}
        >
          <option value="">-- Select Reference Field --</option>
          {dependentFieldOptions.map((field) => (
            <option key={field.id} value={field.id}>
              {field.label}
            </option>
          ))}
        </select>
      </div>

      {/* Step 2: Show Only After Dependent Field is Selected */}
      {dependentFieldId && (
        <>
          {/* Show checkbox if controlling fields exist */}
          {controllingFieldOptions.length > 0 && (
            <>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="manualFilterCheckbox"
                  checked={useManualFilter}
                  onChange={() => {
                    setUseManualFilter(!useManualFilter);
                    setControllingFieldId(null);
                    setSelectedLineItemOptions([]);
                  }}
                />
                <label htmlFor="manualFilterCheckbox" className="text-sm text-gray-700 cursor-pointer">
                  Use manual reference filter
                </label>
              </div>

              {!useManualFilter && (
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">Controlling Field</label>
                  <select
                    className="border border-gray-300 rounded px-2 py-1"
                    value={controllingFieldId ?? ''}
                    onChange={(e) => setControllingFieldId(e.target.value || null)}
                  >
                    <option value="">-- Select Controlling Field --</option>
                    {controllingFieldOptions.map((field) => (
                      <option key={field.id} value={field.id}>
                        {field.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </>
          )}

          {/* Auto-check if no controlling options */}
          {useManualFilter && selectedDependentField?.lookupModelId && selectedDependentField.primaryFieldId && (
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Reference Value</label>
              <AsyncSelect
                key={dependentFieldId}
                isMulti
                cacheOptions
                defaultOptions
                value={selectedLineItemOptions}
                loadOptions={loadLineItemOptions}
                onChange={(selected) => {
                  setSelectedLineItemOptions((selected || []) as SelectOption[]);
                }}
                placeholder="Select value(s)..."
                isClearable
                classNamePrefix="react-select"
                menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  control: (base) => ({
                    ...base,
                    minHeight: '36px',
                    borderColor: '#d1d5db',
                    boxShadow: 'none',
                  }),
                }}
              />

            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow disabled:opacity-50"
              disabled={
                !dependentFieldId ||
                (!useManualFilter && !controllingFieldId) ||
                (useManualFilter && !selectedLineItemOptions?.length)
              }
              onClick={() => {
                console.log('Saving dependency:', {
                  dependentFieldId,
                  controllingFieldId: useManualFilter ? null : controllingFieldId,
                  referenceFieldId: useManualFilter ? dependentFieldId : null,
                  referenceValueId: useManualFilter ? selectedLineItemOptions.map((item) => item.value) : [],
                });
                onClose();
              }}
            >
              Save Dependency
            </button>
          </div>
        </>
      )}
    </div>

  );
};

export default Dependencies;

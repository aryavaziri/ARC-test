'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Select, { components } from 'react-select';
import { Controller, Control, FieldError } from 'react-hook-form';
import { TDependency, TLineItem, TLookupField } from '@/types/dynamicModel';
import { useDynamicModel } from '@/store/hooks/dynamicModelsHooks';
import CustomModal from '@/components/Modals/CustomModal2';
import { MdOutlineSearch } from 'react-icons/md';
import LookupRecordTable from './LookupRecordTable';
import { TFormItem } from '@/types/layouts';
import FormLayoutBlock from './FormLayoutBlock';

type LookupProps = {
  field: TFormItem;
  controllingValues?: string[];
  control: Control<any>;
  error?: FieldError;
};

const Lookup: React.FC<LookupProps> = ({
  field,
  control,
  error,
  controllingValues = [],
}) => {
  const { getLineItems, allFields, getLookupLineItem } = useDynamicModel();
  const [items, setItems] = useState<TLineItem[]>([]);
  const dependencies = useMemo(() => {
    const baseField = allFields.find(f => f.id === field.fieldId) as TLookupField | undefined;
    return baseField?.dependencies ?? [];
  }, [allFields, field.fieldId]);

  const [fieldHeaders, setFieldHeaders] = useState<{ id: string; label: string }[]>([]);
  const [searchHeaders, setSearchHeaders] = useState<{ id: string; label: string }[]>([]);
  const [fieldLabel, setFieldLabel] = useState<string>('Lookup');
  const [showTable, setShowTable] = useState(false);

  const lookupDetails = field.lookupDetails;
  const isCustom = lookupDetails?.isCustomStyle;
  const allowAddingRecord = !!lookupDetails?.allowAddingRecord;

  const isDisabled: boolean = useMemo(() => {
    return dependencies.some(dep =>
      dep.controllingFieldId &&
      Array.isArray(controllingValues) &&
      !controllingValues.length
    );
  }, [dependencies, controllingValues]);

  const [showAddNew, setShowAddNew] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!lookupDetails) return;

      const baseField = allFields.find(f => f.id === field.fieldId) as TLookupField | undefined;
      const resolvedPrimary = baseField?.primaryFieldId ?? '';

      const flatFields = lookupDetails.fields?.flat()?.length
        ? lookupDetails.fields.flat()
        : resolvedPrimary ? [resolvedPrimary] : [];

      const flatSearchFields = lookupDetails.searchFields?.length
        ? lookupDetails.searchFields
        : resolvedPrimary ? [resolvedPrimary] : [];

      let result: TLineItem[] = [];
      if (!dependencies.length) {
        result = await getLineItems(lookupDetails.lookupModelId);
      } else {
        const dependencyMap = getDependencyLineItemMap(dependencies, controllingValues);

        const fetches = await Promise.all(
          Object.entries(dependencyMap).map(async ([dependantFieldId, lineItemIds]) => {
            try {
              return await getLookupLineItem(lookupDetails.lookupModelId, dependantFieldId, lineItemIds);
            } catch (err) {
              console.error(`❌ Failed to fetch for ${dependantFieldId}`, err);
              return [];
            }
          })
        );

        if (fetches.length > 0 && fetches.every(records => records.length > 0)) {
          const idSets = fetches.map(records => new Set(records.map(r => r.id)));
          const commonIds = [...idSets[0]].filter(id => idSets.every(set => set.has(id)));

          // Get full objects for common IDs from any one of the fetches
          const recordMap = new Map(fetches.flat().map(r => [r.id, r]));
          result = commonIds.map(id => recordMap.get(id)).filter((r): r is TLineItem => !!r);
        } else {
          result = [];
        }
      }
      const allFieldMap = new Map(allFields.map(f => [f.id, f.label]));
      setFieldHeaders(flatFields.map(id => ({ id, label: allFieldMap.get(id) ?? id })));
      setSearchHeaders(flatSearchFields.map(id => ({ id, label: allFieldMap.get(id) ?? id })));
      setFieldLabel(baseField?.label ?? 'Lookup');
      setItems(result);
    };

    fetchData();
  }, [field.fieldId, lookupDetails?.lookupModelId, dependencies, controllingValues, allFields]);


  const getRowPreview = (recordId: string) => {
    // const nestedRecord = lineItem.find(l => l.id === recordId);
    const nestedRecord = items.find(l => l.id === recordId);
    return lookupDetails?.fields.map((row, idx) => {
      const line = row
        .map(fid => nestedRecord?.fields.find(f => f.fieldId === fid)?.value)
        .filter(Boolean)
        .join(', ');

      return (
        <p key={`row-${idx}`} className="text-gray-600">
          {line || '\u00A0'}
        </p>
      );
    });
  };

  const selectOptions = items.map(opt => ({
    label: '',
    value: opt.id,
  }));

  const getGridColsClass = (count: number) => `grid-cols-${Math.min(count, 10)}`;

  const CustomMenuList = (props: any) => (
    <components.MenuList {...props}>
      <div className={`grid ${getGridColsClass(fieldHeaders.length)} px-3 py-1 text-xs font-semibold text-muted-foreground bg-white sticky top-0 z-10 border-b border-border`}>
        {fieldHeaders.map(h => <div key={`header-${h.id}`}>{h.label}</div>)}
      </div>
      {props.children}
    </components.MenuList>
  );

  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="font-medium">{fieldLabel}</label>
      <Controller
        name={field.fieldId}
        control={control}
        render={({ field: controllerField }) => (
          <>
            {!isCustom ? (
              <div className="flex gap-2 items-center w-full">
                <div className="w-full">
                  <Select
                    {...controllerField}
                    options={selectOptions}
                    value={selectOptions.find(o => o.value === controllerField.value) || null}
                    onChange={(option) => controllerField.onChange(option?.value)}
                    isClearable
                    isDisabled={isDisabled}
                    className="w-full"
                    classNamePrefix="react-select"
                    menuPortalTarget={typeof window !== "undefined" ? document.body : null}
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                      menu: (base) => ({ ...base, position: "absolute" }),
                    }}
                    components={{ MenuList: CustomMenuList }}
                    formatOptionLabel={(option) => {
                      const record = items.find(r => r.id === option.value);
                      return (
                        <div className={`grid ${getGridColsClass(fieldHeaders.length)} gap-2 px-3 py-1 text-sm`}>
                          {fieldHeaders.map((header, idx) => {
                            const val = record?.fields.find(f => f.fieldId === header.id)?.value;
                            return (
                              <div
                                key={`${header.id}-${option.value}-${idx}`}
                                className="truncate text-muted-foreground max-w-[10rem]">
                                {val ? String(val) : '-'}
                              </div>
                            );
                          })}
                        </div>
                      );
                    }}
                  />
                </div>
                <div
                  className={`btn-icon aspect-square ${!!dependencies.length ? 'hover:bg-light' : ''}`}
                  onClick={() => !isDisabled && setShowTable(true)}
                // onClick={() => !dependencies.length && setShowTable(true)}
                >
                  <MdOutlineSearch />
                </div>
                <div className={`btn-icon`} onClick={() => console.log(controllingValues)} >TEST</div>
              </div>
            ) : (
              <div className="flex w-full gap-2">
                <div className="p-2 grow hover:bg-primary-100/30 rounded border border-border shadow-sm flex flex-col gap-1">
                  {getRowPreview(controllerField.value)}
                </div>
                <div className="btn-icon aspect-square" onClick={() => !isDisabled && setShowTable(true)}>
                  <MdOutlineSearch />
                </div>
                <div className={`btn-icon`} onClick={() => console.log(controllingValues)} >TEST</div>
              </div>
            )}

            <CustomModal
              isOpen={showTable}
              onClose={() => setShowTable(false)}
              header={`Select ${fieldLabel}`}
              Component={LookupRecordTable}
              componentProps={{
                modelId: lookupDetails?.lookupModelId ?? '',
                data: items,
                fieldHeaders: searchHeaders,
                onSelect: (record: TLineItem) => {
                  controllerField.onChange(record.id);
                  setShowTable(false);
                },
                onAddNew: () => setShowAddNew(true),
                allowAddingRecord,
              }}
            />

            <CustomModal
              isOpen={showAddNew}
              onClose={() => setShowAddNew(false)}
              header={`Add New ${fieldLabel}`}
              className="w-[600px]"
              Component={FormLayoutBlock}
              componentProps={{
                modelId: lookupDetails?.lookupModelId ?? '',
                layoutLabel: 'Standard',
                onSave: () => setShowAddNew(false),
                hasSubmit: true,
                onCancel: () => setShowAddNew(false),
              }}
            />
          </>
        )}
      />
      {error && <p className="text-red-500 text-sm">{error.message}</p>}
    </div>
  );
};

export default Lookup;

function getDependencyLineItemMap(
  dependencies: TDependency[],
  controllingValues: string[] = []
): Record<string, string[]> {
  const resultMap: Record<string, Set<string>> = {};

  for (const dep of dependencies) {
    const depId = dep.dependantFieldId;
    if (!depId) continue;

    if (!resultMap[depId]) resultMap[depId] = new Set<string>();

    // From controlling values (dynamic)
    if (dep.controllingFieldId && Array.isArray(controllingValues)) {
      for (const val of controllingValues) {
        if (val) resultMap[depId].add(val);
      }
    }

    // From static reference values (manual)
    if (dep.referenceLineItemIds) {
      try {
        const parsed = Array.isArray(dep.referenceLineItemIds)
          ? dep.referenceLineItemIds
          : JSON.parse(dep.referenceLineItemIds);

        for (const id of parsed) {
          if (typeof id === 'string') resultMap[depId].add(id);
        }
      } catch (err) {
        console.warn('Invalid referenceLineItemIds JSON:', dep.referenceLineItemIds);
      }
    }
  }

  // Convert Sets to arrays
  const result: Record<string, string[]> = {};
  for (const [key, set] of Object.entries(resultMap)) {
    result[key] = Array.from(set);
  }

  return result;
}

'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Select, { components } from 'react-select';
import { Controller, Control, FieldError, UseFormSetValue } from 'react-hook-form';
import { TLineItem, TLookupField, TRecord } from '@/types/dynamicModel';
import { useDynamicModel } from '@/store/hooks/dynamicModelsHooks';
import CustomModal from '@/components/Modals/CustomModal2';
import { MdOutlineSearch } from 'react-icons/md';
import LookupRecordTable from './LookupRecordTable';
import { TFormItem } from '@/types/layouts';
import FormLayoutBlock from './FormLayoutBlock';

type LookupProps = {
  field: TFormItem;
  control: Control<any>;
  error?: FieldError;
};

const Lookup: React.FC<LookupProps> = ({ field, control, error }) => {
  const { models, getLineItems, allFields, lineItem: selectedLineItem } = useDynamicModel();
  const [items, setItems] = useState<TLineItem[]>([]);

  const [fieldHeaders, setFieldHeaders] = useState<{ id: string; label: string }[]>([]);
  const [searchHeaders, setSearchHeaders] = useState<{ id: string; label: string }[]>([]);
  const [fieldLabel, setFieldLabel] = useState<string>('Lookup');
  const [showTable, setShowTable] = useState(false);
  const lookupDetails = field.lookupDetails;
  const isCustom = lookupDetails?.isCustomStyle;
  const allowAddingRecord = !!lookupDetails?.allowAddingRecord

  const matchingFieldIds = useMemo(() => {
    const model = models.find(m => m.id === lookupDetails?.lookupModelId);
    if (!model) return [];

    const ids: string[] = [
      ...model.ModelTextInputs?.map(f => f.id) ?? [],
      ...model.ModelNumberInputs?.map(f => f.id) ?? [],
      ...model.ModelDateInputs?.map(f => f.id) ?? [],
      ...model.ModelCheckboxInputs?.map(f => f.id) ?? [],
      ...model.ModelLongTextInputs?.map(f => f.id) ?? [],
      ...model.ModelLookupInputs?.map(f => f.id) ?? [],
    ];
    return ids;
  }, [models, lookupDetails?.lookupModelId]);

  const lineItem = useMemo(() => {
    return selectedLineItem?.filter((r: TLineItem) =>
      r.fields.some(f => matchingFieldIds.includes(f.fieldId))
    ) ?? [];
  }, [selectedLineItem, matchingFieldIds]);
  const [showAddNew, setShowAddNew] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!lookupDetails) return;

      const baseField = allFields.find(f => f.id === field.fieldId)
      const resolvedPrimary = (baseField as TLookupField).primaryFieldId ?? ""
      const result: TLineItem[] = await getLineItems(lookupDetails.lookupModelId);
      const additionalItems = selectedLineItem?.filter(r =>
        r.fields.some(f => matchingFieldIds.includes(f.fieldId))
      ) ?? [];

      const merged = [
        ...result,
        ...additionalItems.filter(i => !result.some(r => r.id === i.id)),
      ];

      const flatFields = lookupDetails.fields?.flat()?.length > 0 ? lookupDetails.fields.flat() : resolvedPrimary ? [resolvedPrimary] : [];
      const flatSearchFields = lookupDetails.searchFields?.length ? lookupDetails.searchFields : resolvedPrimary ? [resolvedPrimary] : [];

      const allFieldMap = new Map(allFields.map(f => [f.id, f.label]));
      const headers = flatFields.map(id => ({ id, label: allFieldMap.get(id) || id }));
      const headers2 = flatSearchFields.map(id => ({ id, label: allFieldMap.get(id) || id }));

      setItems(merged);
      setFieldLabel(baseField?.label ?? 'Lookup');
      setFieldHeaders(headers);
      setSearchHeaders(headers2);
    };

    fetchData();
  }, [models, matchingFieldIds]);

  const getRowPreview = (recordId: string) => {
    const nestedRecord = lineItem.find(l => l.id === recordId);
    if (!nestedRecord || !lookupDetails?.fields) return null;

    return lookupDetails.fields.map((row, idx) => {
      const values = row
        .map(fid => nestedRecord.fields.find(f => f.fieldId === fid)?.value)
        .filter(val => val !== null && val !== undefined && val !== '') // Filter out empty values
        .map(val => val?.toString());

      if (values.length === 0) return null; // Skip rendering this row if no values

      return (
        <p key={`row-${idx}`} className="text-gray-600">
          {values.join(', ')}
        </p>
      );
    }).filter(Boolean); // Filter out null rows
  };

  const selectOptions = items.map(opt => ({
    label: '', // not used, we’ll customize it
    value: opt.id,
  }));

  const getGridColsClass = (count: number) => {
    return {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4',
      5: 'grid-cols-5',
      6: 'grid-cols-6',
      7: 'grid-cols-7',
      8: 'grid-cols-8',
      9: 'grid-cols-9',
      10: 'grid-cols-10',
    }[count] || 'grid-cols-2';
  };


  const CustomMenuList = (props: any) => {
    return (
      <components.MenuList {...props}>
        <div className={`grid ${getGridColsClass(fieldHeaders.length)} px-3 py-1 text-xs font-semibold text-muted-foreground bg-white sticky top-0 z-10 border-b border-border`}>
          {fieldHeaders.map(h => (
            <div key={`header-${h.id}`}>{h.label}</div>
          ))}
        </div>
        {props.children}
      </components.MenuList>
    );
  };
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
                    className="w-full"
                    classNamePrefix="react-select"
                    components={{ MenuList: CustomMenuList }}
                    menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
                    formatOptionLabel={(option) => {
                      const record = items.find(r => r.id === option.value);
                      return (
                        <div className={`grid ${getGridColsClass(fieldHeaders.length)} gap-2 px-3 py-1 text-sm`}>
                          {fieldHeaders.map((header, idx) => {
                            const val = record?.fields.find(f => f.fieldId === header.id)?.value;
                            return (
                              <div
                                key={`${header.id}-${option.value}-${idx}`}
                                className="truncate text-muted-foreground max-w-[10rem]"
                              >
                                {val ? String(val) : '-'}
                              </div>
                            );
                          })}
                        </div>
                      );
                    }}
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderColor: error ? '#ef4444' : base.borderColor,
                        minHeight: '2.2rem',
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
              </div>
            ) : (
              <div className="flex w-full gap-2">
                <div className="p-2 grow hover:bg-primary-100/30 rounded border border-border shadow-sm flex flex-col gap-1">
                  {controllerField.value && getRowPreview(controllerField.value)}
                </div>
                <div className="btn-icon aspect-square" onClick={() => setShowTable(true)}>
                  <MdOutlineSearch />
                </div>
              </div>
            )}

            <CustomModal
              isOpen={showTable}
              onClose={() => setShowTable(false)}
              header={`Select ${fieldLabel}`}
              Component={LookupRecordTable}
              componentProps={{
                modelId: lookupDetails?.lookupModelId ?? "",
                data: items,
                fieldHeaders: searchHeaders,
                onSelect: (record: TLineItem) => {
                  controllerField.onChange(record.id);
                  setShowTable(false);
                },
                onAddNew: () => {
                  setShowAddNew(true);
                },
                allowAddingRecord
              }}
            />

            <CustomModal
              isOpen={showAddNew}
              onClose={() => setShowAddNew(false)}
              header={`Add New ${fieldLabel}`}
              className='w-[600px]'
              Component={FormLayoutBlock}
              componentProps={{
                modelId: lookupDetails?.lookupModelId ?? "",
                layoutLabel: "Standard",
                onSave: () => {
                  setShowAddNew(false);
                  // Optional: refresh lineItems here if needed
                },
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


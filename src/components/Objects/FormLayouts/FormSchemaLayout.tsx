'use client';

import { useDynamicModel } from '@/store/hooks/dynamicModelsHooks';
import { TFormItem, formItemSchema } from '@/types/layouts';
import { useCallback, useEffect, useMemo, useState } from 'react';
import CustomModal from '@/components/Modals/CustomModal2';
import LookupOptions from './LookupOptions';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import FlowOptionsModal from './FlowOptionsModal';
import { isEqual } from 'lodash';
import { useRef } from 'react';
import DraggableFieldSource from './DraggableFieldSource';
import DroppableColumn from './DroppableColumn';
import Select from 'react-select';

const schema = z.object({ contentSchema: z.array(formItemSchema), numberOfColumns: z.number().int().nonnegative().optional().default(1), });
type LayoutFormData = z.infer<typeof schema>;
type Props = { selectedLayoutId: string };

const FormSchemaLayout = ({ selectedLayoutId }: Props) => {
  const { selectedModel, formLayouts, updateFormLayout, allFields } = useDynamicModel();

  const [selectedLookup, setSelectedLookup] = useState<string | null>(null);
  const [selectedFlowFieldId, setSelectedFlowFieldId] = useState<string | null>(null);
  const selectedLayout = formLayouts.find((l) => l.id === selectedLayoutId);

  const { control, handleSubmit, reset, getValues, setValue, watch, formState } = useForm<LayoutFormData>({ resolver: zodResolver(schema) });

  const { fields, append, remove } = useFieldArray<LayoutFormData, "contentSchema", "id">({ control, name: 'contentSchema' });
  const initialSchemaRef = useRef<TFormItem[]>([]);
  const updateInitialSchema = (newSchema: TFormItem[]) => { initialSchemaRef.current = newSchema };

  const resetLayoutForm = useCallback((schema: TFormItem[]) => {
    const maxCol = Math.max(0, ...schema.map(item => item.col ?? 0));
    const colCount = maxCol + 1;
    reset({ contentSchema: schema, numberOfColumns: colCount });
    setNumberOfColumns(colCount);
    updateInitialSchema(schema);
  }, [reset, selectedLayoutId]);


  useEffect(() => { console.log(formState.errors) }, [formState]);

  useEffect(() => {
    if (selectedLayout) { resetLayoutForm(selectedLayout.contentSchema ?? []); }
  }, [selectedLayout, resetLayoutForm]);


  const availableFields = useMemo(() => {
    return allFields.filter(f =>
      selectedLayout?.contentSchema?.some(i => i.fieldId === f.id)
    );
  }, [allFields, selectedLayout]);


  const onSave = async (data: LayoutFormData) => {
    if (!selectedLayout || !selectedModel) return;

    const cleanedSchema = data.contentSchema.map(item => ({ ...item, flowId: item.flowId || undefined }));
    const updatedLayout = {
      id: selectedLayout.id,
      label: selectedLayout.label,
      modelId: selectedModel.id,
      contentSchema: cleanedSchema,
      numberOfColumns: data.numberOfColumns,
    }
    console.log(updatedLayout);

    const res = await updateFormLayout(updatedLayout);
    console.log(res);

    updateInitialSchema(data.contentSchema);
    resetLayoutForm(cleanedSchema);
  };
  const contentSchema = watch('contentSchema') ?? [];
  const [numberOfColumns, setNumberOfColumns] = useState(() => {
    const maxCol = Math.max(0, ...(selectedLayout?.contentSchema ?? []).map(item => item.col ?? 0));
    return maxCol + 1;
  });
  const groupedFields: TFormItem[][] = Array.from({ length: numberOfColumns }, () => []);
  const hasChanged = !isEqual(initialSchemaRef.current, contentSchema);
  const hasNoFields = contentSchema.length === 0;
  const requiredFieldIds = availableFields.filter(f => f.isRequired).map(f => f.id);
  const addedFieldIds = contentSchema.map(f => f.fieldId);
  const allRequiredFieldsAdded = requiredFieldIds.every(id => addedFieldIds.includes(id));
  const disableSave = hasNoFields || !hasChanged || !allRequiredFieldsAdded;
  fields.forEach(item => { const col = item.col ?? 0; groupedFields[col % numberOfColumns].push(item) });

  const reorderContentSchema = (items: TFormItem[]): TFormItem[] => {
    const normalized = items.map(item => ({ ...item, col: item.col ?? 0, }));
    const byCol = new Map<number, TFormItem[]>();
    for (const item of normalized) {
      const col = item.col!;
      if (!byCol.has(col)) byCol.set(col, []);
      byCol.get(col)!.push(item);
    }
    const reordered: TFormItem[] = [];
    Array.from(byCol.entries())
      .sort(([a], [b]) => a - b) // sort cols ASC
      .forEach(([col, list]) => {
        list.forEach((item, i) => {
          reordered.push({ ...item, order: i, col });
        });
      });
    return reordered;
  };

  const moveItemByFieldId = (fieldId: string, hoverIndex: number, targetCol: number) => {
    const items = [...getValues("contentSchema")].map(item => ({ ...item, col: item.col ?? 0 }));
    const draggedItem = items.find(i => i.fieldId === fieldId);
    if (!draggedItem) return;
    const remainingItems = items.filter(i => i.fieldId !== fieldId);
    const updatedTargetColItems = remainingItems.filter(i => i.col === targetCol);
    updatedTargetColItems.splice(hoverIndex, 0, { ...draggedItem, col: targetCol });
    const otherItems = remainingItems.filter(i => i.col !== targetCol);
    const combined = [...otherItems, ...updatedTargetColItems];
    const reordered = reorderContentSchema(combined);
    setValue("contentSchema", reordered);
  };

  const handleRemove = (index: number) => {
    remove(index);
    setTimeout(() => {
      const current = getValues("contentSchema");
      const reordered = reorderContentSchema([...current]);
      setValue("contentSchema", reordered);
    }, 0);
  };

  return (
    <>
      <div className="w-2/3 flex flex-col gap-4 py-4">
        <div className="flex gap-4 items-center">
          <label className="text-sm font-semibold">Number of Columns:</label>
          <Select
            options={[1, 2, 3, 4, 5].map(n => ({ value: n, label: `${n}` }))}
            value={{ value: numberOfColumns, label: `${numberOfColumns}` }}
            onChange={(selected) => {
              if (selected) {
                setNumberOfColumns(selected.value); // local state
                setValue("numberOfColumns", selected.value); // react-hook-form
              }
            }}
            isSearchable={false}
          />
          <button className="btn btn-secondary py-1" onClick={() => console.log(contentSchema)}>TEST</button>
        </div>

        <div className="text-sm text-gray-500 flex gap-4 mb-2">
          <span>
            <span className="inline-block w-3 h-3 rounded bg-red-300 mr-1" />
            Required (not added)
          </span>
          <span>
            <span className="inline-block w-3 h-3 rounded bg-green-300 mr-1" />
            Required (added)
          </span>
          <span>
            <span className="inline-block w-3 h-3 rounded bg-blue-300 mr-1" />
            Optional
          </span>
        </div>

        {/* Available Fields Grid */}
        <div className="flex gap-2 flex-wrap">
          {availableFields.map((field) => {
            const isAdded = contentSchema.some((f) => f.fieldId === field.id);
            if (isAdded) return null;
            return <DraggableFieldSource key={field.id} field={field} />;
          })}
        </div>

        <hr className="my-4" />

        <p className="text-lg font-medium">Layout Fields</p>
        <div className="flex gap-2">
          {groupedFields.map((colItems, colIdx) => (
            <DroppableColumn
              key={colIdx}
              colIdx={colIdx}
              items={colItems}
              append={append}
              remove={handleRemove}
              moveItem={moveItemByFieldId}
              isAdded={(fieldId) => contentSchema.some(f => f.fieldId === fieldId)}
              onOptionsClick={setSelectedLookup}
              onFlowClick={setSelectedFlowFieldId}
            />
          ))}
        </div>
        {disableSave && (
          <p className="text-xs text-gray-500 mt-2">
            {hasNoFields && ' Please add at least one field.'}<br />
            {!allRequiredFieldsAdded && ' Make sure all required fields are added.'}<br />
            {!hasChanged && ' No changes detected.'}
          </p>
        )}
        <div className="flex justify-end pt-4 gap-2">
          {!disableSave && (
            <button
              type="button"
              onClick={() => resetLayoutForm(contentSchema)}
              className="btn "
            >
              Reset
            </button>
          )}
          <button
            onClick={handleSubmit(onSave)}
            className={`btn ${!disableSave ? 'btn-primary' : 'btn-disabled'}`}
            // disabled={disableSave}
            title={hasNoFields
              ? 'Add at least one field'
              : !allRequiredFieldsAdded
                ? 'All required fields must be included'
                : !hasChanged
                  ? 'No changes to save'
                  : ''
            }
          >
            Save Layout Schema
          </button>
        </div>
      </div>

      <CustomModal
        isOpen={!!selectedLookup}
        onClose={() => setSelectedLookup(null)}
        header="Lookup Options"
        Component={() => {
          const field = contentSchema.find((f) => f.lookupDetails?.lookupModelId === selectedLookup);
          return (
            selectedLookup && (
              <LookupOptions
                lookupId={selectedLookup}
                initialFields={field?.lookupDetails?.fields ?? [[]]}
                initialSearchFields={field?.lookupDetails?.searchFields ?? []}
                initialIsCustomStyle={field?.lookupDetails?.isCustomStyle ?? false}
                onChange={({ fields, searchFields, isCustomStyle }) => {
                  const updated = contentSchema.map((item) => {
                    if (item.lookupDetails?.lookupModelId === selectedLookup) {
                      return {
                        ...item,
                        lookupDetails: {
                          ...item.lookupDetails,
                          fields,
                          searchFields,
                          isCustomStyle,
                        },
                      };
                    }
                    return item;
                  });
                  // console.log(updated)
                  setValue('contentSchema', updated);
                  setSelectedLookup(null);
                }}
              />
            )
          );
        }}
      />

      <CustomModal
        isOpen={!!selectedFlowFieldId}
        onClose={() => setSelectedFlowFieldId(null)}
        header="Select Flow"
        Component={() => {
          const field = contentSchema.find(f => f.fieldId === selectedFlowFieldId);
          return (
            <FlowOptionsModal
              initialFlowId={field?.flowId ?? undefined}
              onSelect={(flowId) => {
                const updated = contentSchema.map(item =>
                  item.fieldId === selectedFlowFieldId ? { ...item, flowId: flowId ?? undefined } : item
                );
                setValue('contentSchema', updated);
                setSelectedFlowFieldId(null);
              }}
            />
          );
        }}
      />

    </>
  );
};

export default FormSchemaLayout;
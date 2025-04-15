'use client';

import { useDynamicModel } from '@/store/hooks/dynamicModelsHooks';
import { TRecordItem, recordItemSchema } from '@/types/layouts';
import { TField } from '@/types/dynamicModel';
import { useEffect, useState, useRef } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import CustomModal from '@/components/Modals/CustomModal2';
import SortableFieldItem from './SortableFieldItem';
import LookupGridColumn from './LookupGridColumn';
import LookupCustom from './LookupCustom';

const schema = z.object({
  contentSchema: z.array(recordItemSchema),
});

type LayoutFormData = z.infer<typeof schema>;

type Props = {
  selectedLayoutId: string;
};

const RecordSchemaLayout = ({ selectedLayoutId }: Props) => {
  const {
    selectedModel,
    inputFields,
    recordLayouts,
    updateRecordLayout,
  } = useDynamicModel();

  const selectedLayout = recordLayouts.find((l) => l.id === selectedLayoutId);

  const [availableFields, setAvailableFields] = useState<TField[]>([]);
  const [selectedLookup, setSelectedLookup] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    setValue,
    watch,
  } = useForm<LayoutFormData>({
    defaultValues: { contentSchema: [] },
    resolver: zodResolver(schema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'contentSchema',
  });

  const initialSchemaRef = useRef<TRecordItem[]>([]);
  const updateInitialSchema = (schema: TRecordItem[]) => {
    initialSchemaRef.current = schema;
  };

  useEffect(() => {
    if (inputFields.length) {
      setAvailableFields(inputFields);
    }

    if (selectedLayout?.contentSchema?.length) {
      setValue('contentSchema', selectedLayout.contentSchema);
      updateInitialSchema(selectedLayout.contentSchema);
    } else {
      setValue('contentSchema', []);
      updateInitialSchema([]);
    }
  }, [inputFields, selectedLayoutId]);

  const addFieldToLayout = (field: TField) => {
    const alreadyAdded = watch('contentSchema').some((f) => f.fieldId === field.id);
    if (alreadyAdded) return;

    append({
      fieldId: field.id,
      type: field.type,
      order: watch('contentSchema').length,
      lookupDetails: field.type === 'lookup'
        ? {
          lookupModelId: field.lookupModelId!,
          fields: [],
        }
        : undefined,
    });
  };

  const onSave = async (data: LayoutFormData) => {
    if (!selectedLayout || !selectedModel) return;

    const fullLayout = {
      id: selectedLayout.id,
      label: selectedLayout.label,
      modelId: selectedModel.id,
      contentSchema: data.contentSchema,
    };

    await updateRecordLayout(fullLayout);
    updateInitialSchema(data.contentSchema);
    reset({ contentSchema: data.contentSchema });
  };

  const resetForm = () => {
    reset({ contentSchema: initialSchemaRef.current });
  };

  const contentSchema = watch('contentSchema');
  const hasChanged = JSON.stringify(initialSchemaRef.current) !== JSON.stringify(contentSchema);
  const hasNoFields = contentSchema.length === 0;
  const isStandardLayout = selectedLayout?.label.toLowerCase() === 'standard';
  const disableSave = isStandardLayout || !hasChanged;

  const moveItem = (dragIndex: number, hoverIndex: number) => {
    const items = [...getValues("contentSchema")];
    const [moved] = items.splice(dragIndex, 1);
    items.splice(hoverIndex, 0, moved);
    setValue("contentSchema", items.map((item, idx) => ({ ...item, order: idx })));
  };

  return (
    <>
      <div className="w-2/3 min-w-fit flex flex-col gap-4 py-4">
        <p className="text-lg font-medium">Add Fields to Layout</p>

        {/* Available Fields */}
        <div className="flex gap-2 flex-wrap">
          {availableFields.map((field) => {
            const isAdded = watch('contentSchema').some((f) => f.fieldId === field.id);

            return (
              <button
                key={field.id}
                onClick={() => addFieldToLayout(field)}
                className={`px-3 py-2 rounded text-sm font-medium transition ${isAdded
                  ? 'bg-gray-300 cursor-not-allowed opacity-60'
                  : 'bg-blue-100 hover:bg-blue-300'
                  }`}
                disabled={isAdded}
              >
                {field.label}
              </button>
            );
          })}
        </div>

        <hr className="my-4" />

        <p className="text-lg font-medium">Layout Fields</p>
        {fields.length === 0 ? (
          <p className="text-sm italic text-gray-500">No fields added yet.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {fields.map((item, index) => {
              const field = availableFields.find((f) => f.id === item.fieldId);
              return (
                <SortableFieldItem
                  key={item.id}
                  index={index}
                  item={item}
                  field={field}
                  moveItem={moveItem}
                  onRemove={() => remove(index)}
                  onOptionsClick={() => setSelectedLookup(item.fieldId)}
                />
              );
            })}
          </ul>
        )}

        <div className="flex justify-end pt-4 gap-2">
          {hasChanged && (
            <button type="button" onClick={resetForm} className="btn">
              Reset
            </button>
          )}
          <button
            onClick={handleSubmit(onSave)}
            className={`btn ${!disableSave ? 'btn-primary' : 'btn-disabled'}`}
            disabled={disableSave}
          >
            Save Layout Schema
          </button>
        </div>
      </div>

      <CustomModal
        Component={() => {
          const item = watch('contentSchema').find((f) => f.fieldId === selectedLookup);
          if (!selectedLookup || !item?.lookupDetails) return null;

          return selectedLayout?.isGrid ? (
            <LookupGridColumn
              lookupId={item.lookupDetails.lookupModelId}
              initialFields={item.lookupDetails.fields?.flat() || []}
              onSave={(updatedFields) => {
                const updated = getValues('contentSchema').map((f) => {
                  if (f.fieldId === selectedLookup && f.lookupDetails) {
                    return {
                      ...f,
                      lookupDetails: {
                        ...f.lookupDetails,
                        fields: [updatedFields], // wrap in 2D array for consistency
                      },
                    };
                  }
                  return f;
                });
                setValue('contentSchema', updated);
                setSelectedLookup(null);
              }}
              onClose={() => setSelectedLookup(null)}
            />
          ) : (
            <LookupCustom
              lookupId={item.lookupDetails.lookupModelId}
              initialGrid={item.lookupDetails.fields || [[]]}
              onSave={(updatedGrid) => {
                const updated = getValues('contentSchema').map((f) => {
                  if (f.fieldId === selectedLookup && f.lookupDetails) {
                    return {
                      ...f,
                      lookupDetails: {
                        ...f.lookupDetails,
                        fields: updatedGrid,
                      },
                    };
                  }
                  return f;
                });
                setValue('contentSchema', updated);
                setSelectedLookup(null);
              }}
              onClose={() => setSelectedLookup(null)}
            />
          );
        }}
        isOpen={!!selectedLookup}
        onClose={() => setSelectedLookup(null)}
        header="Custom field"
      />
    </>
  );
};

export default RecordSchemaLayout;
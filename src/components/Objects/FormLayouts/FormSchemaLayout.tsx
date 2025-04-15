'use client';

import { useDynamicModel } from '@/store/hooks/dynamicModelsHooks';
import { TFormItem, formItemSchema } from '@/types/layouts';
import { TField } from '@/types/dynamicModel';
import { useEffect, useState } from 'react';
import CustomModal from '@/components/Modals/CustomModal2';
import LookupOptions from './LookupOptions';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import SortableFieldItem from './SortableFieldItem';
import { isEqual } from 'lodash';
import { useRef } from 'react';

type Props = {
  selectedLayoutId: string;
};

const schema = z.object({
  contentSchema: z.array(formItemSchema),
});
type LayoutFormData = z.infer<typeof schema>;

const FormSchemaLayout = ({ selectedLayoutId }: Props) => {
  const { selectedModel, inputFields, formLayouts, updateFormLayout } = useDynamicModel();

  const [availableFields, setAvailableFields] = useState<TField[]>([]);
  const [selectedLookup, setSelectedLookup] = useState<string | null>(null);

  const selectedLayout = formLayouts.find((l) => l.id === selectedLayoutId);

  const { control, handleSubmit, reset, getValues, setValue, watch } = useForm<LayoutFormData>({
    defaultValues: { contentSchema: [] },
    resolver: zodResolver(schema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'contentSchema',
  });
  const initialSchemaRef = useRef<TFormItem[]>([]);
  const updateInitialSchema = (newSchema: TFormItem[]) => {
    initialSchemaRef.current = newSchema;
  };


  useEffect(() => {
    if (selectedLayout?.contentSchema?.length) {
      setValue('contentSchema', selectedLayout.contentSchema);
      updateInitialSchema(selectedLayout.contentSchema);
    } else {
      setValue('contentSchema', []);
      updateInitialSchema([]);
    }
  }, [selectedLayoutId, inputFields]);

  useEffect(() => {
    if (inputFields.length) {
      setAvailableFields(inputFields);
    }

    if (selectedLayout?.contentSchema?.length) {
      setValue('contentSchema', selectedLayout.contentSchema);
    } else {
      setValue('contentSchema', []);
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
          primaryField: field.primaryFieldId!,
          fields: [],
        }
        : undefined,
    });
  };
  const resetForm = () => {
    // setValue('contentSchema', initialSchemaRef.current);
    reset({ contentSchema: initialSchemaRef.current });
  };

  const onSave = async (data: LayoutFormData) => {
    if (!selectedLayout || !selectedModel) return;

    const fullLayout = {
      id: selectedLayout.id,
      label: selectedLayout.label,
      modelId: selectedModel.id,
      contentSchema: data.contentSchema,
    };
    // console.log("✅ Final contentSchema to save:", data.contentSchema);
    console.log("✅ Final contentSchema to save:", fullLayout);
    const res = await updateFormLayout(fullLayout)
    updateInitialSchema(data.contentSchema);
    reset({ contentSchema: data.contentSchema }); // ✅ Mark form as clean
  };
  const contentSchema = watch('contentSchema');
  const hasChanged = !isEqual(initialSchemaRef.current, contentSchema);

  const isStandardLayout = selectedLayout?.label.toLowerCase() === 'standard';
  const hasNoFields = contentSchema.length === 0;

  const requiredFieldIds = availableFields.filter(f => f.isRequired).map(f => f.id);
  const addedFieldIds = contentSchema.map(f => f.fieldId);
  const allRequiredFieldsAdded = requiredFieldIds.every(id => addedFieldIds.includes(id));

  const disableSave = isStandardLayout || hasNoFields || !hasChanged || !allRequiredFieldsAdded;

  const moveItem = (dragIndex: number, hoverIndex: number) => {
    const items = [...getValues("contentSchema")];
    const [moved] = items.splice(dragIndex, 1);
    items.splice(hoverIndex, 0, moved);
    setValue("contentSchema", items.map((item, idx) => ({ ...item, order: idx })));
  };

  return (
    <>
      <div className="w-2/3 min-w-fit flex flex-col gap-4 py-4">
        {/* Legend */}
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
            const isAdded = watch('contentSchema').some((f) => f.fieldId === field.id);
            const isRequired = field.isRequired;

            const getBgColor = () => {
              if (isRequired && isAdded) return 'bg-green-100 text-green-800';
              if (isRequired && !isAdded) return 'bg-red-100 text-red-800';
              if (!isRequired && isAdded) return 'bg-gray-200 text-gray-500';
              return 'bg-blue-100 hover:bg-blue-300';
            };

            return (
              <button
                key={field.id}
                onClick={() => !isAdded && addFieldToLayout(field)}
                className={`px-3 py-2 rounded text-sm font-medium transition ${getBgColor()} ${isAdded ? 'cursor-not-allowed opacity-60' : 'hover:scale-[1.03] cursor-pointer'
                  }`}
                title={
                  isAdded
                    ? 'Already added'
                    : isRequired
                      ? 'Required field'
                      : 'Optional field'
                }
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
              // onOptionsClick={() => setSelectedLookup(item.fieldId)}
              // if(item.type=='lookup'){console.log(item.lookupDetails?.lookupModelId)}
              return (
                <SortableFieldItem
                  key={item.id}
                  index={index}
                  item={item}
                  field={field}
                  moveItem={moveItem}
                  onRemove={() => remove(index)}
                  onOptionsClick={() => setSelectedLookup(item.lookupDetails?.lookupModelId ?? "")}
                />
              );
            })}
          </ul>
        )}
        {disableSave && (
          <p className="text-xs text-gray-500 mt-2">
            {isStandardLayout && 'Standard layout cannot be changed.'}<br />
            {hasNoFields && ' Please add at least one field.'}<br />
            {!allRequiredFieldsAdded && ' Make sure all required fields are added.'}<br />
            {!hasChanged && ' No changes detected.'}
          </p>
        )}
        <div className="flex justify-end pt-4 gap-2">
          {!disableSave && (
            <button
              type="button"
              onClick={resetForm}
              className="btn "
            >
              Reset
            </button>
          )}
          <button
            onClick={handleSubmit(onSave)}
            className={`btn ${!disableSave ? 'btn-primary' : 'btn-disabled'}`}
            disabled={disableSave}
            title={
              isStandardLayout
                ? 'Standard layout cannot be edited'
                : hasNoFields
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
        className=""
        Component={() => {
          const field = contentSchema.find(
            (f) => f.lookupDetails?.lookupModelId === selectedLookup
          );

          return (
            selectedLookup && (
              <LookupOptions
                lookupId={selectedLookup}
                initialValues={{
                  primaryFieldId: field?.lookupDetails?.primaryField,
                  searchModalColumns: field?.lookupDetails?.fields || [],
                }}
                onSave={({ primaryFieldId, searchModalColumns }) => {
                  const updated = getValues('contentSchema').map((item) => {
                    if (item.lookupDetails?.lookupModelId === selectedLookup) {
                      return {
                        ...item,
                        lookupDetails: {
                          ...item.lookupDetails,
                          primaryField: primaryFieldId,
                          fields: searchModalColumns,
                        },
                      };
                    }
                    return item;
                  });
                  setValue('contentSchema', updated);
                  setSelectedLookup(null);
                }}
                onClose={() => setSelectedLookup(null)}
              />
            )
          );
        }}
        isOpen={!!selectedLookup}
        onClose={() => setSelectedLookup(null)}
        header="Lookup Options"
      />


    </>
  );
};

export default FormSchemaLayout;

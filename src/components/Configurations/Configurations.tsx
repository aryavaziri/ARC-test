'use client'
import { useDynamicModel } from '@/store/hooks/dynamicModelsHooks';
import React, { useState, useMemo } from 'react';
import Select from 'react-select';
import { TLineItem } from '@/types/dynamicModel';
import { TRecordLayout } from '@/types/layouts';
import GridRender from '../Render/GridRender';

const Configurations = () => {
  const { models, getLineItems, recordLayouts, lineItem } = useDynamicModel();
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
  const [recordLayout, setRecordLayout] = useState<TRecordLayout | null>(null);
  const [lineItems, setLineItems] = useState<TLineItem[]>([]);

  const handleModelChange = async (option: { value: string; label: string } | null) => {
    if (!option) return;
    const modelId = option.value;
    setSelectedModelId(modelId);

    const layout = recordLayouts.find(l => l.modelId === modelId && l.label.toLowerCase() === 'standard');
    const items = await getLineItems(modelId);

    layout && setRecordLayout(layout);
    setLineItems(items);

    // 🔥 Preload all related lookup models
    const lookupIds = layout?.contentSchema
      ?.filter(f => f.lookupDetails?.lookupModelId)
      .map(f => f.lookupDetails!.lookupModelId) ?? [];

    await Promise.all(lookupIds.map(id => getLineItems(id)));
  };


  const modelOptions = models.map(model => ({
    label: model.name,
    value: model.id,
  }));

  const fieldHeaders = useMemo(() => {
    if (!recordLayout || !selectedModelId) return [];

    return recordLayout.contentSchema?.map(f => {
      const field = models.find(m => m.id === selectedModelId)?.ModelLookupInputs?.find(i => i.id === f.fieldId) ||
        models.find(m => m.id === selectedModelId)?.ModelTextInputs?.find(i => i.id === f.fieldId) ||
        models.find(m => m.id === selectedModelId)?.ModelNumberInputs?.find(i => i.id === f.fieldId) ||
        models.find(m => m.id === selectedModelId)?.ModelCheckboxInputs?.find(i => i.id === f.fieldId) ||
        models.find(m => m.id === selectedModelId)?.ModelDateInputs?.find(i => i.id === f.fieldId) ||
        models.find(m => m.id === selectedModelId)?.ModelLongTextInputs?.find(i => i.id === f.fieldId);

      return {
        id: f.fieldId,
        label: field?.label ?? f.fieldId,
        isLookup: !!f.lookupDetails,
        parentFieldId: f.lookupDetails?.lookupModelId,
      };
    }) ?? [];
  }, [recordLayout, selectedModelId]);

  const getDisplayValue = (
    record: TLineItem,
    header: { id: string; isLookup?: boolean; parentFieldId?: string }
  ): string => {
    const matched = record.fields.find(f => f.fieldId === header.id);
    if (!matched) return '-';

    if (header.isLookup && header.parentFieldId) {
      const model = models.find(m => m.id === selectedModelId);
      const primaryFieldId = model?.ModelLookupInputs?.find(f => f.id === matched?.fieldId)?.primaryFieldId;
      const relatedRecord = lineItem?.find(i => i.id === matched.value);
      const primaryValue = relatedRecord?.fields.find(f => f.fieldId === primaryFieldId)?.value;
      return String(primaryValue ?? matched.value ?? '-');
    }

    return String(matched.value ?? '-');
  };


  const removeLineItem = async (id: string) => {
    console.log("Delete line item:", id);
  };

  return (
    <div className="con">
      <div className="font-semibold text-xl mb-8">Configurations</div>

      <div className="font-semibold mb-2">Default Values</div>
      <Select
        options={modelOptions}
        onChange={handleModelChange}
        placeholder="Select a model..."
        className="min-w-[300px]"
        value={modelOptions.find(opt => opt.value === selectedModelId) || null}
        classNamePrefix="react-select"
        menuPosition="fixed"
        menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
        styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
      />

      {selectedModelId && recordLayout && (
        <div className="mt-6">
          <GridRender
            modelId={selectedModelId}
            records={lineItems}
            fieldHeaders={fieldHeaders}
            getDisplayValue={getDisplayValue}
            removeLineItem={removeLineItem}
          />
        </div>
      )}
    </div>
  );
};

export default Configurations;

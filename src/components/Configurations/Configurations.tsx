'use client';

import { useDynamicModel } from '@/store/hooks/dynamicModelsHooks';
import React, { useState } from 'react';
import Select from 'react-select';
import RecordLayoutBlock from '../Render/RecordLayoutBlock'; // 👈 import the component

const Configurations = () => {
  const { models, recordLayouts, getLineItems } = useDynamicModel();
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
  const [recordLayoutId, setRecordLayoutId] = useState<string | null>(null);

  const modelOptions = models.filter(m => m.showInConfiguration).map(model => ({
    label: model.name,
    value: model.id,
  }));

  const handleModelChange = async (option: { value: string; label: string } | null) => {
    if (!option) return;
    const modelId = option.value;
    setSelectedModelId(modelId);

    // 🔍 Find standard layout for selected model
    const layout = recordLayouts.find(
      l => l.modelId === modelId && l.label.toLowerCase() === 'standard'
    );

    if (layout) {
      setRecordLayoutId(layout.id);
      await getLineItems(modelId); // ✅ fetch base line items (lookup items are handled in RecordLayoutBlock)
    }
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

      {recordLayoutId && (
        <div className="mt-6">
          <RecordLayoutBlock recordLayoutId={recordLayoutId} />
        </div>
      )}
    </div>
  );
};

export default Configurations;

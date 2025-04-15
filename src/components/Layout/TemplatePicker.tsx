'use client';

import { layoutTemplates } from './LayoutTemplates';
import { useState } from 'react';

interface Props {
  selectedTemplateId: string;
  onSelect: (id: string) => void;
}

const TemplatePicker = ({ selectedTemplateId, onSelect }: Props) => {

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="grid grid-cols-3 gap-4">
        {layoutTemplates.map((template) => {
          const previewNodes = new Array(template.regions).fill(undefined);
          const preview = template.render(previewNodes, true);

          return (
            <button
              key={template.id}
              onClick={() => onSelect(template.id)}
              className={`rounded border p-2 transition-all flex flex-col hover:shadow-md ${selectedTemplateId === template.id
                  ? 'border-primary ring-2 ring-primary'
                  : 'border-gray-300'
                }`}
            >
              <div className="mb-4 text-sm font-medium text-center h-8">{template.name}</div>
              <div className="pointer-events-none grow bg-sky-300">{preview}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TemplatePicker;

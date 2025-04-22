'use client';

import { useEffect } from 'react';
import DroppableRegion, { NewDroppedField } from './DroppableRegion';
import { layoutTemplates } from './LayoutTemplates';
import { TDroppedField } from '@/types/layouts';

interface Props {
  selectedTemplateId: string;
  droppedFields: TDroppedField[];
  setDroppedFields: React.Dispatch<React.SetStateAction<TDroppedField[]>>;
}

const LayoutBuilder = ({ selectedTemplateId, droppedFields, setDroppedFields }: Props) => {
  const template = layoutTemplates.find((t) => t.id === selectedTemplateId);

  useEffect(() => {
    // Optional: clear dropped fields if changing to a template with fewer regions
    if (template) {
      setDroppedFields((prev) =>
        prev.filter((f) => f.region < template.regions)
      );
    }
  }, [selectedTemplateId]);

  if (!template) return null;

  const handleDrop = (region: number, item: NewDroppedField) => {
    const regionFields = droppedFields.filter(f => f.region === region);
    const newItem = buildDroppedField(item, region, regionFields.length);

    if (newItem) {
      setDroppedFields([...droppedFields, newItem]);
    }
  };


  const handleMove = (regionIndex: number, from: number, to: number) => {
    const items = droppedFields.filter(f => f.region === regionIndex).sort((a, b) => a.index - b.index);
    const [moved] = items.splice(from, 1);
    items.splice(to, 0, moved);

    const reordered = items.map((item, i) => ({ ...item, index: i }));
    const others = droppedFields.filter(f => f.region !== regionIndex);

    setDroppedFields([...others, ...reordered]);
  };

  const handleMoveBetweenRegions = (fromRegion: number, toRegion: number, index?: number) => {
    if (index === undefined) return;

    const fromItems = droppedFields.filter(f => f.region === fromRegion);
    const toItems = droppedFields.filter(f => f.region === toRegion);
    const [movedItem] = fromItems.splice(index, 1);

    if (!movedItem) return;

    const updatedItem = { ...movedItem, region: toRegion, index: toItems.length };

    const remaining = droppedFields.filter(f => f !== movedItem);
    setDroppedFields([...remaining, updatedItem]);
  };

  const handleRemove = (regionIndex: number, index: number) => {
    const regionItems = droppedFields.filter(f => f.region === regionIndex);
    const [removed] = regionItems.splice(index, 1);
    if (!removed) return;

    const reordered = regionItems.map((item, i) => ({ ...item, index: i }));
    const others = droppedFields.filter(f => f !== removed && f.region !== regionIndex);

    setDroppedFields([...others, ...reordered]);
  };

  // Generate one DroppableRegion per numeric index
  const regionNodes: React.ReactNode[] = Array.from({ length: template.regions }, (_, regionIndex) => {
    const regionFields = droppedFields
      .filter(f => f.region === regionIndex)
      .sort((a, b) => a.index - b.index);

    return (
      <DroppableRegion
        key={regionIndex}
        region={regionIndex}
        label={`Region ${regionIndex + 1}`}
        droppedFields={regionFields}
        setDroppedFields={setDroppedFields}
        onDrop={handleDrop}
        onMove={handleMove}
        onRemove={handleRemove}
        onMoveBetweenRegions={handleMoveBetweenRegions}
      />
    );
  });

  return (
    <div className="border rounded overflow-hidden p-4 grow h-full">
      {template.render(regionNodes)}
    </div>
  );
};

export default LayoutBuilder;


const buildDroppedField = (
  item: NewDroppedField,
  region: number,
  index: number
): TDroppedField => {
  if (item.type === 'form') {
    return {
      label: item.label,
      type: 'form',
      formLayoutId: item.formLayoutId,
      region,
      index,
    };
  } else if (item.type === 'record') {
    return {
      label: item.label,
      type: 'record',
      recordLayoutId: item.recordLayoutId,
      region,
      index,
    };
  } else if (item.type === 'custom') {
    return {
      label: item.label,
      type: 'custom',
      customKey: item.customKey,
      region,
      index,
    };
  }

  throw new Error('Unsupported field type');
};

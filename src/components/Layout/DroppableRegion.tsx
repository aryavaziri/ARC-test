'use client';

import { useRef, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import DraggableField from './DraggableField';
import { TDroppedField } from '@/types/layouts';

interface Props {
  region: number;
  label: string;
  droppedFields: TDroppedField[];
  onDrop: (region: number, item: Omit<TDroppedField, 'region' | 'index'>) => void;
  onMove: (region: number, from: number, to: number) => void;
  onRemove: (region: number, index: number) => void;
  onMoveBetweenRegions: (from: number, to: number, index?: number) => void;
}

const DroppableRegion = ({
  region,
  label,
  droppedFields,
  onDrop,
  onMove,
  onRemove,
  onMoveBetweenRegions,
}: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [{ isOver }, drop] = useDrop({
    accept: ['FIELD', 'SORTED_FIELD'],
    drop: (item: any) => {
      if (item.region !== undefined && item.region !== region) {
        onMoveBetweenRegions(item.region, region, item.index);
      } else if (item.region === undefined) {
        const newField: Omit<TDroppedField, 'region' | 'index'> = {
          label: item.label,
          type: item.type,
          ...(item.type === 'form'
            ? { formLayoutId: item.formLayoutId }
            : { recordLayoutId: item.recordLayoutId }),
        };
        onDrop(region, newField);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  useEffect(() => {
    if (containerRef.current) {
      drop(containerRef.current);
    }
  }, [drop]);

  return (
    <div
      ref={containerRef}
      className={`min-h-[140px] p-4 border border-dashed bg-white rounded h-full transition-all ${isOver ? 'bg-primary/10' : ''
        }`}
    >
      <h3 className="text-sm font-semibold mb-2">{label}</h3>

      <div className="space-y-2">
        {droppedFields.map((field, index) => (
          <DraggableField
            key={`${field.type}-${field.formLayoutId || field.recordLayoutId}-${index}`}
            field={field}
            index={index}
            region={region}
            move={(from, to) => onMove(region, from, to)}
            onRemove={() => onRemove(region, index)}
          />
        ))}
      </div>

      {droppedFields.length === 0 && (
        <p className="text-xs text-muted italic">Drop form/table fields here</p>
      )}
    </div>
  );
};

export default DroppableRegion;

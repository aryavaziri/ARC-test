'use client';

import { useDrag, useDrop } from 'react-dnd';
import { memo, useRef } from 'react';
import { FaGripVertical, FaTrash } from 'react-icons/fa';

interface DraggableField2Props {
  field: {
    label: string;
    type: 'custom';
    customKey: string;
  };
  index?: number;
  region?: number;
  move?: (from: number, to: number) => void;
  onRemove?: () => void;
}

const DraggableField2 = ({ field, index, region, move, onRemove }: DraggableField2Props) => {
  const ref = useRef<HTMLDivElement>(null);

  const [, drop] = useDrop({
    accept: ['FIELD', 'SORTED_FIELD'],
    hover(item: any) {
      if (!ref.current || index === undefined) return;
      if (item.type !== 'SORTED_FIELD' || item.region !== region) return;

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      move?.(dragIndex, hoverIndex);
      item.index = hoverIndex;
    }
  });

  const [{ isDragging }, drag] = useDrag({
    type: index !== undefined ? 'SORTED_FIELD' : 'FIELD',
    item: {
      ...field,
      index,
      region,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`flex justify-between items-center bg-white border px-3 py-2 rounded shadow-sm ${isDragging ? 'opacity-50' : ''
        }`}
    >
      <div className="flex items-center gap-2">
        <FaGripVertical className="text-muted cursor-move" />
        <div>
          <div className="text-sm font-medium">{field.label}</div>
          <div className="text-xs text-muted">Custom Field ({field.customKey})</div>
        </div>
      </div>
      {onRemove && (
        <button onClick={onRemove} className="btn-icon text-red-500">
          <FaTrash />
        </button>
      )}
    </div>
  );
};

export default memo(DraggableField2);

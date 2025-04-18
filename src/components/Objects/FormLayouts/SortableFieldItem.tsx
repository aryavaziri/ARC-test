'use client';

import { useDrag, useDrop } from 'react-dnd';
import { FC, useRef } from 'react';
import { TFormItem } from '@/types/layouts';
import { TField } from '@/types/dynamicModel';
import { RxDragHandleDots2 } from 'react-icons/rx';
import { FaProjectDiagram, FaRegEdit, FaRegTrashAlt } from 'react-icons/fa';

type Props = {
  index: number;
  item: TFormItem;
  field?: TField;
  moveItem: (dragIndex: number, hoverIndex: number) => void;
  onRemove: () => void;
  onOptionsClick?: () => void;
  onFlowClick?: () => void;

};

const SortableFieldItem: FC<Props> = ({
  index,
  item,
  field,
  moveItem,
  onRemove,
  onOptionsClick,
  onFlowClick,
}) => {
  const ref = useRef<HTMLLIElement>(null);

  const [, drop] = useDrop({
    accept: 'FIELD_ITEM',
    hover(dragged: { index: number }) {
      if (dragged.index === index) return;
      moveItem(dragged.index, index);
      dragged.index = index;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'FIELD_ITEM',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <li
      ref={ref}
      className={`flex items-center justify-between border border-border rounded px-4 py-2 bg-light/50 hover:bg-light shadow-sm ${isDragging ? 'opacity-50' : ''
        }`}
    >
      <div className="flex items-center gap-2 text-sm">
        <RxDragHandleDots2 className="text-gray-400" />
        <span>{field?.label || 'Unknown Field'}</span>
        <code className="text-xs text-gray-400">({item.type})</code>
      </div>
      <div className={`flex items-center gap-2`}>
        {item.type === 'lookup' && (
          <button
            onClick={onOptionsClick}
            className="ml-2 text-sm btn-icon text-secondary"
            title="Configure Lookup"
          >
            <FaRegEdit />
          </button>
        )}
        <button
          onClick={onFlowClick}
          className="ml-2 text-sm btn-icon text-info"
          title="Select Flow"
        >
          <FaProjectDiagram />
        </button>
        <button onClick={onRemove} className="text-danger btn-icon" title="Remove">
          <FaRegTrashAlt />
        </button>
      </div>
    </li>
  );
};

export default SortableFieldItem;

'use client';

import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { RxDragHandleDots2 } from 'react-icons/rx';
import { FaRegTrashAlt, FaRegEdit } from 'react-icons/fa';
import { TRecordItem } from '@/types/layouts';
import { TField } from '@/types/dynamicModel';

type Props = {
  index: number;
  item: TRecordItem;
  field?: TField;
  moveItem: (dragIndex: number, hoverIndex: number) => void;
  onRemove: () => void;
  onOptionsClick?: () => void;
};

const SortableFieldItem: React.FC<Props> = ({
  index,
  item,
  field,
  moveItem,
  onRemove,
  onOptionsClick,
}) => {
  const ref = useRef<HTMLLIElement>(null);
  const dragType = 'recordField';

  const [, drop] = useDrop({
    accept: dragType,
    hover(draggedItem: { index: number }) {
      if (draggedItem.index === index) return;
      moveItem(draggedItem.index, index);
      draggedItem.index = index;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: dragType,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <li
      ref={ref}
      className={`flex items-center justify-between border border-border rounded px-4 py-2 bg-light/40 hover:bg-light shadow-sm ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-center gap-2 text-sm">
        <RxDragHandleDots2 className="text-gray-400" />
        <span>{field?.label || 'Unknown Field'}</span>
        {item.type === 'lookup' && (
          <button onClick={onOptionsClick} className="ml-2 text-sm btn-icon text-secondary">
            <FaRegEdit />
          </button>
        )}
      </div>
      <button onClick={onRemove} className="text-danger btn-icon">
        <FaRegTrashAlt />
      </button>
    </li>
  );
};

export default SortableFieldItem;

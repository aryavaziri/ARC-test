'use client';

import { useDrag, useDrop } from 'react-dnd';
import { FC, useRef } from 'react';
import { TFormItem } from '@/types/layouts';
import { TField } from '@/types/dynamicModel';
import { RxDragHandleDots2 } from 'react-icons/rx';
import { FaMicroblog, FaProjectDiagram, FaRegEdit, FaRegTrashAlt } from 'react-icons/fa';

type Props = {
  index: number;
  colIdx: number;
  item: TFormItem;
  field: TField;
  onRemove: () => void;
  onOptionsClick?: () => void;
  onFlowClick?: () => void;
};

const SortableFieldItem: FC<Props> = ({
  index,
  item,
  colIdx,
  field,
  onRemove,
  onOptionsClick,
  onFlowClick,
}) => {
  const ref = useRef<HTMLLIElement>(null);

  const [{ isDragging }, drag, preview] = useDrag({
    type: 'FIELD_ITEM',
    item: { type: 'FIELD_ITEM', fieldId: item.fieldId, colIdx },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  drag(ref);

  return (
    <li
      ref={ref}
      className={`flex items-center justify-between border border-border rounded px-4 py-2 bg-light/50 hover:bg-primary-50 shadow-sm ${isDragging ? 'opacity-50' : ''}`}>
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
          onClick={() => console.log({
            index,
            colIdx,
            item,
            field,
          })}
          className="ml-2 text-sm btn-icon text-info"
        >
          <FaMicroblog />
        </button>
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

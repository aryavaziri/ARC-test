// DroppableColumn.tsx
'use client';

import { useDrop } from 'react-dnd';
import { FC, Fragment, useMemo, useRef } from 'react';
import { TFormItem } from '@/types/layouts';
import { TField } from '@/types/dynamicModel';
import SortableFieldItem from './SortableFieldItem';
import { useDynamicModel } from '@/store/hooks/dynamicModelsHooks';

type Props = {
  colIdx: number;
  items: TFormItem[];
  append: (item: TFormItem) => void;
  remove: (index: number) => void;
  moveItem: (fieldId: string, hoverIndex: number, targetCol: number) => void;
  isAdded: (fieldId: string) => boolean;
  onOptionsClick: (lookupModelId: string) => void;
  onFlowClick: (fieldId: string) => void;
};

const DroppableColumn = ({
  colIdx,
  items,
  append,
  remove,
  moveItem,
  isAdded,
  onOptionsClick,
  onFlowClick,
}: Props) => {
  const columnRef = useRef<HTMLDivElement>(null);

  const { allFields } = useDynamicModel()

  const fieldMap = useMemo(() => {
    const map = new Map<string, TField>();
    allFields.forEach(field => map.set(field.id, field));
    return map;
  }, [allFields]);


  const [{ isOver }, drop] = useDrop<
    { type: 'AVAILABLE_FIELD'; field: TField } | { type: 'FIELD_ITEM'; fieldId: string; colIdx: number },
    void,
    { isOver: boolean }
  >({
    accept: ['AVAILABLE_FIELD', 'FIELD_ITEM'],
    drop(item, monitor) {
      if (item.type === 'FIELD_ITEM') {
        const columnItemCount = items.length; // since items is already scoped to this column
        moveItem(item.fieldId, columnItemCount, colIdx);
      } else if (item.type === 'AVAILABLE_FIELD') {
        if (isAdded(item.field.id)) return;
        append({
          fieldId: item.field.id,
          type: item.field.type,
          order: items.length,
          col: colIdx,
          lookupDetails: item.field.type === 'lookup'
            ? {
              lookupModelId: item.field.lookupModelId!,
              isCustomStyle: false,
              fields: [],
            }
            : undefined,
        });
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
  });


  drop(columnRef);

  return (
    <div
      ref={columnRef}
      className={`flex-1 con gap-0 px-4 py-8 border-2 border-dashed ${isOver ? `bg-amber-500/40` : ``}`}
    >
      {items.length === 0 ? (
        <p className="text-sm italic text-gray-500">No fields added yet.</p>
      ) : (
        items.map((item, index) => {
          const matchedField = fieldMap.get(item.fieldId);
          if (!matchedField) return null;
          return (
            <Fragment key={item.fieldId}>
              <DropZone index={index} colIdx={colIdx} moveItem={moveItem} />
              <SortableFieldItem
                key={item.fieldId}
                index={index}
                item={item}
                colIdx={colIdx}
                field={matchedField}
                onRemove={() => remove(index)}
                onOptionsClick={() => onOptionsClick(item.lookupDetails?.lookupModelId ?? '')}
                onFlowClick={() => onFlowClick(item.fieldId)}
              />
            </Fragment>
          )
        })
      )}
    </div>
  );
};

export default DroppableColumn;

type DropZoneProps = {
  index: number;
  colIdx: number;
  moveItem: (fieldId: string, hoverIndex: number, targetCol: number) => void;
};

const DropZone: FC<DropZoneProps> = ({ index, colIdx, moveItem }) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isOver }, drop] = useDrop<{ type: 'FIELD_ITEM'; fieldId: string; colIdx: number }, void, { isOver: boolean }>({
    accept: 'FIELD_ITEM',
    drop: (dragged) => {
      moveItem(dragged.fieldId, index, colIdx);
    },
    collect: monitor => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
  });


  drop(ref); // ✅ attach the drop target to the actual DOM ref

  return (
    <div className={`relative h-2 py-[1px] transition-all ${isOver ? 'bg-amber-300/50' : ''}`}>
      <div ref={ref} className={`h-8 absolute inset-y-0 left-0 right-0 -top-3`} />
    </div>
  );
};
import { useState, useMemo, useRef } from 'react';
import { useDynamicModel } from '@/store/hooks/dynamicModelsHooks';
import { flattenModelFields } from '@/store/slice/dynamicModelSlice';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

type Props = {
  lookupId: string;
  initialGrid?: string[][];
  onSave: (fields: string[][]) => void;
  onClose?: () => void;
};

type DragItem = {
  id: string;
  label: string;
  fromAvailable?: boolean;
};

function DraggableField({ id, label, onRemove }: { id: string; label: string; onRemove?: () => void }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'FIELD',
    item: { id, label },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [id]);
  const dragRef = useRef<HTMLDivElement>(null);
  drag(dragRef);


  return (
    <div
      ref={dragRef}
      className={`px-3 py-1 bg-primary-100 rounded-md shadow-sm border text-sm flex items-center gap-2 cursor-move ${isDragging ? 'opacity-50' : ''}`}
    >
      {label}
      {onRemove && <button onClick={onRemove} className="text-red-500">x</button>}
    </div>
  );
}

function DropRow({ rowIndex, row, allFields, onDrop, onRemove }: {
  rowIndex: number;
  row: string[];
  allFields: { id: string, label: string }[];
  onDrop: (rowIndex: number, fieldId: string) => void;
  onRemove: (rowIndex: number, fieldIndex: number) => void;
}) {
  const dropref = useRef<HTMLDivElement>(null);
  const [, drop] = useDrop(() => ({
    accept: 'FIELD',
    drop: (item: DragItem) => onDrop(rowIndex, item.id),
  }), [rowIndex]);
  drop(dropref);

  return (
    <div ref={dropref} className="flex gap-2 items-center border p-2 rounded bg-white">
      {row.map((fieldId, fieldIndex) => {
        const field = allFields.find(f => f.id === fieldId);
        return (
          <DraggableField
            key={fieldId}
            id={fieldId}
            label={field?.label || 'Unknown'}
            onRemove={() => onRemove(rowIndex, fieldIndex)}
          />
        );
      })}
    </div>
  );
}

export default function LookupCustom({ lookupId, initialGrid = [], onSave, onClose }: Props) {
  const { models } = useDynamicModel();
  const [grid, setGrid] = useState<string[][]>(initialGrid);

  const selectedModel = useMemo(() => models.find((m) => m.id === lookupId), [lookupId, models]);
  const allFields = useMemo(() => flattenModelFields(selectedModel || {} as any), [selectedModel]);

  const availableFields = useMemo(() => {
    const usedIds = grid.flat();
    return allFields.filter((f) => !usedIds.includes(f.id));
  }, [allFields, grid]);

  const addRow = () => setGrid((prev) => [...prev, []]);
  const handleDrop = (rowIndex: number, fieldId: string) => {
    setGrid((prev) => prev.map((row, idx) => idx === rowIndex ? [...row, fieldId] : row));
  };
  const handleRemoveField = (rowIndex: number, fieldIndex: number) => {
    setGrid((prev) => prev.map((row, idx) =>
      idx === rowIndex ? row.filter((_, i) => i !== fieldIndex) : row
    ));
  };

  const handleSave = () => {
    onSave(grid);
    if (onClose) onClose();
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-6 min-w-[500px] space-y-6">
        <h2 className="text-lg font-semibold">Customize Grid Columns</h2>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {availableFields.map((f) => (
              <DraggableField key={f.id} id={f.id} label={f.label} />
            ))}
          </div>

          {grid.map((row, rowIndex) => (
            <DropRow
              key={rowIndex}
              rowIndex={rowIndex}
              row={row}
              allFields={allFields}
              onDrop={handleDrop}
              onRemove={handleRemoveField}
            />
          ))}

          <button onClick={addRow} className='btn'>+ Add Row</button>
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className='btn btn-danger'>Cancel</button>
          <button onClick={handleSave} className='btn btn-primary'>Save</button>
        </div>
      </div>
    </DndProvider>
  );
}

import React, { useRef } from 'react';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

console.log("📦 CustomGridBuilder loaded");

type CustomGridBuilderProps = {
  fields: string[][];
  allOptions: { id: string; label: string }[];
  onChange: (fields: string[][]) => void;
};

function DraggableField({
  id, label, fromRowIndex, fromFieldIndex, onRemove
}: {
  id: string;
  label: string;
  fromRowIndex?: number;
  fromFieldIndex?: number;
  onRemove?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'FIELD',
    item: { id, fromRowIndex, fromFieldIndex },
    collect: monitor => ({ isDragging: monitor.isDragging() }),
  }), [id, fromRowIndex, fromFieldIndex]);

  drag(ref);
  return (
    <div
      ref={ref}
      className={`px-2 py-1 rounded bg-primary-100 border shadow-sm flex items-center gap-2 cursor-move ${isDragging ? 'opacity-50' : ''}`}>
      {label}
      {onRemove && (
        <button className="text-red-500" onClick={onRemove} type="button">×</button>
      )}
    </div>
  );
}

function DropRow({ row, rowIndex, allOptions, onDrop, onRemoveField }: {
  row: string[], rowIndex: number,
  allOptions: { id: string; label: string }[],
  onDrop: (rowIndex: number, fieldId: string) => void,
  onRemoveField: (rowIndex: number, fieldIndex: number) => void,
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [, drop] = useDrop(() => ({
    accept: 'FIELD',
    drop: (item: { id: string; fromRowIndex?: number; fromFieldIndex?: number }) => {
      const source = `${item.fromRowIndex}-${item.fromFieldIndex}`;
      const current = `${rowIndex}-${row.findIndex(f => f === item.id)}`;

      // Only remove if from a different location
      if (source !== current && item.fromRowIndex !== undefined && item.fromFieldIndex !== undefined) {
        onRemoveField(item.fromRowIndex, item.fromFieldIndex);
      }

      onDrop(rowIndex, item.id);
    },

  }), [rowIndex, row]);
  drop(ref);
  return (
    <div ref={ref} className="flex gap-2 items-center border p-2 rounded bg-white min-h-12">
      {row.map((fieldId, i) => {
        const field = allOptions.find(f => f.id === fieldId);
        return (
          <DraggableField
            key={`${rowIndex}-${i}-${fieldId}`}
            id={fieldId}
            label={field?.label || fieldId}
            fromRowIndex={rowIndex}
            fromFieldIndex={i}
            onRemove={() => onRemoveField(rowIndex, i)}
          />
        );
      })}
    </div>
  );
}

function DropRowBetween({ index, onDropNewRow }: { index: number, onDropNewRow: (index: number, fieldId: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [, drop] = useDrop(() => ({
    accept: 'FIELD',
    drop: (item: { id: string }) => {
      console.log("📥 Dropped on DropRowBetween", { index, fieldId: item.id });
      onDropNewRow(index, item.id);
    },
  }), [index]);
  drop(ref);
  return (
    <div ref={ref} className="border border-dashed border-gray-400 text-gray-400 text-sm p-2 text-center rounded hover:bg-gray-50">
      Drop here to insert row
    </div>
  );
}

const CustomGridBuilder: React.FC<CustomGridBuilderProps> = ({ fields, allOptions, onChange }) => {
  const [grid, setGrid] = React.useState(fields);

  React.useEffect(() => {
    setGrid(fields);
  }, [fields]);

  const availableFields = allOptions.filter(opt => !grid.flat().includes(opt.id));

  const handleDrop = (rowIdx: number, fieldId: string) => {
    console.log("➕ Adding field to row", rowIdx, fieldId);
    const updated = grid.map((row, idx) =>
      idx === rowIdx && !row.includes(fieldId) ? [...row, fieldId] : row
    );
    setGrid(updated);
    onChange(updated);
  };

  const handleRemove = (rowIdx: number, fieldIndex: number) => {
    console.log("❌ Removing field from row", rowIdx, fieldIndex);
    const updated = grid.map((row, idx) =>
      idx === rowIdx ? row.filter((_, i) => i !== fieldIndex) : row
    );
    setGrid(updated);
    onChange(updated);
  };

  const handleDropNewRow = (index: number, fieldId: string) => {
    console.log("🆕 Inserting new row at", index, "with field", fieldId);
    const updated = [...grid.slice(0, index), [fieldId], ...grid.slice(index)];
    setGrid(updated);
    onChange(updated);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-2">
        <div className="flex flex-wrap gap-2 mb-2">
          {availableFields.map(opt => (
            <DraggableField key={opt.id} id={opt.id} label={opt.label} />
          ))}
        </div>
        {grid.map((row, i) => (
          <React.Fragment key={i}>
            <DropRowBetween index={i} onDropNewRow={handleDropNewRow} />
            <DropRow
              row={row}
              rowIndex={i}
              allOptions={allOptions}
              onDrop={handleDrop}
              onRemoveField={handleRemove}
            />
          </React.Fragment>
        ))}
        <DropRowBetween index={grid.length} onDropNewRow={handleDropNewRow} />
      </div>
    </DndProvider>
  );
};

export default CustomGridBuilder;

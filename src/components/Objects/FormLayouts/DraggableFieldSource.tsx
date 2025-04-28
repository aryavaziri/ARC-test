// ✅ Updated DraggableFieldSource.tsx
import { useDrag } from 'react-dnd';
import { TField } from '@/types/dynamicModel';
import { useRef, useEffect } from 'react';

const DraggableFieldSource = ({ field }: { field: TField }) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: 'AVAILABLE_FIELD',
    item: { field },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // ✅ Combine drag with ref
  useEffect(() => {
    if (ref.current) {
      drag(ref);
    }
  }, [ref, drag]);

  return (
    <div
      ref={ref}
      className={`px-3 py-2 rounded text-sm font-medium transition bg-blue-100 hover:bg-blue-300 ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      {field.label}
    </div>
  );
};

export default DraggableFieldSource;

'use client';

import { useDrag, useDrop } from 'react-dnd';
import { memo, useEffect, useRef, useState } from 'react';
import { FaAngleRight, FaGripVertical, FaTrash } from 'react-icons/fa';
import { PiFilmScriptBold } from 'react-icons/pi';
import { TAttachment, TDroppedField } from '@/types/layouts';
import { MdAddLink } from 'react-icons/md';
import { GoReport } from "react-icons/go";
import { useDynamicModel } from '@/store/hooks/dynamicModelsHooks';
import { TField } from '@/types/dynamicModel';
import ButtonAttachmentDetails from './CustomItems/ButtonAttachmentDetails';
import AttachmentRenderer from './CustomItems/AttachmentRenderer';
import { CiEdit } from "react-icons/ci";

interface DraggableFieldProps {
  field: Extract<TDroppedField, { type: 'form' | 'record' }>;
  index?: number;
  region?: number;
  move?: (from: number, to: number) => void;
  onRemove?: () => void;
  onEditAttachment?: (attachment?: TAttachment, attachmentIndex?: number) => void;
}

const DraggableField = ({ field, index, region, move, onRemove, onEditAttachment, }: DraggableFieldProps) => {

  const ref = useRef<HTMLDivElement>(null);
  const [showDetils, setShowDetails] = useState<boolean>(false);
  const [extractedFields, setExtractedFields] = useState<TField[]>([]);

  const { formLayouts, recordLayouts, allFields } = useDynamicModel()
  const handleTest = () => {
    console.log('Extracted fields:', extractedFields);
  };

  useEffect(() => {
    const layout =
      field.type === 'form'
        ? formLayouts.find((f) => f.id === field.formLayoutId)
        : recordLayouts.find((r) => r.id === field.recordLayoutId);

    const fields = layout?.contentSchema
      ?.map((f) => allFields.find((af) => af.id === f.fieldId))
      .filter((f): f is NonNullable<typeof f> => Boolean(f));
    console.log('Extracted fields:', fields);

    setExtractedFields(fields || []);

  }, [formLayouts, recordLayouts, allFields])

  const [{ isOver }, drop] = useDrop({
    accept: ['FIELD', 'SORTED_FIELD'],
    hover(item: any) {
      if (!ref.current || index === undefined) return;
      if (item.type !== 'SORTED_FIELD' || item.region !== region) return;

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      move?.(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
    drop: (item: any, monitor) => {
      if (
        item.type === 'custom' &&
        ['script', 'flow', 'input', 'button', 'component', 'external', 'note', 'divider', 'spacer'].includes(item.customKey)
      ) {
        const newAttachment: TAttachment = {
          type: item.customKey as TAttachment['type'],
          payload: null,
        };
        onEditAttachment?.(newAttachment); // Create new attachment
        return { handled: true };
      }
    },
    collect: (monitor) => ({ isOver: monitor.isOver({ shallow: true }) }
    )


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
      className={`flex flex-col border px-3 py-2 rounded shadow-sm gap-2 ${isDragging ? 'opacity-50' : ''
        } ${isOver ? 'bg-primary/20 border-primary' : ''}`}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <FaGripVertical className="text-muted cursor-move" />
          <div className={`rounded-full p-1 bg-gray-100 hover:bg-gray-300 duration-200 ${showDetils ? `rotate-90` : ``}`} onClick={() => { setShowDetails(!showDetils) }}><FaAngleRight /></div>
          <div>
            <div className="text-sm font-medium">{field.label}</div>
            <div className="text-xs text-muted">
              {field.type === 'form' ? 'Form Layout' : 'Record Layout'}
            </div>
          </div>
        </div>
        {onRemove && (
          <div className="flex gap-2 items-center">
            <div className="btn-icon text-amber-500" onClick={handleTest} ><GoReport /></div>
            <button
              onClick={() => onEditAttachment?.()}
              className="btn-icon text-blue-500"
              title="Add Attachment"
            >
              <MdAddLink />
            </button>
            <button onClick={onRemove} className="btn-icon text-red-300 hover:bg-rose-200 hover:text-rose-600" title="Remove Field">
              <FaTrash />
            </button>
          </div>
        )}
      </div>
      {showDetils && extractedFields?.length && (
        <div className="mt-2 px-2 py-1 border-t pt-2 text-xs text-muted space-y-1">
          <div className="text-xs font-semibold text-muted">Fields:</div>
          {extractedFields.map((field, idx) => (
            <div
              key={field?.id ?? idx}
              className="flex justify-between items-center text-muted-foreground bg-gray-50 border px-2 py-1 rounded"
            >
              <span>{field?.label}</span>
              <span className="italic text-[11px]">{field?.type}</span>
            </div>
          ))}
        </div>
      )}

      {field.attachments?.length && (
        <div className="space-y-2 mt-2 border-t pt-2 text-xs">
          <div className="text-xs font-semibold text-muted px-2">Attachments:</div>
          {field.attachments.map((att, i) => (
            <div
              key={i}
              className="flex flex-col gap-1 px-2 py-1 rounded bg-gray-50 border"
            >
              {/* Header: Type + Edit button */}
              <div className="flex items-center justify-between">
                <div className="flex gap-1 items-center h-full">
                  {att.payload.text && <span className={`${att.payload.action == 'submit' ? `bg-primary text-bg` : att.payload.action == 'custom' ? `bg-secondary text-text` : ``} font-medium uppercase border border-border p-1 px-2 rounded`}>{att.payload.text}</span>}
                  {/* {att.type && <span className="text-blue-600 font-medium uppercase p-1 rounded">{att.type}</span>} */}
                  {att.payload.action && <span className="text-blue-600 font-medium uppercase p-1 rounded">{att.payload.action}</span>}

                </div>
                <button
                  onClick={() => onEditAttachment?.(att, i)}
                  className="text-blue-500 underline btn-icon"
                >
                  <CiEdit />
                </button>
              </div>

              {/* Render attachment-specific UI below */}
              {/* <div className="ml-1">
                {(() => {
                  switch (att.type) {
                    case 'button':
                      return <ButtonAttachmentDetails payload={att.payload} />;
                    case 'note':
                      return (
                        <div className="text-muted italic">
                          {att.payload || 'No note content'}
                        </div>
                      );
                    case 'divider':
                      return <hr className="border border-dashed" />;
                    case 'spacer':
                      return (
                        <div
                          className="bg-gray-200 w-full rounded"
                          style={{ height: `${att.payload ?? 16}px` }}
                        />
                      );
                    case 'script':
                      return (
                        <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                          {att.payload || '// empty script'}
                        </pre>
                      );
                    case 'flow':
                      return (
                        <div className="italic text-muted">
                          Flow ID: <span className="text-black">{att.payload || 'None'}</span>
                        </div>
                      );
                    case 'component':
                      return <div className="italic text-muted">Custom component placeholder</div>;
                    case 'input':
                      return <div className="italic text-muted">Input placeholder</div>;
                    case 'external':
                      return <div className="italic text-muted">External resource attached</div>;
                    default:
                      return null;
                  }
                })()}
              </div> */}
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default memo(DraggableField);

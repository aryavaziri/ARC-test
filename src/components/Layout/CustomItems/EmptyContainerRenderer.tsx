'use client';

import { useDrop } from 'react-dnd';
import { memo, useRef } from 'react';
import { TAttachment } from '@/types/layouts';
import { FaGripVertical, FaTrash } from 'react-icons/fa';
import { CiEdit } from 'react-icons/ci';

interface EmptyContainerRendererProps {
  id: string;
  label: string;
  attachments: TAttachment[];
  setAttachments: (attachments: TAttachment[]) => void;
  onEditAttachment: (attachment: TAttachment, parentId: string, index?: number) => void;
  onRemoveAttachment: (parentId: string, attachmentIndex: number) => void;
  onRemoveContainer: () => void;
  onEditContainer: (attachment: TAttachment, containerId: string) => void;
}

const EmptyContainerRenderer = ({
  id,
  label,
  attachments,
  setAttachments,
  onEditAttachment,
  onRemoveAttachment,
  onRemoveContainer,
  onEditContainer
}: EmptyContainerRendererProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isOver, draggingItem }, drop] = useDrop({
    accept: ['FIELD', 'SORTED_FIELD'],
    canDrop: (item: any) => {
      return item.type === 'custom' && ['button', 'input', 'field'].includes(item.customKey);
    },
    drop: (item: any, monitor) => {
      if (item.type === 'custom' && ['button', 'input', 'field'].includes(item.customKey)) {
        const newAttachment: TAttachment = {
          type: item.customKey as TAttachment['type'],
          payload: { text: item.label },
        };
        const updatedAttachments = [...attachments, newAttachment];
        setAttachments(updatedAttachments);

        // ✅ Pass universal parentId to DroppableRegion
        onEditAttachment(newAttachment, id, updatedAttachments.length - 1);
      }
      return { handled: true };
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      draggingItem: monitor.getItem(),
    }),
  });

  drop(ref);

  return (
    <div
      ref={ref}
      className={`border-2 border-dashed p-4 rounded min-h-[100px] transition
        ${isOver && draggingItem && ['button', 'input', 'field'].includes(draggingItem.customKey) ? 'bg-green-100 border-green-400' : ''}
        ${isOver && draggingItem && !['button', 'input', 'field'].includes(draggingItem.customKey) ? 'bg-red-100 border-red-400' : ''}
      `}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <FaGripVertical className="text-muted cursor-move" />
          <div>
            <div className="text-sm font-medium">{label || 'Empty Container'}</div>
            <div className="text-xs text-muted">Empty Container</div>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => onEditContainer({ type: 'empty', payload: { text: label } }, id)} className="text-blue-500 underline btn-icon" title="Remove Container">
            <CiEdit />
          </button>
          <button onClick={onRemoveContainer} className="btn-icon text-red-300 hover:bg-rose-200 hover:text-rose-600" title="Remove Container">
            <FaTrash />
          </button>
        </div>
      </div>


      {attachments.length === 0 ? (
        <p className="text-sm text-gray-400 italic">Drop buttons/inputs here</p>
      ) : (
        <div className="space-y-2 mt-2 border-t pt-2 text-xs" >
          <div className="text-xs font-semibold text-muted px-2">Attachments:</div>
          {attachments.map((att, i) => (
            <div key={i} className="flex items-center justify-between border p-2 rounded my-1 shadow-sm text-xs">
              <div className="flex gap-1 items-center">
                {att.payload?.text && (
                  <span className={`font-medium uppercase border px-2 py-1 rounded
                ${att.payload.action === 'submit' ? 'bg-primary text-white' :
                      att.payload.action === 'custom' ? 'bg-secondary text-white' :
                        'bg-gray-200'}`}>
                    {att.payload.text}
                  </span>
                )}
                {att.payload?.action && (
                  <span className="text-blue-600 uppercase">{att.payload.action}</span>
                )}
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => onEditAttachment(att, id, i)}
                  className="btn-icon text-blue-500"
                  title="Edit Attachment"
                >
                  <CiEdit />
                </button>
                <button
                  onClick={() => onRemoveAttachment(id, i)}
                  className="btn-icon text-red-500"
                  title="Remove Attachment"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default memo(EmptyContainerRenderer);

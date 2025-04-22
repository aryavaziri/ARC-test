'use client';

import { useRef, useEffect, useState } from 'react';
import { useDrop } from 'react-dnd';
import DraggableField from './DraggableField';
import DraggableField2 from './CustomItems/DraggableField2';
import { TAttachment, TDroppedField } from '@/types/layouts';
import CustomModal from '../Modals/CustomModal2';
import AttachmentEditor from './CustomItems/AttachmentEditor';

export type NewDroppedField =
  | { type: 'form'; label: string; formLayoutId: string }
  | { type: 'record'; label: string; recordLayoutId: string }
  | { type: 'custom'; label: string; customKey: string };

interface Props {
  region: number;
  label: string;
  droppedFields: TDroppedField[];
  setDroppedFields: React.Dispatch<React.SetStateAction<TDroppedField[]>>;
  // onDrop: (region: number, item: Omit<TDroppedField, 'region' | 'index'>) => void;
  onDrop: (region: number, item: NewDroppedField) => void;
  onMove: (region: number, from: number, to: number) => void;
  onRemove: (region: number, index: number) => void;
  onMoveBetweenRegions: (from: number, to: number, index?: number) => void;
}

const DroppableRegion = ({
  region,
  label,
  droppedFields,
  onDrop,
  onMove,
  onRemove,
  setDroppedFields,
  onMoveBetweenRegions,
}: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingAttachmentIndex, setEditingAttachmentIndex] = useState<number | null>(null);
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [currentAttachment, setCurrentAttachment] = useState<TAttachment | undefined>();

  const [{ isOver }, drop] = useDrop({
    accept: ['FIELD', 'SORTED_FIELD'],
    drop: (item: any, monitor) => {
      const didDrop = monitor.didDrop();
      if (didDrop) return; // ✅ Exit early if already handled (e.g. by DraggableField)
      if (item.region !== undefined && item.region !== region) {
        onMoveBetweenRegions(item.region, region, item.index);
      } else if (item.region === undefined) {
        if (item.type === 'form') {
          onDrop(region, {
            label: item.label,
            type: 'form',
            formLayoutId: item.formLayoutId,
          });
        } else if (item.type === 'record') {
          onDrop(region, {
            label: item.label,
            type: 'record',
            recordLayoutId: item.recordLayoutId,
          });
        } else if (item.type === 'custom') {
          onDrop(region, {
            label: item.label,
            type: 'custom',
            customKey: item.customKey,
          });
        }

      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  useEffect(() => {
    if (containerRef.current) {
      drop(containerRef.current);
    }
  }, [drop]);

  return (
    <div
      ref={containerRef}
      className={`min-h-[140px] p-4 border border-dashed bg-white rounded h-full transition-all ${isOver ? 'bg-primary/10' : ''
        }`}
    >
      <h3 className="text-sm font-semibold mb-2">{label}</h3>

      <div className="space-y-2">
        {droppedFields.map((field, index) => {
          const sharedProps = {
            index,
            region,
            move: (from: number, to: number) => onMove(region, from, to),
            onRemove: () => onRemove(region, index),
          };

          if (field.type === 'custom') {
            return (
              <DraggableField2
                key={`custom-${field.customKey}-${index}`}
                field={{
                  label: field.label,
                  type: 'custom',
                  customKey: field.customKey,
                }}
                {...sharedProps}
              />
            );
          }

          if (field.type === 'form' || field.type === 'record') {
            return (
              <DraggableField
                key={`${field.type}-${field.type === 'form' ? field.formLayoutId : field.recordLayoutId}`}
                field={field}
                index={index}
                region={region}
                move={(from, to) => onMove(region, from, to)}
                onRemove={() => onRemove(region, index)}
                onEditAttachment={(attachment, attachmentIndex) => {
                  setEditingIndex(index);
                  setEditingAttachmentIndex(attachmentIndex ?? null);
                  if (attachment) {
                    setCurrentAttachment(attachment); // ✅ this line is missing
                  } else {
                    setCurrentAttachment(undefined);
                  }
                  setShowAttachmentModal(true);
                }}
              />
            );
          }

          return null;
        })}
      </div>

      {showAttachmentModal && editingIndex !== null && (
        <CustomModal
          isOpen={showAttachmentModal}
          onClose={() => {
            setShowAttachmentModal(false);
            setEditingAttachmentIndex(null);
          }}
          header="Add or Edit Attachment"
          Component={() => (
            <AttachmentEditor
              onClose={() => {
                setShowAttachmentModal(false);
                setEditingAttachmentIndex(null);
              }}
              index={editingAttachmentIndex ?? undefined}
              initialAttachment={currentAttachment}
              onSave={(attachment, index) => {
                setDroppedFields((prev) =>
                  prev.map((f, i) => {
                    if (i !== editingIndex) return f;

                    const currentAttachments = f.attachments || [];

                    let newAttachments =
                      index !== undefined
                        ? [
                          ...currentAttachments.slice(0, index),
                          attachment,
                          ...currentAttachments.slice(index + 1),
                        ]
                        : [...currentAttachments, attachment];

                    return {
                      ...f,
                      attachments: newAttachments,
                    };
                  })
                );

                setShowAttachmentModal(false);
                setEditingAttachmentIndex(null);
              }}
            />
          )
          }
        />
      )}


      {droppedFields.length === 0 && (
        <p className="text-xs text-muted italic">Drop form/table/custom items here</p>
      )}
    </div>
  );
};

export default DroppableRegion;

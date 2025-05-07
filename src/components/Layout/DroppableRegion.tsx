'use client';

import { useRef, useEffect, useState } from 'react';
import { useDrop } from 'react-dnd';
import DraggableField from './DraggableField';
import DraggableField2 from './CustomItems/DraggableField2';
import EmptyContainerRenderer from './CustomItems/EmptyContainerRenderer';
import CustomModal from '../Modals/CustomModal2';
import AttachmentEditor from './CustomItems/AttachmentEditor';
import { TAttachment, TCustomDroppedField, TDroppedField } from '@/types/layouts';
import { nanoid } from 'nanoid';

export type NewDroppedField =
  | { type: 'form'; label: string; formLayoutId: string }
  | { type: 'record'; label: string; recordLayoutId: string }
  | (
    { type: 'custom'; label: string; customKey: 'empty'; id: string; region: number; index: number; attachments: TAttachment[] }
    | { type: 'custom'; label: string; customKey: string }
  );

interface Props {
  region: number;
  label: string;
  droppedFields: TDroppedField[];
  setDroppedFields: React.Dispatch<React.SetStateAction<TDroppedField[]>>;
  onDrop: (region: number, item: NewDroppedField) => void;
  onMove: (region: number, from: number, to: number) => void;
  onRemove: (region: number, index: number) => void;
  onMoveBetweenRegions: (from: number, to: number, index?: number) => void;
}

const DroppableRegion = ({
  region,
  label,
  droppedFields,
  setDroppedFields,
  onDrop,
  onMove,
  onRemove,
  onMoveBetweenRegions,
}: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [editingParentId, setEditingParentId] = useState<string | null>(null);
  const [editingAttachmentIndex, setEditingAttachmentIndex] = useState<number | null>(null);
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [currentAttachment, setCurrentAttachment] = useState<TAttachment | undefined>();

  const [{ isOver }, drop] = useDrop({
    accept: ['FIELD', 'SORTED_FIELD'],
    drop: (item: any, monitor) => {
      if (monitor.didDrop()) return;

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
          if (item.customKey === 'empty') {
            const newId = nanoid();
            const newEmptyContainer = {
              id: newId,
              label: 'Empty Container',
              type: 'custom' as const,
              customKey: 'empty',
              region,
              index: droppedFields.filter(f => f.region === region).length, // correct index
              attachments: [],
            };

            setDroppedFields(prev => [...prev, newEmptyContainer]);
            setEditingParentId(newId);
            setEditingAttachmentIndex(null);
            setCurrentAttachment({
              type: 'empty',
              payload: { text: 'Container' },
            });
            setShowAttachmentModal(true);
          } else {
            onDrop(region, {
              label: item.label,
              type: 'custom',
              customKey: item.customKey,
              region,
              index: 0,
            });
          }
        }
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }) && monitor.canDrop(),
    }),
  });

  useEffect(() => {
    if (containerRef.current) {
      drop(containerRef.current);
    }
  }, [drop]);

  const handleEditAttachment = (attachment: TAttachment, parentId: string, index?: number) => {
    setEditingParentId(parentId);
    setEditingAttachmentIndex(index ?? null);
    setCurrentAttachment(attachment);
    setShowAttachmentModal(true);
  };

  const handleRemoveAttachment = (parentId: string, attachmentIndex: number) => {
    setDroppedFields(prev =>
      prev.map(f => {
        const fId = f.type === 'form' ? f.formLayoutId : f.type === 'record' ? f.recordLayoutId : f.id;
        if (fId !== parentId) return f;
        const updatedAttachments = [...(f.attachments || [])];
        updatedAttachments.splice(attachmentIndex, 1);
        return { ...f, attachments: updatedAttachments };
      })
    );
  };

  return (
    <div ref={containerRef} className={`min-h-[140px] p-4 border border-dashed rounded h-full transition-all ${isOver ? 'bg-primary-200/50' : ''}`}>
      <h3 className="text-sm font-semibold mb-2">{label}</h3>

      <div className="space-y-2">
        {droppedFields.map((field, index) => {
          const sharedProps = { index, region, move: (from: number, to: number) => onMove(region, from, to), onRemove: () => onRemove(region, index) };

          if (field.type === 'custom') {
            return field.customKey === 'empty' ? (
              <EmptyContainerRenderer
                onRemoveContainer={() => onRemove(region, index)}
                key={`custom-empty-${field.id ?? index}`}
                id={field.id!}
                label={field.label}
                attachments={field.attachments || []}
                setAttachments={(newAttachments) => {
                  setDroppedFields(prev =>
                    prev.map(f => (f as TCustomDroppedField).id! === field.id ? { ...f, attachments: newAttachments } : f)
                  );
                }}
                onEditAttachment={handleEditAttachment}
                onRemoveAttachment={handleRemoveAttachment}
                onEditContainer={(attachment, containerId) => {
                  setEditingParentId(containerId);
                  setEditingAttachmentIndex(null); // Not editing inside attachments array
                  setCurrentAttachment(attachment); // The empty container attachment
                  setShowAttachmentModal(true);
                }}

              />
            ) : (
              <DraggableField2
                key={`custom-${field.customKey}-${index}`}
                field={{ label: field.label, type: 'custom', customKey: field.customKey }}
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
                move={sharedProps.move}
                onRemove={sharedProps.onRemove}
                onEditAttachment={(attachment, parentId) => {
                  setEditingParentId(parentId ?? null);
                  setEditingAttachmentIndex(null);
                  setCurrentAttachment(attachment ?? undefined);
                  setShowAttachmentModal(true);
                }}
                onRemoveAttachment={(attachmentIndex) => {
                  setDroppedFields(prev =>
                    prev.map(f => {
                      const fId = f.type === 'form' ? f.formLayoutId : f.type === 'record' ? f.recordLayoutId : undefined;
                      if (fId !== (field.type === 'form' ? field.formLayoutId : field.recordLayoutId)) return f;
                      const updatedAttachments = [...(f.attachments || [])];
                      updatedAttachments.splice(attachmentIndex, 1);
                      return { ...f, attachments: updatedAttachments };
                    })
                  );
                }}
              />
            );
          }

          return null;
        })}
      </div>

      {/* Modal */}
      {showAttachmentModal && editingParentId && (
        <CustomModal
          Component={AttachmentEditor}
          isOpen={showAttachmentModal}
          onClose={() => {
            setShowAttachmentModal(false);
            setEditingAttachmentIndex(null);
            setEditingParentId(null);
          }}
          header="Add or Edit Attachment"
          componentProps={{
            onClose: () => {
              setShowAttachmentModal(false);
              setEditingAttachmentIndex(null);
              setEditingParentId(null);
            },
            index: editingAttachmentIndex ?? undefined,
            parentId: editingParentId ?? undefined,
            initialAttachment: currentAttachment,
            onSave: (attachment, index) => {
              setDroppedFields(prev =>
                prev.map(f => {
                  const fId = f.type === 'form' ? f.formLayoutId : f.type === 'record' ? f.recordLayoutId : f.id;
                  if (fId !== editingParentId) return f;

                  if (attachment.type === 'empty' && f.type === 'custom' && f.customKey === 'empty') {
                    return { ...f, label: attachment.payload?.text || f.label, id: fId };
                  }

                  const currentAttachments = f.attachments || [];
                  const newAttachments = index !== undefined
                    ? [...currentAttachments.slice(0, index), attachment, ...currentAttachments.slice(index + 1)]
                    : [...currentAttachments, attachment];

                  return { ...f, attachments: newAttachments };
                })
              );

              setShowAttachmentModal(false);
              setEditingAttachmentIndex(null);
              setEditingParentId(null);
            }
          }}
        />
      )}

      {droppedFields.length === 0 && (
        <p className="text-xs text-muted italic">Drop form/table/custom items here</p>
      )}
    </div>
  );
};

export default DroppableRegion;

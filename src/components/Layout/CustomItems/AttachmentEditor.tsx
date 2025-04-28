'use client';

import { useState, useEffect } from 'react';
import { TAttachment, TAttachmentType } from '@/types/layouts';
import Select from 'react-select';
import { useFlow } from '@/store/hooks/flowsHooks';
// import { nanoid } from 'nanoid';

interface Props {
  onClose: () => void;
  onSave: (attachment: TAttachment, index?: number) => void;
  initialAttachment?: TAttachment;
  index?: number;
  parentId?: string;
}

const attachmentTypeOptions = [
  { label: 'Button', value: 'button' },
  { label: 'Input', value: 'input' },
  { label: 'Field', value: 'field' },
  { label: 'Empty Container', value: 'empty' },
];

const AttachmentEditor = ({ onClose, onSave, initialAttachment, index, parentId }: Props) => {
  const [attachmentType, setAttachmentType] = useState<TAttachmentType>('button');
  const [payload, setPayload] = useState<any>(null);

  const { flows } = useFlow();
  const flowOptions = flows.map(flow => ({ label: flow.name, value: flow.id }));

  useEffect(() => {
    if (!initialAttachment) return;
    setAttachmentType(initialAttachment.type);
    setPayload(initialAttachment.payload ?? {});
  }, [initialAttachment]);

  const saveLabel = `${index !== undefined ? 'Update' : 'Add'} ${attachmentType[0].toUpperCase() + attachmentType.slice(1)}`;

  return (
    <div className="space-y-4 p-4 min-w-[400px]">
      <label className="block text-sm font-medium">Attachment Type</label>
      <Select
        options={attachmentTypeOptions}
        value={attachmentTypeOptions.find(opt => opt.value === attachmentType)}
        onChange={(selected) => {
          if (selected) {
            setAttachmentType(selected.value as TAttachmentType);
            setPayload({}); // Reset payload
          }
        }}
        classNamePrefix="react-select"
        menuPosition="fixed"
        menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
        styles={{
          menuPortal: base => ({ ...base, zIndex: 9999 }),
        }}
      />

      {/* Empty Container */}
      {attachmentType === 'empty' && (
        <>
          <label className="block text-sm font-medium">Container Name</label>
          <input
            type="text"
            className="w-full border rounded px-2 py-1"
            value={payload?.text ?? ''}
            onChange={(e) => setPayload({ ...payload, text: e.target.value })}
          />
        </>
      )}

      {/* Field */}
      {attachmentType === 'field' && (
        <>
          <label className="block text-sm font-medium">Field Name</label>
          <input
            type="text"
            className="w-full border rounded px-2 py-1"
            value={payload?.text ?? ''}
            onChange={(e) => setPayload({ ...payload, text: e.target.value })}
          />
          <label className="block text-sm font-medium mt-2">Attach Flow</label>
          <Select
            options={flowOptions}
            isClearable
            value={payload?.flowId ? flowOptions.find(f => f.value === payload.flowId) : null}
            onChange={(selected) =>
              setPayload((prev: any) => ({
                ...prev,
                flowId: selected?.value || '',
              }))
            }
            classNamePrefix="react-select"
            menuPosition="fixed"
            menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
            styles={{
              menuPortal: base => ({ ...base, zIndex: 9999 }),
            }}
          />

        </>
      )}

      {/* Input */}
      {attachmentType === 'input' && (
        <>
          <label className="block text-sm font-medium">Input Name</label>
          <input
            type="text"
            className="w-full border rounded px-2 py-1"
            value={payload?.text ?? ''}
            onChange={(e) => setPayload({ ...payload, text: e.target.value })}
          />
          <label className="block text-sm font-medium mt-2">Input Type</label>
          <Select
            options={[
              { label: 'Text', value: 'text' },
              { label: 'Number', value: 'number' },
              { label: 'Long Text', value: 'longText' },
              { label: 'Date', value: 'date' },
              { label: 'Checkbox', value: 'checkbox' },
            ]}
            value={payload?.inputType ? { label: payload.inputType, value: payload.inputType } : null}
            onChange={(selected) => setPayload((prev: any) => ({
              ...prev,
              inputType: selected?.value || '',
            }))}
            classNamePrefix="react-select"
            menuPosition="fixed"
            menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
            styles={{
              menuPortal: base => ({ ...base, zIndex: 9999 }),
            }}
          />
          <label className="block text-sm font-medium mt-2">Attach Flow</label>
          <Select
            options={flowOptions}
            isClearable
            value={payload?.flowId ? flowOptions.find(f => f.value === payload.flowId) : null}
            onChange={(selected) =>
              setPayload((prev: any) => ({
                ...prev,
                flowId: selected?.value || '',
              }))
            }
            classNamePrefix="react-select"
            menuPosition="fixed"
            menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
            styles={{
              menuPortal: base => ({ ...base, zIndex: 9999 }),
            }}
          />
        </>
      )}

      {/* Button */}
      {attachmentType === 'button' && (
        <>
          <label className="block text-sm font-medium">Button Text</label>
          <input
            type="text"
            className="w-full border rounded px-2 py-1"
            value={payload?.text ?? ''}
            onChange={(e) => setPayload({ ...payload, text: e.target.value })}
          />

          <label className="block text-sm font-medium mt-2">Action</label>
          <Select
            options={[
              { label: 'Submit', value: 'submit' },
              { label: 'Custom', value: 'custom' },
              { label: 'Reset', value: 'reset' },
            ]}
            value={payload?.action ? { label: String(payload.action).toUpperCase(), value: String(payload.action) } : null}
            onChange={(selected) =>
              setPayload((prev: any) => ({
                ...prev,
                action: selected?.value,
                beforeSubmitScript: '',
                afterSubmitScript: '',
              }))
            }
            classNamePrefix="react-select"
            menuPosition="fixed"
            menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
            styles={{
              menuPortal: base => ({ ...base, zIndex: 9999 }),
            }}
          />

          {payload?.action === 'submit' && (
            <>
              <label className="block text-sm font-medium mt-2">Before Submit Flow</label>
              <Select
                options={flowOptions}
                isClearable
                value={payload?.beforeSubmitScript ? flowOptions.find(f => f.value === payload.beforeSubmitScript) : null}
                onChange={(selected) =>
                  setPayload((prev: any) => ({
                    ...prev,
                    beforeSubmitScript: selected?.value || '',
                  }))
                }
                classNamePrefix="react-select"
                menuPosition="fixed"
                menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
                styles={{
                  menuPortal: base => ({ ...base, zIndex: 9999 }),
                }}
              />

              <label className="block text-sm font-medium mt-2">After Submit Flow</label>
              <Select
                options={flowOptions}
                isClearable
                value={payload?.afterSubmitScript ? flowOptions.find(f => f.value === payload.afterSubmitScript) : null}
                onChange={(selected) =>
                  setPayload((prev: any) => ({
                    ...prev,
                    afterSubmitScript: selected?.value || '',
                  }))
                }
                classNamePrefix="react-select"
                menuPosition="fixed"
                menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
                styles={{
                  menuPortal: base => ({ ...base, zIndex: 9999 }),
                }}
              />
            </>
          )}

          {payload?.action === 'custom' && (
            <>
              <label className="block text-sm font-medium mt-2">Custom Flow</label>
              <Select
                options={flowOptions}
                isClearable
                value={payload?.customFlow ? flowOptions.find(f => f.value === payload.customFlow) : null}
                onChange={(selected) =>
                  setPayload((prev: any) => ({
                    ...prev,
                    customFlow: selected?.value || '',
                  }))
                }
                classNamePrefix="react-select"
                menuPosition="fixed"
                menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
                styles={{
                  menuPortal: base => ({ ...base, zIndex: 9999 }),
                }}
              />
            </>
          )}
        </>
      )}

      {/* Buttons */}
      <div className="flex justify-end gap-2 pt-4">
        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button
          className="btn btn-primary"
          onClick={() => {
            const attachment: TAttachment = {
              type: attachmentType,
              payload: {
                id: parentId,
                ...payload,
              },
            };
            // console.log(attachment)
            onSave(attachment, index);
            onClose();
          }}
        >
          {saveLabel}
        </button>
      </div>
    </div>
  );
};

export default AttachmentEditor;

'use client';

import { useState, useEffect } from 'react';
import { TAttachmentType, TAttachment } from '@/types/layouts';
import Select from 'react-select';
import { useFlow } from '@/store/hooks/flowsHooks';

interface Props {
  onClose: () => void;
  onSave: (attachment: TAttachment, index?: number) => void;
  initialAttachment?: TAttachment;
  index?: number; // If editing existing attachment
}

const AttachmentEditor = ({ onClose, onSave, initialAttachment, index }: Props) => {
  const [scriptText, setScriptText] = useState('');
  const [attachmentType, setAttachmentType] = useState<TAttachmentType>('script');
  const [payload, setPayload] = useState<any>(null);

  const { flows } = useFlow()
  const flowOptions = flows.map(flow => ({
    label: flow.name,
    value: flow.id,
  }));


  useEffect(() => {
    if (!initialAttachment) return;

    setAttachmentType(initialAttachment.type);
    setPayload(initialAttachment.payload ?? null);

    if (initialAttachment.type === 'script') {
      setScriptText(initialAttachment.payload ?? '');
    }
  }, [initialAttachment]);

  const saveLabel = `${index !== undefined ? 'Update' : 'Add'} ${attachmentType[0].toUpperCase() + attachmentType.slice(1)}`;

  return (
    <div className="space-y-4 p-4 min-w-[400px]">
      <label className="block text-sm font-medium">Attachment Type</label>
      <select
        className="w-full border rounded px-2 py-1"
        value={attachmentType}
        onChange={(e) => {
          const selected = e.target.value as TAttachmentType;
          setAttachmentType(selected);
          setPayload(null);
          if (selected === 'script') setScriptText('');
        }}
      >
        {['script', 'note', 'divider', 'spacer', 'flow', 'input', 'button', 'component', 'external'].map((type) => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select>

      {attachmentType === 'script' && (
        <>
          <label className="block text-sm font-medium">Script Code</label>
          <textarea
            className="w-full border rounded px-2 py-1"
            rows={4}
            value={scriptText}
            onChange={(e) => {
              setScriptText(e.target.value);
              setPayload(e.target.value);
            }}
          />
        </>
      )}

      {attachmentType === 'note' && (
        <>
          <label className="block text-sm font-medium">Note Text</label>
          <textarea
            className="w-full border rounded px-2 py-1"
            rows={3}
            value={payload ?? ''}
            onChange={(e) => setPayload(e.target.value)}
          />
        </>
      )}

      {attachmentType === 'divider' && (
        <div className="text-muted italic text-sm">A divider will be rendered (no settings).</div>
      )}

      {attachmentType === 'spacer' && (
        <>
          <label className="block text-sm font-medium">Height (px)</label>
          <input
            type="number"
            className="w-full border rounded px-2 py-1"
            value={payload ?? 16}
            onChange={(e) => setPayload(Number(e.target.value))}
          />
        </>
      )}
      {attachmentType === 'button' && (
        <>
          <label className="block text-sm font-medium">Button Text</label>
          <input
            type="text"
            className="w-full border rounded px-2 py-1"
            value={payload?.text ?? ''}
            onChange={(e) =>
              setPayload({ ...payload, text: e.target.value })
            }
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
                beforeSubmitScript: '', // reset if switching
                afterSubmitScript: '',
              }))
            }
            className="z-[1000]"
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
                value={
                  payload?.beforeSubmitScript
                    ? flowOptions.find(f => f.value === payload.beforeSubmitScript)
                    : null
                }
                onChange={(selected) =>
                  setPayload({ ...payload, beforeSubmitScript: selected?.value || '' })
                }
                className="z-[1000]"
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
                value={
                  payload?.afterSubmitScript
                    ? flowOptions.find(f => f.value === payload.afterSubmitScript)
                    : null
                }
                onChange={(selected) =>
                  setPayload({ ...payload, afterSubmitScript: selected?.value || '' })
                }
                className="z-[1000]"
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
              <label className="block text-sm font-medium mt-2">Flow</label>
              <Select
                options={flowOptions}
                isClearable
                value={
                  payload?.customFlow
                    ? flowOptions.find(f => f.value === payload.customFlow)
                    : null
                }
                onChange={(selected) =>
                  setPayload({ ...payload, customFlow: selected?.value || '' })
                }
                className="z-[1000]"
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


      <div className="flex justify-end gap-2 pt-4">
        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button
          className="btn btn-primary"
          onClick={() => {
            const attachment: TAttachment = {
              type: attachmentType,
              payload,
            };
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

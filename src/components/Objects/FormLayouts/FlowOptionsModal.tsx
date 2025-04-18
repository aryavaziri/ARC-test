'use client'
import { useFlow } from '@/store/hooks/flowsHooks';
import React, { useEffect, useState } from 'react';
import Select from 'react-select';

type Props = {
  initialFlowId?: string;
  onSelect: (flowId: string) => void;
};

const FlowOptionsModal: React.FC<Props> = ({ initialFlowId, onSelect }) => {
  const { flows } = useFlow();
  const flowOptions = flows.map(flow => ({
    value: flow.id,
    label: flow.name,
  }));

  const [selected, setSelected] = useState<{ value: string; label: string } | null>(null);

  // Sync with initial value when modal opens
  useEffect(() => {
    const initial = flowOptions.find(opt => opt.value === initialFlowId) || null;
    setSelected(initial);
  }, [ ]);

  return (
    <div className="flex flex-col gap-4 p-6 min-w-[400px]">
      <label className="text-sm font-medium">Select Flow</label>
      <Select
        options={flowOptions}
        value={selected}
        onChange={(option) => setSelected(option)}
        isClearable
        classNamePrefix="react-select"
        menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
        styles={{
          menuPortal: base => ({ ...base, zIndex: 9999 }),
          menu: base => ({ ...base, position: 'absolute' }),
        }}
      />

      <div className="flex justify-end pt-4">
        <button className="btn btn-primary" onClick={() => onSelect(selected?.value || '')}>
          Confirm
        </button>
      </div>
    </div>
  );
};

export default FlowOptionsModal;

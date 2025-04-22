import { useFlow } from '@/store/hooks/flowsHooks';

const LabelValue = ({ label, value }: { label: string; value?: string }) => {
  if (!value) return null;

  return (
    <div className="flex text-xs">
      <span className="w-32 text-gray-500">{label}:</span>
      <span className="text-gray-800">{value}</span>
    </div>
  );
};

const ButtonAttachmentDetails = ({ payload }: { payload: any }) => {
  const { flows } = useFlow();

  const beforeFlow = flows.find(f => f.id === payload?.beforeSubmitScript);
  const afterFlow = flows.find(f => f.id === payload?.afterSubmitScript);
  const customFlow = flows.find(f => f.id === payload?.customFlow);

  return (
    <div className="text-xs text-muted space-y-1 ml-1">
      <LabelValue label="Label" value={payload?.text} />
      <LabelValue label="Action" value={payload?.action} />

      {payload?.action === 'submit' && (
        <>
          <LabelValue
            label="Before Submit Flow"
            value={beforeFlow?.name}
          />
          <LabelValue
            label="After Submit Flow"
            value={afterFlow?.name}
          />
        </>
      )}

      {payload?.action === 'custom' && (
        <LabelValue label="Custom Flow" value={customFlow?.name} />
      )}
    </div>
  );
};

export default ButtonAttachmentDetails;

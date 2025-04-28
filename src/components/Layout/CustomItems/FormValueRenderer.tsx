import { useFlow } from '@/store/hooks/flowsHooks';
import { TAttachment } from '@/types/layouts';

interface Props {
  flowId: string;
}

const FormValueRenderer = ({ flowId }: Props) => {
  const { flows } = useFlow();
  const flow = flows.find(f => f.id === flowId);

  if (!flow) return <div className="text-sm italic text-gray-400">No flow found.</div>;

  return (
    <div className="p-4 border rounded bg-gray-100 text-xs space-y-2">
      <div><strong>Flow Name:</strong> {flow.name}</div>
      <div><strong>ID:</strong> {flow.id}</div>
      {/* Render other flow fields as needed */}
    </div>
  );
};

export default FormValueRenderer;

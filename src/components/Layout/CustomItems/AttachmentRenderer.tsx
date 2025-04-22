// import other components like ScriptAttachmentDetails, NoteAttachmentDetails, etc. as needed
import { TAttachment } from '@/types/layouts';
import ButtonAttachmentDetails from './ButtonAttachmentDetails';

interface Props {
  attachment: TAttachment;
}

const AttachmentRenderer = ({ attachment }: Props) => {
  switch (attachment.type) {
    case 'button':
      return <ButtonAttachmentDetails payload={attachment.payload} />;
    case 'note':
      return (
        <div className="text-xs text-gray-700 italic px-2">
          {attachment.payload || 'No note text'}
        </div>
      );
    case 'divider':
      return <hr className="my-2 border-dashed border-gray-300" />;
    case 'spacer':
      return (
        <div
          style={{ height: `${attachment.payload ?? 16}px` }}
          className="bg-gray-100 w-full"
        />
      );
    case 'script':
      return (
        <pre className="text-xs bg-gray-100 p-2 rounded text-muted overflow-auto">
          {attachment.payload || '// empty script'}
        </pre>
      );
    case 'flow':
      return (
        <div className="text-xs text-gray-700 px-2">
          Flow ID: <span className="font-mono">{attachment.payload || 'None'}</span>
        </div>
      );
    case 'external':
      return (
        <div className="text-xs text-muted px-2 italic">
          External link or resource attached.
        </div>
      );
    case 'component':
      return (
        <div className="text-xs text-muted px-2 italic">
          Custom component placeholder.
        </div>
      );
    case 'input':
      return (
        <div className="text-xs text-muted px-2 italic">
          Input field placeholder (type/config unknown).
        </div>
      );
    default:
      return null;
  }
};

export default AttachmentRenderer;

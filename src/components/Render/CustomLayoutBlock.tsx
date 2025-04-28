'use client';

import { useForm, FieldValues } from 'react-hook-form';
import { TAttachment, TDroppedField } from '@/types/layouts';
import { useFlow } from '@/store/hooks/flowsHooks';
import { FaCode } from 'react-icons/fa';

interface Props {
  item: TDroppedField & { type: 'custom' };
}

const CustomLayoutBlock = ({ item }: Props) => {
  const { runAndHandleFlow } = useFlow();
  const methods = useForm();
  const { register, handleSubmit } = methods;

  const attachments = item.attachments as TAttachment[] ?? [];
  const fields = attachments.filter(att => att.type === 'field');
  const inputs = attachments.filter(att => att.type === 'input');
  const buttons = attachments.filter(att => att.type === 'button');

  const buildInputPayload = () => {
    const formValues = methods.getValues();
    return [...fields, ...inputs].map(field => ({
      name: field.payload.text,
      value: formValues[field.payload.text],
    }));
  };

  const onSubmit = async (formData: FieldValues) => {
    console.log('Submit Data:', formData);
  };

  const handleButtonClick = async (button: TAttachment) => {
    if (button.payload?.flowId) {
      await runAndHandleFlow(button.payload.flowId, {
        values: buildInputPayload()
      }, {
        methods,
        label: button.payload.text || 'Custom Flow'
      });
    }
  };

  return (
    <div className="con">
      <div className="font-semibold text-sm text-muted-foreground mb-4">{item.label}</div>
      {attachments
        ?.filter(att => att.type === 'field' || att.type === 'input')
        .map((att, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <label className="w-1/3 text-sm">{att.payload?.text ?? 'Unnamed'}</label>

            {att.type === 'field' ? (
              <p className="w-full border border-border/40 rounded px-2 py-1 bg-gray-50">{att.payload?.text ?? ''}</p>
            ) : att.type === 'input' ? (
              <input
                {...register(att.payload.text)}
                type={att.payload?.inputType || 'text'}
                placeholder={att.payload?.text ?? ''}
                className="border rounded px-2 py-1 w-full"
              />
            ) : null}

            {att.payload?.flowId && (
              <button
                type="button"
                className="btn-icon hover:bg-primary-200"
                onClick={() => handleButtonClick(att)}
              >
                <FaCode />
              </button>
            )}
          </div>
        ))}

      {/* Buttons */}
      {buttons.length > 0 && (
        <div className="flex gap-2 pt-4">
          {buttons.map((btn, idx) => (
            <button
              key={idx}
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit(onSubmit)}
            >
              {btn.payload?.text || 'Button'}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomLayoutBlock;

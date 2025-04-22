'use client';

import { useEffect, useState } from 'react';
import LayoutBuilder from './LayoutBuilder';
import { layoutTemplates } from './LayoutTemplates';
import CustomModal from '../Modals/CustomModal2';
import TemplatePicker from './TemplatePicker';
import { useDynamicModel } from '@/store/hooks/dynamicModelsHooks';
import { FaChevronRight } from 'react-icons/fa';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DraggableField from './DraggableField';
import { useRouter, useSearchParams } from 'next/navigation';
import { getSchema, saveSchema } from '@/actions/layout';
import { createPageLayoutSchema, pageLayoutSchema, TCreatePageLayout, TDroppedField, TPageLayout } from '@/types/layouts';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '../UI/Input';
import { toast } from 'react-toastify';
import DraggableField2 from './CustomItems/DraggableField2';

export const CUSTOM_FIELD_ITEMS = [
  { label: 'Button', customKey: 'button' },
  { label: 'Input', customKey: 'input' },
  { label: 'Divider', customKey: 'divider' },
  { label: 'Empty Container', customKey: 'empty' },
  { label: 'Note', customKey: 'note' },
  { label: 'Spacer', customKey: 'spacer' },
];

const LayoutDesigner = () => {
  const searchParams = useSearchParams();
  const layoutId = searchParams.get('layoutId');
  const isEditMode = Boolean(layoutId);
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<TCreatePageLayout | TPageLayout>({ resolver: zodResolver(isEditMode ? pageLayoutSchema : createPageLayoutSchema) });
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(layoutTemplates[0].id);
  const [showTemplateModal, setShowTemplateModal] = useState<boolean>(false);
  const { models, formLayouts, recordLayouts } = useDynamicModel()
  const [droppedFields, setDroppedFields] = useState<TDroppedField[]>([]);
  const [showSaveAsModal, setShowSaveAsModal] = useState(false);
  useEffect(() => { setValue("templateId", selectedTemplateId) }, [selectedTemplateId]);
  useEffect(() => { setValue("contentSchema", droppedFields) }, [droppedFields]);
  useEffect(() => { console.log(errors) }, [errors])

  const { push } = useRouter()
  const [expandedModelId, setExpandedModelId] = useState<string | null>(null);

  useEffect(() => {
    const fetchLayout = async () => {
      if (layoutId) {
        const { data: layout } = await getSchema(layoutId);
        console.log(layout)
        if (layout) {
          setValue("id", layout.id);
          setValue("name", layout.name);
          setValue("templateId", layout.templateId);
          setValue("contentSchema", layout.contentSchema);
          setSelectedTemplateId(layout.templateId); // also update local state
          setDroppedFields(layout.contentSchema);   // update builder
        }
      }
    };
    fetchLayout();
  }, [layoutId, setValue]);

  const onSubmit = async (formData: TCreatePageLayout | TPageLayout) => {
    const payload = {
      ...formData,
      templateId: selectedTemplateId,
      contentSchema: droppedFields,
    };

    console.log(payload);
    const action = isEditMode
      ? () => saveSchema(payload as TPageLayout)
      : () => saveSchema(payload as TCreatePageLayout);

    await toast.promise(
      action(),
      {
        pending: isEditMode ? "Saving changes..." : "Creating layout...",
        success: "Layout saved successfully!",
        error: "Failed to save layout.",
      }
    ).then((res) => {
      if (res?.success) {
        push(`/design?layoutId=${res.data}`);
      }
      console.log(res);
    });
  };


  const onSaveAs = async (formData: TCreatePageLayout) => {
    const payload = {
      ...formData,
      id: undefined, // Force new layout creation
      templateId: selectedTemplateId,
      contentSchema: droppedFields,
    };

    await toast.promise(
      saveSchema(payload as TCreatePageLayout),
      {
        pending: "Saving layout as new...",
        success: "Layout duplicated successfully!",
        error: "Failed to duplicate layout.",
      }
    ).then((res) => {
      if (res?.success) {
        setShowSaveAsModal(false);
        push(`/design?layoutId=${res.data}`);
      }
      console.log(res);
    });
  };


  const handleTemplateChange = (newTemplateId: string) => {
    const newTemplate = layoutTemplates.find(t => t.id === newTemplateId);
    if (!newTemplate) return;

    const newRegionCount = newTemplate.regions;

    const updatedFields = droppedFields.map(field =>
      field.region >= newRegionCount
        ? { ...field, region: 0 } // move to first available region
        : field
    );

    setDroppedFields(updatedFields); // update layout content
    setSelectedTemplateId(newTemplateId); // update selected template
  };

  const modelsMap = models.reduce((acc, model) => {
    const forms = formLayouts.filter(l => l.modelId === model.id);
    const records = recordLayouts.filter(l => l.modelId === model.id);

    acc[model.id] = [...forms.map(l => ({ ...l, type: 'form' as const })), ...records.map(l => ({ ...l, type: 'record' as const }))];
    return acc;
  }, {} as Record<string, { id: string; label: string; type: 'form' | 'record' }[]>);


  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col gap-4 p-6 grow">
        {/* Header section with dropdown and button */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Input name='name' register={register} error={errors.name} label='Layout Name' style={2} />
          </div>
          <div className="flex items-center gap-4">

            <button className="btn" onClick={() => console.log(droppedFields)}>
              Log fields
            </button>
            <button className="btn" onClick={() => setShowTemplateModal(true)}>
              Change Layout Template
            </button>
            {isEditMode && <button className="btn btn-secondary" onClick={() => setShowSaveAsModal(true)}>
              Save As
            </button>}
            <button className="btn btn-primary" onClick={handleSubmit(onSubmit)}>
              {isEditMode ? `Save Changes` : `Save Schema`}
            </button>
          </div>
        </div>
        <div className="flex grow">
          <div className="w-[400px] p-4 pl-0 overflow-auto flex flex-col gap-8">
            <div className='flex flex-col gap-2'>
              <p className="text-lg font-semibold">Objects</p>
              <ul className="text-sm">
                {Object.entries(modelsMap).map(([modelId, layouts]) => (
                  <li key={modelId}>
                    <button onClick={() => setExpandedModelId((prev) => (prev === modelId ? null : modelId))} className={`w-full flex gap-2 text-left font-medium py-2 items-center hover:bg-primary-50 hover:shadow rounded shadow-border/50 pl-2  ${expandedModelId === modelId ? `!bg-primary-100` : ``}`}>
                      <div className={`duration-200 ${expandedModelId === modelId ? `rotate-90` : ``}`}>
                        <FaChevronRight />
                      </div>
                      <p className={``}>{models.find(m => m.id == modelId)?.name}</p>
                    </button>

                    {expandedModelId === modelId && (
                      <ul className="ml-6 mt-1 space-y-1">
                        {layouts.map((layout) => (
                          <li key={layout.id}>
                            {layout.type === 'form' ? (
                              <DraggableField
                                field={{
                                  type: 'form',
                                  label: `${models.find(m => m.id === modelId)?.name || 'Model'} - ${layout.label}`,
                                  formLayoutId: layout.id,
                                  index: 0, // dummy
                                  region: 0, // dummy
                                }}
                              />

                            ) : (
                              <DraggableField
                                field={{
                                  type: 'record',
                                  label: `${models.find(m => m.id === modelId)?.name || 'Model'} - ${layout.label}`,
                                  recordLayoutId: layout.id,
                                  index: 0,
                                  region: 0,
                                }}
                              />

                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <div className='flex flex-col gap-2'>
              <p className="text-lg font-semibold">Custom Items</p>
              <ul className="text-sm space-y-1 ml-2">
                {CUSTOM_FIELD_ITEMS.map((item) => (
                  <li key={item.customKey}>
                    <DraggableField2
                      field={{
                        type: 'custom',
                        label: item.label,
                        customKey: item.customKey,
                      }}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grow ">
            <LayoutBuilder
              selectedTemplateId={selectedTemplateId}
              droppedFields={droppedFields}
              setDroppedFields={setDroppedFields}
            />
          </div>
        </div>


        <CustomModal
          isOpen={showTemplateModal}
          onClose={() => setShowTemplateModal(false)}
          header="Select a Template"
          Component={() => (
            <TemplatePicker
              selectedTemplateId={selectedTemplateId}
              onSelect={(id: string) => {
                handleTemplateChange(id);
                setShowTemplateModal(false);
              }}
            />
          )}
        />

        <CustomModal
          isOpen={showSaveAsModal}
          onClose={() => {
            setShowSaveAsModal(false);
            // setNewLayoutName('');
          }}
          header="Save Layout As"
          Component={() => (
            <div className="flex flex-col gap-4 p-8">
              <Input
                name="name"
                register={register}
                label="New Layout Name"
                style={2}
              // value={newLayoutName}
              // onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewLayoutName(e.target.value)}
              // required
              />

              <div className="flex justify-end gap-2 mt-4">
                <button className="btn" onClick={() => setShowSaveAsModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleSubmit(onSaveAs)}>Save</button>
              </div>
            </div>
          )}
        />

      </div>
    </DndProvider>
  );
};

export default LayoutDesigner;

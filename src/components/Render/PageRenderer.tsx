'use client';

import React, { useEffect, useState } from 'react';
import { useDynamicModel } from '@/store/hooks/dynamicModelsHooks';
import { TCustomDroppedField, TPageLayout } from '@/types/layouts';
import { getSchema } from '@/actions/layout';
import { layoutTemplates } from '../Layout/LayoutTemplates';
import FormLayoutBlock from './FormLayoutBlock';
import RecordLayoutBlock from './RecordLayoutBlock';
import { useSearchParams } from 'next/navigation';
import CustomLayoutBlock from './CustomLayoutBlock';

type PageRendererProps = {
  layoutId: string;
};

const PageRenderer = ({ layoutId }: PageRendererProps) => {
  const [pageLayout, setPageLayout] = useState<TPageLayout | null>(null);
  const [loading, setIsLoading] = useState<boolean>(true);
  const { models } = useDynamicModel();

  useEffect(() => {
    if (!models.length) return;
    const fetchLayout = async () => {
      const { data: layout } = await getSchema(layoutId ?? "");
      if (layout) {
        setPageLayout(layout);
      }
      setIsLoading(false);
    };
    fetchLayout();
  }, [models]);

  if (loading) return <div>LOADING</div>;
  if (!pageLayout || !layoutId) return <div>⚠️ Invalid layout Id</div>;

  const layoutTemplate = layoutTemplates.find(t => t.id === pageLayout.templateId);
  if (!layoutTemplate) return <div>⚠️ Unknown layout template</div>;

  // 👇 Flattened logic: build region components array by index
  const regionContent: React.ReactNode[] = Array.from({ length: layoutTemplate.regions }, (_, regionIndex) => {
    const regionItems = pageLayout.contentSchema
      .filter(item => item.region === regionIndex)
      .sort((a, b) => a.index - b.index);

    return (
      <div key={regionIndex} className="h-full space-y-4">
        {regionItems.map((item, idx) => {
          if (item.type === 'form') {
            return <FormLayoutBlock key={item.formLayoutId} formLayoutId={item.formLayoutId} attachments={item.attachments} />;
          }
          if (item.type === 'record') {
            return <RecordLayoutBlock key={item.recordLayoutId} recordLayoutId={item.recordLayoutId} />;
          }
          if (item.type === 'custom' && item.id) {
            return <CustomLayoutBlock key={item.id} item={item as TCustomDroppedField} />;
          }
          return <div key={idx} className="text-red-500">⚠️ Unknown item type</div>;
        })}
      </div>
    );
  });

  return (
    <div className="grow w-full h-full p-4">
      {layoutTemplate.render(regionContent)}
    </div>
  );
};

export default PageRenderer;

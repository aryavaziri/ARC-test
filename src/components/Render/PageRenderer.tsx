'use client';

import React, { useEffect, useState } from 'react';
import { useDynamicModel } from '@/store/hooks/dynamicModelsHooks';
import { TPageLayout } from '@/types/layouts';
import { getSchema } from '@/actions/layout';
import { layoutTemplates } from '../Layout/LayoutTemplates';
import FormLayoutBlock from './FormLayoutBlock';
import RecordLayoutBlock from './RecordLayoutBlock';
import { useSearchParams } from 'next/navigation';

const PageRenderer = () => {
  const searchParams = useSearchParams();
  const layoutId = searchParams.get('layoutId');
  const [pageLayout, setPageLayout] = useState<TPageLayout | null>(null);
  const [loading, setIsLoading] = useState<boolean>(true);
  const { refetch } = useDynamicModel();

  useEffect(() => {
    const fetchLayout = async () => {
      const { data: layout } = await getSchema(layoutId ?? "");
      if (layout) {
        await refetch();
        setPageLayout(layout);
      }
      setIsLoading(false);
    };
    fetchLayout();
  }, []);

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
            return <FormLayoutBlock key={item.formLayoutId} formLayoutId={item.formLayoutId} />;
          }
          if (item.type === 'record') {
            return <RecordLayoutBlock key={item.recordLayoutId} recordLayoutId={item.recordLayoutId} />;
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

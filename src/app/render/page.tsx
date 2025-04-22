'use client';

import React from 'react';
import PageRenderer from '@/components/Render/PageRenderer';
import { useSearchParams } from 'next/navigation';

const Renderer = () => {
  const searchParams = useSearchParams();
  const layoutId = searchParams.get('layoutId');

  if (!layoutId) {
    return <div className="text-red-500">⚠️ layoutId query parameter is required</div>;
  }

  return (
    <div className="p-8 grow flex flex-col">
      <PageRenderer layoutId={layoutId} />
    </div>
  );
};

export default Renderer;

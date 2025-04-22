// /app/[tab]/[layout]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { slugify } from '@/lib/helpers';
import PageRenderer from '@/components/Render/PageRenderer';

export default function DynamicLayoutPage() {
    const params = useParams();

    const layoutId = useSelector((state: RootState) => {
        const tab = state.tabs.tabs.find(
            t => slugify(t.label) === params.tab.toString().toLowerCase()
        );
        const layout = tab?.layouts.find(
            l => slugify(l.route) === params.layout.toString().toLowerCase()
        );
        return layout?.layoutId ?? null;
    });

    if (!layoutId) return <div>Layout not found</div>;

    return (
        <div className="p-8 grow flex flex-col">
            <PageRenderer layoutId={layoutId} />
        </div>
    );
}

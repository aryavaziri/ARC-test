'use client';

import { useParams, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export default function DynamicLayoutPage() {
    const params = useParams();
    const router = useRouter();

    const layoutId = useSelector((state: RootState) => {
        const tab = state.tabs.tabs.find(t => t.label.toLowerCase() === params.tab.toString().toLowerCase());
        const layout = tab?.layouts.find(l => l.route === params.layout);
        return layout?.layoutId ?? null;
    });

    if (!layoutId) return <div>Layout not found</div>;
    router.push(`/render?layoutId=${layoutId}`);
}

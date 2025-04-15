import LayoutRenderer from "@/components/Layout/LayoutRenderer";

interface Props {
    params: { tab: string; layout: string };
}

export default function DynamicLayoutPage({ params }: Props) {
    return (
        <LayoutRenderer tab={params.tab} layout={params.layout} />
    );
}
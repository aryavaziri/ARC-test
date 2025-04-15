import LayoutDesigner from "@/components/Layout/LayoutDesigner";

interface Props {
    params: { tab: string; layout: string };
}

export default function LayoutDesignerPage({ params }: Props) {
    return (
        // <LayoutDesigner tab={params.tab} layout={params.layout} />
        <LayoutDesigner />
    );
}

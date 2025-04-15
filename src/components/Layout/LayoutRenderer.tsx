'use client'
import { useEffect, useState } from "react";

const LayoutRenderer = ({ tab, layout }: { tab: string; layout: string }) => {
    const [schema, setSchema] = useState<any[]>([]);

    useEffect(() => {
        const loadSchema = async () => {
            const res = await fetch(`/api/layout-schemas?tab=${tab}&layout=${layout}`);
            const data = await res.json();
            setSchema(data.schema);
        };
        loadSchema();
    }, [tab, layout]);

    return (
        <div className="p-6">
            <h1>Rendered Layout: {layout}</h1>
            {/* Dynamically render form from schema */}
        </div>
    );
};

export default LayoutRenderer
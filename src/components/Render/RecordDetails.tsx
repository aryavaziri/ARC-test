"use client"

import { useDynamicModel } from "@/store/hooks/dynamicModelsHooks";
import { useEffect, useMemo, useState } from "react";
import { TLineItem } from "@/types/dynamicModel";

interface Props {
  layoutId: string;
  recordId: string;
}

const RecordDetails = ({ layoutId, recordId }: Props) => {
  const {
    recordLayouts,
    allFields,
    getLookupLineItem,
    lineItem,
  } = useDynamicModel();

  const layout = useMemo(() => recordLayouts.find(l => l.id === layoutId), [layoutId, recordLayouts]);
  const record = useMemo(() => lineItem?.find(r => r.id === recordId), [recordId, lineItem]);

  const [lookupRecordsMap, setLookupRecordsMap] = useState<Record<string, TLineItem[]>>({});

  useEffect(() => {
    const fetchLookups = async () => {
      if (!layout?.contentSchema) return;

      const ids = new Set<string>();

      layout.contentSchema.forEach((item) => {
        const base = allFields.find(f => f.id === item.fieldId);
        if (base?.type === "lookup") {
          ids.add((base as any).lookupModelId);
          const nestedIds = item.lookupDetails?.fields.flat() || [];
          nestedIds.forEach(nid => {
            const nf = allFields.find(f => f.id === nid);
            if (nf?.type === "lookup") {
              ids.add((nf as any).lookupModelId);
            }
          });
        }
      });

      const map: Record<string, TLineItem[]> = {};
      await Promise.all(
        Array.from(ids).map(async (id) => {
          const result = await getLookupLineItem(id);
          map[id] = result;
        })
      );

      setLookupRecordsMap(map);
    };

    fetchLookups();
  }, [layout, allFields]);

  if (!layout || !record) {
    return <p className="italic text-muted text-sm">Record or layout not found.</p>;
  }

  return (
    <div className="space-y-4 bg-white p-6 rounded-lg shadow">
      {layout.contentSchema?.map((item) => {
        const base = allFields.find(f => f.id === item.fieldId);
        if (!base) return null;

        if (base.type !== "lookup") {
          const val = record.fields.find(f => f.fieldId === item.fieldId)?.value;
          return (
            <div key={item.fieldId} className="flex justify-between px-8 py-3 bg-primary-50/50 rounded shadow hover:bg-primary-50">
              <p className="text-sm font-medium text-gray-600 w-1/3">{base.label}</p>
              <p className="text-gray-800 w-2/3 text-right">{val?.toString() ?? "-"}</p>
            </div>
          );
        }

        const lookupValue = record.fields.find(f => f.fieldId === base.id)?.value;
        const nestedRecord = typeof lookupValue === "string"
          ? lookupRecordsMap[(base as any).lookupModelId]?.find(r => r.id === lookupValue)
          : null;

        const rows = item.lookupDetails?.fields.map((row, idx) => {
          const values = row.map(fid => {
            const val = nestedRecord?.fields.find(f => f.fieldId === fid)?.value;
            return val?.toString() ?? "-";
          });
          return (
            <p key={`${item.fieldId}-row-${idx}`} className="text-right">
              {values.join(", ")}
            </p>
          );
        });

        return (
          <div key={item.fieldId} className="flex justify-between px-8 py-3 bg-primary-50/50 rounded shadow hover:bg-primary-50">
            <p className="text-sm font-medium text-gray-600 w-1/3">{base.label}</p>
            <div className="flex flex-col gap-2 w-2/3 items-end">{rows}</div>
          </div>
        );
      })}
    </div>
  );
};

export default RecordDetails;

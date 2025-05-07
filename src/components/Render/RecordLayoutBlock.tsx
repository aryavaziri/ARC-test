"use client";

import { useEffect, useMemo, useState } from "react";
import { useDynamicModel } from "@/store/hooks/dynamicModelsHooks";
import { TLineItem } from "@/types/dynamicModel";
import SingleRecordRender from "./SingleRecordRender";
import GridRender from "./GridRender";

interface Props {
  recordLayoutId: string;
}

const RecordLayoutBlock = ({ recordLayoutId }: Props) => {
  const { recordLayouts, models, allFields, getLookupLineItem, removeLineItem, getLineItems, lineItem, } = useDynamicModel();

  const layout = useMemo(
    () => recordLayouts.find((l) => l.id === recordLayoutId),
    [recordLayoutId, recordLayouts]
  );

  const model = useMemo(
    () => models.find((m) => m.id === layout?.modelId),
    [layout?.modelId, models]
  );

  const [lookupRecordsMap, setLookupRecordsMap] = useState<Record<string, TLineItem[]>>({});
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);

  const fieldHeaders = useMemo(() => {
    if (!layout?.contentSchema) return [];
    console.log(layout)

    return (
      layout.contentSchema.flatMap((item) => {
        const base = allFields.find((f) => f.id === item.fieldId);
        if (!base) return [];
        if (base.type !== "lookup") { return [{ id: base.id, label: base.label }] }

        const lookupFields = item.lookupDetails?.fields?.flat() || [];

        // const heads = allFields.filter((f) => lookupFields.length ? lookupFields.some(lf => lf === f.id) : f.id === (base as any).primaryFieldId)
        const heads = lookupFields.length
          ? allFields.filter(f => lookupFields.includes(f.id))
          : [allFields.find(f => f.id === (base as any).primaryFieldId)].filter(Boolean);

        console.log(heads)
        return heads.filter((f) => !!f).map(h => ({
          id: h.id,
          label: `${base.label}: ${h.label}`,
          isLookup: true,
          parentFieldId: base.id,

        }))
      }) || []
    );
  }, [layout, allFields]);

  useEffect(() => {
    if (layout?.modelId) {
      getLineItems(layout.modelId);
    }
  }, [layout?.modelId]);

  useEffect(() => {
    const fetchLookupRecords = async () => {
      const ids = new Set<string>();

      layout?.contentSchema?.forEach((item) => {
        const base = allFields.find((f) => f.id === item.fieldId);
        if (base?.type === "lookup") {
          const lookupModelId = (base as any).lookupModelId;
          if (lookupModelId) ids.add(lookupModelId);

          const nested = item.lookupDetails?.fields?.flat() || [];
          nested.forEach((nid) => {
            const nf = allFields.find((f) => f.id === nid);
            if (nf?.type === "lookup") {
              const lid = (nf as any).lookupModelId;
              if (lid) ids.add(lid);
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

    if (layout?.contentSchema?.length) fetchLookupRecords();
  }, [layout, allFields]);

  const getDisplayValue = (
    item: TLineItem,
    header: { id: string; isLookup?: boolean; parentFieldId?: string }
  ): string => {
    let rawValue: string | number | boolean | Date | undefined;

    if (!header.isLookup) {
      rawValue = item.fields.find((f) => f.fieldId === header.id)?.value;
    } else {
      const lookupValue = item.fields.find((f) => f.fieldId === header.parentFieldId)?.value;
      const lookupField = allFields.find((f) => f.id === header.parentFieldId);

      if (lookupField?.type === "lookup" && typeof lookupValue === "string") {
        const candidates = lookupRecordsMap[(lookupField as any).lookupModelId];
        const nestedRecord = candidates?.find((r) => r.id === lookupValue);
        rawValue = nestedRecord?.fields.find((f) => f.fieldId === header.id)?.value;
      }
    }

    return rawValue !== undefined && rawValue !== null ? String(rawValue) : "-";
  };

  const handleRemoveLineItem = async (id: string): Promise<void> => {
    await removeLineItem(id);
  };

  const layoutFieldIds = useMemo(() => {
    return layout?.contentSchema?.map(item => item.fieldId) ?? [];
  }, [layout]);

  const records = useMemo(() => {
    if (!layoutFieldIds.length) return [];
    return (lineItem ?? []).filter(item =>
      item.fields.some(f => layoutFieldIds.includes(f.fieldId))
    );
  }, [lineItem, layoutFieldIds]);
  // useEffect(() => {
  //   console.log("✅ records", records);
  //   console.log("✅ lineItem", lineItem);
  //   console.log("✅ layoutFieldIds", layoutFieldIds);

  // }, [records, lineItem, layoutFieldIds]);

  if (!layout) {
    return <div className="text-muted text-sm italic">⚠️ Layout not found</div>;
  }
  return (
    <div className="con">
      <div className="text-sm font-semibold text-muted-foreground mb-2 flex items-start justify-between">
        <p>
          {model?.name} - {layout.label}
        </p>
        {/* <div className="flex">
          {(layout.isGrid || !selectedRecordId) && <div className={`btn btn-primary`}>Add</div>}
          {!layout.isGrid && selectedRecordId && <div className={`btn btn-secondary`}>Edit</div>}
        </div> */}
      </div>

      {layout.isGrid ? (
        <GridRender
          allowAddingLineItems={layout.allowAddingLineItems}
          modelId={layout.modelId}
          records={records}
          fieldHeaders={fieldHeaders}
          getDisplayValue={getDisplayValue}
          removeLineItem={handleRemoveLineItem}
        />
      ) : (
        <SingleRecordRender
          layoutId={layout.id}
          modelId={layout.modelId} // ✅ required for add/edit form
          layoutLabel={layout.label} // ✅ required for form lookup
          records={records}
          fieldHeaders={fieldHeaders}
          getDisplayValue={getDisplayValue}
          selectedRecordId={selectedRecordId}
          setSelectedRecordId={setSelectedRecordId}
        />

      )}
    </div>
  );
};

export default RecordLayoutBlock;

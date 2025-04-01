'use client';

import { useDynamicModel } from "@/store/hooks/dynamicModelsHooks";
import { useEffect, useState } from "react";
import { TiDelete } from "react-icons/ti";
import { TLineItem } from "@/types/dynamicModel";

export default function DynamicRecordTable() {
  const {
    selectedModel,
    inputFields,
    lineItem,
    removeLineItem,
    models,
    allFields,
    getLookupLineItem
  } = useDynamicModel();

  const [fieldHeaders, setFieldHeaders] = useState<{ id: string; label: string }[]>([]);
  const [lookupRecordsMap, setLookupRecordsMap] = useState<Record<string, TLineItem[]>>({});

  useEffect(() => {
    const fetchLookupRecords = async () => {
      const recordsMap: Record<string, TLineItem[]> = {};
      const lookupFields = inputFields.filter(f => f.type === 'lookup');

      await Promise.all(
        lookupFields.map(async (lookupField) => {
          if (lookupField.lookupModelId && !recordsMap[lookupField.lookupModelId]) {
            const records = await getLookupLineItem(lookupField.lookupModelId);
            recordsMap[lookupField.lookupModelId] = records;
          }
        })
      );

      setLookupRecordsMap(recordsMap);
    };

    fetchLookupRecords();
  }, [inputFields]);

  useEffect(() => {
    if (!selectedModel || !inputFields || !models) return;

    const headers: { id: string; label: string }[] = [];

    inputFields.forEach((field) => {
      if (field.type === 'lookup') {
        const lookupModel = models.find((m) => m.id === field.lookupModelId);
        if (!lookupModel) return;
        const columnIds = field.recordTableColumns?.length
          ? field.recordTableColumns
          : field.primaryFieldId
            ? [field.primaryFieldId]
            : [];

        columnIds.forEach((colId) => {
          const matched = allFields.find((f) => f.id === colId);
          if (matched && !headers.some((h) => h.id === matched.id)) {
            headers.push({ id: matched.id, label: matched.label });
          }
        });
      } else {
        if (!headers.some((h) => h.id === field.id)) {
          headers.push({ id: field.id, label: field.label });
        }
      }
    });

    setFieldHeaders(headers);
  }, [selectedModel, inputFields, models]);

  if (!selectedModel) return null;

  return (
    <div className="con">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold mb-4">Records for: {selectedModel.name}</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="my-table whitespace-nowrap">
          <thead>
            <tr>
              <th>#</th>
              {fieldHeaders.map((field) => (
                <th key={field.id}>{field.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {lineItem?.map((data, index) => (
              <tr key={index} className="group">
                <td className="relative !w-[40px]">
                  <div className="flex justify-evenly items-center">
                    <p className="group-hover:hidden">{index + 1}</p>
                    <div
                      onClick={async () => await removeLineItem(data.id)}
                      className="-left-100 group-hover:inset-1 flex cursor-pointer items-center justify-center absolute text-rose-500 duration-200 hover:scale-[1.1] z-1"
                    >
                      <TiDelete size={36} />
                    </div>
                  </div>
                </td>
                {fieldHeaders.map((header) => {
                  let valueToRender = "-";

                  // Direct match from current record
                  const directMatch = data.fields.find((f) => f.fieldId === header.id);
                  if (directMatch) {
                    valueToRender = String(directMatch.value);
                  } else {
                    // Check nested lookup fields
                    for (const lookupField of inputFields.filter(f => f.type === 'lookup')) {
                      const lookupValue = data.fields.find(f => f.fieldId === lookupField.id)?.value;

                      if (typeof lookupValue === "string") {
                        const records = lookupRecordsMap[lookupField.lookupModelId];
                        const nestedRecord = records?.find(r => r.id === lookupValue);
                        const nestedField = nestedRecord?.fields.find(f => f.fieldId === header.id);

                        if (nestedField) {
                          valueToRender = String(nestedField.value);
                          break;
                        }
                      }
                    }
                  }

                  return <td key={header.id}>{valueToRender}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useMemo, useState } from 'react';
import { RiDeleteBin7Fill } from 'react-icons/ri';
import { TDependency, TLookupField } from '@/types/dynamicModel';
import { useDynamicModel } from '@/store/hooks/dynamicModelsHooks';

interface Props {
  dependencies: TDependency[];
  deleteDependency: (id: string) => Promise<void>;
}

const DependencyList: React.FC<Props> = ({ dependencies, deleteDependency }) => {
  const { allFields, getPrimaryValue } = useDynamicModel();
  const [primaryValues, setPrimaryValues] = useState<Record<string, string>>({});


  useEffect(() => {
    const fetchValues = async () => {
      const values: Record<string, string> = {};

      for (const dep of dependencies) {
        const dependantField = (allFields.find(f => f.id == dep.dependantFieldId) as TLookupField).primaryFieldId
        const primaryFieldId = (allFields.find(f => f.id == dep.dependantFieldId) as TLookupField).primaryFieldId
        if (Array.isArray(dep.referenceLineItemIds) && dependantField) {
          for (const id of dep.referenceLineItemIds) {
            const key = `${dep.dependantFieldId}_${id}`;
            if (!values[key]) {
              const label = await getPrimaryValue(id, primaryFieldId);
              values[key] = label || id;
            }
          }
        }
      }

      setPrimaryValues(values);
    };

    fetchValues();
  }, [dependencies]);

  if (!dependencies.length) return null;

  const getLabel = (fieldId?: string) =>
    allFields.find(f => f.id === fieldId)?.label || fieldId || '-';

  return (
    <div className="flex grow w-full mt-24">
      <div className="con">
        <div className="flex items-center gap-2 mb-4">
          <p className="font-semibold mr-auto text-xl">
            {getLabel(dependencies[0]?.referenceFieldId)} Dependencies
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="my-table w-full">
            <thead>
              <tr>
                <th>Dependant Field</th>
                <th>Controlling Field</th>
                <th>Selected Values</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {dependencies.map(dep => (
                <tr key={dep.id} className="transition-colors hover:bg-muted/40">
                  <td><p className="font-mono text-sm">{getLabel(dep.dependantFieldId)}</p></td>
                  <td><p className="font-mono text-sm">{getLabel(dep.controllingFieldId ?? undefined)}</p></td>
                  <td className={`justify-center`}>
                    {dep.referenceLineItemIds?.length ? (
                      <div className="w-full flex flex-col items-center flex-wrap gap-2">
                        {dep.referenceLineItemIds.map(id => {
                          const key = `${dep.dependantFieldId}_${id}`;
                          return (
                            <div key={id} className="bg-secondary-100 rounded px-2 py-1 text-sm text-gray-700">
                              {primaryValues[key] || id}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p>-</p>
                    )}
                  </td>
                  <td>
                    <button
                      onClick={() => deleteDependency(dep.id!)}
                      className="btn-icon hover:bg-red-400 p-[5px] border-none shadow text-md"
                    >
                      <RiDeleteBin7Fill />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DependencyList;

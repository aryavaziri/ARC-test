'use client'

import React, { useEffect, useState } from 'react'
import { useDynamicModel } from '@/store/hooks/dynamicModelsHooks'
import { useDependency } from '@/store/hooks/dependencyHooks'
import { RiDeleteBin7Fill } from 'react-icons/ri'
import { TDependency } from '@/types/dynamicModel'

interface Props {
  referenceFieldId: string
  dependencies: TDependency[];
}

const DependencyList: React.FC<Props> = ({ referenceFieldId, dependencies }) => {
  const { allFields } = useDynamicModel()
  const { deleteDependency } = useDependency(referenceFieldId)

  if (!dependencies.length) return null

  return (
    <div className="flex grow w-full mt-24">
      <div className="con">
        <div className="flex items-center gap-2 mb-4">
          <p className="font-semibold mr-auto text-xl">Dependencies</p>
        </div>

        <div className="overflow-x-auto">
          <table className="my-table w-full">
            <thead>
              <tr>
                <th>Reference Field</th>
                <th>Controlling Field / Values</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {dependencies.map(dep => (
                <tr key={dep.id} className="transition-colors hover:bg-muted/40">
                  <td>
                    {allFields.find(f => f.id === dep.referenceFieldId)?.label || dep.referenceFieldId}
                  </td>
                  <td>
                    {dep.controllingFieldId
                      ? <p className="font-mono text-sm">
                        {allFields.find(f => f.id === dep.controllingFieldId)?.label || dep.controllingFieldId}
                      </p>
                      : <div className="flex flex-wrap gap-2 text-sm text-gray-700">
                        {dep.referenceLineItemIds?.map(id => (
                          <div key={id} className="bg-gray-100 rounded px-2 py-1">
                            {id}
                          </div>
                        ))}
                      </div>}
                  </td>
                  <td>
                    <button
                      onClick={() => dep.id && deleteDependency(dep.id)}
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
  )
}

export default DependencyList

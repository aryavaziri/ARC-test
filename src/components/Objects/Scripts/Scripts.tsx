'use client'

import React from 'react';
import { useDynamicModel } from '@/store/hooks/dynamicModelsHooks';

const Scripts = () => {
    const { models, selectedModel } = useDynamicModel();

    if (!selectedModel) return null;

    return (
        <div className="flex grow">
            <div className="flex flex-col gap-4 grow con">
                <div className="flex gap-8 w-full overflow-x-auto">
                    <div className="con w-1/3 min-w-fit">
                        <div className="flex items-center gap-2 mb-4">
                            <p className="font-semibold mr-auto text-xl">
                                {models.find(m => m.id === selectedModel?.id)?.name || "Model"} Scripts
                            </p>
                            <button className="btn btn-secondary">
                                Add Script
                            </button>
                        </div>
                        <div className="text-sm text-gray-500 italic">
                            No scripts defined yet.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Scripts;

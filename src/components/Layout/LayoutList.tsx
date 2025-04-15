'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { IoMdAdd } from 'react-icons/io';
import { RiDeleteBin7Fill } from 'react-icons/ri';
import { useTab } from '@/store/hooks/tabsHooks';

const LayoutList = () => {
  const router = useRouter();

  const {pageLayouts, getPageLayouts, deleteLayout, loading} = useTab()

  useEffect(() => {
    getPageLayouts();
  }, []);

  const handleClick = (id: string) => {
    router.push(`/design?layoutId=${id}`);
  };

  const handleCreateNew = () => {
    router.push('/design');
  };

  const handleDelete = async (id: string) => {
    await deleteLayout(id);
  };

  return (
    <div className="con max-w-[500px]">
      <div className="flex justify-between items-center mb-4">
        <p className="text-xl font-semibold">Page Layouts</p>
        <button className="btn-icon btn-primary text-xl" onClick={handleCreateNew}>
          <IoMdAdd />
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {loading && <p className="text-muted">Loading layouts...</p>}
        {!loading && pageLayouts.length === 0 && <p className="text-muted">No layouts found.</p>}

        {pageLayouts.map((layout) => (
          <div
            key={layout.id}
            onClick={() => handleClick(layout.id)}
            className="flex justify-between items-center px-4 h-12 border rounded hover:bg-primary-50 transition-all shadow-sm group"
          >
            <p className="text-md font-medium hover:underline cursor-pointer">{layout.name}</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(layout.id);
              }}
              className="btn-icon text-muted hover:text-red-600 h-min hidden group-hover:block"
              title="Delete Layout"
            >
              <RiDeleteBin7Fill />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LayoutList;

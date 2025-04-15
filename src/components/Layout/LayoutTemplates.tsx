export interface LayoutTemplate {
  id: string;
  name: string;
  regions: number;
  render: (nodes: (React.ReactNode | undefined)[], isPreview?: boolean) => React.ReactNode;
}

export const layoutTemplates: LayoutTemplate[] = [
  {
    id: 'one-region',
    name: 'Single Region',
    regions: 1,
    render: (array, isPreview = false) => (
      <div className="w-full h-full">
        {array[0] ?? (
          isPreview ? (
            <div className="h-24 w-full border border-dashed border-gray-400 flex items-center justify-center text-gray-500">
              1
            </div>
          ) : null
        )}
      </div>
    ),
  },
  {
    id: 'header-two-equal',
    name: 'Header + 2 Columns',
    regions: 3,
    render: (array, isPreview = false) => (
      <div className={`flex flex-col h-full w-full ${!isPreview ? 'gap-4' : ''}`}>
        <div className={`${isPreview ? 'min-h-8 border border-dashed border-gray-400 flex items-center justify-center text-gray-500' : ''}`}>
          {array[0] ?? (isPreview ? "1" : null)}
        </div>
        <div className={`flex flex-1 w-full ${!isPreview ? 'gap-4' : ''}`}>
          <div className={`w-1/2 ${isPreview ? 'border border-dashed border-gray-400 flex items-center justify-center text-gray-500' : ''}`}>
            {array[1] ?? (isPreview ? "2" : null)}
          </div>
          <div className={`w-1/2 ${isPreview ? 'border border-dashed border-gray-400 border-l-0 flex items-center justify-center text-gray-500' : ''}`}>
            {array[2] ?? (isPreview ? "3" : null)}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'three-regions',
    name: 'Three Columns',
    regions: 3,
    render: (array, isPreview = false) => (
      <div className={`flex h-full w-full ${!isPreview ? 'gap-4' : ''}`}>
        <div className={`w-1/3 ${isPreview ? 'border border-dashed border-gray-400 flex items-center justify-center text-gray-500' : ''}`}>
          {array[0] ?? (isPreview ? "1" : null)}
        </div>
        <div className={`w-1/3 ${isPreview ? 'border border-dashed border-gray-400 border-l-0 flex items-center justify-center text-gray-500' : ''}`}>
          {array[1] ?? (isPreview ? "2" : null)}
        </div>
        <div className={`w-1/3 ${isPreview ? 'border border-dashed border-gray-400 border-l-0 flex items-center justify-center text-gray-500' : ''}`}>
          {array[2] ?? (isPreview ? "3" : null)}
        </div>
      </div>
    ),
  },
];

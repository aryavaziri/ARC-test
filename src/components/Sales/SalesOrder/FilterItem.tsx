interface FilterItemProps {
  label: string
  qt: number
  selected: boolean
  onClick: () => void
}

const FilterItem = ({ label, qt, selected, onClick }: FilterItemProps) => {
  return (
    <div
      onClick={onClick}
      className={`${selected ? `bg-lime-300` : `hover:bg-gray-400/30`} whitespace-nowrap py-2 px-6 text-lg rounded-full border cursor-pointer border-gray-400/60 flex gap-2`}
    >
      <span>{label}</span>
      <span className="h-8 aspect-square bg-white border-gray-300 border text-sm flex justify-center items-center text-center shadow rounded-full">
        {qt}
      </span>
    </div>
  )
}

export default FilterItem
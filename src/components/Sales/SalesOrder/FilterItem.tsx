interface FilterItemProps {
  label: string
  qt: number
  selected: boolean
  onClick: () => void
}

const FilterItem = ({ label, qt, selected, onClick }: FilterItemProps) => {
  return (
    <div onClick={onClick} className={`btn ${selected ? `btn-primary` : ``}`} >
      <span>{label}</span>
      <span className="h-8 aspect-square bg-light text-dark text-sm center shadow rounded-full">
        {qt}
      </span>
    </div>
  )
}

export default FilterItem
import FieldsGrid from "./DynamicModel/Fields/FieldsGrid"
import DynamicModelGrid from "./DynamicModel/DynamicModelGrid"
import DynamicShow from "./ModelFormLayout"

export default function DynamicModelFields() {


  return (
    <div className="flex gap-4">
      <DynamicModelGrid />
      <FieldsGrid />
    </div>
  )
}

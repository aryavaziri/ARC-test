'use client'
import React from "react"
import { useForm } from "react-hook-form"
import Input from "@/components/UI/Input" // Assuming you have an Input component

// Sample data
const sampleData = [
  {
    id: 1,
    action: "Edit",
    line: 101,
    quantity: 2,
    itemNumber: "ITM001",
    description: "Sample Item 1",
    unitPrice: 50.0,
    discountPrice: 5.0,
    totalPrice: 95.0,
    requestedDate: "2025-03-20",
    status: "Pending",
    pricingLevel: "Standard"
  },
  {
    id: 2,
    action: "Edit",
    line: 102,
    quantity: 5,
    itemNumber: "ITM002",
    description: "Sample Item 2",
    unitPrice: 30.0,
    discountPrice: 3.0,
    totalPrice: 135.0,
    requestedDate: "2025-03-22",
    status: "Approved",
    pricingLevel: "Premium"
  }
]

const Items = () => {
  const { register, formState, handleSubmit, reset } = useForm({
    defaultValues: {
      action: "New",
      line: "",
      quantity: "",
      itemNumber: "",
      description: "",
      unitPrice: "",
      discountPrice: "",
      totalPrice: "",
      requestedDate: new Date().toISOString().split("T")[0], // Default to today's date
      status: "Pending",
      pricingLevel: "Standard"
    }
  })

  // Check if any field is modified
  const isDirty = Object.keys(formState.dirtyFields).length > 0

  const onSubmit = (data: any) => {
    console.log("New Item:", data)
    reset() // Reset form after submission
  }

  return (
    <div className="con">
      <ul className="flex gap-4">
        <p className="mr-auto font-semibold text-4xl">Items</p>
        <li className="btn">Add New +</li>
        <li className="btn">Copy Function</li>
        <li className="btn">Import Lines</li>
      </ul>
      <div className="border border-border whitespace-nowrap rounded-2xl overflow-x-auto">
        <table className="my-table">
          <thead>
            <tr>
              {["Action", "Line", "Quantity", "Item Number", "Description", "Unit Price", "Discount Price", "Total Price", "Requested Date", "Status", "Pricing Level"].map(
                (header) => (
                  <th key={header}>
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody>
            {sampleData.map((item) => (
              <tr key={item.id}>
                <td>{item.action}</td>
                <td>{item.line}</td>
                <td>{item.quantity}</td>
                <td>{item.itemNumber}</td>
                <td>{item.description}</td>
                <td>${item.unitPrice.toFixed(2)}</td>
                <td>${item.discountPrice.toFixed(2)}</td>
                <td>${item.totalPrice.toFixed(2)}</td>
                <td>{item.requestedDate}</td>
                <td>{item.status}</td>
                <td>{item.pricingLevel}</td>
              </tr>
            ))}
            <tr>
              <td className="p-0"><Input placeholder='type...' label="" register={register} name="action" /></td>
              <td className="p-0"><Input placeholder='type...' label="" register={register} name="line" /></td>
              <td className="p-0"><Input placeholder='type...' label="" register={register} name="quantity" /></td>
              <td className="p-0"><Input placeholder='type...' label="" register={register} name="itemNumber" /></td>
              <td className="p-0"><Input placeholder='type...' label="" register={register} name="description" /></td>
              <td className="p-0"><Input placeholder='type...' label="" register={register} name="unitPrice" /></td>
              <td className="p-0"><Input placeholder='type...' label="" register={register} name="discountPrice" /></td>
              <td className="p-0"><Input placeholder='type...' label="" register={register} name="totalPrice" /></td>
              <td className="p-0"><Input placeholder='type...' label="" register={register} name="requestedDate" type="date" /></td>
              <td className="p-0"><Input placeholder='type...' label="" register={register} name="status" /></td>
              <td className="p-0"><Input placeholder='type...' label="" register={register} name="pricingLevel" /></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Show "Create" Button When Any Input Field is Modified */}
      {isDirty && (
        <button
          onClick={handleSubmit(onSubmit)}
          className="btn btn-primary"
        >
          Create Item
        </button>
      )}
    </div>
  )
}

export default Items

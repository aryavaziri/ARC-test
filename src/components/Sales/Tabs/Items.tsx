'use client'
import React from "react"
import { useForm } from "react-hook-form"
import Input from "@/components/Input" // Assuming you have an Input component

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
      <ul className="flex gap-4 mb-8 items-center">
        <li className="mr-auto">
          <p className="font-semibold text-4xl">Items</p>
        </li>
        <li className="rounded-full border p-2 px-4 hover:bg-gray-300 cursor-pointer">Add New +</li>
        <li className="rounded-full border p-2 px-4 hover:bg-gray-300 cursor-pointer">Copy Function</li>
        <li className="rounded-full border p-2 px-4 hover:bg-gray-300 cursor-pointer">Import Lines</li>
      </ul>
      <div className="border border-gray-300 rounded-2xl overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100/40">
              {["Action", "Line", "Quantity", "Item Number", "Description", "Unit Price", "Discount Price", "Total Price", "Requested Date", "Status", "Pricing Level"].map(
                (header) => (
                  <th key={header} className="font-normal px-4 py-2">
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody>
            {sampleData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-100 transition-all">
                <td className="border border-gray-300 px-4 py-2 text-center">{item.action}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{item.line}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{item.quantity}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{item.itemNumber}</td>
                <td className="border border-gray-300 px-4 py-2">{item.description}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">${item.unitPrice.toFixed(2)}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">${item.discountPrice.toFixed(2)}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">${item.totalPrice.toFixed(2)}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{item.requestedDate}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{item.status}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{item.pricingLevel}</td>
              </tr>
            ))}
            {/* Add new item row with input fields */}
            <tr>
              <td className="border-gray-400/50 border">
                <Input placeholder='type...' className="rounded-none border-none bg-amber-200/20!" name="action" label="" register={register} />
              </td>
              <td className="border-gray-400/50 border">
                <Input placeholder='type...' className="rounded-none border-none bg-amber-200/20!" name="line" label="" register={register} />
              </td>
              <td className="border-gray-400/50 border">
                <Input placeholder='type...' className="rounded-none border-none bg-amber-200/20!" name="quantity" label="" register={register} />
              </td>
              <td className="border-gray-400/50 border">
                <Input placeholder='type...' className="rounded-none border-none bg-amber-200/20!" name="itemNumber" label="" register={register} />
              </td>
              <td className="border-gray-400/50 border">
                <Input placeholder='type...' className="rounded-none border-none bg-amber-200/20!" name="description" label="" register={register} />
              </td>
              <td className="border-gray-400/50 border">
                <Input placeholder='type...' className="rounded-none border-none bg-amber-200/20!" name="unitPrice" label="" register={register} />
              </td>
              <td className="border-gray-400/50 border">
                <Input placeholder='type...' className="rounded-none border-none bg-amber-200/20!" name="discountPrice" label="" register={register} />
              </td>
              <td className="border-gray-400/50 border">
                <Input placeholder='type...' className="rounded-none border-none bg-amber-200/20!" name="totalPrice" label="" register={register} />
              </td>
              <td className="border-gray-400/50 border">
                <Input placeholder='type...' className="rounded-none border-none bg-amber-200/20!" type="date" name="requestedDate" label="" register={register} />
              </td>
              <td className="border-gray-400/50 border">
                <Input placeholder='type...' className="rounded-none border-none bg-amber-200/20!" name="status" label="" register={register} />
              </td>
              <td className="border-gray-400/50 border">
                <Input placeholder='type...' className="rounded-none border-none bg-amber-200/20!" name="pricingLevel" label="" register={register} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Show "Create" Button When Any Input Field is Modified */}
      {isDirty && (
        <button
          onClick={handleSubmit(onSubmit)}
          className="whitespace-nowrap w-min btn-primary"
        >
          Create Item
        </button>
      )}
    </div>
  )
}

export default Items

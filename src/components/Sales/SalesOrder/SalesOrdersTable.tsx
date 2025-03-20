'use client'
import Input from '@/components/Input'
import React from 'react'
import { useForm } from 'react-hook-form'

const salesOrders = [
  {
    account: '0000000001',
    customer: 'SE WI TOOL WORKS, INC.',
    salesOrder: '200186 - 1',
    poNumber: '4234234',
    quantity: 1.0,
    shipped: 0.0,
    itemNumber: '20190427-000-01',
    description: 'Thick-Wall Plastic Pipe Fittings for Water',
    requestedDate: '2/8/2024',
    promiseDate: '2/8/2024',
    status: 'Ready To Invoice'
  },
  {
    account: '0000000011',
    customer: 'NORTH CENTRAL SYSTEMS',
    salesOrder: '200213 - 1',
    poNumber: '8726354',
    quantity: 45.0,
    shipped: 0.0,
    itemNumber: '20220730-SYS',
    description: 'System Integration Services',
    requestedDate: '3/28/2024',
    promiseDate: '3/29/2024',
    status: 'Ready To Invoice'
  }
]

const SalesOrderTable = () => {
  const { register, formState, handleSubmit, reset } = useForm({
    defaultValues: {
      account: '', // Prepopulate with a default value
      customer: '', // Example customer
      salesOrder: '',
      poNumber: '',
      quantity: '',
      shipped: '',
      itemNumber: '',
      description: '',
      requestedDate: new Date().toISOString().split('T')[0], // Prepopulate with today's date
      promiseDate: '',
      status: 'Draft' // Default status
    }
  })

  // Check if any field is dirty
  const isDirty = Object.keys(formState.dirtyFields).length > 0

  const onSubmit = (data: any) => {
    console.log('New Sales Order:', data)
    reset() // Reset form after submission
  }

  return (
    <>
      <div className="table-base mt-8">
        <table className="w-full">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              {['Account', 'Customer', 'Sales Order', 'PO Number', 'Quantity', 'Shipped', 'Item Number', 'Description', 'Requested Date', 'Promise Date', 'Status'].map((header) => (
                <th key={header} className="table-header">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {salesOrders.map((order, index) => (
              <tr key={order.salesOrder} className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'} hover:bg-gray-200/70`}>
                <td className="px-4 py-2 border border-gray-300">{order.account}</td>
                <td className="px-4 py-2 border border-gray-300">{order.customer}</td>
                <td className="px-4 py-2 border border-gray-300">{order.salesOrder}</td>
                <td className="px-4 py-2 border border-gray-300">{order.poNumber}</td>
                <td className="px-4 py-2 border border-gray-300">{order.quantity.toFixed(2)}</td>
                <td className="px-4 py-2 border border-gray-300">{order.shipped.toFixed(2)}</td>
                <td className="px-4 py-2 border border-gray-300">{order.itemNumber}</td>
                <td className="px-4 py-2 border border-gray-300">{order.description}</td>
                <td className="px-4 py-2 border border-gray-300">{order.requestedDate}</td>
                <td className="px-4 py-2 border border-gray-300">{order.promiseDate}</td>
                <td className="px-4 py-2 border border-gray-300">{order.status}</td>
              </tr>
            ))}
            <tr>
              <td className="p-1 border-gray-400/50 border"><Input className="rounded-none border-none bg-amber-200/30!" placeholder="type ..." name="account" label="" register={register} /></td>
              <td className="p-1 border-gray-400/50 border"><Input className="rounded-none border-none bg-amber-200/30!" placeholder="type ..." name="customer" label="" register={register} /></td>
              <td className="p-1 border-gray-400/50 border"><Input className="rounded-none border-none bg-amber-200/30!" placeholder="type ..." name="salesOrder" label="" register={register} /></td>
              <td className="p-1 border-gray-400/50 border"><Input className="rounded-none border-none bg-amber-200/30!" placeholder="type ..." name="poNumber" label="" register={register} /></td>
              <td className="p-1 border-gray-400/50 border"><Input className="rounded-none border-none bg-amber-200/30!" placeholder="type ..." name="quantity" label="" register={register} /></td>
              <td className="p-1 border-gray-400/50 border"><Input className="rounded-none border-none bg-amber-200/30!" placeholder="type ..." name="shipped" label="" register={register} /></td>
              <td className="p-1 border-gray-400/50 border"><Input className="rounded-none border-none bg-amber-200/30!" placeholder="type ..." name="itemNumber" label="" register={register} /></td>
              <td className="p-1 border-gray-400/50 border"><Input className="rounded-none border-none bg-amber-200/30!" placeholder="type ..." name="description" label="" register={register} /></td>
              <td className="p-1 border-gray-400/50 border"><Input className="rounded-none border-none bg-amber-200/30!" type="date" name="requestedDate" label="" register={register} /></td>
              <td className="p-1 border-gray-400/50 border"><Input className="rounded-none border-none bg-amber-200/30!" type="date" name="promiseDate" label="" register={register} /></td>
              <td className="p-1 border-gray-400/50 border"><Input className="rounded-none border-none bg-amber-200/30!" placeholder="type ..." name="status" label="" register={register} /></td>
            </tr>
          </tbody>
        </table>

      </div>
      {/* "Create" Button - Visible Only When Any Field is Dirty */}
      {isDirty && (
        <button
          onClick={handleSubmit(onSubmit)}
          className="mt-4 btn-primary w-min whitespace-nowrap"
        >
          Create Sales Order
        </button>
      )}
    </>
  )
}

export default SalesOrderTable

'use client'
import { useState } from "react"
import FilterItem from "./FilterItem"
import Link from "next/link"
import SalesOrderTable from "./SalesOrdersTable"

const SalesOrder = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>('openOrder')

  // Define order types
  const orderTypes = [
    { label: "Open Order", qt: 3, value: "openOrder" },
    { label: "Pending Confirm", qt: 3, value: "pendingConfirm" },
    { label: "On Hold", qt: 4, value: "onHold" },
    { label: "Past Due", qt: 12, value: "pastDue" },
  ]

  return (
    <div className="bg-gray-100 grow flex flex-col w-full mt-4">
      <p className="text-3xl font-bold my-4">Sales Orders</p>
      <div className="w-full flex flex-wrap gap-8">
        {orderTypes.map((order) => (
          <FilterItem
            key={order.value}
            label={order.label}
            qt={order.qt}
            selected={selectedFilter === order.value}
            onClick={() => setSelectedFilter(order.value)}
          />
        ))}
        <Link
        href={`/sales/newSales`}
          className={`ml-auto bg-lime-300 whitespace-nowrap hover:bg-lime-200 py-2 px-6 text-lg rounded-full border cursor-pointer border-gray-400/60 flex gap-2`}
        >
          New Sales Order
        </Link>
      </div>

      <SalesOrderTable/>

    </div>
  )
}

export default SalesOrder

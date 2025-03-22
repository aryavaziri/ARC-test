'use client'
import { useState } from "react"
import FilterItem from "./FilterItem"
import SalesOrderTable, { SalesOrderProps } from "./SalesOrdersTable"
import { salesOrders } from "./salesOrders"

const SalesOrder = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>('')

  const orderTypes = [
    { label: "Open Order", value: "Ready To Invoice" },
    { label: "Pending Confirm", value: "Pending Confirm" },
    { label: "On Hold", value: "On Hold" },
    { label: "Past Due", value: "Past Due" },
  ]

  const filteredOrders: SalesOrderProps[] = selectedFilter ? salesOrders.filter(order => order.status === selectedFilter) : salesOrders

  return (
    <div className="grow flex flex-col w-full mt-4">
      <p className="text-3xl font-bold my-4">Sales Orders</p>
      <div className="w-full flex flex-wrap gap-8">
        {orderTypes.map((order) => (
          <FilterItem
            key={order.value}
            label={order.label}
            qt={salesOrders.filter(o => o.status === order.value).length}
            selected={selectedFilter === order.value}
            onClick={() => setSelectedFilter(order.value)}
          />
        ))}
      </div>

      <SalesOrderTable filteredOrders={filteredOrders} />
    </div>
  )
}

export default SalesOrder

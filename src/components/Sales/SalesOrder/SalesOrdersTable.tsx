'use client'
import React from 'react'
export interface SalesOrderProps {
  account: string;
  customer: string;
  salesOrder: string;
  poNumber: string;
  quantity: number;
  shipped: number;
  itemNumber: string;
  description: string;
  requestedDate: string;
  promiseDate: string;
  status: string;
}
export interface SalesOrderTableProps {

  filteredOrders: SalesOrderProps[]
}

const SalesOrderTable: React.FC<SalesOrderTableProps> = ({ filteredOrders }) => {
  return (
    <div className="border border-border rounded-2xl overflow-x-auto mt-8 whitespace-nowrap">
      <table className="my-table">
        <thead className="">
          <tr>
            {['Account', 'Customer', 'Sales Order', 'PO Number', 'Quantity', 'Shipped', 'Item Number', 'Description', 'Requested Date', 'Promise Date', 'Status'].map((header) => (
              <th key={header} className="">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order, index) => (
            <tr key={order.salesOrder} >
              <td className="">{order.account}</td>
              <td className="">{order.customer}</td>
              <td className="">{order.salesOrder}</td>
              <td className="">{order.poNumber}</td>
              <td className="">{order.quantity.toFixed(2)}</td>
              <td className="">{order.shipped.toFixed(2)}</td>
              <td className="">{order.itemNumber}</td>
              <td className="">{order.description}</td>
              <td className="">{order.requestedDate}</td>
              <td className="">{order.promiseDate}</td>
              <td className="">{order.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default SalesOrderTable

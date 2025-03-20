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
    <div className="border border-gray-300 rounded-2xl overflow-x-auto mt-8 whitespace-nowrap">
      <table className="w-full">
        <thead className="bg-gray-200 text-gray-700">
          <tr>
            {['Account', 'Customer', 'Sales Order', 'PO Number', 'Quantity', 'Shipped', 'Item Number', 'Description', 'Requested Date', 'Promise Date', 'Status'].map((header) => (
              <th key={header} className="px-4 py-2 border border-gray-300 text-left">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order, index) => (
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
        </tbody>
      </table>
    </div>
  )
}

export default SalesOrderTable

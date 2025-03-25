import React from 'react'
import { FaEdit } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";
import CustomModal from "../Modals/CustomModal2";
import AddEditCustomer from '@/components/Customer/AddEditCustomer'
import { useCustomerModel } from '@/store/hooks/customerHooks'
import { useState } from "react";

export default function FilteredCustomerTable() {
    const [showModal, setShowModal] = useState<boolean>(false)
    const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null)
    const { customers, deleteExistingItem } = useCustomerModel()
    const handleClose = () => { setShowModal(false); setSelectedCustomer(null) }
    const handleEdit = async (id: string) => { setShowModal(true); setSelectedCustomer(id) }
    const handleDelete = async (id: string) => { deleteExistingItem(id) }
    if (customers.length === 0) {
      return <p>No customers found.</p>;
    }
    return (
        <>
          <div className={`flex items-center`}>
            <p className={`text-2xl font-semibold mb-2 mr-auto`}>Customers</p>
            <div className={`btn btn-primary`} onClick={() => { setShowModal(true) }}>Add New Customer</div>
          </div>
          <div className="border border-border whitespace-nowrap rounded-2xl overflow-x-auto">
            <table className="my-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Company Name</th>
                  <th>Account Number</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id}>
                    <td>{customer.id}</td>
                    <td>{customer.companyName}</td>
                    <td>{customer.accountNumber || "-"}</td>
                    <td>
                      <div className="flex gap-2 items-center justify-center">
                        <button onClick={() => { handleEdit(customer.id) }} className={`btn-icon rounded-full hover:scale-[1.1] text-xl p-[6px] bg-emerald-600/75 hover:bg-emerald-400`}><FaEdit /></button>
                        <button onClick={() => { handleDelete(customer.id) }} className={`btn-icon rounded-full hover:scale-[1.1] text-xl p-[6px] bg-rose-400/75 hover:bg-rose-400`}><MdOutlineDelete /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <CustomModal
            isOpen={showModal}
            onClose={() => handleClose()}
            header={selectedCustomer ? `Edit Customer` : `Add New Customer`}
            className={`w-[500px]`}
            Component={() => <AddEditCustomer customerId={selectedCustomer} onClose={() => handleClose()} />}
          />
        </>
      );
}
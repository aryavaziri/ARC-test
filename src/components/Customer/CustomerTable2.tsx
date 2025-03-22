'use client';

import { FaEdit } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";
import { IoIosAddCircle } from "react-icons/io";
import { useCustomerModel } from '@/store/hooks/customerHooks';
import { useState, useEffect } from "react";
import Input from "../UI/Input3";
import { useForm } from "react-hook-form";
import { customerSchema, TCustomer } from "@/types/customer";
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from "zod";
import CustomModal from "../Modals/CustomModal2";

// Zod type inference
const customerCreateSchema = customerSchema.partial({ id: true });
type TCustomerCreate = z.infer<typeof customerCreateSchema>;

export default function CustomerTable() {
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const { customers, deleteExistingItem, addNewItem, updateExistingItem } = useCustomerModel();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<TCustomerCreate>({
    resolver: zodResolver(customerCreateSchema),
    defaultValues: {
      companyName: '',
      accountNumber: '',
    },
  });

  const handleDelete = async (id: string) => {
    await deleteExistingItem(id);
  };

  const handleEdit = (id: string) => {
    setSelectedCustomer(id);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setSelectedCustomer(null);
    setShowModal(false);
  };

  const onAddSubmit = async (data: TCustomerCreate) => {
    await addNewItem(data);
    reset(); // reset inline form after add
  };

  const selectedCustomerData = customers.find(c => c.id === selectedCustomer);

  if (customers.length === 0) {
    return <p>No customers found.</p>;
  }

  return (
    <>
      <div className="flex items-center">
        <p className="text-2xl font-semibold mb-2 mr-auto">Customers</p>
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
                    <button onClick={() => handleEdit(customer.id)} className="btn-icon rounded-full hover:scale-[1.1] text-xl p-[6px] bg-emerald-600/75 hover:bg-emerald-400">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(customer.id)} className="btn-icon rounded-full hover:scale-[1.1] text-xl p-[6px] bg-rose-400/75 hover:bg-rose-400">
                      <MdOutlineDelete />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {/* Inline Add New Customer Row */}
            <tr>
              <td></td>
              <td className={`p-0`} ><Input placeholder='type...' className={`px-4 h-16`} label="" register={register} error={errors.companyName} name="companyName" /></td>
              <td className={`p-0`} ><Input placeholder='type...' className={`px-4 h-16`} label="" register={register} error={errors.accountNumber} name="accountNumber" /></td>
              <td>
                <form onSubmit={handleSubmit(onAddSubmit)}>
                  <button type="submit" className="mx-auto btn btn-primary flex items-center gap-1" disabled={isSubmitting}>
                    Add <IoIosAddCircle size={24} />
                  </button>
                </form>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Modal for Edit */}
      <CustomModal
        isOpen={showModal}
        onClose={handleModalClose}
        header={selectedCustomer ? `Edit Customer` : ``}
        className="w-[500px]"
        Component={() =>
          selectedCustomerData ? (
            <EditCustomerForm
              customer={selectedCustomerData}
              onClose={handleModalClose}
              onSubmit={async (data) => {
                await updateExistingItem(data); // return value ignored
              }}

            />
          ) : null
        }
      />
    </>
  );
}

interface EditFormProps {
  customer: TCustomer;
  onClose: () => void;
  onSubmit: (data: TCustomer) => Promise<void>;
}

const EditCustomerForm: React.FC<EditFormProps> = ({ customer, onClose, onSubmit }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting,errors },
  } = useForm<TCustomer>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      id: customer.id,
      companyName: customer.companyName,
      accountNumber: customer.accountNumber || '',
    },
  });

  useEffect(() => {
    reset({
      id: customer.id,
      companyName: customer.companyName,
      accountNumber: customer.accountNumber || '',
    });
  }, [customer, reset]);

  const submit = async (data: TCustomer) => {
    await onSubmit(data);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="p-8 flex flex-col gap-2">
      <Input register={register} name="id" disabled />
      <Input register={register} error={errors.companyName} name="companyName" />
      <Input register={register} error={errors.accountNumber} name="accountNumber" />

      <button className="btn btn-primary mt-4 w-full" type="submit" disabled={isSubmitting}>
        Update Customer
      </button>
    </form>
  );
};

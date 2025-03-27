import { useCustomerModel } from '@/store/hooks/customerHooks';
import React, { useEffect } from 'react';
import Input from '../UI/Input';
import { useForm } from 'react-hook-form';
import { customerSchema, TCustomer } from '@/types/customer';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

interface Props {
  customerId: string | null;
  onClose?: () => void;
}

const AddEditCustomer: React.FC<Props> = ({ customerId, onClose }) => {
  const { customers, addNewItem, updateExistingItem } = useCustomerModel();
  const customer = customers.find((c) => c.id === customerId);
  const schema = !!customer ? customerSchema : customerSchema.partial({ id: true })

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      id: undefined,
      companyName: '',
      accountNumber: '',
    },
  });

  useEffect(() => {
    if (customer) {
      reset({
        id: customer.id,
        companyName: customer.companyName,
        accountNumber: customer.accountNumber || '',
      });
    } else {
      reset();
    }
  }, [customer, reset]);

  const onSubmit = async (data: z.infer<typeof schema>) => {
    if (customerId) {
      // Edit mode
      await updateExistingItem({ ...data, id: customerId });
    } else {
      // Add mode
      const { id, ...newData } = data;
      await addNewItem(newData);
    }
    onClose && onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='p-8 flex flex-col gap-2'>
      {customer && <Input style={3} register={register} name="id" disabled />}
      <Input style={3} register={register} error={errors.companyName} name="companyName" required />
      <Input style={3} register={register} error={errors.accountNumber} name="accountNumber" />

      <button className={`btn btn-primary mt-4 w-full`} type="submit" disabled={isSubmitting}>
        {customerId ? 'Update Customer' : 'Add Customer'}
      </button>
    </form>
  );
};

export default AddEditCustomer;

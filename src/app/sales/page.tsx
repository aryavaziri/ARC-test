'use client'
import React from 'react'
import Header from '../../components/Sales/Header'
import Input from '@/components/Input'
import { useForm } from 'react-hook-form';
import Tabs from './Tabs';
import Items from './Items';
import Checkout from './Checkout';

const Page = () => {
    const { register } = useForm();
    return (
        <div className="bg-gray-100 grow flex flex-col w-full px-12 pb-8">
            <Header />
            <div className={`flex flex-col gap-8`}>
                <div className='shadow border border-gray-300 p-6 rounded-3xl bg-white flex flex-col gap-5'>
                    <Input label='New Sales Order' name='Search_Sales_Order' register={register} className={`px-4`} />
                    <hr className={`mt-2`} />
                    <p className={`text-2xl`}>Customer Info</p>
                    <div className="flex gap-8 mb-2 ">
                        <Input label='Customer' name='Customer' register={register} className={`px-4`} />
                        <Input label='Contact' name='Customer' register={register} className={`px-4`} />
                    </div>
                    <hr className={`mt-2`} />
                    <p className={`text-2xl`}>Shipment</p>
                    <div className="flex gap-8 mb-2 ">
                        <Input label='Ship to' name='Customer' register={register} className={`px-4`} />
                        <Input label='Contact' name='Customer' register={register} className={`px-4`} />
                    </div>
                    <hr className={`mt-2`} />
                    <p className={`text-2xl`}>Order Info</p>
                    <div className="flex gap-8 mb-2">
                        <Input label='Order Date' name='Customer' type='date' register={register} className={`px-4`} />
                        <Input label='P.O Date' name='Customer' type='date' register={register} className={`px-4`} />
                    </div>
                    <div className="flex gap-8 mb-2">
                        <Input label='Company Code' name='Customer' register={register} className={`px-4`} />
                        <Input label='Entered By' name='Customer' register={register} className={`px-4`} />
                    </div>
                    <div className="flex gap-8 mb-2">
                        <Input label='Purchase Order' name='Customer' register={register} className={`px-4`} />
                        <Input label='Delivery Method' name='Customer' register={register} className={`px-4`} />
                    </div>
                    <div className="flex gap-8 mb-2">
                        <Input label='Sales Rep' name='Customer' register={register} className={`px-4`} />
                        <Input label='Payment Terms' name='Customer' register={register} className={`px-4`} />
                    </div>
                </div>
                <div className={`flex flex-col gap-8`}>
                    <Tabs />
                    <Items />
                    {/* <p>Table</p> */}
                </div>
                <div>
                    <Checkout />
                </div>
            </div>
        </div>
    )
}

export default Page
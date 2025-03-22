import Input from '@/components/UI/Input'
import React from 'react'
import { useForm } from 'react-hook-form';

const Procurement = () => {
    const { register } = useForm();
    return (
        <div className="con">
            <p className="text-4xl mb-4 font-semibold">Procurement</p>
            <div className="flex gap-8 mb-2 ">
                <Input label='Order type' name='Order type' register={register} className={`px-4`} />
                <Input label='Confirmed Date' type='date' name='Confirmed Date' register={register} className={`px-4`} />
            </div>
        </div>
    )
}

export default Procurement
'use client'
import React from 'react'
import Input from '../UI/Input'
import { useForm } from 'react-hook-form';

const Dashboard = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    return (
        <div className={`w-full `}>
            <div className="flex justify-between gap-4 w-full mb-8">
                <div className={`grow text-2xl block whitespace-nowrap mb-6 font-semibold`}>Dashboard</div>
                <div><Input label='Internal Notes' name='Internal Notes' register={register} className={`px-4 min-w-80 max-w-96`} /></div>
            </div>
            <div className="con pb-24">
                <div className={`text-2xl font-semibold`}>Title 1</div>
               
            </div>
        </div>
    )
}

export default Dashboard
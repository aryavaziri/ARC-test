'use client'
import React from 'react'
import Input from '../Input'
import { useForm } from 'react-hook-form';
import Left from './Left';
import Image from 'next/image';
import Right from './Right';

const Dashboard = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    return (
        <div className={`w-full `}>
            <div className="flex justify-between gap-4 w-full mb-8">
                <div className={`grow text-2xl block whitespace-nowrap mb-6 font-semibold`}>Dashboard</div>
                <div><Input label='Internal Notes' name='Internal Notes' register={register} className={`px-4 min-w-80 max-w-96`} /></div>
            </div>
            <div className="flex justify-between gap-4 w-full items-center">
                <Left />
                <div className={`mx-32`}>
                    <Image
                        className="object-contain"
                        width={320}
                        height={20}
                        alt="LOGO"
                        src={`/next.svg`}
                    />
                </div>
                <Right />
            </div>
        </div>
    )
}

export default Dashboard
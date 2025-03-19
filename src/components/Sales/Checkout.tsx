import Input from '@/components/Input'
import React from 'react'
import { useForm } from 'react-hook-form';

const Checkout = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    return (
        <div className="p-8 bg-white border-gray-400 rounded-2xl">
            <p className={`text-2xl mb-6`}>Check out</p>
            <div className={`flex w-full gap-8`}>
                <div className={`basis-1 grow flex flex-col gap-4`}>
                    {/* <div className={`flex gap-4 w-full min-h-32`}>
                        <div className={`rounded-xl border border-gray-300 p-4 grow h-full`}>Shipping Info</div>
                        <div className={`rounded-xl border border-gray-300 p-4 grow h-full`}>Internal Notes</div>
                    </div> */}
                    <div className="flex gap-4">
                        <Input label='Shipping Info' name='Shipping Info' as='textarea' rows={4} register={register} className={`px-4`} />
                        <Input label='Internal Notes' name='Internal Notes' as='textarea' rows={4} register={register} className={`px-4`} />
                    </div>                    <hr className={`mt-2`} />
                    <div className={``}>
                        <p className={`text-2xl mb-6`}>Print</p>
                        <div className={`flex gap-8 text-lg w-min`}>
                            <Input type={`checkbox`} register={register} name='Hide Price' />
                            <Input type={`checkbox`} register={register} name='Delivery Ticket' />
                            <Input type={`checkbox`} register={register} name='Sub-Contract Tag' />
                        </div>
                    </div>
                </div>
                <ul className={`basis-1 grow border border-gray-300 divide-gray-200 rounded-2xl divide-y p-4 text-lg gap-4`}>
                    <li className={`flex justify-between w-full py-4`}>
                        <p>Sub Total</p>
                        <p>$0</p>
                    </li>
                    <li className={`flex justify-between w-full py-4`}>
                        <p>Additional</p>
                        <p>$0</p>
                    </li>
                    <li className={`flex justify-between w-full py-4`}>
                        <p>Discount</p>
                        <p>$0</p>
                    </li>
                    <li className={`flex justify-between w-full py-4`}>
                        <p>Tax</p>
                        <p>$0</p>
                    </li>
                    <li className={`flex justify-between w-full py-4`}>
                        <p>Total</p>
                        <p>$0</p>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default Checkout
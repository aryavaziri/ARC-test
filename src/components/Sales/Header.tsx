import React from 'react'
import { IoMdRefresh } from 'react-icons/io'
import { IoChevronBackSharp } from 'react-icons/io5'

const Header = () => {
    return (
        <div>
            <ul className={`flex gap-4 my-8 items-center`}>
                <li>
                    <div className={`border border-dark/40 p-1 rounded-lg hover:bg-gray-300`}>
                        <IoChevronBackSharp />
                    </div>
                </li>
                <li className={`text-2xl`}>
                    <p className={`font-bold`}>New Sales Order</p>
                </li>
                <li className={`rounded-full border p-2 hover:bg-gray-300 cursor-default ml-auto`}>
                    <IoMdRefresh />
                </li>
                <li className={`rounded-full border p-2 px-4 hover:bg-gray-300 cursor-default`}>
                    Procure
                </li>
                <li className={`rounded-full border p-2 px-4 hover:bg-gray-300 cursor-default`}>
                    Shipping
                </li>
                <li className={`rounded-full border p-2 px-4 hover:bg-gray-300 cursor-default`}>
                    Invoice
                </li>
                <li className={`rounded-full border p-2 px-4 hover:bg-gray-300 cursor-default`}>
                    Confirm
                </li>
                <li className={`rounded-full border p-2 px-4 hover:bg-gray-300 cursor-default`}>
                    Print
                </li>
                <li className={`rounded-full border p-2 px-4 bg-sky-200 font-semibold cursor-default`}>
                    save Order
                </li>
            </ul>
        </div>
    )
}

export default Header
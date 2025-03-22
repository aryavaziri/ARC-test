import Link from 'next/link'
import React from 'react'
import { IoMdRefresh } from 'react-icons/io'
import { IoChevronBackSharp } from 'react-icons/io5'

const Header = () => {
    return (
        <div>
            <ul className={`flex gap-4 my-8 items-center`}>
                <li className={`border p-1 cursor-pointer text-2xl rounded-lg hover:bg-gray-300`}>
                    <Link href={'/sales/'}  >
                        <IoChevronBackSharp />
                    </Link>
                </li>
                <li className={`text-2xl`}><p className={`font-bold`}>New Sales Order</p></li>
                <li className={`rounded-full border p-2 hover:bg-gray-300 cursor-default ml-auto`}><IoMdRefresh /></li>
                <li className={`btn btn-secondary`}>Procure</li>
                <li className={`btn btn-secondary`}>Shipping</li>
                <li className={`btn btn-secondary`}>Invoice</li>
                <li className={`btn btn-secondary`}>Confirm</li>
                <li className={`btn btn-secondary`}>Print</li>
                <li className={`btn btn-primary`}>save Order</li>
            </ul>
        </div>
    )
}

export default Header
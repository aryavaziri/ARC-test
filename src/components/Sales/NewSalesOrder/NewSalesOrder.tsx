import React from 'react'
import Header from '@/components/Sales/NewSalesOrder/Header'
import Body from '@/components/Sales/NewSalesOrder/Body';

const NewSalesOrder = () => {
    return (
        <div className="bg-gray-100 grow flex flex-col w-full px-12 pb-8">
            <Header />
            <Body />
        </div>
    )
}

export default NewSalesOrder
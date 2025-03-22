import React from 'react'
import Header from '@/components/Sales/NewSalesOrder/Header'
import Body from '@/components/Sales/NewSalesOrder/Body';

const NewSalesOrder = () => {
    return (
        <div className="grow flex flex-col w-full pb-8 px-12">
            <Header />
            <Body />
        </div>
    )
}

export default NewSalesOrder
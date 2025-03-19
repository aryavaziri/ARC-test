'use client'
import React from 'react'
import Tabs from './Tabs';
import Items from './Tabs/Items';
import Checkout from './Checkout';
import Info from './Info';
import Selector from './Selector';
const Body = () => {
    return (
        <div className={`flex flex-col gap-8`}>
            <Info />
            <Selector />
            <Checkout />
        </div>
    )
}

export default Body
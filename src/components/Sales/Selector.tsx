'use client'
import React from 'react'
import Tabs from './Tabs'
import Items from './Tabs/Items'
import { useState } from "react";
import Procurement from './Tabs/Procurement';

const Selector = () => {
      const [activeTab, setActiveTab] = useState("items");
    
    return (
        <>
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
      { activeTab === "items" && <Items /> }
      { activeTab === "procurement" && <Procurement/> }
        </>
    )
}

export default Selector
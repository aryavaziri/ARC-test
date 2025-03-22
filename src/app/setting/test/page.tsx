'use client'
import React from 'react'
import axios from 'axios'

const Page = () => {

  const handleGet = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/sample')
      console.log('GET response:', response.data)
    } catch (error) {
      console.error('GET error:', error)
    }
  }


  return (
    <div className="p-12">
      <div className="mt-8 con">
        <p className="text-2xl font-semibold mb-2">API TEST</p>
        <div className="flex gap-8">
          <button className="btn btn-primary w-min" onClick={handleGet}>GET API</button>
          {/* <HandleCreateCustomer /> */}
        </div>
      </div>
    </div>
  )
}

export default Page

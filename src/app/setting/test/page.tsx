'use client'
import React, { useState } from 'react'
import axios from 'axios'

const Page = () => {
  const [data, setData] = useState([])

  const handleGet = async () => {
    try {
      debugger;
      const response = await axios.get('https://jsonplaceholder.typicode.com/posts')
      setData(response.data.slice(0, 10)) // Fetch only the first 10 records
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
        </div>

        {/* Table to display data */}
        {data.length > 0 && (
          <table className="mt-4 w-full border-collapse border border-gray-400">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-400 px-4 py-2">ID</th>
                <th className="border border-gray-400 px-4 py-2">Title</th>
                <th className="border border-gray-400 px-4 py-2">Body</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item:any) => (
                <tr key={item.id} className="bg-white">
                  <td className="border border-gray-400 px-4 py-2">{item.id}</td>
                  <td className="border border-gray-400 px-4 py-2">{item.title}</td>
                  <td className="border border-gray-400 px-4 py-2">{item.body}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default Page

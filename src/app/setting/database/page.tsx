'use client'
import { dropDatabase, syncTables } from '@/actions/db/sync'
import React from 'react'
import { useMyContext } from '../../Provider';

const Page = () => {
  const { } = useMyContext();

  return (
    <div className="bg-bg grow flex flex-col w-full px-12 pb-8">
      <div className="mt-8 con">
        <p className="text-2xl font-semibold mb-2">Database Management</p>
        <div className="flex flex-col gap-8">
          <button className={`btn btn-primary w-min`} onClick={syncTables} >SYNC DB</button>
          {/* <button className={`btn btn-primary w-min`} onClick={createUser} >Create User</button> */}
          {/* <button className={`btn btn-primary w-min`} onClick={signin} >SIGN IN</button> */}
        </div>
      </div>


    </div>
  )
}

export default Page
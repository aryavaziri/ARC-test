'use client'
import React from 'react'
import { useMyContext } from '../../Provider';
import ThemeSelector from '@/components/UI/ThemeSelector';

const Page = () => {
  const { theme, setTheme } = useMyContext();

  return (
    <div className="bg-bg grow flex flex-col w-full px-12 pb-8">
      <div className="mt-12 con">
        <p className="text-2xl font-semibold mb-2">Theme Selector</p>
        <div className="flex flex-col gap-8">
          <ThemeSelector />
          <div className="bg-[var(--bg-color)] text-[var(--text-color)] p-4 rounded">
            This box respects the current theme: <strong>{theme}</strong>
          </div>
          <div className="flex gap-8">
            <button className={`btn btn-primary`} >Primary</button>
            <button className={`btn btn-secondary`} >Secondary</button>
            <button className={`btn`} >Action</button>
          </div>
        </div>
      </div>


    </div>
  )
}

export default Page
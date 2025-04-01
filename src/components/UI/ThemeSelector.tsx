'use client'
import { themes, Theme } from '@/app/Provider'; // Adjust path as needed
import { useMyContext } from '@/app/Provider';
import { useEffect, useState } from 'react';

const ThemeSelector = () => {
  const { theme, setTheme } = useMyContext();
  // const [hasMounted, setHasMounted] = useState(false);
  // useEffect(() => {
  //   setHasMounted(true);
  // }, []);
  // if (!hasMounted) return null;

  return (
    <div className="flex flex-wrap gap-4 items-center">
      {themes.map((t,i) => (
        <button
          key={i}
          onClick={() => setTheme(t)}
          className={`btn 
            ${theme === t 
              ? 'btn-primary' 
              : ''}
          `}
        >
          {t.charAt(0).toUpperCase() + t.slice(1)}
        </button>
      ))}
    </div>
  );
};

export default ThemeSelector;

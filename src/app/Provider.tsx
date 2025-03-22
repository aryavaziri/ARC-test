"use client";

import { createContext, useState, Dispatch, SetStateAction, useContext, useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import { isMobile as isM } from "react-device-detect";
import ReduxProvider from "./ReduxProvider";

export const themes = ['light', 'dark', 'custom1', 'custom2', 'custom3'] as const;

export type Theme = typeof themes[number];

interface ContextProps {
  isAuth: boolean;
  setIsAuth: Dispatch<SetStateAction<boolean>>;
  quoteModalOpen: boolean;
  setQuoteModalOpen: Dispatch<SetStateAction<boolean>>;
  isAdmin: boolean;
  setIsAdmin: Dispatch<SetStateAction<boolean>>;
  isSuperUser: boolean;
  setIsSuperUser: Dispatch<SetStateAction<boolean>>;
  isMobile: boolean;
  navTab: string;
  setNavTab: Dispatch<SetStateAction<string>>;
  theme: Theme;
  setTheme: Dispatch<SetStateAction<Theme>>;
}


export const Context = createContext<ContextProps>({} as ContextProps);

export const useMyContext = (): ContextProps => {
  const context = useContext(Context);
  return context;
};

export default function Provider({ children }: React.PropsWithChildren) {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [isSuperUser, setIsSuperUser] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [theme, setTheme] = useState<Theme>('light');
  const [quoteModalOpen, setQuoteModalOpen] = useState<boolean>(false);
  const [navTab, setNavTab] = useState<string>("");

  useEffect(() => {
    setIsMobile(isM);
  }, [isM])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = window.localStorage.getItem('theme');
      if (savedTheme && themes.includes(savedTheme as Theme)) {
        setTheme(savedTheme as Theme);
      } else {
        setTheme('light'); // fallback or default
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('theme', theme)
    }
  }, [theme])

  const myContext = {
    isAuth,
    setIsAuth,
    navTab,
    setNavTab,
    isMobile,
    isSuperUser,
    setIsSuperUser,
    isAdmin,
    setIsAdmin,
    quoteModalOpen,
    setQuoteModalOpen,
    theme,
    setTheme
  };

  return (
    <SessionProvider>
      <ReduxProvider >
        <Context.Provider value={myContext} >
          <main data-theme={myContext.theme} className="min-h-screen flex flex-col text-text bg-bg border-border">
            {children}
          </main>
        </Context.Provider>
      </ReduxProvider>
    </SessionProvider>
  );
}

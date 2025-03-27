"use client";

import { createContext, useState, Dispatch, SetStateAction, useContext, useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import { isMobile as isM } from "react-device-detect";
import ReduxProvider from "./ReduxProvider";
// import { FieldType, RecordType } from "@/types/dynamicField";

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
  // sampleData: RecordType;
  // setSampleData: Dispatch<SetStateAction<RecordType>>;
  // sampleData2: FieldType[];
  // setSampleData2: Dispatch<SetStateAction<FieldType[]>>;
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
  // const [sampleData, setSampleData] = useState<RecordType>(
  //   {
  //     id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  //     recordName: 'User Info',
  //     fields: [
  //       {
  //         id: 'f1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1',
  //         name: 'fullName',
  //         label: 'Full Name',
  //         type: 'text',
  //         fieldId: 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1',
  //         content: {
  //           id: 'x1x1x1x1-x1x1-x1x1-x1x1-x1x1x1x1x1x1',
  //           label: 'Full Name',
  //           value: 'John Doe',
  //         },
  //         required: true,
  //       },
  //       {
  //         id: 'f2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2',
  //         name: 'age',
  //         label: 'Age',
  //         type: 'number',
  //         fieldId: 'd2d2d2d2-d2d2-d2d2-d2d2-d2d2d2d2d2d2',
  //         content: {
  //           id: 'x2x2x2x2-x2x2-x2x2-x2x2-x2x2x2x2x2x2',
  //           label: 'Age',
  //           value: 30,
  //         },
  //       },
  //       {
  //         id: 'f3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3',
  //         name: 'isMarried',
  //         label: 'Married',
  //         type: 'checkbox',
  //         fieldId: 'e3e3e3e3-e3e3-e3e3-e3e3-e3e3e3e3e3e3',
  //         content: {
  //           id: 'x3x3x3x3-x3x3-x3x3-x3x3-x3x3x3x3x3x3',
  //           label: 'Married',
  //           value: false,
  //         },
  //       },
  //       {
  //         id: 'f4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4',
  //         name: 'dob',
  //         label: 'Date of Birth',
  //         type: 'date',
  //         fieldId: 'f4f4f4f4-f4f4-f4f4-f4f4-f4f4f4f4f4f4',
  //         content: {
  //           id: 'x4x4x4x4-x4x4-x4x4-x4x4-x4x4x4x4x4x4',
  //           label: 'Date of Birth',
  //           value: new Date('1990-01-01'),
  //         },
  //       },
  //     ],
  //   }
  // );
  // const [sampleData2, setSampleData2] = useState<editDynamicField[]>([]);
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
    setTheme,
    // sampleData, 
    // setSampleData,
    // sampleData2, 
    // setSampleData2
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

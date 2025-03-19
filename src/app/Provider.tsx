"use client";

import { createContext, useState, Dispatch, SetStateAction, useContext, useEffect} from "react";
// import { SessionProvider } from "next-auth/react";
import { isMobile as isM } from "react-device-detect";

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
  const [quoteModalOpen, setQuoteModalOpen] = useState<boolean>(false);
  const [navTab, setNavTab] = useState<string>("");

  useEffect(() => {
    setIsMobile(isM);
  }, [isM])

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
  };

  return (
    // <ReduxProvider>
    // <SessionProvider>
    // </SessionProvider>
    <Context.Provider value={myContext}>{children}</Context.Provider>
    // </ReduxProvider>
  );
}

"use client";
import { editUser, getUserById, logout } from "@/store/slice/userSlice";
import { TUser } from "@/types/user";
import { useCallback, useEffect } from "react";
import { useAppDispatchWithSelector } from "./reduxHooks";
import { useMyContext } from "@/app/Provider";
import { useSession, signOut } from "next-auth/react";
import { RootState } from "../store";
// import { editUser } from "../slice/adminSlice";

export const useAuth = () => {
  const { data: session, status } = useSession();
  const { dispatch, useAppSelector } = useAppDispatchWithSelector();
  const { isAuth, setIsAuth, setIsAdmin, setIsSuperUser, isSuperUser, isAdmin } = useMyContext();
  const { error, loading, userData } = useAppSelector((state: RootState) => state.user);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id && !userData?.id) {
      setIsAuth(true);
      console.log(session)
      if (session.user.isAdmin) {
        setIsAdmin(true);
      }
      // if (session.user.isSuperUser) {
      //   setIsSuperUser(true);
      // }
      dispatch(getUserById(session.user.id));
    }
  }, [status, session?.user?.id, userData?.id]);

  const handleLogout = useCallback(() => {
    dispatch(logout());
    setIsAdmin(false);
    setIsSuperUser(false);
    setIsAuth(false);
    signOut();
  }, [logout]);

  const update = useCallback(
    async (user: Partial<TUser> & { id: string }) => {
      await dispatch(editUser(user));
      await dispatch(getUserById(user.id));
    },
    [editUser]
  );

  return { session, error, loading, userData, isAuth, logout: handleLogout, isSuperUser, isAdmin, update };
};

"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useMyContext } from "@/app/Provider";
import NavItem from "./NavItem";
import { FaHome, FaShoppingCart, FaTools } from "react-icons/fa";
import { useAuth } from "@/store/hooks/authHooks";
import { logout } from "@/store/slice/userSlice";
import { signOut } from "next-auth/react";
import { IoClose } from "react-icons/io5";
import { MdMenu } from "react-icons/md";
import { syncTables } from "@/actions/db/sync";

const Nav = () => {
  const { userData } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { isAuth } = useMyContext();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null); // 🔹 Create ref for dropdown

  const handleLogOut = async () => {
    await signOut({ redirectTo: `/login` });
    logout();
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <div className={`${pathname !== "/login" ? `static top-0 left-0 ` : `hidden`} 
        w-full flex items-center justify-between px-12 z-[400] bg-linear-80/hsl from-secondary/10 via-primary/20 to-secondary/20 bg-primary/20 backdrop-blur-[2px] transition-all duration-300 gap-20`}>

      <Link href={`/`} className="h-16 w-24 relative flex items-center">
        <Image className="object-contain" width={200} height={20} alt="LOGO" src={`/next.svg`} />
      </Link>

      <ul className={`flex grow h-20`}>
        <NavItem Icon={FaHome} label="Home" directUrl="/" />
        <NavItem Icon={FaShoppingCart} label="Sales" menuItems={[{ label: "Dynamic form", url: "/dynamic" }, { label: "Customers", url: "/customers" }, { label: "Sales Orders", url: "/sales" }, { label: "New Sales Order", url: "/sales/newSales" }]} />
        <NavItem Icon={FaTools} label="Settings" menuItems={[{ label: "Database", url: "/setting/database" }, { label: "Theme", url: "/setting/theme" }, { label: "API Test", url: "/setting/test" }]} />
      </ul>
      <button className={`btn btn-primary w-min`} onClick={async () => await syncTables()} >SYNC DB</button>
      {isAuth ? (
        <div className="relative" ref={dropdownRef}> {/* 🔹 Wrap dropdown in ref */}
          {/* <button className="btn" onClick={() => setDropdownOpen(prev => !prev)}>User</button> */}
          <button
            className="btn-icon border-primary font-semibold bg-primary/50 hover:bg-primary hover:text-light"
            onClick={() => setDropdownOpen(prev => !prev)}>
            {dropdownOpen ? <IoClose /> : <MdMenu />}
          </button>
          {dropdownOpen && (
            <ul className="absolute right-0 mt-2 w-48 bg-bg backdrop-blur-xl border shadow-dark rounded-md overflow-hidden shadow">
              <li className="bg-primary text-bg font-xl cursor-default rounded-none">
                <p className="px-4 py-2 block w-full h-full font-semibold">
                  {`${userData?.firstName} ${userData?.lastName}`}
                </p>
              </li>
              <li className="hover:bg-primary/30">
                <Link className="px-4 py-2 block w-full h-full" onClick={() => setDropdownOpen(false)} href="/dashboard">
                  Dashboard
                </Link>
              </li>
              <li className="hover:bg-primary/30">
                <Link className="px-4 py-2 block w-full h-full" onClick={() => setDropdownOpen(false)} href="/login/profile/edit">
                  Edit Profile
                </Link>
              </li>
              <li className="hover:bg-primary/30">
                <Link className="px-4 py-2 block w-full h-full" onClick={() => setDropdownOpen(false)} href="/login/profile/setPassword">
                  Change Password
                </Link>
              </li>
              <li className="hover:bg-primary/30 px-4 py-2 cursor-pointer" onClick={handleLogOut}>
                Logout
              </li>
            </ul>
          )}
        </div>
      ) : (
        <Link className="btn btn-primary" href={`/login`}>Sign In</Link>
      )}
    </div>
  );
};

export default Nav;

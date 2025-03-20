"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useMyContext } from "@/app/Provider";
import NavItem from "./NavItem";
import { FaHome, FaShoppingCart, FaTools } from "react-icons/fa";

export const links = [
  ["/", "Home"],
  ["/about", "Sales"],
  ["/contact", "Purchasing"],
  ["/contact", "Manufacturing"],
  ["/contact", "Items"],
  ["/contact", "MRP"],
  ["/contact", "Employees"],
  ["/contact", "Quality"],
  ["/contact", "PLM"],
  ["/contact", "Projects"],
  ["/contact", "Receivables"],
  ["/contact", "Payables"],
  ["/contact", "PM"],
  ["/contact", "Setting"],
];

const Nav = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [signIn, setSignIn] = useState(false);
  const { isAuth } = useMyContext()
  const pathname = usePathname();

  const handleLogOut = async () => {
  };

  return (
    <>
      <div className={`${pathname !== '/dashboard' ? `static top-0 left-0 ` : ``} w-full flex items-center justify-between px-12 z-[400] bg-white/40 backdrop-blur-[2px] transition-all duration-300 gap-20`}>
        <Link href={`/`} className="h-16 w-24 relative flex items-center">
          <Image
            className="object-contain"
            width={200}
            height={20}
            alt="LOGO"
            src={`/next.svg`}
          />
        </Link>
        <ul className={`flex grow h-20`}>
            <NavItem Icon={FaHome} label="Home" directUrl="/" />
            <NavItem
              Icon={FaShoppingCart}
              label="Sales"
              menuItems={[
                { label: "Sales Orders", url: "/sales" },
                { label: "New Sales Order", url: "/sales/newSales" },
              ]}
            />
            <NavItem
              Icon={FaTools}
              label="Settings"
              menuItems={[
                { label: "Profile", url: "/profile" },
              ]}
            />
        </ul>
        {isAuth ? (
          <div className="relative text-dark">
            <button
              className="bg-gray-400 rounded px-4 py-1 cursor-pointer hover:bg-gray-200/30 hover:border-dark border-dark/5 border font-semibold"
              onClick={() => setDropdownOpen(prev => !prev)}>
              {"User"}
            </button>
            {dropdownOpen && (
              <ul className="absolute right-0 mt-2 w-48 bg-gray-200 border shadow-dark rounded-md shadow">
                <li className="hover:bg-gray-300">
                  <Link className="px-4 py-2 block w-full h-full" onClick={() => setDropdownOpen(false)} href="/dashboard">
                    Dashboard
                  </Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-300 cursor-pointer" onClick={handleLogOut}>
                  Logout
                </li>
              </ul>
            )}
          </div>
        ) : (
          <div onClick={() => setSignIn(true)} className="cursor-pointer primary-btn flex items-center font-bold text-xl border p-2 ">Sign In</div>
        )}
      </div>

    </>

  );
};

export default Nav;

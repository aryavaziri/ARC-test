"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { IconType } from "react-icons";
import { FaAngleDown } from "react-icons/fa";
import { usePathname } from "next/navigation"; // Import usePathname

interface MenuItem {
  label: string;
  url: string;
}

interface NavItemProps {
  Icon: IconType;
  label: string;
  menuItems?: MenuItem[];
  directUrl?: string;
}

const NavItem: React.FC<NavItemProps> = ({ Icon, label, menuItems = [], directUrl }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname(); // Get current route

  // Close dropdown when pathname changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClick = () => {
    if (directUrl) return;
    setIsOpen(!isOpen);
  };

  // ✅ Check if the link is active
  const isActive =
    pathname === directUrl ||
    menuItems.some((item) => pathname.startsWith(item.url)); // Match dropdown items too

  return (
    <div ref={dropdownRef} className="relative h-full cursor-pointer">
      {directUrl ? (
        <Link
          href={directUrl}
          className={`flex flex-col justify-between h-full items-center p-3 text-gray-500 ${
            isActive ? "bg-gray-400 text-white" : "hover:bg-gray-200"
          }`}
        >
          <Icon className="text-3xl" />
          <span className="text-sm">{label}</span>
        </Link>
      ) : (
        <button
          onClick={handleClick}
          className={`flex flex-col h-full cursor-pointer justify-between items-center p-3 gap-1 text-gray-500 ${
            isActive ? "bg-gray-400 text-white" : "hover:bg-gray-200"
          }`}
        >
          <div className="flex items-center gap-1">
            <Icon className="text-3xl" />
          </div>
          <span className="text-sm flex items-center gap-1">
            {label}
            {menuItems.length > 0 && <FaAngleDown />}
          </span>
        </button>
      )}

      {/* Dropdown Menu */}
      {isOpen && menuItems.length > 0 && (
        <div className="absolute left-0 mt-[1px] w-48 bg-white border border-gray-400 shadow-xs cursor-pointer rounded-xs text-sm">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.url}
              className={`block px-4 py-2 hover:bg-gray-100 ${
                pathname.startsWith(item.url) ? "bg-gray-400 text-white" : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default NavItem;

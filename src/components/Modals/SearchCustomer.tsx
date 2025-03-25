"use client";
import React, { useState } from "react";
import { IoChevronBackSharp } from "react-icons/io5";
import { IoMdRefresh } from "react-icons/io";
import Input2 from "@/components/UI/Input2";
import { useForm } from "react-hook-form";
import CustomerTable from "../Customer/CustomerTable";

const SearchCustomer = () => {
  const { register } = useForm();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTypedQuery, setTypedQuery] = useState("");
  const [isOpenAddNew, setIsOpenAddNew] = useState<boolean>(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query); // Update state (optional if only triggering onSearch)
  };



  const toggleIsOpenAddNew = () => {
    setIsOpenAddNew((prev) => !prev);
  }

  return (
    <div>
      <ul className="flex gap-4 my-8 items-center pr-4 pl-4">
        <div className="flex items-center gap-2">
          <Input2
            label="Search"
            name="Searchs"
            register={register}
            className="w-full min-w-[250px] relative right-[60px]"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setTypedQuery(e.target.value)
            }
          />
          <button
            className="btn btn-secondary"
            onClick={() => handleSearch(searchTypedQuery)} // Calls onSearch in CustomerTable
          >
            Search
          </button>
        </div>
        <li className="rounded-full border p-2 hover:bg-gray-300 cursor-default ml-auto">
          <IoMdRefresh />
        </li>
        <li className="btn btn-secondary" onClick={toggleIsOpenAddNew}>Add New</li>
        <li className="btn btn-primary">Select</li>
      </ul>
      <CustomerTable searchQuery={searchQuery} isOpenAddNew={isOpenAddNew} toggleIsOpenAddNew={toggleIsOpenAddNew}/>
    </div>
  );
};

export default SearchCustomer;
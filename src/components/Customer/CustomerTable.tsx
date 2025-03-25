"use client";
import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";
import CustomModal from "../Modals/CustomModal2";
import AddEditCustomer from "@/components/Customer/AddEditCustomer";
import { mockCustomers, Customer } from "@/data/mockCustomers";

interface CustomerTableProps {
  searchQuery: string;
  isOpenAddNew: boolean;
  toggleIsOpenAddNew: () => void;
}

export default function CustomerTable({ searchQuery, isOpenAddNew, toggleIsOpenAddNew }: CustomerTableProps) {
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>(mockCustomers);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCustomers = filteredCustomers.slice(startIndex, endIndex);

  // Filtering logic triggered by onSearch
  const handleSearch = (query: string) => {
    const trimmedQuery = query.trim().toLowerCase();
    if (trimmedQuery === "") {
      setFilteredCustomers(customers); // Reset to full list
    } else {
      const filtered = customers.filter(
        (customer) =>
          customer.customer.toLowerCase().includes(trimmedQuery) ||
          (customer.accountNumber &&
            customer.accountNumber.toLowerCase().includes(trimmedQuery))
      );
      setFilteredCustomers(filtered);
    }
    setCurrentPage(1); // Reset to first page after search
  };

  useEffect(()=>{
    handleSearch(searchQuery);
  }, [searchQuery])

  const handleClose = () => {
    toggleIsOpenAddNew();
    setSelectedCustomer(null);
  };
  
  const handleCustomerUpdate = (updatedCustomer: Customer) => {
    if (selectedCustomer) {
      const updatedList = customers.map((c) =>
        c.id === updatedCustomer.id ? updatedCustomer : c
      );
      setCustomers(updatedList);
      setFilteredCustomers(updatedList); // Sync filtered list
    } else {
      const newCustomer = { ...updatedCustomer, id: String(customers.length + 1) };
      setCustomers([...customers, newCustomer]);
      setFilteredCustomers([...customers, newCustomer]); // Sync filtered list
    }
    handleClose();
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getPageNumbers = () => {
    const maxPagesToShow = 3;
    const halfRange = Math.floor(maxPagesToShow / 2);
    let startPage = Math.max(1, currentPage - halfRange);
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  };

  if (filteredCustomers.length === 0) {
    return <p>No customers found.</p>;
  }

  return (
    <>
      <div className="border border-border whitespace-nowrap rounded-2xl overflow-x-auto">
        <table className="my-table">
          <thead>
            <tr>
              <th>Account Number</th>
              <th>Customer</th>
              <th>Sold-to-City</th>
              <th>Ship-to</th>
            </tr>
          </thead>
          <tbody>
            {currentCustomers.map((customer) => (
              <tr key={customer.id} onClick={() => setSelectedCustomer(selectedCustomer === customer.id ? null : customer.id)}
              style={{
                backgroundColor: selectedCustomer === customer.id ? "#618ec7" : "transparent",
                cursor: "pointer" // Optional: indicates the row is clickable
              }}
              onMouseEnter={(e) => selectedCustomer !== customer.id && (e.currentTarget.style.backgroundColor = "#81a5d4")}
              onMouseLeave={(e) => selectedCustomer !== customer.id && (e.currentTarget.style.backgroundColor = "transparent")}
              >
                <td>{customer.accountNumber}</td>
                <td>{customer.customer}</td>
                <td>{customer.soldToCity || "-"}</td>
                <td>{customer.shipTo || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center items-center mt-4 gap-2">
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          className="btn btn-secondary px-4 py-2 disabled:opacity-50"
        >
          First
        </button>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="btn btn-secondary px-4 py-2 disabled:opacity-50"
        >
          Previous
        </button>

        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`btn px-4 py-2 ${
              currentPage === page ? "btn-primary" : "btn-secondary"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="btn btn-secondary px-4 py-2 disabled:opacity-50"
        >
          Next
        </button>
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="btn btn-secondary px-4 py-2 disabled:opacity-50"
        >
          Last
        </button>
      </div>

      <CustomModal
        isOpen={isOpenAddNew}
        onClose={handleClose}
        header={selectedCustomer ? "Edit Customer" : "Add New Customer"}
        className="w-[500px]"
        Component={() => (
          <AddEditCustomer
            customerId={selectedCustomer}
            onClose={handleClose}
          />
        )}
      />
    </>
  );
}
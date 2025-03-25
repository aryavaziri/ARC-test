import React from "react";
import Input from "@/components/UI/Input";
import Input2 from "@/components/UI/Input2";
import { useForm } from "react-hook-form";
import { RiMenuSearchLine } from "react-icons/ri";
import { MdOutlineSearch } from "react-icons/md";
import CustomModal from "@/components/Modals/CustomModal";
import SearchTestModal from "@/components/Modals/SearchTestModal";
import SearchCustomer from "@/components/Modals/SearchCustomer";
import { IoMdRefresh } from 'react-icons/io'
const Info = () => {
    const { register } = useForm();

    return (
        <div className="con">
            <div className="flex items-center gap-2">
                <Input2 label="New Sales Order" name="Search_Sales_Order" register={register} className="px-4 w-full" />
                <CustomModal
                    className={`min-w-[600px]`}
                    Component={SearchTestModal}
                    ModalButton={() => (
                        <div className="btn-icon">
                            <MdOutlineSearch size={28} />
                        </div>
                    )}
                    header="Search"
                />
            </div>
            <hr className="mt-4" />

            <p className="text-2xl font-semibold mb-2">Customer Info</p>
            <div className="grid grid-cols-2 gap-28 mb-4">
                <div className="flex items-center gap-2">
                    <Input2 label="Customer" name="Customer" register={register} className="w-full" />
                    <CustomModal
                    className={`min-w-[1000px]`}
                    Component={SearchCustomer}
                    ModalButton={() => (
                        <div className="btn-icon">
                            <MdOutlineSearch size={28} />
                        </div>
                    )}
                    header="Search Customer"
                />
                    {/* <button className="btn-icon">
                        <MdOutlineSearch size={28} />
                        
                    </button> */}
                </div>

                <div className="flex items-center gap-2">
                    <Input2 label="Contact" name="Contact" register={register} className="w-full" />
                    <button className="btn-icon">
                        <MdOutlineSearch size={28} />
                    </button>
                </div>
            </div>
            <hr className="mt-4" />

            {/* Shipment Section */}
            <p className="text-2xl font-semibold mb-2">Shipment</p>
            <div className="grid grid-cols-2 gap-28 mb-4">
                <Input2 label="Ship to" name="ShipTo" register={register} className="w-full" />
                <Input2 label="Contact" name="ShipmentContact" register={register} className="w-full" />
            </div>
            <hr className="mt-4" />

            {/* Order Info Section */}
            <p className="text-2xl font-semibold mb-2">Order Info</p>
            <div className="grid grid-cols-2 gap-28 mb-4">
                <Input2 label="Order Date" name="OrderDate" type="date" register={register} className="w-full" />
                <Input2 label="P.O Date" name="PODate" type="date" register={register} className="w-full" />
            </div>

            <div className="grid grid-cols-2 gap-28 mb-4">
                <Input2 label="Company Code" name="CompanyCode" register={register} className="w-full" />
                <Input2 label="Entered By" name="EnteredBy" register={register} className="w-full" />
            </div>

            <div className="grid grid-cols-2 gap-28 mb-4">
                <Input2 label="Purchase Order" name="PurchaseOrder" register={register} className="w-full" />
                <Input2 label="Delivery Method" name="DeliveryMethod" register={register} className="w-full" />
            </div>

            <div className="grid grid-cols-2 gap-28">
                <Input2 label="Sales Rep" name="SalesRep" register={register} className="w-full" />
                <Input2 label="Payment Terms" name="PaymentTerms" register={register} className="w-full" />
            </div>
        </div>
    );
};

export default Info;

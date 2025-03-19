import React from "react";

// Sample data
const sampleData = [
    {
        id: 1,
        action: "Edit",
        line: 101,
        quantity: 2,
        itemNumber: "ITM001",
        description: "Sample Item 1",
        unitPrice: 50.0,
        discountPrice: 5.0,
        totalPrice: 95.0,
        requestedDate: "2025-03-20",
        status: "Pending",
        pricingLevel: "Standard"
    },
    {
        id: 2,
        action: "Edit",
        line: 102,
        quantity: 5,
        itemNumber: "ITM002",
        description: "Sample Item 2",
        unitPrice: 30.0,
        discountPrice: 3.0,
        totalPrice: 135.0,
        requestedDate: "2025-03-22",
        status: "Approved",
        pricingLevel: "Premium"
    }
];

const Items = () => {
    return (
        <div className="p-8 bg-white border-gray-400 rounded-2xl">
            {/* Header Section */}
            <ul className="flex gap-4 mb-8">
                <li className="mr-auto">
                    <p className="text-2xl">Items</p>
                </li>
                <li className="rounded-full border p-2 px-4 hover:bg-gray-300 cursor-pointer">
                    Add New +
                </li>
                <li className="rounded-full border p-2 px-4 hover:bg-gray-300 cursor-pointer">
                    Copy Function
                </li>
                <li className="rounded-full border p-2 px-4 hover:bg-gray-300 cursor-pointer">
                    Import Lines
                </li>
            </ul>

            {/* Table Section */}
            <div className="border border-gray-300 rounded-2xl overflow-x-auto">
                <table className="w-full ">
                    {/* Table Headings */}
                    <thead>
                        <tr className="bg-gray-100/40">
                            <th className="font-normal px-4 py-2">Action</th>
                            <th className="font-normal px-4 py-2">Line</th>
                            <th className="font-normal px-4 py-2">Quantity</th>
                            <th className="font-normal px-4 py-2">Item Number</th>
                            <th className="font-normal px-4 py-2">Description</th>
                            <th className="font-normal px-4 py-2">Unit Price</th>
                            <th className="font-normal px-4 py-2">Discount Price</th>
                            <th className="font-normal px-4 py-2">Total Price</th>
                            <th className="font-normal px-4 py-2">Requested Date</th>
                            <th className="font-normal px-4 py-2">Status</th>
                            <th className="font-normal px-4 py-2">Pricing Level</th>
                        </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody>
                        {sampleData.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-100 transition-all">
                                <td className="border border-gray-300 px-4 py-2 text-center">{item.action}</td>
                                <td className="border border-gray-300 px-4 py-2 text-center">{item.line}</td>
                                <td className="border border-gray-300 px-4 py-2 text-center">{item.quantity}</td>
                                <td className="border border-gray-300 px-4 py-2 text-center">{item.itemNumber}</td>
                                <td className="border border-gray-300 px-4 py-2">{item.description}</td>
                                <td className="border border-gray-300 px-4 py-2 text-center">${item.unitPrice.toFixed(2)}</td>
                                <td className="border border-gray-300 px-4 py-2 text-center">${item.discountPrice.toFixed(2)}</td>
                                <td className="border border-gray-300 px-4 py-2 text-center">${item.totalPrice.toFixed(2)}</td>
                                <td className="border border-gray-300 px-4 py-2 text-center">{item.requestedDate}</td>
                                <td className="border border-gray-300 px-4 py-2 text-center">{item.status}</td>
                                <td className="border border-gray-300 px-4 py-2 text-center">{item.pricingLevel}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Items;

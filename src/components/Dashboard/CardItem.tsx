import Link from "next/link";
import React from "react";

interface CardItemProps {
    color: string; // Background color for icon
    icon: React.ReactNode;
    label: string;
    items: { label: string; url: string }[]; // Each item now has a label and URL
}

const CardItem: React.FC<CardItemProps> = ({ color, icon, label, items }) => {
    return (
        <div className="flex gap-4">
            {/* Icon positioned outside */}
            <div
                className="flex items-center justify-center w-16 h-16 rounded-full "
                style={{ backgroundColor: color }}
            >
                {icon}
            </div>
            <div className="border-gray-300 border rounded-lg shadow bg-gray-100 grow">
                <h3 className="text-lg font-semibold border-b px-4 py-2">{label}</h3>
                <div className="grid grid-cols-2 gap-x-2 my-2 text-gray-700 px-4 py-1">
                    {items.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <div className="w-[6px] h-[6px] bg-gray-700 rounded-full" />
                            <Link
                                href={item.url}
                                className="text-sm text-gray-700 hover:text-blue-600 transition-colors">
                                {item.label}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CardItem;

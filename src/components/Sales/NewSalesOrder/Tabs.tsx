import { useState } from "react";

const tabs = [
  { name: "Items", key: "items" },
  { name: "Procurement", key: "procurement" },
  { name: "Shipping", key: "shipping" },
  { name: "Financials", key: "financials" },
  { name: "Workflow", key: "workflow" },
  { name: "Attachments", key: "attachments" },
  { name: "Additional Details", key: "additional-details" },
];
interface TabsProps {
  activeTab: string;
  setActiveTab: (key: string) => void;
}
const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab }) => {
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  return (
    <div className="center w-full">
      <div className="flex rounded-full p-1 w-full justify-evenly">
        {tabs.map((tab, index) => {
          const isLast = index == tabs.length - 1;
          const isActive = activeTab === tab.key;
          const isHovered = hoveredTab === tab.key;
          const isPrev =
            (activeTab === tabs[index + 1]?.key || hoveredTab === tabs[index + 1]?.key);
          return (

            <div key={index} className={`border-r w-full transition-all border-gray-300 whitespace-nowrap ${(isLast || isActive || isHovered || isPrev) ? "!border-gray-100/0" : ""}`}>
              <button
                // className={`px-6 py-2 text-sm font-medium transition-all duration-200 w-full text-xl rounded-full whitespace-nowrap ${isActive
                className={`btn w-full text-xl ${isActive
                  ? "btn-primary text-light font-semibold"
                  : " border-none" 
                  }`}
                onClick={() => setActiveTab(tab.key)}
                onMouseEnter={() => setHoveredTab(tab.key)}
                onMouseLeave={() => setHoveredTab(null)}
              >
                {tab.name}
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default Tabs;

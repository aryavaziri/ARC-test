import React from 'react';
import CardItem from './CardItem';
import { IoBriefcaseSharp } from 'react-icons/io5';
import { FaTools, FaIndustry, FaShippingFast, FaCalendarAlt } from 'react-icons/fa';

const Left = () => {
  return (
    <div className="space-y-6 p-6">
      {/* Human Capital Management */}
      <CardItem
        color="#0F4C75"
        icon={<IoBriefcaseSharp size={24} color="white" />}
        label="Human Capital Management"
        items={[
          { label: "Core HR", url: "#" },
          { label: "Global HR", url: "#" },
          { label: "Candidate Self-Service", url: "#" },
          { label: "Employee Self Service", url: "#" },
          { label: "Talent Management", url: "#" },
          { label: "Training and Development", url: "#" },
          { label: "Position Control", url: "#" },
          { label: "Timesheets", url: "#" },
        ]}
      />

      {/* Service and Asset Management */}
      <CardItem
        color="#6ABF69"
        icon={<FaTools size={24} color="white" />}
        label="Service and Asset Management"
        items={[
          { label: "Service Management", url: "#" },
          { label: "Global HR", url: "#" },
          { label: "Maintenance Management", url: "#" },
          { label: "Field Service Automation", url: "#" },
          { label: "Case Management", url: "#" },
          { label: "Returned Material Authorization", url: "#" },
          { label: "Service Contract and Warranty Management", url: "#" },
        ]}
      />

      {/* Production Management */}
      <CardItem
        color="#F4A261"
        icon={<FaIndustry size={24} color="white" />}
        label="Production Management"
        items={[
          { label: "Job Management", url: "#" },
          { label: "Advanced Production", url: "#" },
          { label: "Kanban Lean Production", url: "#" },
          { label: "Manufacturing Execution System", url: "#" },
          { label: "Quality Management", url: "#" },
        ]}
      />

      {/* Supply Chain Management */}
      <CardItem
        color="#2A9D8F"
        icon={<FaShippingFast size={24} color="white" />}
        label="Supply Chain Management"
        items={[
          { label: "Purchase Management", url: "#" },
          { label: "Supplier Connect", url: "#" },
          { label: "Supplier Relationship Management", url: "#" },
          { label: "Inventory Management", url: "#" },
          { label: "Advanced Material Management", url: "#" },
          { label: "Manifesting and Freight Management", url: "#" },
          { label: "Shipping and Receiving", url: "#" },
          { label: "Warehouse Management", url: "#" },
        ]}
      />

      {/* Planning and Scheduling */}
      <CardItem
        color="#E76F51"
        icon={<FaCalendarAlt size={24} color="white" />}
        label="Planning and Scheduling"
        items={[
          { label: "Forecasting", url: "#" },
          { label: "Master Production Scheduling", url: "#" },
          { label: "Smart Demand Planning", url: "#" },
          { label: "Material Requirements Planning", url: "#" },
          { label: "Scheduling and Resource Management", url: "#" },
          { label: "Advanced Planning and Scheduling", url: "#" },
          { label: "Infinite, Finite, and Constraint Based Scheduling", url: "#" },
        ]}
      />
    </div>
  );
};

export default Left;

import React from 'react';
import CardItem from './CardItem';
import { IoBriefcaseSharp } from 'react-icons/io5';
import { FaTools, FaIndustry, FaShippingFast, FaCalendarAlt, FaMoneyBillWave, FaHandshake, FaChartLine, FaClipboardList, FaProjectDiagram } from 'react-icons/fa';

const Right = () => {
  return (
    <div className="space-y-4">
      <CardItem
        color="#F4A261"
        icon={<FaMoneyBillWave size={24} color="white" />}
        label="Financial Management"
        items={[
          { label: "Global Engines", url: "#" },
          { label: "General Ledger", url: "#" },
          { label: "Financial Planning", url: "#" },
          { label: "Accounts Receivable", url: "#" },
          { label: "Credit and Collections", url: "#" },
          { label: "Accounts Payable", url: "#" },
          { label: "Rebates", url: "#" },
          { label: "Connect", url: "#" },
          { label: "Cash Management", url: "#" },
          { label: "Asset Management", url: "#" },
          { label: "Advanced Financial Reporting", url: "#" },
        ]}
      />

      <CardItem
        color="#2A9D8F"
        icon={<FaHandshake size={24} color="white" />}
        label="Customer Relationship Management"
        items={[
          { label: "Contact Management", url: "#" },
          { label: "Customer Connect", url: "#" },
          { label: "Marketing Management", url: "#" },
          { label: "Lead and Opportunity Management", url: "#" },
          { label: "Case Management", url: "#" },
          { label: "CRM", url: "#" },
          { label: "Integration to Salesforce.com", url: "#" },
        ]}
      />

      <CardItem
        color="#8B5CF6"
        icon={<FaChartLine size={24} color="white" />}
        label="Sales Management"
        items={[
          { label: "Estimate and Quote Management", url: "#" },
          { label: "Order Management", url: "#" },
          { label: "EDI/Demand Management", url: "#" },
          { label: "Lead and Opportunity Management", url: "#" },
          { label: "Point of Sale", url: "#" },
          { label: "Commerce Connect", url: "#" },
          { label: "Customer Connect", url: "#" },
        ]}
      />

      <CardItem
        color="#6D9DC5"
        icon={<FaClipboardList size={24} color="white" />}
        label="Product Management"
        items={[
          { label: "Bills of Materials", url: "#" },
          { label: "Routings", url: "#" },
          { label: "Engineering Change and Revision Control", url: "#" },
          { label: "Document Management", url: "#" },
          { label: "CAD Integration", url: "#" },
          { label: "Product Lifecycle Management", url: "#" },
          { label: "Product Costing", url: "#" },
          { label: "Product Configuration", url: "#" },
        ]}
      />

      <CardItem
        color="#90CAF9"
        icon={<FaProjectDiagram size={24} color="white" />}
        label="Project Management"
        items={[
          { label: "Project Planning and Analysis", url: "#" },
          { label: "Project Generation", url: "#" },
          { label: "Project Billing", url: "#" },
          { label: "Resource Management", url: "#" },
          { label: "Contract Management", url: "#" },
          { label: "Planning Contract", url: "#" },
          { label: "Time Management", url: "#" },
          { label: "Expense Management", url: "#" },
        ]}
      />
    </div>
  );
};

export default Right;

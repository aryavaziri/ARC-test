'use client';

import { useState } from "react";
import CustomModal from "../Modals/CustomModal3";
import AddEditFlowForm from "./AddEditFlowForm";
import { IoMdAdd, IoMdCreate } from "react-icons/io";
import { RiDeleteBin7Fill } from "react-icons/ri";
import { useFlow } from "@/store/hooks/flowsHooks";
import { TFlow } from "@/types/flow";
import { FaCode } from "react-icons/fa";

const Flows = () => {
  const { flows, deleteFlow, runFlow } = useFlow();

  const [showModal, setShowModal] = useState(false);
  const [selectedFlow, setSelectedFlow] = useState<TFlow | null>(null);

  // const [input, setInput] = useState({ path: "/dashboard", query: { test: "1234" } });
  const input = { test:"testestest", path: "/dashboard", query: { test: "1234" } }

  const handleEdit = (flow: TFlow) => {
    setSelectedFlow(flow);
    setShowModal(true);
  };

  const handleRun = async (flow: TFlow) => {
    const res = await runFlow(flow.id, { input })
    console.log(res);
  };

  return (
    <div className="con max-w-[600px]">
      <div className="flex justify-between items-center mb-4">
        <p className="text-xl font-semibold">Flows</p>
        <button
          onClick={() => {
            setSelectedFlow(null);
            setShowModal(true);
          }}
          className="btn-icon btn-primary text-xl font-semibold"
        >
          <IoMdAdd />
        </button>
      </div>
      {/* <div>
        <label className={`mb-1 font-semibold text-medium`} htmlFor="">Input</label>
        <textarea
          rows={3}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border border-border/50 rounded p-2 w-full"/>
      </div> */}

      <div className="flex flex-col gap-4">
        {flows.map((flow) => (
          <div
            key={flow.id}
            className="p-4 rounded border border-border/50 shadow hover:bg-primary/5 transition-all flex justify-between items-center"
          >
            <div>
              <p className="font-semibold text-lg">{flow.name}</p>
              <p className="text-sm capitalize">
                {flow.triggerType} — {flow.targetType}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleRun(flow)}
                className="btn-icon hover:bg-secondary"
              >
                <FaCode />
              </button>
              <button
                onClick={() => handleEdit(flow)}
                className="btn-icon hover:bg-primary-200"
              >
                <IoMdCreate />
              </button>
              <button
                onClick={() => deleteFlow(flow.id)}
                className="btn-icon hover:bg-red-400 p-[5px] border-none shadow shadow-border text-md"
              >
                <RiDeleteBin7Fill />
              </button>
            </div>
          </div>
        ))}
      </div>

      <CustomModal
        className="w-[800px]"
        Component={() => (
          <AddEditFlowForm
            onClose={() => setShowModal(false)}
            defaultValues={selectedFlow ?? undefined}
          />
        )}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        header="Add/Edit Flow"
      />
    </div>
  );
};

export default Flows;

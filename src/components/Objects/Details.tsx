'use client'
import { useDynamicModel } from '@/store/hooks/dynamicModelsHooks';
import React, { useState } from 'react'
import CustomModal from '../Modals/CustomModal2';
import EditDynamicModel from '../Dynamic/DynamicModel/EditDynamicModel';
import { toast } from 'react-toastify';

const Details = () => {
  const { models, selectedModel, selectedField, deleteItem, loading, deleteField, setSelectedField } = useDynamicModel();
  const handleDelete = async () => {
    console.log('Delete model:', selectedModel?.id);
    selectedModel && await toast.promise(
      deleteItem(selectedModel.id),
      {
        pending: "deleting object...",
        success: "Object deleted successfully!",
        error: "Error deleting object.",
      }
    );

  };
  const [showEditModelModal, setShowEditModelModal] = useState(false);
  const handleClose2 = () => {
    setShowEditModelModal(false);
    setSelectedField(null)
  };
  
  const model = models.find(m=>m.id===selectedModel?.id)
  if (!selectedModel || !model) return
  return (
    <div className="flex grow">
      <div className="flex flex-col gap-4 grow con">
        <div className="flex items-center gap-2 mb-4">
          <p className="text-2xl font-semibold mr-auto">
            {model.name || "Model"} Details
          </p>
          <button className="btn btn-secondary" onClick={() => setShowEditModelModal(true)}>
            Edit Model
          </button>
          <button className="btn hover:bg-rose-800 hover:text-white" onClick={handleDelete}>
            Delete Model
          </button>
        </div>
        <div className="w-1/2 ">
          <div className={`flex justify-between px-8 rounded hover:shadow-md shadow-border/30 py-4 hover:bg-primary-50`}>
            <p className="font-semibold text-gray-600">ID</p>
            <p className="text-gray-800">{model.id}</p>
          </div>
          <div className={`flex justify-between px-8 rounded hover:shadow-md shadow-border/30 py-4 hover:bg-primary-50`}>
            <p className="font-semibold text-gray-600">Name</p>
            <p className="text-gray-800">{model.name}</p>
          </div>
          <div className={`flex justify-between px-8 rounded hover:shadow-md shadow-border/30 py-4 hover:bg-primary-50`}>
            <p className="font-semibold text-gray-600">Description</p>
            <p className="text-gray-800">{model.description || '-'}</p>
          </div>
          <div className={`flex justify-between px-8 rounded hover:shadow-md shadow-border/30 py-4 hover:bg-primary-50`}>
            <p className="font-semibold text-gray-600">Type</p>
            <p className="text-gray-800">{model.layoutType}</p>
          </div>
          <div className={`flex justify-between px-8 rounded hover:shadow-md shadow-border/30 py-4 hover:bg-primary-50`}>
            <p className="font-semibold text-gray-600">Number of Fields</p>
            <p className="text-gray-800">{model.ModelTextInputs?.length || 0}</p>
          </div>
        </div>
      </div>
      <CustomModal
        isOpen={showEditModelModal}
        onClose={handleClose2}
        header="Edit Model"
        className="w-[500px]"
        Component={() => (<EditDynamicModel onClose={() => { handleClose2() }} />)}
      />
    </div>
  )
}

export default Details
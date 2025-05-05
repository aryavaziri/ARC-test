'use client';

import React, { useEffect, useState } from 'react';
import { FaEdit, FaLink } from 'react-icons/fa';
import { MdEdit, MdOutlineDelete } from 'react-icons/md';
import CustomModal from '@/components/Modals/CustomModal2';
import AddDynamicField from './Fields/AddEditDynamicField';
import { useDynamicModel } from '@/store/hooks/dynamicModelsHooks';
import EditDynamicModel from './EditDynamicModel';
import { RiDeleteBin2Fill, RiDeleteBin7Fill } from 'react-icons/ri';
import Dependencies from './Dependency/Dependencies';

type Props = {
  // modelId: string;
};

const FieldsGrid: React.FC<Props> = ({ }) => {
  const [showModal, setShowModal] = useState(false);
  const [showEditModelModal, setShowEditModelModal] = useState(false);
  const [showDependencies, setShowDependencies] = useState(false);
  const { models, selectedModel, selectedField, deleteItem, loading, deleteField, setSelectedField } = useDynamicModel();

  const handleClose = () => {
    setSelectedField(null)
    setShowModal(false);
  };

  const handleClose2 = () => {
    setShowEditModelModal(false);
    setSelectedField(null)
  };

  const handleClose3 = () => {
    setShowDependencies(false);
    setSelectedField(null)
  };


  const handleEdit = (field: any) => {
    // console.log('Edit field:', field);
    setSelectedField(field)
    setShowModal(true)
  };

  const handleDependencies = (field: any) => {
    setSelectedField(field)
    setShowDependencies(true)
  };

  const handleDelete = async () => {
    console.log('Delete model:', selectedModel?.id);
    selectedModel && await deleteItem(selectedModel.id);
  };

  const handleRemoveField = async (id: string) => {
    console.log('Delete field:', id);
    selectedModel && await deleteField(id);
  };


  useEffect(() => {
    console.log(selectedModel?.id)
  }, [selectedModel?.id]);

  const fields = [
    ...(selectedModel?.ModelTextInputs?.map(f => ({ ...f, type: 'text' })) || []),
    ...(selectedModel?.ModelNumberInputs?.map(f => ({ ...f, type: 'number' })) || []),
    ...(selectedModel?.ModelLongTextInputs?.map(f => ({ ...f, type: 'longText' })) || []),
    ...(selectedModel?.ModelDateInputs?.map(f => ({ ...f, type: 'date' })) || []),
    ...(selectedModel?.ModelCheckboxInputs?.map(f => ({ ...f, type: 'checkbox' })) || []),
    ...(selectedModel?.ModelLookupInputs?.map(f => ({ ...f, type: 'lookup' })) || []),
    // ...(selectedModel?.ModelLookupInputs?.filter(f => {
    //   const referencedModel = models.find(m => m.id === f.lookupModelId);
    //   return referencedModel && (
    //     (referencedModel.ModelLookupInputs?.length || 0) > 0
    //   );
    // })?.map(f => ({ ...f, type: 'lookup' })) || []),

  ];
  return (
    // <div className={!selectedModel?.id ? `hidden` : `flex grow`}>
    <div className="flex grow">
      <div className="flex flex-col gap-4 grow con">
        <div className="flex items-center gap-2 mb-4">
          <p className="text-2xl font-semibold mr-auto">
            {models.find(m => m.id === selectedModel?.id)?.name || "Model"} Fields
          </p>
          <input type="text" placeholder='Quick find ...' className='border rounded h-full px-2' />
          <button className="btn btn-secondary" onClick={() => setShowModal(true)}>
            Add a Custom Field
          </button>
          {/* <button className="btn btn-secondary" onClick={() => setShowEditModelModal(true)}>
            Edit Model
          </button>
          <button className="btn hover:bg-rose-800 hover:text-white" onClick={handleDelete}>
            Delete Model
          </button> */}
        </div>

        <div className="overflow-x-auto">
          <table className="my-table whitespace-nowrap">
            <thead>
              <tr>
                <th>ID</th>
                <th>Label</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {fields.length > 0 ? (
                fields.map((field) => (
                  <tr key={field.id}>
                    <td>{field.id.slice(0, 8)}...</td>
                    <td>{field.label}</td>
                    <td className={`subtitle`}><p>{field.type.toUpperCase()}{field.type == 'lookup' && 'lookupModelId' in field ? ` - (${models.find(m => m.id === field.lookupModelId)?.name})` : ''}</p></td>
                    <td className='justify-end' >
                      {field.type === "lookup" && 'lookupModelId' in field && !!models.find((m) => m.id === field.lookupModelId)?.ModelLookupInputs?.length &&
                        <button
                          onClick={() => handleDependencies(field)}
                          className="btn-icon hover:bg-amber-400 aspect-square h-6 border-none shadow shadow-border"
                        >
                          <FaLink size={16} />
                        </button>
                      }
                      {/* )()} */}
                      {/* {field.type === "lookup" && 'lookupModelId' in field && !!models.find(m => m.id === field.lookupModelId)?.ModelLookupInputs?.length &&
                        <button
                          onClick={() => handleDependencies(field)}
                          className="btn-icon hover:bg-amber-400 aspect-square h-6 border-none shadow shadow-border"
                        >
                          <FaLink size={16} />
                        </button>
                      } */}
                      {/* {field.type === "lookup" &&
                        'lookupModelId' in field &&
                        (() => {
                          const targetModel = models.find((m) => m.id === field.lookupModelId);
                          const outerLookups = selectedModel?.ModelLookupInputs ?? [];
                          const innerLookups = targetModel?.ModelLookupInputs ?? [];

                          const hasMatchingNestedLookup = innerLookups.some((inner) =>
                            outerLookups.some((outer) => outer.lookupModelId === inner.lookupModelId)
                          );

                          return hasMatchingNestedLookup ? (
                            <button
                              onClick={() => handleDependencies(field)}
                              className="btn-icon hover:bg-amber-400 aspect-square h-6 border-none shadow shadow-border"
                            >
                              <FaLink size={16} />
                            </button>
                          ) : null;
                        })()
                      } */}
                      <button
                        onClick={() => handleEdit(field)}
                        className="btn-icon hover:bg-lime-400 aspect-square h-6 border-none shadow shadow-border text-md"
                      >
                        <MdEdit />
                      </button>
                      <button
                        onClick={async () => await handleRemoveField(field.id)}
                        className="btn-icon hover:bg-red-400 aspect-square h-6 border-none shadow shadow-border text-md"
                      >
                        <RiDeleteBin7Fill />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={5} className="text-center p-4">
                  {loading ? 'Loading...' : 'No fields found.'}
                </td></tr>
              )}

            </tbody>
          </table>
        </div>

        <CustomModal
          isOpen={showModal}
          onClose={handleClose}
          header={selectedField ? "Edit Field" : "Add New Field"}
          className="w-[500px]"
          Component={() => (<AddDynamicField onClose={() => { handleClose() }} />)}
        />

        <CustomModal
          isOpen={showEditModelModal}
          onClose={handleClose2}
          header="Edit Model"
          className="w-[500px]"
          Component={() => (<EditDynamicModel onClose={() => { handleClose2() }} />)}
        />

        <CustomModal
          isOpen={showDependencies}
          onClose={handleClose3}
          header="Dependencies"
          className="w-[800px]"
          Component={Dependencies}
          componentProps={{ onClose: handleClose3 }}
        />
      </div>
    </div>
  );
};

export default FieldsGrid;

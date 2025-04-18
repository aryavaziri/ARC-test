import { useEffect, useCallback, useState } from "react";
import { unwrapResult } from "@reduxjs/toolkit";
import { useAppDispatchWithSelector } from "./reduxHooks";
import { RootState } from "@/store/store";
import { setSelectedModel, setSelectedField, setAllFields } from "@/store/slice/dynamicModelSlice";
import { TDynamicModel, TField, TLineItem, TRecord } from "@/types/dynamicModel";
import { } from '@/store/slice/dynamicModelSlice';
import { addDynamicModel, addInputFieldToModel, editDynamicFieldAction, addLineItem, deleteDynamicField, deleteDynamicModel, editDynamicModel, getDynamicModels, getLineItem, removeLineItemAction, addRecordLayout, addFormLayout, fetchFormLayouts, fetchRecordLayouts, deleteFormLayout, editFormLayout, fetchAllFormLayouts, editRecordLayout, deleteRecordLayout, fetchAllRecordLayouts, editLineItem } from "../slice/dynamicThunks";
import { TResponse } from "@/lib/helpers";
import axios from "axios";
import { TFormLayout, TRecordLayout } from "@/types/layouts";
import { resetStandardSchema } from "@/actions/Dynamic/SchemaReset";

export const useDynamicModel = () => {
  const { dispatch, useAppSelector } = useAppDispatchWithSelector();

  const models = useAppSelector((state: RootState) => state.dynamicModel.dynamicModels);
  const selectedModel = useAppSelector((state: RootState) => state.dynamicModel.selectedModel);
  const lineItem = useAppSelector((state: RootState) => state.dynamicModel.selectedLineItem);
  const selectedField = useAppSelector((state: RootState) => state.dynamicModel.selectedField);
  const inputFields = useAppSelector((state: RootState) => state.dynamicModel.inputFields);
  const allFields = useAppSelector((state: RootState) => state.dynamicModel.allFields);
  const formLayouts = useAppSelector((state: RootState) => state.dynamicModel.formLayouts);
  const recordLayouts = useAppSelector((state: RootState) => state.dynamicModel.recordLayouts);
  const loading = useAppSelector((state: RootState) => state.dynamicModel.loading);
  const error = useAppSelector((state: RootState) => state.dynamicModel.error);

  const setFields = async () => {
    const resultAction = dispatch(setAllFields());
    const data = unwrapResult(resultAction);
    return data;
  };
  const fetch = async () => {
    const resultAction = await dispatch(getDynamicModels());
    const data = unwrapResult(resultAction);
    setFields()
    return data;
  };

  const handleFetch = useCallback(async () => {
    try {
      await fetch();
      await getAllFormLayouts()
      await getAllRecordLayouts()
    } catch (err) {
      console.error(err);
    }
  }, []);

  const selectModel = (model: TDynamicModel | null) => {
    dispatch(setSelectedModel(model));
  };

  const selectField = (field: TField & { type: string } | null) => {
    dispatch(setSelectedField(field));
  };

  const addNewItem = async (newItem: Omit<TDynamicModel, "id">) => {
    const result = await dispatch(addDynamicModel(newItem));
    return unwrapResult(result);
  };

  const deleteItem = async (id: string) => {
    const result = await dispatch(deleteDynamicModel(id));
    return unwrapResult(result);
  };

  const deleteField = async (id: string) => {
    const result = await dispatch(deleteDynamicField(id));
    return unwrapResult(result);
  };

  const editItem = async (item: Partial<Omit<TDynamicModel, 'id'>> & { id: string }) => {
    const result = await dispatch(editDynamicModel(item));
    return unwrapResult(result);
  };

  const editInputField = async ({ modelId, input }: { modelId: string; input: TField }) => {
    const result = await dispatch(editDynamicFieldAction({ modelId, ...input }));
    return unwrapResult(result);
  };

  const addInputField = async ({ modelId, input }: { modelId: string; input: Omit<TField, "id"> }) => {
    const result = await dispatch(addInputFieldToModel({ modelId, ...input }));
    return unwrapResult(result);
  };

  const addData = async (data: { records: TRecord[]; modelId: string }) => {
    const result = await dispatch(addLineItem(data));
    return unwrapResult(result);
  };

  const updateLineItem = async ({ modelId, lineItemId, records, }: {
    modelId: string; lineItemId: string; records: { id: string; fieldId: string; value: any; type: string; label?: string; }[];
  }) => {
    const result = await dispatch(editLineItem({ modelId, lineItemId, records }));
    return unwrapResult(result);
  };


  const removeLineItem = async (lineItemId: string) => {
    const result = await dispatch(removeLineItemAction(lineItemId));
    return unwrapResult(result);
  };

  const getData = async () => {
    const modelId = selectedModel?.id
    if (!modelId) return
    const result = await dispatch(getLineItem(modelId));
    return unwrapResult(result);
  };

  const getLineItems = async (id: string) => {
    const result = await dispatch(getLineItem(id));
    return unwrapResult(result);
  };

  const getLookupLineItem = async (modelId: string) => {
    const { data: response } = await axios.get<TResponse>(
      `/api/dynamic-models/${modelId}/data`
    )
    return response.data
  };

  const getAllFormLayouts = async () => {
    const result = await dispatch(fetchAllFormLayouts());
    return unwrapResult(result);
  };

  const getFormLayoutsData = async (modelId: string) => {
    const result = await dispatch(fetchFormLayouts(modelId));
    return unwrapResult(result);
  };

  const getRecordLayoutsData = async (modelId: string) => {
    const result = await dispatch(fetchRecordLayouts(modelId));
    return unwrapResult(result);
  };

  const createFormLayout = async (layout: Omit<TFormLayout, "id">) => {
    const result = await dispatch(addFormLayout(layout));
    return unwrapResult(result);
  };

  const createRecordLayout = async (layout: Omit<TRecordLayout, "id">) => {
    const result = await dispatch(addRecordLayout(layout));
    return unwrapResult(result);
  };

  const removeFormLayout = async (layoutId: string) => {
    const result = await dispatch(deleteFormLayout(layoutId));
    return unwrapResult(result);
  };

  const removeRecordLayout = async (layoutId: string) => {
    const result = await dispatch(deleteRecordLayout(layoutId));
    return unwrapResult(result);
  };

  const updateFormLayout = async (layout: Partial<TFormLayout> & { id: String }) => {
    const result = await dispatch(editFormLayout(layout));
    return unwrapResult(result);
  };

  const updateRecordLayout = async (layout: Partial<TRecordLayout> & { id: String }) => {
    const result = await dispatch(editRecordLayout(layout));
    return unwrapResult(result);
  };

  const getAllRecordLayouts = async () => {
    const result = await dispatch(fetchAllRecordLayouts());
    console.log(result)
    return unwrapResult(result);
  };

  const resetFormLayout = async (modelId:string) => {
    const result = await resetStandardSchema(modelId)
    console.log(result)
  };

  // const addMultiRecord = async (data: TRecord[]) => {
  //   const result = await dispatch(createModelMultiRecord(data));
  //   return unwrapResult(result);
  // };

  // const getRecords = async () => {
  //   if (!selectedModel?.id) return
  //   const result = await dispatch(getRecordsAction(selectedModel?.id));
  //   return unwrapResult(result);
  // };


  return {
    models,
    loading,
    error,
    addNewItem,
    deleteItem,
    editItem,
    selectedModel,
    selectedField,
    lineItem,
    inputFields,
    formLayouts,
    recordLayouts,
    addInputField,
    editInputField,
    deleteField,
    addData,
    getData,
    getLookupLineItem,
    removeLineItem,
    allFields,
    setFields,
    getFormLayoutsData,
    getRecordLayoutsData,
    createFormLayout,
    createRecordLayout,
    removeFormLayout,
    updateFormLayout,
    resetFormLayout,
    removeRecordLayout,
    updateRecordLayout,
    getLineItems,
    updateLineItem,
    // getAllFormLayouts,
    // addRecord,
    // addMultiRecord,
    // records,
    // getRecords,
    refetch: handleFetch,
    setSelectedModel: selectModel,
    setSelectedField: selectField,
  };
};

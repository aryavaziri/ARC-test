import { useEffect, useCallback, useState } from "react";
import { unwrapResult } from "@reduxjs/toolkit";
import { useAppDispatchWithSelector } from "./reduxHooks";
import { RootState } from "@/store/store";
import {
  // getDynamicModels,
  // addDynamicModel,
  // editDynamicModel,
  // deleteDynamicModel,
  // addInputFieldToModel,
  // deleteDynamicField,
  setSelectedModel, 
  setSelectedField
} from "@/store/slice/dynamicModelSlice";
import { TDynamicModel, TField } from "@/types/dynamicModel";
import {  } from '@/store/slice/dynamicModelSlice';
import { addDynamicModel, addInputFieldToModel, deleteDynamicField, deleteDynamicModel, editDynamicModel, getDynamicModels } from "../slice/dynamicThunks";

export const useDynamicModel = () => {
  const { dispatch, useAppSelector } = useAppDispatchWithSelector();

  const models = useAppSelector((state: RootState) => state.dynamicModel.dynamicModels);
  const selectedModel = useAppSelector((state: RootState) => state.dynamicModel.selectedModel);
  const selectedField = useAppSelector((state: RootState) => state.dynamicModel.selectedField);
  const inputFields = useAppSelector((state: RootState) => state.dynamicModel.inputFields);
  const records = useAppSelector((state: RootState) => state.dynamicModel.records);
  const loading = useAppSelector((state: RootState) => state.dynamicModel.loading);
  const error = useAppSelector((state: RootState) => state.dynamicModel.error);

  const [isFetched, setIsFetched] = useState(false);

  useEffect(() => {
    if (!loading && models.length === 0 && !isFetched) {
      handleFetch();
    }
  }, []);

  const fetch = async () => {
    const resultAction = await dispatch(getDynamicModels());
    const data = unwrapResult(resultAction);
    return data;
  };

  const handleFetch = useCallback(async () => {
    try {
      await fetch();
      setIsFetched(true);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const selectModel = (model: TDynamicModel | null) => {
    dispatch(setSelectedModel(model));
  };

  const selectField = (field: TField & {type:string} | null) => {
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

  const editInputField = async (item: Partial<Omit<TField, 'id'>> & { id: string }) => {
    // const result = await dispatch(editDynamicField(item));
    // return unwrapResult(result);
  };

  const addInputField = async ({ modelId, input }: { modelId: string; input: Omit<TField, "id"> }) => {
    const result = await dispatch(addInputFieldToModel({ modelId, ...input }));
    return unwrapResult(result);
  };


  return {
    models,
    loading,
    error,
    deleteField,
    addNewItem,
    selectedModel,
    selectedField,
    addInputField,
    deleteItem,
    editItem,
    editInputField,
    records,
    inputFields,
    refetch: handleFetch,
    setSelectedModel: selectModel,
    setSelectedField: selectField,
  };
};

// thunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { TResponse } from "@/lib/helpers";
import { TDynamicModel, TField, TLineItem, TRecord } from "@/types/dynamicModel";

export const getDynamicModels = createAsyncThunk<
  TDynamicModel[],
  void,
  { rejectValue: string }
>("dynamicModels/getAll", async (_, thunkAPI) => {
  try {
    const { data: response } = await axios.get<TResponse>("/api/dynamic-models");
    if (response?.success && response.data) {
      return response.data;
    }
    return thunkAPI.rejectWithValue(response?.error ?? "Failed to fetch models.");
  } catch (err) {
    return thunkAPI.rejectWithValue("Unexpected error while fetching models.");
  }
});

// ✅ ADD NEW MODEL
export const addDynamicModel = createAsyncThunk<
  TDynamicModel,
  Omit<TDynamicModel, "id">,
  { rejectValue: string }
>("dynamicModels/add", async (model, thunkAPI) => {
  try {
    const { data: response } = await axios.post<TResponse>("/api/dynamic-models", model);
    if (response?.success && response.data) {
      return response.data;
    }
    throw new Error(response?.error ?? "Failed to add model.");
  } catch (err) {
    return thunkAPI.rejectWithValue((err as Error).message);
  }
});

// ✅ EDIT MODEL
export const editDynamicModel = createAsyncThunk<
  TDynamicModel,
  Partial<TDynamicModel> & { id: string },
  { rejectValue: string }
>("dynamicModels/edit", async (model, thunkAPI) => {
  try {
    const { id, ...rest } = model;
    const { data: response } = await axios.put<TResponse>(`/api/dynamic-models/${id}`, rest);
    if (response?.success && response.data) {
      return response.data;
    }
    throw new Error(response?.error ?? "Failed to edit model.");
  } catch (err) {
    return thunkAPI.rejectWithValue((err as Error).message);
  }
});

export const addInputFieldToModel = createAsyncThunk<
  TField & { modelId: string },
  Omit<TField, "id"> & { modelId: string },
  { rejectValue: string }
>("dynamicModels/addInput", async (payload, thunkAPI) => {
  try {
    const { modelId, ...rest } = payload;
    const { data: response } = await axios.post<TResponse>(
      `/api/dynamic-models/${modelId}/fields`,
      rest
    );
    console.log(response);

    if (response?.success && response.data) {
      return response.data;
    }

    throw new Error(response?.error ?? "Failed to add field.");
  } catch (err) {
    return thunkAPI.rejectWithValue((err as Error).message);
  }
});

// ✅ DELETE MODEL
export const deleteDynamicModel = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("dynamicModels/delete", async (id, thunkAPI) => {
  try {
    const { data: response } = await axios.delete<TResponse>(`/api/dynamic-models/${id}`);
    if (response?.success) {
      return id;
    }
    throw new Error(response?.error ?? "Failed to delete model.");
  } catch (err) {
    return thunkAPI.rejectWithValue((err as Error).message);
  }
});

export const deleteDynamicField = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("dynamicModels/deleteField", async (id, thunkAPI) => {
  try {
    const { data: response } = await axios.delete<TResponse>(`/api/dynamic-models/_/fields/${id}`);
    if (response?.success) {
      return id;
    }
    throw new Error(response?.error ?? "Failed to delete model.");
  } catch (err) {
    return thunkAPI.rejectWithValue((err as Error).message);
  }
});


// export const fetchLineItems = createAsyncThunk<
//   TRecord[],
//   string,
//   { rejectValue: string }
// >('dynamicModels/fetchRecords', async (modelId, thunkAPI) => {
//   try {
//     const { data: response } = await axios.get<TResponse>(
//       `/api/dynamic-models/${modelId}/records`
//     )
//     if (response.success && response.data) return response.data
//     return thunkAPI.rejectWithValue(response.error ?? 'Failed to fetch records')
//   } catch (err) {
//     return thunkAPI.rejectWithValue('Unexpected error while fetching records')
//   }
// })

export const editDynamicFieldAction = createAsyncThunk<
  TField & { modelId: string },
  TField & { modelId: string },
  { rejectValue: string }
>('dynamicModels/editFields', async (field, thunkAPI) => {
  try {
    console.log(field)
    const { data: response } = await axios.put<TResponse>(
      `/api/dynamic-models/${field.modelId}/fields/${field.id}`, field
    )
    if (response.success && response.data) return response.data
    return thunkAPI.rejectWithValue(response.error ?? 'Failed to fetch records')
  } catch (err) {
    return thunkAPI.rejectWithValue('Unexpected error while editing fields')
  }
})

export const addLineItem = createAsyncThunk<
  TLineItem,
  { records: TRecord[]; modelId: string },
  { rejectValue: string }
>('dynamicModels/addRecord', async ({ records, modelId }, thunkAPI) => {
  try {
    const { data: response } = await axios.post<TResponse>(
      `/api/dynamic-models/${modelId}/records`, records
    )
    if (response.success && response.data) return response.data
    return thunkAPI.rejectWithValue(response.error ?? 'Failed to add record')
  } catch (err) {
    return thunkAPI.rejectWithValue('Unexpected error while adding records')
  }
})

export const getLineItem = createAsyncThunk<
  TLineItem[],
  String,
  { rejectValue: string }
>('dynamicModels/getData', async (modelId, thunkAPI) => {
  try {
    const { data: response } = await axios.get<TResponse>(
      `/api/dynamic-models/${modelId}/data`
    )
    if (response.success && response.data) return response.data
    return thunkAPI.rejectWithValue(response.error ?? 'Failed to add record')
  } catch (err) {
    return thunkAPI.rejectWithValue('Unexpected error while fetching records')
  }
})

export const removeLineItemAction = createAsyncThunk<
  String,
  String,
  { rejectValue: string }
>('dynamicModels/delData', async (lineItemId, thunkAPI) => {
  try {
    const { data: response } = await axios.delete<TResponse>(
      `/api/dynamic-models/_/data/${lineItemId}`
    )
    if (response.success && response.data) return response.data.id
    return thunkAPI.rejectWithValue(response.error ?? 'Failed to remove record')
  } catch (err) {
    return thunkAPI.rejectWithValue('Unexpected error while deleting records')
  }
})

// export const createModelMultiRecord = createAsyncThunk<
// TRecord[],
// TRecord[],
//   { rejectValue: string }
// >('dynamicModels/addRecord', async (record, thunkAPI) => {
//   try {
//     const { data: response } = await axios.post<TResponse>(
//       `/api/dynamic-models/${record[0].modelId}/records`,record
//     )
//     if (response.success && response.data) return response.data
//     return thunkAPI.rejectWithValue(response.error ?? 'Failed to add record')
//   } catch (err) {
//     return thunkAPI.rejectWithValue('Unexpected error while fetching records')
//   }
// })

// export const getRecordsAction = createAsyncThunk<
//   TRecord[],
//   String,
//   { rejectValue: string }
// >('dynamicModels/getRecords', async (modelId, thunkAPI) => {
//   try {
//     const { data: response } = await axios.get<TResponse>(
//       `/api/dynamic-models/${modelId}/records`
//     )
//     if (response.success && response.data) return response.data
//     return thunkAPI.rejectWithValue(response.error ?? 'Failed to add record')
//   } catch (err) {
//     return thunkAPI.rejectWithValue('Unexpected error while fetching records')
//   }
// })


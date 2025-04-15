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

export const editLineItem = createAsyncThunk<
{ id: string; fields: TRecord[] },
  {
    modelId: string;
    lineItemId: string;
    records: {
      id: string;        // record ID
      fieldId: string;
      value: any;
      type: string;
      label?: string;
    }[];
  },
  { rejectValue: string }
>('dynamicModels/editLineItem', async ({ modelId, lineItemId, records }, thunkAPI) => {
  try {
    const { data: response } = await axios.put<TResponse>(
      `/api/dynamic-models/${modelId}/records/${lineItemId}`,
      records
    );

    if (response.success && response.data) return response.data;
    return thunkAPI.rejectWithValue(response.error ?? "Failed to update record");
  } catch (err) {
    return thunkAPI.rejectWithValue("Unexpected error while updating records");
  }
});


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


import { TFormLayout, TRecordLayout } from "@/types/layouts";

export const fetchFormLayouts = createAsyncThunk<
  TFormLayout[],
  string,
  { rejectValue: string }
>("dynamicModels/fetchFormLayouts", async (modelId, thunkAPI) => {
  try {
    const { data: response } = await axios.get<TResponse>(
      `/api/dynamic-models/${modelId}/form-layouts`
    );
    if (response.success && response.data) return response.data;
    return thunkAPI.rejectWithValue(response.error ?? "Failed to fetch form layouts");
  } catch {
    return thunkAPI.rejectWithValue("Unexpected error while fetching form layouts");
  }
});

export const fetchAllFormLayouts = createAsyncThunk<
  TFormLayout[],
  void,
  { rejectValue: string }
>("dynamicModels/fetchFormLayouts", async (_, thunkAPI) => {
  try {
    const { data: response } = await axios.get<TResponse>(
      `/api/dynamic-models/all/form-layouts`
    );
    if (response.success && response.data) return response.data;
    return thunkAPI.rejectWithValue(response.error ?? "Failed to fetch form layouts");
  } catch {
    return thunkAPI.rejectWithValue("Unexpected error while fetching form layouts");
  }
});

export const addFormLayout = createAsyncThunk<
  TFormLayout,
  Omit<TFormLayout, "id">,
  { rejectValue: string }
>("dynamicModels/addFormLayout", async (layout, thunkAPI) => {
  try {
    const { data: response } = await axios.post<TResponse>(
      `/api/dynamic-models/${layout.modelId}/form-layouts`, layout
    );
    if (response.success && response.data) return response.data;
    return thunkAPI.rejectWithValue(response.error ?? "Failed to create form layout");
  } catch {
    return thunkAPI.rejectWithValue("Unexpected error");
  }
});


export const deleteFormLayout = createAsyncThunk<
  string, // returned layout ID
  string, // layoutId
  { rejectValue: string }
>("dynamicModels/deleteFormLayout", async (layoutId, thunkAPI) => {
  try {
    const { data: response } = await axios.delete<TResponse>(
      `/api/dynamic-models/_/form-layouts/${layoutId}`
    );
    if (response.success && response.data) return layoutId;
    return thunkAPI.rejectWithValue(response.error ?? "Failed to delete form layout");
  } catch {
    return thunkAPI.rejectWithValue("Unexpected error");
  }
});

export const editFormLayout = createAsyncThunk<
  TFormLayout,
  Partial<TFormLayout> & { id: String },
  { rejectValue: string }
>("dynamicModels/editFormLayout", async (layout, thunkAPI) => {
  try {
    const { data: response } = await axios.put<TResponse>(
      `/api/dynamic-models/-/form-layouts/${layout.id}`,
      layout
    );
    if (response.success && response.data) return response.data;
    return thunkAPI.rejectWithValue(response.error ?? "Failed to update form layout");
  } catch {
    return thunkAPI.rejectWithValue("Unexpected error");
  }
});

export const addRecordLayout = createAsyncThunk<
  TRecordLayout,
  Omit<TRecordLayout, "id">,
  { rejectValue: string }
>("dynamicModels/addRecordLayout", async (layout, thunkAPI) => {
  try {
    const { data: response } = await axios.post<TResponse>(
      `/api/dynamic-models/${layout.modelId}/record-layouts`, layout
    );
    if (response.success && response.data) return response.data;
    return thunkAPI.rejectWithValue(response.error ?? "Failed to create record layout");
  } catch {
    return thunkAPI.rejectWithValue("Unexpected error");
  }
});

export const fetchRecordLayouts = createAsyncThunk<
  TRecordLayout[],
  string,
  { rejectValue: string }
>("dynamicModels/fetchRecordLayouts", async (modelId, thunkAPI) => {
  try {
    const { data: response } = await axios.get<TResponse>(
      `/api/dynamic-models/${modelId}/record-layouts`
    );
    if (response.success && response.data) return response.data;
    return thunkAPI.rejectWithValue(response.error ?? "Failed to fetch record layouts");
  } catch {
    return thunkAPI.rejectWithValue("Unexpected error while fetching record layouts");
  }
});

export const editRecordLayout = createAsyncThunk<
  TRecordLayout,
  Partial<TRecordLayout> & { id: string },
  { rejectValue: string }
>("dynamicModels/editRecordLayout", async (layout, thunkAPI) => {
  try {
    const { data: response } = await axios.put<TResponse>(
      `/api/dynamic-models/-/record-layouts/${layout.id}`,
      layout
    );
    if (response.success && response.data) return response.data;
    return thunkAPI.rejectWithValue(response.error ?? "Failed to update record layout");
  } catch {
    return thunkAPI.rejectWithValue("Unexpected error");
  }
});

export const fetchAllRecordLayouts = createAsyncThunk<
  TRecordLayout[],
  void,
  { rejectValue: string }
>("dynamicModels/fetchAllRecordLayouts", async (_, thunkAPI) => {
  try {
    const { data: response } = await axios.get<TResponse>(
      `/api/dynamic-models/all/record-layouts`
    );
    if (response.success && response.data) return response.data;
    return thunkAPI.rejectWithValue(response.error ?? "Failed to fetch record layouts");
  } catch {
    return thunkAPI.rejectWithValue("Unexpected error while fetching record layouts");
  }
});

export const deleteRecordLayout = createAsyncThunk<
  string, // returned layoutId
  string, // input layoutId
  { rejectValue: string }
>("dynamicModels/deleteRecordLayout", async (layoutId, thunkAPI) => {
  try {
    const { data: response } = await axios.delete<TResponse>(
      `/api/dynamic-models/_/record-layouts/${layoutId}`
    );
    if (response.success && response.data) return layoutId;
    return thunkAPI.rejectWithValue(response.error ?? "Failed to delete record layout");
  } catch {
    return thunkAPI.rejectWithValue("Unexpected error");
  }
});

import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { delSchema, getAllSchema } from "@/actions/layout";
import { TResponse } from "@/lib/helpers";
import { TTab } from "@/types/layouts";
const baseURL = "/api/tabs";

// GET ALL TABS
export const fetchTabs = createAsyncThunk<
  TTab[],
  void,
  { rejectValue: string }
>("tabs/fetchTabs", async (_, thunkAPI) => {
  try {
    const { data: response } = await axios.get<TResponse>(baseURL);
    if (response.success && response.data) return response.data;
    return thunkAPI.rejectWithValue(response.error ?? "Failed to fetch tabs");
  } catch {
    return thunkAPI.rejectWithValue("Unexpected error while fetching tabs");
  }
});

// CREATE TAB
export const createTabThunk = createAsyncThunk<
  TTab,
  Omit<TTab, "id">,
  { rejectValue: string }
>("tabs/create", async (tab, thunkAPI) => {
  try {
    const { data: response } = await axios.post<TResponse>(baseURL, tab);
    if (response.success && response.data) return response.data;
    throw new Error(response.error ?? "Failed to create tab");
  } catch (err) {
    return thunkAPI.rejectWithValue((err as Error).message);
  }
});

// UPDATE TAB
export const updateTabThunk = createAsyncThunk<
  TTab,
  TTab,
  { rejectValue: string }
>("tabs/update", async (tab, thunkAPI) => {
  try {
    const { id, ...rest } = tab;
    const { data: response } = await axios.put<TResponse>(`${baseURL}/${id}`, rest);
    if (response.success && response.data) return response.data;
    throw new Error(response.error ?? "Failed to update tab");
  } catch (err) {
    return thunkAPI.rejectWithValue((err as Error).message);
  }
});

// DELETE TAB
export const deleteTabThunk = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("tabs/delete", async (id, thunkAPI) => {
  try {
    const { data: response } = await axios.delete<TResponse>(`${baseURL}/${id}`);
    if (response.success) return id;
    throw new Error(response.error ?? "Failed to delete tab");
  } catch (err) {
    return thunkAPI.rejectWithValue((err as Error).message);
  }
});

export const fetchPageLayouts = createAsyncThunk<{ id: string; name: string }[], void>(
  "tab/fetchPageLayouts",
  async (_, thunkAPI) => {
    const response = await getAllSchema();
    if (response?.success && response.data) return response.data;
    return thunkAPI.rejectWithValue(response?.error || `Failed to fetch page layouts!`);
  }
);

export const removePageLayout = createAsyncThunk<string, string>(
  "tab/deletePageLayout",
  async (layoutId, thunkAPI) => {
    const response = await delSchema(layoutId);
    if (response?.success && response.data) {
      return response.data; // the deleted ID
    }
    return thunkAPI.rejectWithValue(response?.error || `Failed to delete layout!`);
  }
);
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { TResponse } from "@/lib/helpers";
import { TFlow } from "@/types/flow";
const baseURL = "/api/flows";

// FETCH ALL FLOWS
export const fetchFlows = createAsyncThunk<
  TFlow[],
  void,
  { rejectValue: string }
>("flows/fetchAll", async (_, thunkAPI) => {
  try {
    const { data: response } = await axios.get<TResponse>(baseURL);
    if (response.success && response.data) return response.data;
    return thunkAPI.rejectWithValue(response.error ?? "Failed to fetch flows");
  } catch {
    return thunkAPI.rejectWithValue("Unexpected error while fetching flows");
  }
});

// CREATE FLOW
export const createFlowThunk = createAsyncThunk<
  TFlow,
  Omit<TFlow, "id">,
  { rejectValue: string }
>("flows/create", async (flow, thunkAPI) => {
  try {
    const { data: response } = await axios.post<TResponse>(baseURL, flow);
    if (response.success && response.data) return response.data;
    throw new Error(response.error ?? "Failed to create flow");
  } catch (err) {
    return thunkAPI.rejectWithValue((err as Error).message);
  }
});

// UPDATE FLOW
export const updateFlowThunk = createAsyncThunk<
  TFlow,
  TFlow,
  { rejectValue: string }
>("flows/update", async (flow, thunkAPI) => {
  try {
    const { id, ...rest } = flow;
    const { data: response } = await axios.put<TResponse>(`${baseURL}/${id}`, rest);
    if (response.success && response.data) return response.data;
    throw new Error(response.error ?? "Failed to update flow");
  } catch (err) {
    return thunkAPI.rejectWithValue((err as Error).message);
  }
});

// DELETE FLOW
export const deleteFlowThunk = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("flows/delete", async (id, thunkAPI) => {
  try {
    const { data: response } = await axios.delete<TResponse>(`${baseURL}/${id}`);
    if (response.success) return id;
    throw new Error(response.error ?? "Failed to delete flow");
  } catch (err) {
    return thunkAPI.rejectWithValue((err as Error).message);
  }
});

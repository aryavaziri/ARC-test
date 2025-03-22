import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { TCustomer } from "@/types/customer";
import axios from "axios";
import { TResponse } from "@/lib/helpers";

interface Customers {
  customers: TCustomer[] | [];
  loading: boolean;
  error: string | null;
}

const initialState: Customers = {
  customers: [],
  loading: false,
  error: null,
};

// Get Customers
export const getCustomers = createAsyncThunk<TCustomer[], void, { rejectValue: string }>(
  "customers/getCustomers",
  async (_, thunkAPI) => {
    try {
      const { data: response } = await axios.get<TResponse>('/api/customers');
      if (response?.success && response.data) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response?.error ?? "Failed to fetch customer data!");
    } catch (error) {
      return thunkAPI.rejectWithValue("An unexpected error occurred!");
    }
  }
);

// Add Customer
export const addCustomer = createAsyncThunk<TCustomer, Omit<TCustomer, "id">, { rejectValue: string }>(
  "customers/addCustomer",
  async (newCustomer, thunkAPI) => {
    try {
      const { data: response } = await axios.post<TResponse>('/api/customers', newCustomer);
      if (response?.success && response.data) {
        return response.data;
      }
      throw new Error(response?.error ?? "Failed to add customer!");
    } catch (error) {
      return thunkAPI.rejectWithValue((error as Error).message ?? "An unexpected error occurred!");
    }
  }
);

// Edit Customer
export const editCustomer = createAsyncThunk<TCustomer, Partial<TCustomer> & { id: string }, { rejectValue: string }>(
  "customers/editCustomer",
  async (updatedCustomer, thunkAPI) => {
    try {
      const { data: response } = await axios.put<TResponse>(`/api/customers/${updatedCustomer.id}`, updatedCustomer);
      if (response?.success && response.data) {
        return response.data;
      }
      throw new Error(response?.error ?? "Failed to edit customer!");
    } catch (error) {
      return thunkAPI.rejectWithValue((error as Error).message ?? "An unexpected error occurred!");
    }
  }
);

// Delete Customer
export const deleteCustomer = createAsyncThunk<string, string, { rejectValue: string }>(
  "customers/deleteCustomer",
  async (id, thunkAPI) => {
    try {
      const { data: response } = await axios.delete<TResponse>(`/api/customers/${id}`);
      if (response?.success) {
        return id; // return id to remove from state
      }
      throw new Error(response?.error ?? "Failed to delete customer!");
    } catch (error) {
      return thunkAPI.rejectWithValue((error as Error).message ?? "An unexpected error occurred!");
    }
  }
);

// Slice
const customerSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {},
  extraReducers: builder => {
    // Get
    builder
      .addCase(getCustomers.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCustomers.fulfilled, (state, action: PayloadAction<TCustomer[]>) => {
        state.loading = false;
        state.customers = action.payload;
      })
      .addCase(getCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch customers.";
      });

    // Add
    builder
      .addCase(addCustomer.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCustomer.fulfilled, (state, action: PayloadAction<TCustomer>) => {
        state.loading = false;
        state.customers = [...state.customers, action.payload];
      })
      .addCase(addCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add customer.";
      });

    // Edit
    builder
      .addCase(editCustomer.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editCustomer.fulfilled, (state, action: PayloadAction<TCustomer>) => {
        state.loading = false;
        const index = state.customers.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.customers[index] = action.payload;
        }
      })
      .addCase(editCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to edit customer.";
      });

    // Delete
    builder
      .addCase(deleteCustomer.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCustomer.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.customers = state.customers.filter(c => c.id !== action.payload);
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete customer.";
      });
  },
});

export default customerSlice.reducer;

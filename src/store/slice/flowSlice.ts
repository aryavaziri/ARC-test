import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchFlows,
  createFlowThunk,
  updateFlowThunk,
  deleteFlowThunk,
} from "./flowThunks";
import { TFlow } from "@/types/flow";

interface FlowState {
  flows: TFlow[];
  loading: boolean;
  error: string | null;
}

const initialState: FlowState = {
  flows: [],
  loading: false,
  error: null,
};

const flowSlice = createSlice({
  name: "flow",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFlows.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFlows.fulfilled, (state, action: PayloadAction<TFlow[]>) => {
        state.flows = action.payload;
        state.loading = false;
      })
      .addCase(fetchFlows.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch flows";
      })

      .addCase(createFlowThunk.fulfilled, (state, action: PayloadAction<TFlow>) => {
        state.flows.push(action.payload);
      })

      .addCase(updateFlowThunk.fulfilled, (state, action: PayloadAction<TFlow>) => {
        const index = state.flows.findIndex(f => f.id === action.payload.id);
        if (index !== -1) {
          state.flows[index] = action.payload;
        }
      })

      .addCase(deleteFlowThunk.fulfilled, (state, action: PayloadAction<string>) => {
        state.flows = state.flows.filter(f => f.id !== action.payload);
      });
  },
});

export default flowSlice.reducer;

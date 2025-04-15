import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchTabs, createTabThunk, updateTabThunk, deleteTabThunk, fetchPageLayouts, removePageLayout } from "./tabThunks";
import { TTab } from "@/types/layouts";

interface TabState {
  tabs: TTab[];
  pageLayouts: { name: string; id: string }[];
  activeTab: string | null;
  activeLayout: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: TabState = {
  tabs: [],
  pageLayouts: [],
  activeTab: null,
  activeLayout: null,
  loading: false,
  error: null,
};

const tabSlice = createSlice({
  name: "tab",
  initialState,
  reducers: {
    setActiveTab(state, action: PayloadAction<string>) {
      state.activeTab = action.payload;
      const tab = state.tabs.find((t) => t.label === action.payload);
      state.activeLayout = tab?.layouts[0]?.label || null;
    },
    setActiveLayout(state, action: PayloadAction<string>) {
      state.activeLayout = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTabs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTabs.fulfilled, (state, action: PayloadAction<TTab[]>) => {
        state.tabs = action.payload;
        state.loading = false;
      })
      .addCase(fetchTabs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch tabs";
      })

      .addCase(fetchPageLayouts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPageLayouts.fulfilled, (state, action: PayloadAction<{ name: string; id: string }[]>) => {
        state.pageLayouts = action.payload;
        state.loading = false;
      })
      .addCase(fetchPageLayouts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch page layouts";
      })

      .addCase(removePageLayout.fulfilled, (state, action) => {
        state.pageLayouts = state.pageLayouts.filter((l) => l.id !== action.payload);
      })

      .addCase(createTabThunk.fulfilled, (state, action: PayloadAction<TTab>) => {
        state.tabs.push(action.payload);
      })
      .addCase(updateTabThunk.fulfilled, (state, action: PayloadAction<TTab>) => {
        const index = state.tabs.findIndex(t => t.id === action.payload.id);
        if (index !== -1) state.tabs[index] = action.payload;
      })
      .addCase(deleteTabThunk.fulfilled, (state, action: PayloadAction<string>) => {
        state.tabs = state.tabs.filter(tab => tab.id !== action.payload);
      });
  },
});

export const { setActiveTab, setActiveLayout } = tabSlice.actions;
export default tabSlice.reducer;

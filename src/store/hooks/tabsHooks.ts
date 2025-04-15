import { useAppDispatchWithSelector } from "./reduxHooks";
import { RootState } from "../store";
import {
  fetchTabs,
  createTabThunk,
  deleteTabThunk,
  updateTabThunk,
  fetchPageLayouts,
  removePageLayout,
} from "../slice/tabThunks";
import {
  setActiveTab,
  setActiveLayout,
} from "../slice/tabSlice";
import { TTab } from "@/types/layouts";

export const useTab = () => {
  const { dispatch, useAppSelector } = useAppDispatchWithSelector();

  const tabs = useAppSelector((state: RootState) => state.tabs.tabs);
  const pageLayouts = useAppSelector((state: RootState) => state.tabs.pageLayouts);
  const activeTab = useAppSelector((state: RootState) => state.tabs.activeTab);
  const activeLayout = useAppSelector((state: RootState) => state.tabs.activeLayout);
  const loading = useAppSelector((state: RootState) => state.tabs.loading);
  const error = useAppSelector((state: RootState) => state.tabs.error);

  const getTabs = async () => {
    await dispatch(fetchTabs());
  };

  const getPageLayouts = async () => {
    await dispatch(fetchPageLayouts());
  };

  const createTab = async (data: Omit<TTab, "id">) => {
    await dispatch(createTabThunk(data));
  };

  const updateTab = async (tab: TTab) => {
    await dispatch(updateTabThunk(tab));
  };

  const deleteTab = async (id: string) => {
    await dispatch(deleteTabThunk(id));
  };

  const deleteLayout = async (id: string) => {
    await dispatch(removePageLayout(id));
  };

  const selectTab = (label: string) => dispatch(setActiveTab(label));
  const selectLayout = (label: string) => dispatch(setActiveLayout(label));

  return {
    tabs,
    pageLayouts,
    activeTab,
    activeLayout,
    loading,
    error,
    getPageLayouts,
    getTabs,
    createTab,
    updateTab,
    deleteTab,
    selectTab,
    selectLayout,
    deleteLayout
  };
};

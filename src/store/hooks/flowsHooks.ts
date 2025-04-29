import { useAppDispatchWithSelector } from "./reduxHooks";
import { RootState } from "../store";
import { fetchFlows, createFlowThunk, updateFlowThunk, deleteFlowThunk } from "../slice/flowThunks";
import { flowGeneralReturnSchema, TFlow, TFlowGeneralReturn } from "@/types/flow";
import axios from "axios";
import { handleWithTryCatch, TResponse } from "@/lib/helpers";
import { toast } from "react-toastify";
import { UseFormReturn } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";

export const useFlow = () => {
  const { dispatch, useAppSelector } = useAppDispatchWithSelector();

  const flows = useAppSelector((state: RootState) => state.flows.flows);
  const loading = useAppSelector((state: RootState) => state.flows.loading);
  const error = useAppSelector((state: RootState) => state.flows.error);

  const getFlows = async () => {
    await dispatch(fetchFlows());
  };

  const createFlow = async (data: Omit<TFlow, "id">) => {
    await dispatch(createFlowThunk(data));
  };

  const updateFlow = async (flow: TFlow) => {
    await dispatch(updateFlowThunk(flow));
  };

  const deleteFlow = async (id: string) => {
    await dispatch(deleteFlowThunk(id));
  };

  const query = new URLSearchParams(window.location.search).toString();

  const runFlow = async (
    flowId: string,
    data?: Record<string, any>
  ): Promise<TResponse<TFlowGeneralReturn>> => {

    return handleWithTryCatch(async () => {
      // console.log(query)
      console.log(data)
      const res = await axios.post(`/api/flows/${flowId}/run2?${query}`, data);
      if (!res.data.success || res.data.error || res.status === 500) {
        throw new Error(res.data.error ?? "Unknown flow error");
      }
      // console.log("Flow response", res.data.data);

      /// How to triger Flow action from here?
      /// 1. Check if the flow has a return value and if it is valid
      /// 2. If valid, call the handleFlowAction function with the action and data
      /// 3. If not valid, show an error message
      const validation = flowGeneralReturnSchema.safeParse(res.data.data);
      if (!validation.success) {
        console.warn("❌ Invalid flow return format", validation.error);
        toast.error("Invalid flow response.");
        return res.data;
      }
      console.log("Flow action", validation.data);
      handleFlowAction(validation.data);
      return res.data.data;
    });
  };

  const handleFlowAction = (
    action: TFlowGeneralReturn,
    helpers?: {
      setValue?: (fieldId: string, value: any) => void;
      updateLayoutItem?: (fieldId: string, updates: Partial<any>) => void;
      fields?: { id: string; label: string }[];
    }
  ) => {
    if (!action) return;

    switch (action.action) {
      case "setValue": {
        const { setValue } = helpers || {};
        if (!setValue) return;
        setValue(action.targetFieldId, action.value);
        break;
      }

      case "updateLayoutItem": {
        const { updateLayoutItem } = helpers || {};
        if (!updateLayoutItem) return;
        updateLayoutItem(action.targetFieldId, action.updates);
        break;
      }

      case "toast":
        toast(action.message);
        break;

      case "redirect": {
        const { url, queryParams } = action;
        const query = queryParams
          ? `?${new URLSearchParams(queryParams).toString()}`
          : "";
        window.location.assign(`${url}${query}`);
        break;
      }

      default:
        console.warn("⚠️ Unknown flow action:", action);
    }

  };

  const runAndHandleFlow = async (
    flowId: string,
    input?: Record<string, any> | null,
    helpers?: {
      methods?: UseFormReturn<any>;
      fields?: { id: string; label: string }[];
      label?: string; // Optional: show name in toast
      updateLayoutItem?: (fieldId: string, updates: Partial<any>) => void;
    }
  ) => {
    const flow = flows.find((f) => f.id === flowId);
    if (!flow) {
      toast.error(`Flow not found for ID "${flowId}"`);
      return;
    }

    const res = await toast.promise(
      runFlow(flow.id, input ?? undefined),
      {
        pending: `Running "${helpers?.label || flow.name}"...`,
        success: `"${helpers?.label || flow.name}" completed!`,
        error: `"${helpers?.label || flow.name}" failed.`,
      }
    );

    if (!res?.success) return;

    const validation = flowGeneralReturnSchema.safeParse(res.data);
    if (!validation.success) {
      console.warn("❌ Invalid flow return format", validation.error);
      toast.error("Invalid flow response.");
      return;
    }

    handleFlowAction(validation.data, helpers);
  };

  return {
    flows,
    loading,
    error,
    getFlows,
    createFlow,
    updateFlow,
    deleteFlow,
    runFlow,
    runAndHandleFlow,
    handleFlowAction
  };
};

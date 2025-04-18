import { useAppDispatchWithSelector } from "./reduxHooks";
import { RootState } from "../store";
import {
  fetchFlows,
  createFlowThunk,
  updateFlowThunk,
  deleteFlowThunk,
} from "../slice/flowThunks";
import { TFlow } from "@/types/flow";
import axios from "axios";
import { handleWithTryCatch, TResponse } from "@/lib/helpers";
import { toast } from "react-toastify";
import { UseFormReturn } from "react-hook-form";

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

  const runFlow = async (flowId: string, data?: any): Promise<TResponse> => {
    return handleWithTryCatch(async () => {
      const res = await axios.put<TResponse>(`/api/flows/${flowId}/run`, data);

      if (!res.data.success || res.data.error || res.status == 500) {
        throw new Error(res.data.error ?? "Unknown flow error");
      }

      return res.data.data; // We only return the actual data here
    });
  };

  const handleFlowAction = (
    action: any,
    setValue: (name: string, value: any) => void,
    fields: { id: string; label: string }[]
  ) => {
    if (!action) return;

    switch (action.action) {
      case 'setValue':
        if (action.targetFieldName) {
          const field = fields.find(f => f.label === action.targetFieldName);
          if (!field) {
            console.warn("⚠️ Field not found for action:", action);
            return;
          }
          setValue(field.id, action.value);
          console.log("Set value for", field.id, action.value);
        }
        break;

      case 'toast':
        toast(action.message || 'Flow action');
        break;

      default:
        console.warn("⚠️ Unknown flow action:", action);
    }
  };

  const handleRunFlow = async (
    flowId: string,
    fieldId: string,
    methods: UseFormReturn<any>,
    fields: { id: string; label: string }[]
  ) => {
    const flow = flows.find(f => f.id === flowId);
    if (!flow) {
      toast.error(`Flow not found for field "${fieldId}"`);
      return;
    }

    const res = await toast.promise(
      runFlow(flow.id, { value: methods.getValues()[fieldId] }),
      {
        pending: `Running "${flow.name}"...`,
        success: `"${flow.name}" completed!`,
        error: `"${flow.name}" failed.`,
      }
    );

    if (res?.success) {
      handleFlowAction(res.data, methods.setValue, fields);
    }
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
    handleRunFlow,
    handleFlowAction
  };
};

import { useState, useCallback } from "react";
import axios from "axios";
import { TResponse } from "@/lib/helpers";
import { dependencySchema, TDependency } from "@/types/dynamicModel";
import { LineItem } from "@/models/Dynamic/DynamicModel";

export function useDependency(referenceFieldId: string) {
  const [dependencies, setDependencies] = useState<TDependency[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDependencies = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get<TResponse>(`/api/dynamic-models/dependencies/${referenceFieldId}`);
      setDependencies(data.data);
    } catch (err) {
      console.error("❌ Failed to fetch dependencies", err);
    } finally {
      setLoading(false);
    }
  }, [referenceFieldId]);

  const createDependency = useCallback(
    async (data: Omit<TDependency, 'id'>) => {
      try {
        const { referenceFieldId, controllingFieldId, referenceLineItemIds } =
          dependencySchema.omit({ id: true }).parse(data);

        const { data: response } = await axios.post<TResponse>(
          `/api/dynamic-models/dependencies/${referenceFieldId}`,
          {
            controllingFieldId,
            referenceLineItemIds,
          }
        );

        setDependencies((prev) => [...prev, response.data]);
        return response;
      } catch (err) {
        console.error("❌ Failed to create dependency", err);
      }
    },
    []
  );

  const deleteDependency = useCallback(async (id: string) => {
    try {
      await axios.delete(`/api/dynamic-models/dependencies/-/${id}`);
      setDependencies((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      console.error("❌ Failed to delete dependency", err);
    }
  }, []);

  const updateDependency = useCallback(async (id: string, updates: Partial<TDependency>) => {
    try {
      const { data } = await axios.put<TResponse>(`/api/dependencies/-/${id}`, updates);
      setDependencies((prev) => prev.map((d) => (d.id === id ? data.data : d)));
    } catch (err) {
      console.error("❌ Failed to update dependency", err);
    }
  }, []);

  const getDependentData = useCallback(async (controllingFieldId: string, controllingRecordIds: string[]) => {
    try {
      const res = await axios.post<TResponse>('/api/dynamic-models/dependencies/filterLineItem/', {
        controllingFieldId,
        controllingRecordIds,
      });
      return res.data.data as LineItem[]
    } catch (err) {
      console.error("❌ Failed to update dependency", err);
    }
  }, []);

  return {
    dependencies,
    loading,
    fetchDependencies,
    createDependency,
    deleteDependency,
    updateDependency,
    getDependentData
  };
}

// const { data: response } = await axios.get<TResponse>(`/api/dynamic-models/dependencies/${fieldId}`)
import { useEffect, useCallback, useState } from "react";
import { unwrapResult } from "@reduxjs/toolkit";
import { useAppDispatchWithSelector } from "./reduxHooks";
import { RootState } from "@/store/store";
import { TCustomer } from "@/types/customer";
import { addCustomer, deleteCustomer, editCustomer, getCustomers } from "../slice/customerSlice";



export const useCustomerModel = () => {
    const { dispatch, useAppSelector } = useAppDispatchWithSelector();
    const items = useAppSelector((state: RootState) => state.customer.customers)
    const loading = useAppSelector((state: RootState) => state.customer.loading)
    const error = useAppSelector((state: RootState) => state.customer.error)

    const [isFetched, setIsFetched] = useState(false);

    useEffect(() => {
        if (!loading && items.length === 0 && !isFetched) {
            handleFetch();
        }
    }, []);

    const fetch = async () => {
        const resultAction = await dispatch(getCustomers());
        const items = unwrapResult(resultAction);
        return items;
    };

    const handleFetch = useCallback(async () => {
        try {
            await fetch();
            setIsFetched(true);
        } catch (error) {
            console.log(error);
        }
    }, []);

    // Updated `addNewItem` to make `id` optional using Omit
    const addNewItem = async (
        newItem: Omit<TCustomer, "id"> // id is not required for new items
    ) => {
        const resultAction = await dispatch(addCustomer(newItem));
        const item = unwrapResult(resultAction);
        return item;
    };

    const updateExistingItem = async (
        updatedItem: TCustomer
    ) => {
        const result = await dispatch(editCustomer(updatedItem));
        return unwrapResult(result);
    };

    const deleteExistingItem = async (id: string) => {
        const result = await dispatch(deleteCustomer(id));
        return unwrapResult(result);
    };

    return {
        customers:items,
        loading,
        error,
        addNewItem,
        updateExistingItem,
        deleteExistingItem,
        refetch: handleFetch,
    };
};

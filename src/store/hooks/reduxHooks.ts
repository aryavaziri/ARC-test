import { useDispatch, useSelector, useStore } from "react-redux";
import type { AppDispatch, AppStore, RootState } from "../store";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();

export const useAppDispatchWithSelector = () => {
  const dispatch = useAppDispatch();

  // Rename `selector` to `useAppSelector` so it follows the custom hook naming convention
  const useAppSelectorWithState = <TSelected>(selector: (state: RootState) => TSelected): TSelected => {
    return useSelector(selector);
  };

  return { dispatch, useAppSelector: useAppSelectorWithState };
};

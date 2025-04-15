import { configureStore } from "@reduxjs/toolkit";
import user from "./slice/userSlice";
import dynamicModel from "./slice/dynamicModelSlice";
import tabs from "./slice/tabSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      dynamicModel,
      tabs,
      user,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

import { configureStore } from "@reduxjs/toolkit";

import user from "./slice/userSlice";
import customer from "./slice/customerSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      user,
      customer
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

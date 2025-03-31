import { configureStore } from "@reduxjs/toolkit";
import { themeReducer } from "./features/themeSlice";

// Configure the store using the reducers we defined in the features
const store = configureStore({
  reducer: {
    theme: themeReducer,
  },
});

// All we do in redux is simply get state and dispatch actions
// Since, it's TypeScript, we can use the `RootState`
// and `AppDispatch` types to get the state and dispatch actions

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
// Export the store as default
export default store;
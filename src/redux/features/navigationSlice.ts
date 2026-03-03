import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type NavigationState = {
  isNavigating: boolean;
};

const initialState: NavigationState = {
  isNavigating: false,
};

const navigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    setNavigating: (state, action: PayloadAction<boolean>) => {
      state.isNavigating = action.payload;
    },
  },
});

export const { setNavigating } = navigationSlice.actions;
export const navigationReducer = navigationSlice.reducer;

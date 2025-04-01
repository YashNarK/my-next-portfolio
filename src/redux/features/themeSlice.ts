import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define types
type Mode = "light" | "dark";
type ThemeState = {
  mode: Mode;
};
// Define Name
const name = "theme";
// Function to get initial theme safely
const getInitialTheme = (): Mode => {
  if (typeof window !== "undefined") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return "light"; // Default theme during SSR
};

// Initial state
const initialState: ThemeState = {
  mode: getInitialTheme(),
};
// create Slice
const themeSlice = createSlice({
  name,
  initialState,
  reducers: {
    toggleTheme: (state: ThemeState) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setTheme: (state: ThemeState, action: PayloadAction<Mode>) => {
      state.mode = action.payload;
    },
  },
});

// export action and reducer

export const { toggleTheme, setTheme } = themeSlice.actions;
export const themeReducer = themeSlice.reducer;

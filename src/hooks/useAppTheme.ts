"use client";

import { darkTheme, lightTheme } from "@/lib/theme";
import { useAppSelector } from "./useReduxCustom";

// Custom hook to get theme settings based on redux stored modes

export const useAppTheme = () => {
  const mode = useAppSelector((state) => state.theme.mode);
  return mode === "light" ? lightTheme : darkTheme;
};

"use client";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxCustom";
import { toggleTheme } from "@/redux/features/themeSlice";
import { DarkMode, Sunny } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";

const ThemeToggleButton = () => {
  const mode = useAppSelector((state) => state.theme.mode);
  const dispatch = useAppDispatch();

  const animation = {
    initial: { x: -20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 20, opacity: 0 },
  };

  return (
    <div>
      <IconButton
        onClick={() => dispatch(toggleTheme())}
        color="inherit"
        aria-label="theme-toggle-button"
        size="large"
        sx={{ overflow: "hidden", position: "relative", width: 48, height: 48 }}
      >
        <AnimatePresence mode="wait">
          {mode === "dark" ? (
            <motion.div
              key="sun"
              transition={{ duration: 0.3, ease: "easeInOut" }}
              style={{ position: "absolute" }}
              {...animation}
            >
              <Sunny />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              transition={{ duration: 0.3, ease: "easeInOut" }}
              style={{ position: "absolute" }}
              {...animation}
            >
              <DarkMode />
            </motion.div>
          )}
        </AnimatePresence>
      </IconButton>
    </div>
  );
};

export default ThemeToggleButton;

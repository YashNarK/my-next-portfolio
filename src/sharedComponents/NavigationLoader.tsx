"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/useReduxCustom";
import { setNavigating } from "@/redux/features/navigationSlice";
import { Backdrop, Box, CircularProgress, Typography } from "@mui/material";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export default function NavigationLoader() {
  const dispatch = useAppDispatch();
  const isNavigating = useAppSelector(
    (state) => state.navigation.isNavigating
  );
  const pathname = usePathname();
  const prevPathname = useRef(pathname);

  // Clear loading when navigation completes (pathname changed)
  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      dispatch(setNavigating(false));
    }
  }, [pathname, dispatch]);

  // Global click listener to detect internal link clicks
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as Element).closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href) return;
      // Skip external links, mailto, tel, hash-only, or same page
      if (
        href.startsWith("http") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("#") ||
        href === pathname
      )
        return;
      dispatch(setNavigating(true));
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [dispatch, pathname]);

  return (
    <Backdrop
      open={isNavigating}
      sx={{
        zIndex: 9999,
        color: "#fff",
        flexDirection: "column",
        gap: 3,
        backdropFilter: "blur(4px)",
      }}
    >
      <CircularProgress color="inherit" size={64} thickness={4} />
      <Box textAlign="center">
        <Typography variant="h6" fontWeight="bold">
          Loading...
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>
          Please wait while the page loads
        </Typography>
      </Box>
    </Backdrop>
  );
}

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

      const isSamePageHashNavigation = (() => {
        try {
          const url = new URL(href, window.location.origin);
          return (
            url.origin === window.location.origin &&
            url.pathname === pathname &&
            url.hash.length > 0
          );
        } catch {
          return false;
        }
      })();

      // Skip external links, mailto, tel, hash-only, or same page
      if (
        href.startsWith("http") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("#") ||
        isSamePageHashNavigation ||
        href === pathname
      )
        return;
      dispatch(setNavigating(true));
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [dispatch, pathname]);

  // If only the hash changes on the same pathname, the route does not change.
  // Ensure loader is not left open from any edge case.
  useEffect(() => {
    const handleHashChange = () => {
      dispatch(setNavigating(false));
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [dispatch]);

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

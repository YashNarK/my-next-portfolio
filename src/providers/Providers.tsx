"use client"; // Ensures this file runs only on the client side

import store from "@/redux/store"; // Import Redux store
import { ThemeProvider } from "@emotion/react"; // MUI ThemeProvider for theming
import { CssBaseline } from "@mui/material"; // Resets default CSS styles
import { ReactNode, useEffect, useState } from "react"; // React utilities
import { Provider } from "react-redux"; // Redux Provider
import { useAppTheme } from "@/hooks/useAppTheme"; // Custom theme hook
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ErrorFallback from "@/components/errorPageComponents/ErrorFallback";
import { ErrorBoundary } from "react-error-boundary";
// Import the key from the standalone module (and the config as a type only) so
// this file pulls no Firebase runtime code into the server module graph.
import { PROFILE_QUERY_KEY } from "@/lib/queryKeys";
import type { ProfileConfig } from "@/lib/firebase/site-config-crud";
// A client-side QueryClientProvider for React Query
// This is used for data fetching and caching
// It allows components to fetch data and manage server state
// without needing to pass props down through the component tree
// or manage loading states manually.
export const QueryProvider = ({
  children,
  initialProfile,
}: {
  children: ReactNode;
  initialProfile?: ProfileConfig | null;
}) => {
  const [client] = useState(() => {
    const queryClient = new QueryClient();
    // Seed the profile picture the server already resolved, so the homepage
    // doesn't re-fetch it from Firestore before it can start loading the photo.
    if (initialProfile) {
      queryClient.setQueryData(PROFILE_QUERY_KEY, initialProfile);
    }
    return queryClient;
  });

  return (
    <QueryClientProvider client={client}>
      <ReactQueryDevtools initialIsOpen={false} />
      {children}
    </QueryClientProvider>
  );
};

// A client-side ThemeProvider that applies the theme dynamically
const ClientThemeProvider = ({ children }: { children: ReactNode }) => {
  const theme = useAppTheme(); // Gets the theme mode from Redux
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Ensures consistent styles */}
      {children}
    </ThemeProvider>
  );
};

// The main Providers component that wraps the entire app
export const Providers = ({
  children,
  initialProfile,
}: {
  children: ReactNode;
  initialProfile?: ProfileConfig | null;
}) => {
  const [isClient, setIsClient] = useState(false);

  // 🛠️ **Fix #1: Hydration Issue**
  // Prevents mismatches between SSR (server-rendered) and CSR (client-rendered) content
  useEffect(() => {
    setIsClient(true); // Runs only on the client side
  }, []);

  if (!isClient) {
    return null; // Avoids rendering mismatched content on the server
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Provider store={store}>
        {/* 🛠️ **Fix #2: Circular Dependency Issue** */}
        {/* We wrap `ClientThemeProvider` inside `<Provider>` to prevent `useAppTheme()` from 
          accessing the Redux store before it's available */}
        <QueryProvider initialProfile={initialProfile}>
          <ClientThemeProvider>{children}</ClientThemeProvider>
        </QueryProvider>
      </Provider>
    </ErrorBoundary>
  );
};

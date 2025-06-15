"use client";

import { useAuth } from "@/hooks/useAuth";
import { Box, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { authenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && !authenticated) {
      router.replace("/login");
    }
  }, [loading, authenticated, router]);
  if (loading)
    return (
      <>
        <Box
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
          alignItems={"center"}
          mt={20}
          minHeight={"100%"}
        >
          <Typography variant="codeLike">Checking Authentication...</Typography>
        </Box>
      </>
    );
  return <>{children}</>;
}

import "./globals.css";
import type { Metadata } from "next";
import { Providers } from "@/providers/Providers";
import FloatingNavBar from "../components/FloatingNavBar";
import { Box } from "@mui/material";
export const metadata: Metadata = {
  title: "Narendran A I's portfolio",
  description:
    "A portfolio website showcasing work and skills of Narendran A I.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <FloatingNavBar />
          <Box component={"main"} p={3} mt={"80px"} color={"inherit"}>
            {children}
          </Box>
        </Providers>
      </body>
    </html>
  );
}

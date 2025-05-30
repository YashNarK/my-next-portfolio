import { Providers } from "@/providers/Providers";
import { Box } from "@mui/material";
import type { Metadata } from "next";
import FloatingNavBar from "../components/FloatingNavBar";
import "./globals.css";
import BlackHoleCursor from "@/sharedComponents/animations/blackholeCursorAnimation/BlackHoleCursor";
import Footer from "@/sharedComponents/Footer";
import SceneBackground from "@/sharedComponents/animations/backgroundAnimations/Scenebackground";
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
          <BlackHoleCursor />

          <Box
            className="firstChildOfBody"
            sx={{
              display: "flex",
              flexDirection: "column",
              backgroundColor: "background.default",
            }}
          >
            <FloatingNavBar />
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                mt: "50px",
                color: "inherit",
              }}
            >
              <SceneBackground />
              {children}
              <Footer />
            </Box>
          </Box>
        </Providers>
      </body>
    </html>
  );
}

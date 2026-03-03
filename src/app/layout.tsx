import { Providers } from "@/providers/Providers";
import { Box } from "@mui/material";
import type { Metadata } from "next";
import FloatingNavBar from "../components/navbarComponents/FloatingNavBar";
import "./globals.css";
import BlackHoleCursor from "@/sharedComponents/animations/blackholeCursorAnimation/BlackHoleCursor";
import Footer from "@/sharedComponents/Footer";
import SceneBackground from "@/sharedComponents/animations/backgroundAnimations/Scenebackground";
import NavigationLoader from "@/sharedComponents/NavigationLoader";
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
          <NavigationLoader />

          <Box
            className="firstChildOfBody"
            sx={{
              display: "flex",
              flexDirection: "column",
              backgroundColor: "background.default",
              minHeight: "100vh",
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
            </Box>
            <Footer />
          </Box>
        </Providers>
      </body>
    </html>
  );
}

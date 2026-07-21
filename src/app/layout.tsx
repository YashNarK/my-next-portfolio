import { Providers } from "@/providers/Providers";
import { Box } from "@mui/material";
import type { Metadata } from "next";
import FloatingNavBar from "../components/navbarComponents/FloatingNavBar";
import "./globals.css";
import BlackHoleCursor from "@/sharedComponents/animations/blackholeCursorAnimation/BlackHoleCursor";
import Footer from "@/sharedComponents/Footer";
import SceneBackground from "@/sharedComponents/animations/backgroundAnimations/Scenebackground";
import NavigationLoader from "@/sharedComponents/NavigationLoader";
const siteUrl = "https://www.narendranai.work";
const siteName = "Narendran A I";
const title = "Narendran A I — Senior Full Stack Developer";
const description =
  "Senior Full Stack Developer with 5+ years building microservices, event-driven systems and multi-frontend architectures across the JavaScript/TypeScript and Python ecosystems.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s | Narendran A I",
  },
  description,
  applicationName: siteName,
  authors: [{ name: "Narendran A I", url: siteUrl }],
  creator: "Narendran A I",
  keywords: [
    "Narendran A I",
    "Senior Full Stack Developer",
    "Software Engineer",
    "Microservices",
    "Event-Driven Systems",
    "React",
    "Next.js",
    "Node.js",
    "Python",
    "FastAPI",
    "TypeScript",
    "Portfolio",
  ],
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName,
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
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

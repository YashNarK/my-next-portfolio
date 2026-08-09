import { Providers } from "@/providers/Providers";
import { Box } from "@mui/material";
import type { Metadata } from "next";
import FloatingNavBar from "../components/navbarComponents/FloatingNavBar";
import "./globals.css";
import BlackHoleCursorGate from "@/sharedComponents/animations/blackholeCursorAnimation/BlackHoleCursorGate";
import Footer from "@/sharedComponents/Footer";
import SceneBackgroundGate from "@/sharedComponents/animations/backgroundAnimations/SceneBackgroundGate";
import NavigationLoader from "@/sharedComponents/NavigationLoader";
import ChatBotWidgetGate from "@/components/chatbotComponents/ChatBotWidgetGate";
import { getProfileConfigServer } from "@/lib/firebase/profile-server";
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Resolved during SSR/ISR so the browser can begin downloading the profile
  // photo from the HTML itself, in parallel with the JS bundle, instead of
  // waiting for hydration + a Firestore round trip to even learn its URL.
  const initialProfile = await getProfileConfigServer();
  const profileImageUrl = initialProfile?.imageUrl || initialProfile?.thumbUrl;

  return (
    <html lang="en">
      <body>
        {profileImageUrl && (
          // Rendered unoptimized by <ImageIntro/>, so this href is byte-for-byte
          // the request the <img> makes and the preload is guaranteed to be reused.
          <link
            rel="preload"
            as="image"
            href={profileImageUrl}
            fetchPriority="high"
          />
        )}
        <Providers initialProfile={initialProfile}>
          <BlackHoleCursorGate />
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
              <SceneBackgroundGate />
              {children}
            </Box>
            <Footer />
          </Box>
          <ChatBotWidgetGate />
        </Providers>
      </body>
    </html>
  );
}

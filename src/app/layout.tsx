import type { Metadata } from "next";
import { Providers } from "@/providers/Providers";

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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

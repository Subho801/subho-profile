import type { Metadata } from "next";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Subho | Gaming Profile",
  description: "Developer, gamer, and anime enthusiast.",
  generator: "v0.app",
  icons: {
    icon: [
      { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark bg-background">
      <head>
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:FILL@0"
  />

  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:opsz,wght@8..144,400..700"
  />
</head>

      <body className="font-sans antialiased bg-background">
        <TooltipProvider>
          {children}
          {process.env.NODE_ENV === "production" && <Analytics />}
        </TooltipProvider>
      </body>
    </html>
  );
}
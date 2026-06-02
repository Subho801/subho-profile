import type { Metadata } from "next";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://subho.site"),

  title: "Subho | Gaming Profile",
  description: "Developer, gamer, and anime enthusiast.",
  generator: "v0.app",

  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },

  openGraph: {
    title: "Subho | Gaming Profile",
    description: "Developer, gamer, and anime enthusiast.",
    url: "https://subho.site",
    siteName: "Subho",
    images: [
      {
        url: "/og-image.gif",
        width: 1200,
        height: 630,
        alt: "Subho Gaming Profile",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Subho | Gaming Profile",
    description: "Developer, gamer, and anime enthusiast.",
    images: ["/og-image.gif"],
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
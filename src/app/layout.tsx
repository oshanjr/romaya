import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ROMAYA — For All Your Glamorous Needs",
    template: "%s | ROMAYA",
  },
  description:
    "Discover the latest in glamorous fashion at ROMAYA. Premium clothing, accessories, and more — designed to make you shine.",
  keywords: ["ROMAYA", "fashion", "clothing", "glamour", "Sri Lanka", "women's fashion"],
  authors: [{ name: "ROMAYA" }],
  creator: "ROMAYA",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "ROMAYA",
    title: "ROMAYA — For All Your Glamorous Needs",
    description: "Discover the latest in glamorous fashion at ROMAYA.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="antialiased bg-white text-gray-900">
        <Providers>
          {children}
          <Toaster position="bottom-right" richColors />
        </Providers>
      </body>
    </html>
  );
}

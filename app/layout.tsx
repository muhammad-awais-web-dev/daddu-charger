import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Daddu Charger | Premium Gaming PCs & Accessories Store",
    template: "%s | Daddu Charger",
  },
  description: "Rawalpindi's premium gaming store. Powering your gaming experience with custom-built gaming PCs, high-performance racing wheels, and premium gaming accessories. Delivering across Pakistan.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
  },
};

import { StoreProviders } from "@/components/StoreProviders";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col">
        <StoreProviders>
          <Header />
          <div className="pt-24 flex-1 flex flex-col relative z-10">
            {children}
          </div>
          <Footer />
        </StoreProviders>
      </body>
    </html>
  );
}

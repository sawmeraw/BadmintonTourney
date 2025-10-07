import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ReactQueryProvider } from "./providers";
import { Toaster } from "react-hot-toast";
import React from "react";
import { ThemeRegistry } from "./providers";
import { inter } from "./fonts";

export const metadata: Metadata = {
  title: "Tourney - Badminton Tournament Engine",
  description: "Manage your badminton tournaments with ease.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
        <ThemeRegistry>
          <div className="flex min-h-screen flex-col">
            <ReactQueryProvider>
              <Toaster position="top-center"/>
              <Header />
              {children}
              <Footer />
            </ReactQueryProvider>
          </div>
        </ThemeRegistry>
      </body>
    </html>
  );
}
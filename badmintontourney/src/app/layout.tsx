import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";


const inter = Inter({ subsets: ["latin"] });

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
        <div className="flex min-h-screen flex-col">
          <Header />
          {/* Page content from your page.tsx files will be rendered here */}
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
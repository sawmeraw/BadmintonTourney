// File: app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Badminton Tournament Engine",
  description: "Manage your badminton tournaments with ease.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-800`}>
        <div className="flex min-h-screen flex-col">
          {/* Header */}
          <header className="bg-white shadow-sm">
            <div className="container mx-auto px-4 py-4">
              <h1 className="text-2xl font-bold text-gray-900">
                Tournament Engine
              </h1>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>

          {/* Footer */}
          <footer className="bg-white border-t mt-auto">
            <div className="container mx-auto px-4 py-4 text-center text-gray-500">
              <p>&copy; 2025 Badminton Tournament Engine. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
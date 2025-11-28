import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { Sidebar } from "@/components/layout/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Short Form Factory",
  description: "Professional Short Form Video Production",
};

import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark">
      <body className={inter.className}>
        <AuthProvider>
          <div className="flex min-h-screen bg-background text-foreground">
            <Sidebar />
            <main className="flex-1 md:ml-72 p-8 transition-all duration-300">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}

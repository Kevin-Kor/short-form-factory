import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { Sidebar } from "@/components/layout/Sidebar";
import { BottomNav } from "@/components/layout/BottomNav";

import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Short Form Factory",
  description: "Professional Short Form Video Production",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <AuthProvider>
          <div className="flex min-h-screen bg-background text-accent">
            {/* Sidebar for Desktop */}
            <div className="hidden md:block">
              <Sidebar />
            </div>

            <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 overflow-y-auto">
              {children}
            </main>

            {/* Bottom Nav for Mobile */}
            <BottomNav />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}

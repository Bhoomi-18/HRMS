import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { ClientLayout } from "../components/layout/ClientLayout";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HRMS Pro",
  description: "Global HRMS Portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-200/50 flex justify-center`}
      >
        {/* Mobile App Container Frame */}
        <div className="w-full max-w-md min-h-screen sm:h-[100dvh] sm:my-auto sm:max-h-[850px] bg-background sm:rounded-[2rem] sm:shadow-2xl sm:border-8 border-slate-800 relative overflow-hidden flex flex-col">
          <Providers>
            <ClientLayout>
              {children}
            </ClientLayout>
            <Toaster position="bottom-center" richColors />
          </Providers>
        </div>
      </body>
    </html>
  );
}

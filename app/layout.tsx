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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100 flex justify-center`}
      >
        <div className="w-full max-w-md h-[100dvh] bg-background shadow-2xl relative overflow-hidden flex flex-col border-x border-border">
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

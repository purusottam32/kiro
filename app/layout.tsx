import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
//clerk
import { ClerkProvider } from '@clerk/nextjs'
//redux
import StoreProvider from '@/lib/store/StoreProvider';
import { Toaster } from "@/components/ui/sonner"
//theme
import { ThemeProvider } from "@/components/theme-provider"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kiro | Lightweight Project Management for Startups",
  description: "Ditch the enterprise bloat. Kiro is a fast, agile project management tool built specifically for MSMEs, early-stage startups, and lean dev teams to ship faster.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StoreProvider>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
             {children}
        <Toaster richColors />
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}

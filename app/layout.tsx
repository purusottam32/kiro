
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import {ThemeProvider} from "../components/theme-provider";

import { ClerkProvider } from '@clerk/nextjs';
import Header from "../components/header";
import { Toaster } from "sonner";

const customTheme = {
  colors: {
    primary: "#0A5BFF",
    colorBackground: "#0f172a",
    colorInputBackground: "#1e293b",
    colorNeutral: "#64748b",
  },
  fonts: {
    buttonText: '"Inter", sans-serif',
    formFieldLabel: '"Inter", sans-serif',
    formFieldInput: '"Inter", sans-serif',
  },
};

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "kiro",
  description: "Project management app",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={{
      variables: {
        colorBackground: "#0f172a",
        colorInputBackground: "#1e293b", 
        colorInputText: "#f1f5f9",
        colorNeutral: "#94a3b8",
        colorPrimary: "#0A5BFF",
        colorTextOnPrimaryBackground: "#ffffff",
        colorTextSecondary: "#cbd5e1",
        colorDanger: "#ef4444",
        colorWarning: "#f59e0b",
        colorSuccess: "#10b981",
        colorShimmer: "#1e293b",
        borderRadius: "0.75rem",
      },
      elements: {
        // Buttons
        button: "text-white font-semibold transition-all duration-200",
        buttonPrimary: "bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30",
        buttonSecondary: "bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600",
        
        // Cards and containers
        card: "bg-gradient-to-br from-slate-800/40 via-slate-900/60 to-slate-900/40 border border-slate-700/50",
        
        // Form inputs
        formFieldInput: "bg-slate-800/50 border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500/20",
        formFieldLabel: "text-slate-200 font-medium",
        
        // User menu
        userButtonBox: "hover:bg-slate-700/50 rounded-lg transition-all duration-200",
        userButtonTrigger: "focus:shadow-sm focus:shadow-blue-500/30 rounded-lg",
        
        // Organization switcher
        organizationSwitcherTrigger: "border-2 border-slate-600 hover:border-blue-500 rounded-xl bg-slate-800/30 hover:bg-slate-700/50 transition-all duration-200",
        
        // Modal/Popover
        modalContent: "bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 border border-slate-700",
        popoverContent: "bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 border border-slate-700 shadow-lg shadow-slate-950/50",
        
        // Dividers and borders
        dividerLine: "bg-slate-700/50",
        
        // Links
        linkText: "text-blue-400 hover:text-blue-300 transition-colors",
        
        // Tabs
        tab: "text-slate-400 hover:text-blue-300 transition-colors data-[state=active]:text-blue-400 data-[state=active]:border-b-2 data-[state=active]:border-blue-500",
        
        // Badges
        badge: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
        
        // Headers
        headerTitle: "text-white font-bold",
        headerSubtitle: "text-slate-400",
      },
    }}>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${inter.className} dotted-background`}
        >
          <ThemeProvider attribute="class" defaultTheme="dark" >
            <Header/>
            <main className="min-h-screen pt-4 md:pt-8">{children}</main>
            <Toaster richColors/>
            <footer className="bg-linear-to-t from-slate-950 via-slate-900 to-slate-900/50 py-12 border-t border-white/5 mt-16">
              <div className="container mx-auto px-4 text-center text-slate-300">
                <p className="text-sm">
                  &copy; {new Date().getFullYear()} KIRO - Project Management Platform. All rights reserved.
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  Built with Next.js, Prisma, and Tailwind CSS
                </p>
              </div>
            </footer>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

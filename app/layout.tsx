import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import {ThemeProvider} from "../components/theme-provider";

import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes'
import Header from "../components/header";
import { Toaster } from "sonner";




const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "kiro",
  description: "Project management app",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance ={{
      theme: dark,
    }}>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${inter.className} dotted-background`}
        >
          <ThemeProvider attribute="class" defaultTheme="dark" >
            <Header/>
            <main className="min-h-screen pt-4 md:pt-8">{children}</main>
            <Toaster richColors/>
            <footer className="bg-gradient-to-t from-slate-950 via-slate-900 to-slate-900/50 py-12 border-t border-white/5 mt-16">
              <div className="container mx-auto px-4 text-center text-slate-300">
                <p className="text-sm">
                  &copy; {new Date().getFullYear()} KIRO - Project Management Platform. All rights reserved.
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  Built with <span className="text-red-500">❤</span> by the team at Influcraft.  
                </p>
              </div>
            </footer>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}


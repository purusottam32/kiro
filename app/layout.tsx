
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
    <ClerkProvider appearance ={{
      theme: dark,
    }}>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${inter.className} dotted-background`}
        >
          <ThemeProvider attribute="class" defaultTheme="dark" >
            <Header/>
            <main className="min-h-screen">{children}</main>
            <Toaster richColors/>
            <footer className="bg-gray-900 py-12">
              <div className="container mx-auto px-4 text-center text-grey-200">
                <p>
                  &copy; {new Date().getFullYear()} INFLUCRAFT. All rights reserved.
                </p>
              </div>
            </footer>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

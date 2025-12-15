
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {ThemeProvider} from "../components/theme-provider";
import { Inter } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes'
import Header from "../components/header";
import { Toaster } from "sonner";
const inter = Inter({ subsets: ["latin"] });


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
                  &copy; {new Date().getFullYear()} kiro. All rights reserved.
                </p>
              </div>
            </footer>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

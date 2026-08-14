import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://finpros.online'),
  title: {
    template: '%s | FinPros',
    default: 'FinPros – Free Consumer Finance Tools',
  },
  description: 'Explore free, easy-to-use financial calculators and utilities designed to help you navigate debt, savings, and personal finance with confidence.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      // Added scroll-smooth so any anchor links or automated scrolling (like error focusing) glides smoothly
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      {/* 
        Applied global selection colors (Teal) so text highlighting 
        is always on-brand, and enforced the base slate-900 text color 
      */}
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 selection:bg-teal-100 selection:text-teal-900 font-sans">
        <Header />
        
        {/* Added flex flex-col to ensure main content always structures properly between header and footer */}
        <div className="flex-grow flex flex-col">
          {children}
        </div>
        
        <Footer />
      </body>
    </html>
  );
}
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Ankit Kumar | Founder & CEO, Biker Bazaar",
    template: "%s | Ankit Kumar",
  },
  description:
    "Founder & CEO of Biker Bazaar (bikerbazaar.in) — a marketplace for used motorcycles and riding gear in India. Previously Senior Software Engineer at Bluecore building high-performance web systems for Fortune 500 brands.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Header />
        <main className="mx-auto max-w-4xl px-6 py-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

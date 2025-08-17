import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import { content as c } from "@/lib/content";
import { auth } from "@/auth";

const { title, description } = c.home.hero;

const geistSans = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = { title: { default: title, template: "%s - WarungOta" }, description };

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased min-h-screen flex flex-col`}>
        <Header session={session} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import { content as c } from "@/lib/content";
import { NextAuthProviders } from "@/components/NextAuthProvider";
import Layer from "@/components/layouts/layer";
import ClientProvider from "@/components/ClientProvider";
import { SessionUpdaterProvider } from "@/components/SessionUpdaterProvider";
import { Toaster } from "sonner";
import Header from "@/components/layouts/Header";

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
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo-warungota-favicon.png" />
      </head>
      <body className={`${geistSans.variable} antialiased min-h-screen flex flex-col`}>
        <NextAuthProviders>
          <ClientProvider>
            <SessionUpdaterProvider />
            <Toaster richColors />
            <Layer />
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </ClientProvider>
        </NextAuthProviders>
      </body>
    </html>
  );
}

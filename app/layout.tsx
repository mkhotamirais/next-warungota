import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import { Toaster } from "sonner";
import { NextAuthProviders } from "@/components/providers/NextAuthProvider";
import ClientProvider from "@/components/providers/ClientProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
// import MainProvider from "@/components/providers/MainProvider";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Warungota",
  description:
    "WarungOta menyediakan sembako, ATK, serta layanan fotokopi, cetak dokumen dan foto, laminating, transfer, tarik tunai, isi saldo, pulsa, dan token listrik.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} font-sans antialiased`}>
        <NextAuthProviders>
          <ClientProvider>
            <TooltipProvider>
              <Toaster position="top-center" richColors swipeDirections={["left", "right", "top"]} />
              <Header />
              <main className="min-h-screen">{children}</main>
              <Footer />
            </TooltipProvider>
          </ClientProvider>
        </NextAuthProviders>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/ui/header";
import { Separator } from "@/components/ui/separator";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fantasy Dashboard",
  description: "Your one-stop dashboard for all your Fantasy data.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="p-2 sm:p-4 max-w-3xl mx-auto">
          <Header />
          <Separator />
          {children}
          <Toaster />
        </div>
      </body>
    </html>
  );
}

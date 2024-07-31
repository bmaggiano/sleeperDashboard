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
  openGraph: {
    images: [{
      url: `https://sleeper-dashboard.vercel.app/api/og`,
      width: 1200,
      height: 630,
      alt: 'Fantasy Dashboard Default Image',
    }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* 
          Remove hardcoded meta tags if you're using Next.js metadata API
          These will be added dynamically based on the metadata configuration
        */}
        {/* <meta
          property="og:image"
          content="https://sleeper-dashboard.vercel.app/api/og?title=Fantasy%20Dashboard"
        /> */}
      </head>
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
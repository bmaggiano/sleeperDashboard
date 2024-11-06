import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import Header from '@/components/ui/header'
import { MyRuntimeProvider } from '@/app/MyRuntimeProvider'
import { Suspense } from 'react'
import Providers from '@/components/providers'
import { Analytics } from '@vercel/analytics/react'
import { Loader2 } from 'lucide-react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Stuart AI',
  description: 'Your fantasy football knowledge base.',
  openGraph: {
    images: [
      {
        url: `https://sleeper-dashboard.vercel.app/api/og`,
        width: 1200,
        height: 630,
        alt: 'Stuart AI, Your fantasy football knowledge base.',
      },
    ],
  },
}

function LoadingSkeleton() {
  return (
    <div className="flex justify-center items-center h-screen w-full bg-gray-50">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <span className="sr-only">Loading</span>
    </div>
  )
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <MyRuntimeProvider>
      <html lang="en">
        <head></head>
        <body className={`${inter.className} min-h-screen bg-gray-50`}>
          <div className="p-2 sm:p-4 max-w-3xl mx-auto">
            <Providers>
              <Header />
              <Suspense fallback={<LoadingSkeleton />}>
                {children}
                <Analytics />
              </Suspense>
              <Toaster />
            </Providers>
          </div>
        </body>
      </html>
    </MyRuntimeProvider>
  )
}

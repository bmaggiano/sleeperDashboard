import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import Header from '@/components/ui/header'
import { MyRuntimeProvider } from '@/app/MyRuntimeProvider'
import { Suspense } from 'react'
import Providers from '@/components/providers'
import { ApiLimitBanner } from '@/components/dailyLimitBanner/apiLimitBanner' // Import the ApiLimitBanner

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <MyRuntimeProvider>
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
            <Providers>
              <Header />
              <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
              <Toaster />
              <ApiLimitBanner />
            </Providers>
          </div>
        </body>
      </html>
    </MyRuntimeProvider>
  )
}

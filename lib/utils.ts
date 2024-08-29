import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getAppUrl(): string {
  const isLocal = process.env.NODE_ENV === 'development'
  const appUrl = isLocal
    ? process.env.NEXT_PUBLIC_APP_URL
    : `https://${process.env.VERCEL_URL}`
  return appUrl || ''
}

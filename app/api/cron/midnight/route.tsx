// app/api/cron/midnight/route.tsx

import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
  try {
    console.log('Resetting daily limits 5 mins...')

    // Reset daily limits for all users
    await prisma.user.updateMany({
      data: { dailyLimit: 10 } as any,
    })

    console.log('Daily limits have been reset.')
    return NextResponse.json({ message: 'Daily limits reset successfully.' })
  } catch (error) {
    console.error('Error resetting daily limits:', error)
    return NextResponse.error()
  }
}

// app/api/start-cron/route.tsx

import { NextResponse } from 'next/server'
import cron from 'node-cron'
import prisma from '@/lib/db'

export async function GET() {
  try {
    // Schedule the cron job to run at midnight every night
    cron.schedule('0 0 * * *', async () => {
      try {
        console.log('Resetting daily limits...')

        // Reset daily limits for all users
        await prisma.user.updateMany({
          data: { dailyLimit: 10 } as any,
        })

        console.log('Daily limits have been reset.')
      } catch (error) {
        console.error('Error resetting daily limits:', error)
      }
    })

    console.log('Cron job scheduled to run at midnight every night.')
    return NextResponse.json({ message: 'Cron job scheduled successfully.' })
  } catch (error) {
    console.error('Error scheduling cron job:', error)
    return NextResponse.error()
  }
}

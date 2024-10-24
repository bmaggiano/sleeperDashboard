import db from '@/lib/db'
import { NextResponse } from 'next/server'

export const GET = async (req: Request) => {
  const users = await db.user.findMany({})
  const all2023 = await db.user.findMany({
    take: 10,
    include: {
      leagues: true,
    },
  })
  return NextResponse.json({ all2023 })
}

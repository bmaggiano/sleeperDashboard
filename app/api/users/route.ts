import db from '@/lib/db'
import { NextResponse } from 'next/server'

export const GET = async (req: Request) => {
  const users = await db.user.findMany({})
  const all2023 = await db.nflverse_play_by_play_2023.findMany({
    take: 10,
  })
  return NextResponse.json({ all2023 })
}

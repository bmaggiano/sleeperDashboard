// /pages/api/dailyLimit.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import prisma from '@/lib/db'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email as string },
    select: { dailyLimit: true },
  })

  if (!user) {
    return NextResponse.json({ message: 'User not found' })
  }
  return NextResponse.json({ dailyLimit: user.dailyLimit })
}

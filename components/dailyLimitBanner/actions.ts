'use server'
import prisma from "@/lib/db"
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function fetchDailyLimit() {
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { dailyLimit: true } as any,
  })
  return user?.dailyLimit ?? 0
}
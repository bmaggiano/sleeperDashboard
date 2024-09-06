'use server'
import prisma from "@/lib/db"
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'

export async function fetchDailyLimit() {
    const session = await getServerSession(authOptions)
  const user = await prisma.user.findUnique({
    where: { email: session?.user?.email as string },
    select: { dailyLimit: true } as any,
  })
  return user?.dailyLimit ?? 0
}
import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import prisma from '@/lib/db'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        if (!user.email) {
          console.error('User email is not defined')
          return false
        }

        try {
          await prisma.user.upsert({
            where: { email: user.email },
            update: {
              email: profile?.email,
              accountType: 'free',
              dailyLimit: 10,
            } as any,
            create: {
              email: user.email,
              accountType: 'free',
              dailyLimit: 10,
            } as any,
          })

          return true
        } catch (error) {
          console.error('Error upserting user:', error)
          return false
        }
      }

      return true
    },
    async session({ session, user }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          accountType: (user as any).accountType,
          dailyLimit: (user as any).dailyLimit,
        } as any,
      }
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

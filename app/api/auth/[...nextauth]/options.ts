import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import prisma from '@/lib/db'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      allowDangerousEmailAccountLinking: true,
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
          // Check if the user exists
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
          })

          if (existingUser) {
            // Only update the account type and other details if the user exists
            await prisma.user.update({
              where: { email: user.email },
              data: {
                email: profile?.email,
                accountType: existingUser.accountType || 'free', // Preserve existing account type
              },
            })
          } else {
            // Create a new user with default values
            await prisma.user.create({
              data: {
                email: user.email,
                accountType: 'free',
                dailyLimit: 10, // Set daily limit for new users only
              },
            })
          }

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
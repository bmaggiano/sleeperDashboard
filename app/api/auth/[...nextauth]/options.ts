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
  // Add these configurations
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'database',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  cookies: {
    sessionToken: {
      name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
    callbackUrl: {
      name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.callback-url`,
      options: {
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
    csrfToken: {
      name: `${process.env.NODE_ENV === 'production' ? '__Host-' : ''}next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
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
      // Add debug logging
      console.log('Session Callback - Session:', session)
      console.log('Session Callback - User:', user)

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
  debug: process.env.NODE_ENV === 'development',
}

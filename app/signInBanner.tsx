import { X } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]/options'
import LoginButton from '@/components/login'

export default async function SignInBanner() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return (
      <Alert variant="dark" className="w-full border-none">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10">
              <svg
                className="h-4 w-4"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <AlertTitle className="sr-only">Sign in to Stuart AI</AlertTitle>
            <AlertDescription className="min-w-0 flex-1 truncate text-sm">
              Sign in to Stuart AI and get 10 free player comparisons per day
            </AlertDescription>
          </div>
          <div className="flex shrink-0 items-center gap-3 text-black">
            <LoginButton />
          </div>
        </div>
      </Alert>
    )
  }
}

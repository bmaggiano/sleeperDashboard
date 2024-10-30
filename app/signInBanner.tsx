import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]/options'
import LoginButton from '@/components/login'
import { Card, CardContent } from '@/components/ui/card'
import { LogIn } from 'lucide-react'

export default async function SignInBanner() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return (
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 shadow-sm border border-gray-100">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {' '}
              {/* Update: Adjusted spacing */}
              <div className="flex-shrink-0 w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center">
                {' '}
                {/* Update: Replaced LogIn icon */}
                <LogIn className="w-5 h-5 text-black" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-gray-900">
                  Want to compare your own players?
                </h3>
                <p className="text-xs text-gray-500">
                  Sign in, enjoy 10 free player comparisons per day and much
                  more!
                </p>
              </div>
            </div>
            <LoginButton />
          </div>
        </CardContent>
      </Card>
    )
  }
}

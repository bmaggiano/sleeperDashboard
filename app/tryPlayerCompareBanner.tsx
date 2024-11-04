import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]/options'
import LoginButton from '@/components/login'
import { Card, CardContent } from '@/components/ui/card'
import { LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function TryPlayerCompareBanner() {
  const session = await getServerSession(authOptions)
  if (session) {
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
                  Enjoy 10 free player comparisons per day on us!
                </p>
              </div>
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Link href={'/playerSelect'}>Compare Players</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }
}

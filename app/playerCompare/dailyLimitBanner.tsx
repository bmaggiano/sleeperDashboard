import { useEffect, useState } from 'react'
import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Clock } from 'lucide-react'
import { AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default function DailyLimitBanner({
  dailyLimit,
}: {
  dailyLimit: number
}) {
  const [timeLeft, setTimeLeft] = useState<string>('')

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date()
      const nextReset = new Date()

      // Set nextReset to midnight (or any desired reset time)
      nextReset.setHours(24, 0, 0, 0)

      const timeDifference = nextReset.getTime() - now.getTime()

      const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24)
      const minutes = Math.floor((timeDifference / (1000 * 60)) % 60)
      const seconds = Math.floor((timeDifference / 1000) % 60)

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`)
    }

    // Update the countdown every second
    const timer = setInterval(calculateTimeLeft, 1000)

    // Clear the timer on component unmount
    return () => clearInterval(timer)
  }, [])

  if (dailyLimit === 0)
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center text-amber-500">
            <AlertCircle className="mr-2" />
            Daily Limit Reached
          </CardTitle>
          <CardDescription>
            You&apos;ve used all your player compare tokens for today.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2 text-lg font-bold">
              <Clock className="text-muted-foreground" />
              <span>{timeLeft}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="w-full text-gray-400 flex items-center justify-center select-none cursor-not-allowed">
            Upgrade for Unlimited Compares{' '}
            <Badge
              size="xs"
              className="bg-gray-400 hover:bg-opacity text-white ml-2"
            >
              Soon
            </Badge>
          </div>
        </CardFooter>
      </Card>
    )

  return <Alert>You have {dailyLimit} player compares remaining today.</Alert>
}

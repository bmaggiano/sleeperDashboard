import { Alert } from '@/components/ui/alert'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default async function DailyLimitBanner({
  dailyLimit,
  topic,
}: {
  dailyLimit: number
  topic: string
}) {
  if (dailyLimit === 0)
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center text-amber-500">
            <AlertCircle className="mr-2" />
            Daily Limit Reached
          </CardTitle>
          <CardDescription>
            You&apos;ve used all your {topic} tokens for today.
          </CardDescription>
        </CardHeader>
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

  return (
    <Alert>
      You have {dailyLimit} {topic}s remaining today.
    </Alert>
  )
}

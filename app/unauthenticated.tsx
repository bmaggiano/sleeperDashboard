import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LockIcon } from 'lucide-react'

export default async function Unauthenticated() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <LockIcon className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Access Restricted
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            Log in with your Google account or create a new one to start
            comparing players and accessing exclusive features.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

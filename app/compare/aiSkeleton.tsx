import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Loader2 } from 'lucide-react'

export default function AISkeleton() {
  return (
    <Card>
      <CardHeader className="overflow-hidden rounded-t-md bg-green-50">
        <CardTitle className="flex items-center justify-between text-gray-400 text-lg gap-x-2">
          Gathering data...{' '}
          <Loader2 className="animate-spin h-5 w-5 text-gray-400" />{' '}
          {/* Placeholder for title */}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex justify-between">
          <div className="flex">
            {/* Placeholder for image */}
            <Skeleton className="w-16 h-16 rounded-full mr-2" />{' '}
            <div>
              {/* Placeholder for player name */}
              <Skeleton className="w-32 h-4 mb-4" />
              {/* Placeholder for position and team */}
              <Skeleton className="w-24 h-4" />{' '}
            </div>
          </div>
          <div className="flex">
            <Skeleton className="w-16 h-4 mr-2" />{' '}
            {/* Placeholder for certainty */}
            <Skeleton className="w-16 h-4" />{' '}
            {/* Placeholder for certainty label */}
          </div>
        </div>
        <Skeleton className="h-4 w-full my-2" />{' '}
        <Skeleton className="w-20 h-6 rounded-full" />{' '}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
          <Skeleton className="w-full h-6 rounded-full" />{' '}
          <Skeleton className="w-full h-6 rounded-full" />{' '}
          <Skeleton className="w-full h-6 rounded-full" />{' '}
          <Skeleton className="w-full h-6 rounded-full" />{' '}
        </div>
        <Skeleton className="w-20 h-6 rounded-full" />{' '}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          <Skeleton className="w-full h-6 rounded-full" />{' '}
          <Skeleton className="w-full h-6 rounded-full" />{' '}
          <Skeleton className="w-full h-6 rounded-full" />{' '}
        </div>
      </CardContent>
    </Card>
  )
}

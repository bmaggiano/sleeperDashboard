import { Skeleton } from './skeleton'

export default function MatchupCardSkeleton() {
  return (
    <div className="flex items-center justify-between space-x-4 space-y-2 p-4 my-4 ring-1 ring-gray-200 rounded-md">
      <div className="flex">
        <Skeleton className="mr-4 h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[70px] sm:w-[150px]" />
          <Skeleton className="h-4 w-[80px] sm:w-[200px]" />
          <Skeleton className="h-4 w-[60px] sm:w-[100px]" />
        </div>
      </div>
      <Skeleton className="h-6 sm:h-12 w-6 sm:w-12 rounded-full" />
      <div className="flex">
        <div className="space-y-2 flex flex-col items-end">
          <Skeleton className="h-4 w-[70px] sm:w-[150px]" />
          <Skeleton className="h-4 w-[80px] sm:w-[200px]" />
          <Skeleton className="h-4 w-[60px] sm:w-[100px]" />
        </div>
        <Skeleton className="ml-4 h-12 w-12 rounded-full" />
      </div>
    </div>
  )
}

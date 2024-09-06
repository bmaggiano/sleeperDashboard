'use client'

import { useAtom } from 'jotai'
import { remainingApiCallsAtom } from '../../app/atoms/atom'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircleIcon } from 'lucide-react'
import { useEffect } from 'react'
import { fetchDailyLimit } from './actions' // Import the fetchDailyLimit action

export function ApiLimitBanner() {
  const [remainingApiCalls, setRemainingApiCalls] = useAtom(
    remainingApiCallsAtom
  )

  useEffect(() => {
    const getDailyLimit = async () => {
      const limit = await fetchDailyLimit()
      setRemainingApiCalls(limit)
    }
    getDailyLimit()
  }, [setRemainingApiCalls])

  if (remainingApiCalls === null) return null

  return (
    <Alert variant="default" className="fixed bottom-4 right-4 w-auto max-w-sm">
      <AlertCircleIcon className="h-4 w-4" />
      <AlertTitle>API Limit</AlertTitle>
      <AlertDescription>
        You have {remainingApiCalls} free API calls remaining today.
      </AlertDescription>
    </Alert>
  )
}

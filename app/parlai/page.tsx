'use server'
import FuzzySearch from '../fuzzySearch'
import DailyLimitBanner from '../compare/dailyLimitBanner'
import ParlayHelperClient from './parlayHelperClient'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../api/auth/[...nextauth]/options'
import { cookies } from 'next/headers'
import Unauthenticated from '../unauthenticated'
import GameLogs from '../boxScores/page'
import { getDailyLimit } from '../utils'

type Props = {
  searchParams: { [key: string]: string | string[] | undefined }
}

const fetchUrl =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://sleeper-dashboard.vercel.app'

export default async function ParlayHelper({ searchParams }: Props) {
  const session = await getServerSession(authOptions)
  const cookieStore = cookies()
  let sessionTokenCookie = cookieStore.get('next-auth.session-token')
  let sessionToken = sessionTokenCookie?.value

  const dailyLimitData = await getDailyLimit()

  if (!session) {
    return <Unauthenticated />
  }

  if (dailyLimitData && dailyLimitData.dailyLimit === 0) {
    return <DailyLimitBanner dailyLimit={0} topic="parlay check" />
  }

  return (
    <>
      <ParlayHelperClient searchParams={searchParams} />
      {searchParams?.playerId && (
        <GameLogs searchParams={searchParams} withBack={false} />
      )}
      <div className="my-4">
        {dailyLimitData && (
          <DailyLimitBanner
            dailyLimit={dailyLimitData.dailyLimit || 0}
            topic="parlay check"
          />
        )}
      </div>
      <p className="italic text-sm text-gray-500">
        *The information provided on this website is for informational and
        entertainment purposes only. While we strive to provide accurate and
        up-to-date data, we make no guarantees about the accuracy, completeness,
        or reliability of any betting odds, analysis, or predictions displayed.
        Betting involves financial risk, and you should never bet more than you
        can afford to lose. We encourage responsible gambling, and you are
        solely responsible for any decisions you make based on the information
        provided here. Always verify odds and consult with licensed betting
        services before placing any bets.
      </p>
    </>
  )
}

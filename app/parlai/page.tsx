'use server'
import FuzzySearch from '../fuzzySearch'
import DailyLimitBanner from '../playerCompare/dailyLimitBanner'
import ParlayHelperClient from './parlayHelperClient'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../api/auth/[...nextauth]/options'
import { cookies } from 'next/headers'
import Unauthenticated from '../unauthenticated'

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
  const details = await fetch(`${fetchUrl}/api/getOdds`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `next-auth.session-token=${sessionToken};path=/;expires=Session`,
    },
    body: JSON.stringify({
      p1Id: searchParams.p1Id,
      p1Name: searchParams.p1Name,
      p1Team: searchParams.p1Team,
      p1Prop: searchParams.p1Prop,
      opTeam: searchParams.opTeam,
    }),
  })
  const data = await details.json()

  const dailyLimit = await fetch(`${fetchUrl}/api/dailyLimit`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `next-auth.session-token=${sessionToken};path=/;expires=Session`,
    },
    cache: 'no-store',
  })
  const dailyLimitJson = await dailyLimit.json()

  if (!session) {
    return <Unauthenticated />
  }

  return (
    <>
      <ParlayHelperClient searchParams={searchParams} data={data} />
      <div className="my-4">
        <DailyLimitBanner
          dailyLimit={dailyLimitJson.dailyLimit}
          topic="parlay check"
        />
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

'use server'
import { getSession } from 'next-auth/react'
import db from '@/lib/db'
import { getLeagueDetails } from './utils'
import { authOptions } from './api/auth/[...nextauth]/options'
import { getServerSession } from 'next-auth'

export default async function UserLeagues() {
  // Fetch user data
  const session = (await getServerSession(authOptions)) as {
    user: { id: string; name?: string; email?: string; image?: string } | null
  }

  const userData = await db.user.findUnique({
    where: {
      id: session?.user?.id,
    },
  })

  // Initialize fetchedDetails array for league details
  //   let fetchedDetails = []
  //   if (userData.user?.leagues && userData.user.leagues.length > 0) {
  //     const detailsPromises = userData.user.leagues.map(async (league: any) => {
  //       const leagueData = await getLeagueDetails(league.leagueId)
  //       return leagueData
  //     })
  //     fetchedDetails = await Promise.all(detailsPromises)
  //   } else {
  //     console.log('No leagues found for the user.')
  //   }

  return (
    <div>
      <h1>User Leagues</h1>
      {JSON.stringify(userData, null, 2)}
    </div>
  )
}

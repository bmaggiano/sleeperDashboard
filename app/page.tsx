'use server'
import { getLeagueDetails } from './utils'
import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]/options'
import db from '@/lib/db'
import HomeHeroSection from './homeHeroSection'
import LeaguesMarquee from './leaguesMarquee'
import Link from 'next/link'
import { Card, CardHeader } from '@/components/ui/card'
import NoLeaguesFoundEmpty from './noLeaguesFoundEmpty'

// Define a custom type for the session user
type SessionUser = {
  id: string // Add the id property
  name?: string | null
  email?: string | null
  image?: string | null
}

const LeagueCard = function LeagueCard({
  leagueDetails,
  week,
}: {
  leagueDetails: any
  week: number
}) {
  const imgUrl = leagueDetails?.avatar
    ? `https://sleepercdn.com/avatars/thumbs/${leagueDetails.avatar}`
    : null
  return (
    <div className="sm:w-[14rem]">
      {leagueDetails ? (
        <Link
          href={`/${leagueDetails?.league_id}/${week}`}
          prefetch={true}
          className="block"
        >
          <Card>
            <CardHeader>
              <div className="flex gap-2 items-center truncate overflow-hidden">
                {imgUrl ? (
                  <img
                    className="w-10 h-10 rounded-full"
                    src={imgUrl}
                    alt={`${leagueDetails.name} avatar`}
                  />
                ) : (
                  <div className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-muted">
                      {leagueDetails.name[0]}
                    </div>
                  </div>
                )}
                <span className="truncate">{leagueDetails.name}</span>{' '}
              </div>
            </CardHeader>
          </Card>
        </Link>
      ) : (
        <div>Loading league details...</div>
      )}
    </div>
  )
}

export default async function UserLeagues() {
  // Fetch user session
  const session = (await getServerSession(authOptions)) as {
    user: SessionUser | null
  }

  // Check if there's no session or no user in the session
  if (!session || !session.user) {
    return (
      <div>
        <HomeHeroSection fetchedDetails={[]} />
        <LeaguesMarquee />
      </div>
    )
  }

  // Fetch user data from the database
  const userData = await db.user.findUnique({
    where: {
      id: session.user.id,
    },
    include: {
      leagues: true,
    },
  })

  // Initialize fetchedDetails array for league details
  let fetchedDetails = []
  if (userData?.leagues && userData.leagues.length > 0) {
    const detailsPromises = userData.leagues.map(async (league: any) => {
      const leagueData = await getLeagueDetails(league.leagueId)
      return leagueData
    })
    fetchedDetails = await Promise.all(detailsPromises)
  } else {
    console.log('No leagues found for the user.')
  }

  return (
    <div>
      <HomeHeroSection fetchedDetails={fetchedDetails} />
      {fetchedDetails.length > 0 ? (
        <>
          <h2 className="text-lg font-medium">Your leagues</h2>
          <div className="flex sm:flex-wrap flex-col sm:flex-row gap-2 my-4">
            {fetchedDetails.map((details, index) => (
              <LeagueCard
                key={index}
                leagueDetails={details}
                week={details.settings.leg}
              />
            ))}
          </div>
        </>
      ) : null}
      <LeaguesMarquee />
    </div>
  )
}

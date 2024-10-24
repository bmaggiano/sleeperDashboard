'use client'
import RecentSearches from '@/components/ui/recentSearches'
import LeaguesMarquee from './leaguesMarquee'
import LeagueSearchForm from './leagueSearchForm'
import { Zap } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getLeagueDetails } from './utils'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import NoLeaguesFoundEmpty from './noLeaguesFoundEmpty'

function LeagueCard({ leagueDetails }: { leagueDetails: any }) {
  return (
    <div className="w-[15rem]">
      {leagueDetails ? (
        <Link
          href={`/${leagueDetails?.league_id}/${leagueDetails?.settings?.leg}`}
          prefetch={true}
          className="block"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center truncate overflow-hidden">
                <Avatar className="mr-2">
                  <AvatarImage
                    src={`https://sleepercdn.com/avatars/thumbs/${leagueDetails.avatar}`}
                    alt={`${leagueDetails.name} avatar`}
                  />
                  <AvatarFallback>{leagueDetails.name[0]}</AvatarFallback>
                </Avatar>{' '}
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

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [leagueDetails, setLeagueDetails] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [noLeagues, setNoLeagues] = useState<boolean>(false)

  useEffect(() => {
    async function fetchUserLeagues() {
      const response = await fetch(`/api/user`)
      const userData = await response.json() // Parse the response to JSON
      setUser(userData.user)

      if (userData.user?.leagues && userData.user.leagues.length > 0) {
        // Fetch league details for each league
        const detailsPromises = userData.user.leagues.map((league: any) =>
          getLeagueDetails(league.leagueId)
        )
        const fetchedDetails = await Promise.all(detailsPromises)
        setLeagueDetails(fetchedDetails)
      } else {
        setNoLeagues(true)
      }

      setLoading(false)
    }

    fetchUserLeagues()
  }, [])

  return (
    <>
      <main className="flex-1 my-4">
        <section className="bg-gradient-to-b from-white to-white pt-8">
          <div className="container mx-auto px-4 text-center">
            <div className="flex sm:flex-row justify-center">
              <h1 className="flex flex-col sm:flex-row items-center text-3xl font-bold mb-4 text-gray-800">
                <Zap className="hidden sm:block sm:flex-0 h-8 w-8 mr-2 text-gray-600 animate-pulse" />
                Fantasy Football&nbsp;
                <span className="text-gray-600">Meets AI</span>
              </h1>
            </div>
            <p className="text-xl text-gray-600">
              <span className="text-gray-800 font-semibold">Dominate</span> your
              league with cutting-edge AI insights
            </p>
            {noLeagues ? null : <LeagueSearchForm />}
          </div>
        </section>
      </main>
      <div className="p-2 sm:p-4 max-w-3xl mx-auto">
        {/* <RecentSearches /> */}
        {loading ? (
          <div>Loading leagues...</div> // Loading state
        ) : noLeagues ? (
          <NoLeaguesFoundEmpty /> // No leagues state
        ) : (
          <>
            <h2 className="text-xl font-medium">Your leagues</h2>
            <div className="flex my-4">
              {leagueDetails.map((details, index) => (
                <LeagueCard key={index} leagueDetails={details} />
              ))}
            </div>
          </>
        )}
        <LeaguesMarquee />
      </div>
    </>
  )
}

'use client'
import RecentSearches from '@/components/ui/recentSearches'
import LeaguesMarquee from './leaguesMarquee'
import LeagueSearchForm from './leagueSearchForm'
import { ChevronRight, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getCurrentWeek, getLeagueDetails } from './utils'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import NoLeaguesFoundEmpty from './noLeaguesFoundEmpty'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'

function LeagueCard({ leagueDetails }: { leagueDetails: any }) {
  const [week, setWeek] = useState<number | null>(null)
  useEffect(() => {
    const fetchUserData = async () => {
      const response = await getCurrentWeek(leagueDetails.league_id)
      setWeek(response)
    }
    fetchUserData()
  }, [])
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
    const fetchUserData = async () => {
      const response = await fetch(`/api/user`)
      const userData = await response.json()
      setUser(userData.user)
    }

    fetchUserData()
  }, [])

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
        <div className="flex flex-col justify-center p-4 space-y-4">
          <div className="space-y-2">
            <div className="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm">
              <Zap className="mr-1 h-4 w-4" />
              Powered by AI
            </div>
            <h1 className="text-center text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
              Fantasy Football Meets AI
            </h1>
            <p className="text-center text-muted-foreground md:text-xl">
              Dominate your league with cutting-edge AI insights. Get
              personalized player recommendations, player prop analysis, and
              winning strategies.
            </p>
          </div>
        </div>
        {noLeagues ? null : <LeagueSearchForm />}
      </main>
      <div className="max-w-3xl mx-auto">
        {/* <RecentSearches /> */}
        {loading ? (
          <div>
            <div className="mb-4 text-lg font-medium">Loading leagues...</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-4">
              {Array.from({ length: 3 }, (_, i) => (
                <div key={i}>
                  <Card>
                    <CardContent className="p-4 flex items-center space-x-4">
                      <Skeleton className="h-16 w-16 rounded-full flex-shrink-0" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-full" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        ) : noLeagues ? (
          <NoLeaguesFoundEmpty /> // No leagues state
        ) : (
          <>
            <h2 className="text-lg font-medium">Your leagues</h2>
            <div className="flex sm:flex-wrap flex-col sm:flex-row gap-2 my-4">
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

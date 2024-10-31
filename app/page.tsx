'use client'
import RecentSearches from '@/components/ui/recentSearches'
import LeaguesMarquee from './leaguesMarquee'
import LeagueSearchForm from './leagueSearchForm'
import { ChevronRight, Zap } from 'lucide-react'
import { useEffect, useState, useMemo } from 'react'
import { getCurrentWeek, getLeagueDetails } from './utils'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import NoLeaguesFoundEmpty from './noLeaguesFoundEmpty'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import React from 'react'

// Define a type for league details
type LeagueDetail = {
  league_id: string
  name: string
  avatar: string
  settings: {
    playoff_week_start: number
    leg: number
  }
}

const LeagueCard = React.memo(function LeagueCard({
  leagueDetails,
  week,
}: {
  leagueDetails: any
  week: number
}) {
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
})

export default function Home() {
  const [user, setUser] = useState(null)
  const [leagueDetails, setLeagueDetails] = useState<LeagueDetail[]>([])
  const [loading, setLoading] = useState(true)
  const [noLeagues, setNoLeagues] = useState(false)
  const [weeks, setWeeks] = useState({})

  useEffect(() => {
    async function fetchUserDataAndLeagues() {
      const response = await fetch(`/api/user`)
      const userData = await response.json()
      setUser(userData.user)

      if (userData.user?.leagues && userData.user.leagues.length > 0) {
        const detailsPromises = userData.user.leagues.map(
          async (league: any) => {
            const leagueData = await getLeagueDetails(league.leagueId)
            return leagueData
          }
        )
        const fetchedDetails = await Promise.all(detailsPromises)
        setLeagueDetails(fetchedDetails)
      } else {
        setNoLeagues(true)
      }

      setLoading(false)
    }

    fetchUserDataAndLeagues()
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
          <NoLeaguesFoundEmpty />
        ) : (
          <>
            <h2 className="text-lg font-medium">Your leagues</h2>
            <div className="flex sm:flex-wrap flex-col sm:flex-row gap-2 my-4">
              {leagueDetails.map((details: LeagueDetail, index) => (
                <LeagueCard
                  key={index}
                  leagueDetails={details}
                  week={details.settings.leg}
                />
              ))}
            </div>
          </>
        )}
        <LeaguesMarquee />
      </div>
    </>
  )
}

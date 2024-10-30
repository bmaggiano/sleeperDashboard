'use server'

import React from 'react'
import {
  matchBracketToMatchup,
  getChampionInfo,
  getTotalWeeks,
  getLeagueWeeks,
  getLeagueDetails,
} from '../../utils'
import MatchupCard from '@/components/ui/matchupCard'
import MatchupCardSkeleton from '@/components/ui/matchupCardSkeleton'
import UserCard from '@/components/ui/userCard'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ArrowRight, Calendar, Trophy, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'

type TeamInfo = {
  displayName: string
  rosterId: number
  points: number
  starters: string[]
  players: string[]
}

type Matchup = {
  round: number
  matchupId: number
  team1: TeamInfo
  team2: TeamInfo
}

const WinnersBracket = async ({ leagueId }: { leagueId: string }) => {
  const weekLength = await getTotalWeeks(leagueId)
  const leaugeDetails = await getLeagueDetails(leagueId)
  console.log(leaugeDetails.settings.playoff_week_start)
  console.log(leaugeDetails.settings.leg)
  if (leaugeDetails.settings.playoff_week_start >= leaugeDetails.settings.leg) {
    const matchupsByRound: Matchup[] = []
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            No Matchups Yet
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <Trophy className="w-16 h-16 mx-auto text-yellow-400" />
          <p className="text-muted-foreground">
            The matchups for this round haven&apos;t been generated yet. Check
            back soon or explore other sections of the league.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
              <Calendar className="w-8 h-8 mb-2 text-primary" />
              <h3 className="font-semibold">Playoffs</h3>
              <p className="text-sm text-muted-foreground">
                Starts in{' '}
                {leaugeDetails.settings.playoff_week_start -
                  leaugeDetails.settings.leg}{' '}
                weeks
              </p>
            </div>
            <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
              <Users className="w-8 h-8 mb-2 text-primary" />
              <h3 className="font-semibold">Participants</h3>
              <p className="text-sm text-muted-foreground">
                {leaugeDetails.total_rosters} teams remaining
              </p>
            </div>
            <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
              <Trophy className="w-8 h-8 mb-2 text-primary" />
              <h3 className="font-semibold">Prize Pool</h3>
              <p className="text-sm text-muted-foreground">N/A</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }
  const matchupDetails = await matchBracketToMatchup({
    week: weekLength,
    leagueId: leagueId,
  })
  const champion = await getChampionInfo(leagueId)
  const regSeason = await getLeagueWeeks(leagueId)
  const regSeasonWeekNum = regSeason.length - 1

  if (!leagueId) {
    return Array.from({ length: 6 }).map((_, i) => (
      <div className="mx-auto w-full max-w-3xl" key={i}>
        <MatchupCardSkeleton />
      </div>
    ))
  }

  // Group matchups by round number
  const matchupsByRound = matchupDetails.reduce<Record<number, Matchup[]>>(
    (acc, matchup) => {
      if (!acc[matchup.round]) {
        acc[matchup.round] = []
      }
      acc[matchup.round].push(matchup)
      return acc
    },
    {}
  )

  const isUnclaimed = matchupDetails.every(
    (matchup: any) => !matchup.team1.claimed && !matchup.team2.claimed
  )

  return (
    <div className="pt-4">
      {matchupDetails.length > 0 && (
        <UserCard width={true} user={champion} champion={true} />
      )}
      {Object.keys(matchupsByRound).length > 0 ? (
        Object.entries(matchupsByRound)
          .sort(([a], [b]) => Number(b) - Number(a)) // Sort rounds in descending order
          .map(([round, matchups]) => (
            <div key={round}>
              <h3 className="text-2xl font-semibold text-gray-700 mt-4">
                Round {round}
              </h3>
              {matchups.map((matchup, index) => (
                <MatchupCard
                  key={index}
                  team1={matchup.team1}
                  team2={matchup.team2}
                  withVsLink
                  withWeekRef={regSeasonWeekNum + parseInt(round)}
                  isUnclaimed={isUnclaimed}
                />
              ))}
            </div>
          ))
      ) : (
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              No Matchups Yet
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <Trophy className="w-16 h-16 mx-auto text-yellow-400" />
            <p className="text-muted-foreground">
              The matchups for this round haven&apos;t been generated yet. Check
              back soon or explore other sections of the league.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
                <Calendar className="w-8 h-8 mb-2 text-primary" />
                <h3 className="font-semibold">Playoffs</h3>
                <p className="text-sm text-muted-foreground">
                  Starts in{' '}
                  {leaugeDetails.settings.playoff_week_start -
                    leaugeDetails.settings.leg}{' '}
                  weeks
                </p>
              </div>
              <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
                <Users className="w-8 h-8 mb-2 text-primary" />
                <h3 className="font-semibold">Participants</h3>
                <p className="text-sm text-muted-foreground">
                  {leaugeDetails.total_rosters} teams remaining
                </p>
              </div>
              <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
                <Trophy className="w-8 h-8 mb-2 text-primary" />
                <h3 className="font-semibold">Prize Pool</h3>
                <p className="text-sm text-muted-foreground">N/A</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default WinnersBracket

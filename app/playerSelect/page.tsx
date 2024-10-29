'use client'

import { useEffect, useState } from 'react'
import { useQueryState, parseAsString } from 'nuqs'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import { X } from 'lucide-react'

// Assume these utility functions are defined elsewhere
import {
  combineUserAndRosterInfoCard,
  getLeagueDetails,
  sleeperToESPNMapping,
} from '../utils'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import NoLeaguesFoundEmpty from '../noLeaguesFoundEmpty'

export default function UsersPlayers() {
  const [loading, setLoading] = useState<boolean>(true)
  const [uniquePlayers, setUniquePlayers] = useState<any[]>([])
  const [p1Name, setP1Name] = useQueryState('p1Name', parseAsString)
  const [p2Name, setP2Name] = useQueryState('p2Name', parseAsString)
  const [p1Pos, setP1Pos] = useQueryState('p1Pos', parseAsString)
  const [p2Pos, setP2Pos] = useQueryState('p2Pos', parseAsString)
  const [p1Team, setP1Team] = useQueryState('p1Team', parseAsString)
  const [p2Team, setP2Team] = useQueryState('p2Team', parseAsString)
  const [p1Id, setP1Id] = useQueryState('p1Id', parseAsString)
  const [p2Id, setP2Id] = useQueryState('p2Id', parseAsString)
  const [p1EID, setP1EID] = useQueryState('p1EID', parseAsString)
  const [p2EID, setP2EID] = useQueryState('p2EID', parseAsString)

  const handleAddPlayer = (player: any) => {
    if (p1Id === player.sleeper_id) {
      setP1Name(null)
      setP1Pos(null)
      setP1Team(null)
      setP1Id(null)
      setP1EID(null)
    } else if (p2Id === player.sleeper_id) {
      setP2Name(null)
      setP2Pos(null)
      setP2Team(null)
      setP2Id(null)
      setP2EID(null)
    } else if (!p1Id) {
      setP1Name(player.full_name)
      setP1Pos(player.position)
      setP1Team(player.team)
      setP1Id(player.sleeper_id)
      setP1EID(player.espn_id)
    } else if (!p2Id) {
      setP2Name(player.full_name)
      setP2Pos(player.position)
      setP2Team(player.team)
      setP2Id(player.sleeper_id)
      setP2EID(player.espn_id)
    }
  }

  const clearPlayers = () => {
    setP1Name(null)
    setP2Name(null)
    setP1Pos(null)
    setP2Pos(null)
    setP1Team(null)
    setP2Team(null)
    setP1Id(null)
    setP2Id(null)
    setP1EID(null)
    setP2EID(null)
  }

  useEffect(() => {
    setLoading(true)
    async function fetchUserLeagues() {
      const response = await fetch(`/api/userLeagues`)
      const leaguesData = await response.json()
      setUniquePlayers(leaguesData)
      setLoading(false)
      console.log(leaguesData)
    }
    //   const response = await fetch(`/api/user`)
    //   const userData = await response.json()

    //   if (userData.user?.leagues && userData.user.leagues.length > 0) {
    //     const leaguePromises = userData.user.leagues.map(
    //       async (league: any) => {
    //         const leagueDetails = await getLeagueDetails(league.leagueId)
    //         const rosterInfo = await combineUserAndRosterInfoCard(
    //           league.leagueId
    //         )
    //         const rosterMatch = rosterInfo.find(
    //           (roster: any) => roster.owner_id === userData.user.sleeperUserId
    //         )

    //         let playerDetails: any[] = []
    //         if (rosterMatch?.players) {
    //           playerDetails = await Promise.all(
    //             rosterMatch.players.map(async (player: any) => {
    //               const info = await sleeperToESPNMapping(player)
    //               return { player, info }
    //             })
    //           )
    //         }

    //         return {
    //           leagueDetails,
    //           players: playerDetails,
    //         }
    //       }
    //     )

    //     const allLeaguesData = await Promise.all(leaguePromises)

    //     const uniquePlayerMap = new Map()
    //     allLeaguesData.forEach((league) => {
    //       league.players.forEach((player: any) => {
    //         if (
    //           !uniquePlayerMap.has(player.player) &&
    //           player.info.position !== 'DEF' &&
    //           player.info.position !== 'K'
    //         ) {
    //           uniquePlayerMap.set(player.player, player)
    //         }
    //       })
    //     })

    //     const positionOrder = ['QB', 'WR', 'RB', 'TE']
    //     const sortedUniquePlayers = Array.from(uniquePlayerMap.values()).sort(
    //       (a, b) =>
    //         positionOrder.indexOf(a.info.position) -
    //         positionOrder.indexOf(b.info.position)
    //     )

    //     setUniquePlayers(sortedUniquePlayers)
    //   }
    //   setLoading(false)
    // }

    fetchUserLeagues()
  }, [])

  function PlayerCard({ player }: { player: any }) {
    const imageUrl = player.info?.image_url || '/NFL.svg'
    const isSelected =
      p1Id === player.info.sleeper_id || p2Id === player.info.sleeper_id
    return (
      <Button
        variant={'outline'}
        className="rounded-md w-full p-0 h-auto overflow-hidden"
        onClick={() => handleAddPlayer(player.info)}
        disabled={p1Id && p2Id && !isSelected ? true : undefined}
      >
        <Card
          className={cn(
            isSelected && 'bg-green-50',
            'w-full overflow-hidden border-0'
          )}
        >
          <CardContent className="p-4 flex items-center space-x-4">
            <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
              <Image
                src={imageUrl}
                alt={`${player.info?.first_name} ${player.info?.last_name}`}
                width={64}
                height={64}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="min-w-0 flex-1 text-left">
              <p className="font-semibold text-lg truncate">
                {player.info?.first_name} {player.info?.last_name}
              </p>
              <p className="text-sm text-gray-500 truncate">
                {player.info?.position} - {player.info?.team}
              </p>
            </div>
          </CardContent>
        </Card>
      </Button>
    )
  }

  return (
    <div className="py-8">
      <Card className="mb-8 p-6 rounded-lg">
        <h2 className="text-lg text-center font-semibold mb-4">
          Selected Players
        </h2>
        <div className="flex justify-center space-x-4 mb-4">
          {p1Name ? (
            <Card className="w-[18rem]">
              <CardContent className="p-4 flex items-center space-x-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                  <Image
                    src={
                      p1EID
                        ? `https://a.espncdn.com/i/headshots/nfl/players/full/${p1EID}.png`
                        : '/NFL.svg'
                    }
                    alt={`${p1Name}`}
                    width={64}
                    height={64}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <p className="font-semibold">{p1Name}</p>
                  <p className="text-sm text-gray-500">
                    {p1Pos} - {p1Team}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="w-[18rem]">
              <CardContent className="p-4 text-center">
                <p className="font-semibold">Player 1</p>
                <p className="text-sm text-gray-500">Not Selected</p>
              </CardContent>
            </Card>
          )}
          {p2Name ? (
            <Card className="w-[18rem]">
              <CardContent className="p-4 flex items-center space-x-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                  <Image
                    src={
                      p2EID
                        ? `https://a.espncdn.com/i/headshots/nfl/players/full/${p2EID}.png`
                        : '/NFL.svg'
                    }
                    alt={`${p2Name}`}
                    width={64}
                    height={64}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <p className="font-semibold">{p2Name}</p>
                  <p className="text-sm text-gray-500">
                    {p2Pos} - {p2Team}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="w-[18rem]">
              <CardContent className="p-4 text-center">
                <p className="font-semibold">Player 2</p>
                <p className="text-sm text-gray-500">Not Selected</p>
              </CardContent>
            </Card>
          )}
        </div>
        {p1Id && p2Id && (
          <div className="flex justify-end space-x-2">
            <Button onClick={clearPlayers} variant="destructive">
              <X className="mr-2 h-4 w-4" /> Clear All Players
            </Button>
            <Button>
              <Link
                href={{
                  pathname: '/compare',
                  query: {
                    p1Name,
                    p1EID,
                    p1Id,
                    p1Team,
                    p1Pos,
                    p2EID,
                    p2Id,
                    p2Name,
                    p2Pos,
                    p2Team,
                  },
                }}
              >
                Compare
              </Link>
            </Button>
          </div>
        )}
      </Card>

      <h2 className="text-lg font-semibold mb-4">Your Players</h2>
      {loading ? (
        <>
          <h2 className="text-lg font-semibold mb-4">
            Gathering your players...
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(9)].map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-4 flex items-center space-x-4">
                  <Skeleton className="h-16 w-16 rounded-full flex-shrink-0" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <>
          {uniquePlayers.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {uniquePlayers?.map((player, index) => (
                  <PlayerCard key={index} player={player} />
                ))}
              </div>
            </>
          ) : (
            <>
              <div>
                No players found, your players will show up here once
                you&apos;ve added a Sleeper league.
              </div>
              <NoLeaguesFoundEmpty />
            </>
          )}
        </>
      )}
    </div>
  )
}

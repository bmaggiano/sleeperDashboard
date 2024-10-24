'use client'

import { useEffect, useState } from 'react'
import {
  combineUserAndRosterInfoCard,
  getLeagueDetails,
  sleeperToESPNMapping,
} from '../utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Image from 'next/image'

export default function UsersPlayers() {
  const [user, setUser] = useState<any>(null)
  const [leagueData, setLeagueData] = useState<any[]>([]) // Store league details with players
  const [loading, setLoading] = useState<boolean>(true)
  const [noLeagues, setNoLeagues] = useState<boolean>(false)

  useEffect(() => {
    async function fetchUserLeagues() {
      const response = await fetch(`/api/user`)
      const userData = await response.json()
      setUser(userData.user)

      if (userData.user?.leagues && userData.user.leagues.length > 0) {
        // Fetch league details and players for each league
        const leaguePromises = userData.user.leagues.map(
          async (league: any) => {
            const leagueDetails = await getLeagueDetails(league.leagueId)

            const rosterInfo = await combineUserAndRosterInfoCard(
              league.leagueId
            )
            const rosterMatch = rosterInfo.find(
              (roster: any) => roster.owner_id === userData.user.sleeperUserId
            )

            // Fetch player details for each player in the roster
            let playerDetails: any[] = []
            if (rosterMatch?.players) {
              playerDetails = await Promise.all(
                rosterMatch.players.map(async (player: any) => {
                  const info = await sleeperToESPNMapping(player)
                  return {
                    player,
                    info,
                  }
                })
              )
            }

            // Return league details along with its players
            return {
              leagueDetails,
              players: playerDetails,
            }
          }
        )

        const allLeaguesData = await Promise.all(leaguePromises)
        setLeagueData(allLeaguesData)
      } else {
        setNoLeagues(true)
      }

      setLoading(false)
    }

    fetchUserLeagues()
  }, [])

  function PlayerCard({ player }: { player: any }) {
    const imageUrl =
      player.info?.position === 'DEF'
        ? '/NFL.svg'
        : player.info?.image_url || '/NFL.svg'
    return (
      <div className="ring-1 ring-gray-200 flex items-center p-2 rounded-md w-[20rem] truncate text-ellipsis">
        <Image
          className="rounded-full"
          src={imageUrl}
          height={40}
          width={60}
          alt=""
        />
        <div>
          <p className="text-ellipsis truncate">
            {player.info?.first_name} {player.info?.last_name}
          </p>
          <p>
            {player.info?.position} - {player.info?.team}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1>Your players</h1>
      {loading ? (
        <div>Loading leagues...</div> // Loading state
      ) : noLeagues ? (
        <div>No leagues found.</div> // No leagues state
      ) : (
        <div className="flex">
          {leagueData.map((league, index) => (
            <div key={index}>
              <h2>{league.leagueDetails.name}</h2>
              <div>
                {league.players.map((player: any, playerIndex: number) => (
                  <PlayerCard key={playerIndex} player={player} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

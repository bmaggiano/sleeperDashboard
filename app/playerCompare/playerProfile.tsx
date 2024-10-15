'use client'
import { Suspense, useEffect, useState } from 'react'
import { FileText, User } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function PlayerProfile({ player }: { player: any }) {
  const calculateHeight = async (height: string) => {
    // Parse the height string to get total inches

    if (!height || isNaN(parseInt(height))) {
      return 'Invalid height' // Return a default value or message
    }

    let heightNum = parseInt(height)

    // Calculate feet and inches
    // Format the output without fractions
    return `${Math.floor(heightNum / 12)}'${heightNum % 12}`
  }
  const [playerProfileData, setPlayerProfileData] = useState<any>(null)
  useEffect(() => {
    const fetchPlayerInfo = async () => {
      const playerInfo = await fetch(`/api/cache?pid=${player.player_id}`)
      const playerData = await playerInfo.json()
      setPlayerProfileData(playerData)
    }
    if (player.player_id) {
      fetchPlayerInfo()
    }
  }, [player.player_id])
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="w-full flex items-center space-x-4">
        <div className="flex items-center justify-center text-2xl">
          {player.espn_id ? (
            <Image
              src={`https://a.espncdn.com/i/headshots/nfl/players/full/${player.espn_id}.png`}
              height={110}
              width={110}
              alt={player.full_name}
            />
          ) : (
            <User size={32} />
          )}
        </div>
        <div>
          <h3 className="text-xl font-semibold">{player.full_name}</h3>
          <p className="text-gray-500">
            {calculateHeight(playerProfileData?.height)} -{' '}
            {playerProfileData?.weight} lbs
          </p>
          <p className="text-gray-500">
            {player.position} - {player.team}
          </p>
          <Link
            className="flex items-center"
            href={`/boxScores?playerId=${player.player_id}`}
            prefetch={true}
          >
            <FileText className="w-4 h-4 mr-2 text-gray-500 hover:text-gray-700" />
            Box Scores
          </Link>
        </div>
      </div>
    </Suspense>
  )
}

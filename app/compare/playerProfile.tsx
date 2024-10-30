'use client'

import { Suspense, useEffect, useState } from 'react'
import { FileText, User } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const NFL_TEAM_COLORS = {
  ARI: '#97233F',
  ATL: '#A71930',
  BAL: '#241773',
  BUF: '#00338D',
  CAR: '#0085CA',
  CHI: '#C83803',
  CIN: '#FB4F14',
  CLE: '#311D00',
  DAL: '#003594',
  DEN: '#FB4F14',
  DET: '#0076B6',
  GB: '#203731',
  HOU: '#03202F',
  IND: '#002C5F',
  JAX: '#006778',
  KC: '#E31837',
  LAC: '#0080C6',
  LAR: '#003594',
  LV: '#000000',
  MIA: '#008E97',
  MIN: '#4F2683',
  NE: '#002244',
  NO: '#D3BC8D',
  NYG: '#0B2265',
  NYJ: '#125740',
  PHI: '#004C54',
  PIT: '#FFB612',
  SEA: '#002244',
  SF: '#AA0000',
  TB: '#D50A0A',
  TEN: '#0C2340',
  WAS: '#773141',
}

type PlayerStatus =
  | 'Out'
  | 'IR'
  | 'Inactive'
  | 'Questionable'
  | 'Injured Reserve'
  | 'PUP'
  | 'Active'
  | undefined

const getStatusColor = (status: PlayerStatus) => {
  switch (status) {
    case 'Out':
    case 'IR':
    case 'Inactive':
    case 'Injured Reserve':
    case 'PUP':
      return 'bg-red-500'
    case 'Questionable':
      return 'bg-yellow-500'
    case 'Active':
    default:
      return 'bg-green-500'
  }
}

function renderStatus(status: string) {
  return (
    <Badge className="text-white font-normal" variant="outline">
      {status === 'Out' && 'Out'}
      {status === 'IR' && 'IR'}
      {status === 'Inactive' && 'Inactive'}
      {status === 'Questionable' && 'Questionable'}
      {status === 'Injured Reserve' && 'Injured Reserve'}
      {status === 'Active' && 'Active'}
      {status === 'PUP' && 'PUP'}
      {!status && 'Active'}
    </Badge>
  )
}

interface PlayerProfileProps {
  player: {
    player_id: string
    full_name: string
    position: string
    team: string
    espn_id?: string
  }
}

export default function PlayerProfile({ player }: PlayerProfileProps) {
  const calculateHeight = (height: string) => {
    if (!height || isNaN(parseInt(height))) {
      return 'Invalid height'
    }
    let heightNum = parseInt(height)
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
  }, [player?.player_id])

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Card
        className="w-full border-none overflow-hidden"
        style={{
          // Dynamically set the ring color based on the team color
          boxShadow: `0 0 0 0.5px ${
            NFL_TEAM_COLORS[player.team as keyof typeof NFL_TEAM_COLORS]
          }`, // This simulates a 'ring' effect
        }}
      >
        <div
          className="flex"
          style={{
            backgroundColor:
              NFL_TEAM_COLORS[player.team as keyof typeof NFL_TEAM_COLORS],
          }}
        >
          <div className="w-1/3 flex items-center justify-center bg-white">
            {player.espn_id ? (
              <div className="relative">
                <Image
                  src={`https://a.espncdn.com/i/headshots/nfl/players/full/${player.espn_id}.png`}
                  height={110}
                  width={110}
                  alt={player.full_name}
                />
                <span
                  className={`absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-white ${getStatusColor(playerProfileData?.injury_status)}`}
                  title={playerProfileData?.injury_status || 'Active'}
                ></span>
              </div>
            ) : (
              <User size={110} className="text-gray-400" />
            )}
          </div>
          <CardContent className="w-2/3 p-4 text-white">
            <h2 className="text-lg font-bold">{player.full_name}</h2>
            <p className="flex items-center gap-2 text-sm mb-1">
              {`${player.position} - ${player.team}`}{' '}
              {renderStatus(playerProfileData?.injury_status)}{' '}
            </p>
            {playerProfileData ? (
              <p className="text-sm mb-1">
                {`${calculateHeight(playerProfileData.height)} - ${playerProfileData.weight} lbs`}
              </p>
            ) : (
              <p className="text-sm mb-1">Height - Weight</p>
            )}
            <Link
              href={`/boxScores?playerId=${player.player_id}`}
              prefetch={true}
              className="flex items-center text-sm text-white hover:text-gray-200 transition-colors"
            >
              <FileText className="w-4 h-4 mr-1" />
              <span>Box Scores</span>
            </Link>
          </CardContent>
        </div>
      </Card>
    </Suspense>
  )
}

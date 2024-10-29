// @ts-nocheck
// TODO: FIX TYPES

'use client'
import { Suspense, lazy, useState, useEffect, useMemo } from 'react'
import MatchupCard from '@/components/ui/matchupCard'
import { MatchupDetailProps, PlayerMatchupCardsProps } from '@/lib/definitions'
import Image from 'next/image'
import { Skeleton } from '@/components/ui/skeleton'

const findMatchupPosition = (player1: string, player2: string) => {
  if (player1 !== player2) {
    return 'WRT'
  }
  if (player1 === player2) {
    return player1
  }
  return 'BN'
}

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

const PlayerAvatar = ({
  player,
  size = 40,
}: {
  player: any
  size?: number
}) => {
  if (!player) return null
  if (player.position === 'DEF' || !player?.image_url) {
    const bgColor =
      NFL_TEAM_COLORS[player.team as keyof typeof NFL_TEAM_COLORS] || '#000000'
    return (
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm"
        style={{ backgroundColor: bgColor }}
      >
        {player.team}
      </div>
    )
  }
  return (
    <Image
      src={player.image_url || '/default-avatar.png'}
      alt={player.full_name || 'Player'}
      width={size}
      height={size}
      className="rounded-full"
    />
  )
}

const PlayerInfo = ({
  player,
  points,
  isLeft,
}: {
  player: any
  points: number
  isLeft: boolean
}) => {
  if (!player) return null
  return (
    <div
      className={`flex items-center ${isLeft ? '' : 'flex-row-reverse'} w-full`}
    >
      <PlayerAvatar player={player} />
      <div
        className={`flex flex-col ${isLeft ? 'ml-3' : 'mr-3'} ${
          isLeft ? '' : 'items-end'
        }`}
      >
        <p className="text-sm">
          {player.full_name || `${player.first_name} ${player.last_name}`}
        </p>
        <p className="text-xs text-gray-500">
          {player.position} - {player.team || 'N/A'}
        </p>
      </div>
      <p className={`text-sm font-medium ${isLeft ? 'ml-auto' : 'mr-auto'}`}>
        {points !== null ? points.toFixed(1) : '0.0'}
      </p>
    </div>
  )
}

const PlayerMatchupCard = ({
  player1,
  player2,
  points1,
  points2,
  isStarter,
}: {
  player1: any
  player2: any
  points1: number
  points2: number
  isStarter: boolean
}) => {
  if (!player1 && !player2) return null
  return (
    <div
      className={`flex items-center justify-between p-2 sm:p-4 rounded-lg ${
        isStarter ? 'bg-white' : 'bg-gray-100'
      } mb-4 shadow-sm`}
    >
      <div className="w-5/12">
        {player1 && (
          <PlayerInfo player={player1} points={points1 || 0} isLeft={true} />
        )}
      </div>
      <div className="mx-2 text-xs text-gray-400">
        {isStarter
          ? findMatchupPosition(player1?.position, player2?.position)
          : 'BN'}
      </div>
      <div className="w-5/12 text-right">
        {player2 && (
          <PlayerInfo player={player2} points={points2 || 0} isLeft={false} />
        )}
      </div>
    </div>
  )
}

const PlayerMatchupCards = ({ teamOne, teamTwo }: PlayerMatchupCardsProps) => {
  if (!teamOne?.starters || !teamTwo?.starters)
    return <Skeleton className="w-full h-96" />

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mt-4 mb-2">Starters</h3>
      {teamOne.starters.map((starter, index) => {
        const player2 = teamTwo.starters[index]
        if (!starter?.info && !player2?.info) return null
        return (
          <PlayerMatchupCard
            key={`starter-${index}`}
            player1={starter?.info}
            player2={player2?.info}
            points1={starter?.points || 0}
            points2={player2?.points || 0}
            isStarter={true}
          />
        )
      })}
      {teamTwo.starters.slice(teamOne.starters.length).map((starter, index) => {
        if (!starter?.info) return null
        return (
          <PlayerMatchupCard
            key={`starter-extra-${index}`}
            player1={null}
            player2={starter.info}
            points1={0}
            points2={starter.points || 0}
            isStarter={true}
          />
        )
      })}
      <h3 className="text-lg font-semibold mt-8 mb-2">Bench</h3>
      {teamOne.bench.map((benchPlayer, index) => {
        const player2 = teamTwo.bench[index]
        if (!benchPlayer?.info && !player2?.info) return null
        return (
          <PlayerMatchupCard
            key={`bench-${index}`}
            player1={benchPlayer?.info}
            player2={player2?.info}
            points1={benchPlayer?.points || 0}
            points2={player2?.points || 0}
            isStarter={false}
          />
        )
      })}
      {teamTwo.bench.slice(teamOne.bench.length).map((benchPlayer, index) => {
        if (!benchPlayer?.info) return null
        return (
          <PlayerMatchupCard
            key={`bench-extra-${index}`}
            player1={null}
            player2={benchPlayer.info}
            points1={0}
            points2={benchPlayer.points || 0}
            isStarter={false}
          />
        )
      })}
    </div>
  )
}

const MatchupDetails: React.FC<MatchupDetailProps> = ({
  teamOne,
  teamTwo,
  isUnclaimed,
}) => {
  if (!teamOne || !teamTwo || !teamOne.starters || !teamTwo.starters)
    return <Skeleton className="w-full h-screen" />
  return (
    <div className="max-h-screen flex flex-col">
      <div className="mx-auto w-full max-w-4xl">
        <MatchupCard
          team1={teamOne}
          team2={teamTwo}
          withVsLink={false}
          isUnclaimed={isUnclaimed}
        />
        <Suspense fallback={<Skeleton className="w-full h-96" />}>
          <PlayerMatchupCards teamOne={teamOne} teamTwo={teamTwo} />
        </Suspense>
      </div>
    </div>
  )
}

export default MatchupDetails

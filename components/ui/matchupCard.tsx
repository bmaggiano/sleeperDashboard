'use client'

import React from 'react'
import { FaTrophy } from 'react-icons/fa6'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import MatchupCardSkeleton from '@/components/ui/matchupCardSkeleton'
import Link from 'next/link'
import { useAtom } from 'jotai'
import { weekNumberAtom } from '@/app/atoms/atom'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { cn } from '@/lib/utils'

const MatchupCard = ({
  team1,
  team2,
  withVsLink,
  withWeekRef,
}: {
  team1: any
  team2: any
  withVsLink: boolean
  withWeekRef?: number
}) => {
  const [weekIndex] = useAtom(weekNumberAtom)

  if (!team1 || !team2 || !team1.user || !team2.user) {
    return <MatchupCardSkeleton />
  }

  const linkHref =
    withWeekRef !== undefined
      ? `/${team1.league_id}/${withWeekRef}/${team1.matchup_id}`
      : `/${team1.league_id}/${weekIndex}/${team1.matchup_id}`

  const CardContent = () => (
    <div className="flex items-center justify-between">
      <TeamInfo team={team1} otherTeam={team2} isLeft={true} />
      <div className="text-sm sm:text-2xl font-bold text-gray-400 w-[5%]">
        VS
      </div>
      <TeamInfo team={team2} otherTeam={team1} isLeft={false} />
    </div>
  )

  return (
    <motion.div
      className="w-full bg-white rounded-lg p-2 sm:p-6 my-4 text-black shadow-sm"
      whileHover={
        withVsLink
          ? { scale: 1.02, boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }
          : undefined
      }
      transition={{ duration: 0.2 }}
    >
      {withVsLink ? (
        <Link href={linkHref}>
          <CardContent />
        </Link>
      ) : (
        <CardContent />
      )}
    </motion.div>
  )
}

const TeamInfo = ({
  team,
  otherTeam,
  isLeft,
}: {
  team: any
  otherTeam: any
  isLeft: boolean
}) => {
  const alignClass = isLeft ? 'text-left' : 'text-right'
  const flexDirection = isLeft ? 'flex-row' : 'flex-row-reverse'

  const avatarSrc = team.user.avatar
    ? `https://sleepercdn.com/avatars/thumbs/${team.user.avatar}`
    : ''

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const teamInitials = getInitials(
    team.user.metadata.team_name || team.user.display_name
  )

  return (
    <div
      className={`flex ${flexDirection} items-center overflow-hidden text-ellipsis w-[45%]`}
    >
      <Avatar className={isLeft ? 'mr-4' : 'ml-4'}>
        {avatarSrc ? (
          <AvatarImage
            src={avatarSrc}
            alt={`${team.user.metadata.team_name} avatar`}
          />
        ) : (
          <AvatarFallback>{teamInitials}</AvatarFallback>
        )}
      </Avatar>
      <div className={`flex flex-col ${alignClass}`}>
        <span className="text-xs text-gray-400 w-[100px] sm:w-full truncate">
          @{team.user.display_name}
        </span>
        <span className="font-bold text-sm w-[100px] sm:w-full truncate">
          {team.user.metadata.team_name || team.user.display_name}
        </span>
        <div
          className={cn(
            'flex text-sm mt-2 items-center',
            isLeft ? 'justify-start' : 'justify-end'
          )}
        >
          <span className="font-semibold text-lg">{team.score}</span>
          <span className="text-black font-medium">{team.points} pts</span>
          {team.points > otherTeam.points && (
            <FaTrophy className="text-amber-400 ml-2" />
          )}
        </div>
      </div>
    </div>
  )
}

export default MatchupCard

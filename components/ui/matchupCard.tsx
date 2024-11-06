'use client'

import React, { useState, useEffect } from 'react'
import { FaTrophy } from 'react-icons/fa6'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import MatchupCardSkeleton from '@/components/ui/matchupCardSkeleton'
import Link from 'next/link'
import { useAtom } from 'jotai'
import { weekNumberAtom } from '@/app/atoms/atom'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
// import { Button } from './button'
import { BookmarkCheck, BookmarkPlus, Hand, Loader2 } from 'lucide-react'
import { Button } from './tooltip-button'
import { toast } from './use-toast'
import { useRouter } from 'next/navigation'

const MatchupCard = ({
  team1,
  team2,
  withVsLink,
  withWeekRef,
  isUnclaimed,
}: {
  team1: any
  team2: any
  withVsLink: boolean
  withWeekRef?: number
  isUnclaimed?: boolean
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
      <TeamInfo
        team={team1}
        otherTeam={team2}
        isLeft={true}
        isUnclaimed={isUnclaimed || false}
      />
      <div className="text-sm sm:text-2xl font-bold text-gray-400 w-[5%]">
        VS
      </div>
      <TeamInfo
        team={team2}
        otherTeam={team1}
        isLeft={false}
        isUnclaimed={isUnclaimed || false}
      />
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
  isUnclaimed,
}: {
  team: any
  otherTeam: any
  isLeft: boolean
  isUnclaimed: boolean
}) => {
  const alignClass = isLeft ? 'text-left' : 'text-right'
  const flexDirection = isLeft ? 'flex-row' : 'flex-row-reverse'
  const [loading, setLoading] = useState<boolean>(false)
  const [isLeagueClaimed, setIsLeagueClaimed] = useState<boolean | null>(null)
  const [isTeamClaimed, setIsTeamClaimed] = useState<string | null>(null)
  const router = useRouter()

  const avatarSrc = team.user.metadata.avatar
    ? team.user.metadata.avatar
    : team.user.avatar
      ? `https://sleepercdn.com/avatars/thumbs/${team.user.avatar}`
      : null

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

  const addLeague = async (team: any) => {
    setLoading(true)
    const res = await fetch('/api/claimLeague', {
      method: 'POST',
      body: JSON.stringify({
        leagueId: team.league_id,
        sleeperUserId: team.owner_id,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const data = await res.json()
    if (res.ok) {
      toast({
        title: 'League claimed',
        description: 'Your league has been claimed successfully.',
      })
      setIsTeamClaimed(team.owner_id)
      setIsLeagueClaimed(true)
      router.refresh()
    } else {
      toast({
        variant: 'destructive',
        title: 'Failed to claim league',
        description: data.error,
      })
    }
    setLoading(false)
  }

  const handleClaimLeague = async (
    e: React.MouseEvent<HTMLButtonElement>,
    team: any
  ) => {
    e.preventDefault()
    e.stopPropagation()
    await addLeague(team)
  }

  const handleRemoveLeague = async (
    e: React.MouseEvent<HTMLButtonElement>,
    team: any
  ) => {
    e.preventDefault()
    e.stopPropagation()
    await removeLeague(team)
  }

  const removeLeague = async (leagueId: string) => {
    setLoading(true)
    const res = await fetch('/api/removeLeague', {
      method: 'POST',
      body: JSON.stringify({
        leagueId: team.league_id,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const data = await res.json()
    if (res.ok) {
      toast({
        title: 'League removed',
        description: 'Your league has been removed successfully.',
      })
      setIsTeamClaimed(null)
      setIsLeagueClaimed(false)
      router.refresh()
    } else {
      toast({
        variant: 'destructive',
        title: 'Failed to remove league',
        description: data.error,
      })
    }
    setLoading(false)
  }

  return (
    <div className={`flex ${flexDirection} items-center text-ellipsis w-[45%]`}>
      <div className="relative inline-block">
        {/* Avatar inside a wrapper */}
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

        {isUnclaimed === true && (
          <Button
            tooltip={`Claim @${team.user.display_name} as your team`}
            variant="ghost"
            size="icon"
            className={cn(
              'absolute -top-2 h-6 w-6 rounded-full bg-white shadow',
              isLeft ? '-left-3' : '-right-3'
            )}
            onClick={(e) => handleClaimLeague(e, team)}
          >
            {loading ? (
              <Loader2 className="animate-spin h-4 w-4" />
            ) : (
              <BookmarkPlus className="h-4 w-4 text-gray-500" />
            )}
          </Button>
        )}

        {isTeamClaimed === null && null}

        {isUnclaimed === false &&
          team.claimed?.sleeperUserId === team.owner_id && (
            <Button
              tooltip={`Remove @${team.user.display_name} as your team`}
              variant="ghost"
              size="icon"
              className={cn(
                'absolute -top-2 h-6 w-6 rounded-full bg-white shadow',
                isLeft ? '-left-3' : '-right-3'
              )}
              onClick={(e) => handleRemoveLeague(e, team)}
            >
              {loading ? (
                <Loader2 className="animate-spin h-4 w-4" />
              ) : (
                <BookmarkCheck className="h-4 w-4 text-green-500" />
              )}
            </Button>
          )}

        {isLeagueClaimed === null && null}
      </div>
      <div className={`flex flex-col ${alignClass}`}>
        <span className="flex items-center text-xs text-gray-400 w-[100px] sm:w-full truncate">
          @{team.user.display_name} · {team.settings.wins} -{' '}
          {team.settings.losses}
        </span>
        <span className="font-bold text-sm w-[100px] sm:w-full truncate">
          {team.user.metadata.team_name || team.user.display_name}
        </span>
        <div
          className={cn(
            'flex text-sm items-center',
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

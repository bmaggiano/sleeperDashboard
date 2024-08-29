'use client'
import { cn } from '@/lib/utils'
import { Button } from './button'
import { Avatar, AvatarFallback, AvatarImage } from './avatar'
import { FaTrophy } from 'react-icons/fa'
import { ArrowRightIcon } from '@radix-ui/react-icons'
import { motion } from 'framer-motion'

export default function UserCard({
  user,
  champion,
  width,
  viewRoster = false,
}: {
  user: any
  champion?: any
  width?: boolean
  viewRoster?: boolean
}) {
  return (
    <motion.div
      className={cn(
        'flex p-4 flex mx-auto flex-col items-center h-[90px] ring-1 ring-gray-200 rounded-lg',
        width ? `w-full sm:w-1/2` : `w-full`,
        viewRoster ? 'overflow-hidden curosr-pointer' : ''
      )}
      whileHover={viewRoster ? { height: '150px' } : undefined}
      transition={{
        duration: 0.2,
        ease: 'easeInOut',
      }}
    >
      {champion && (
        <p className="inline-flex items-center gap-x-4 text-amber-400 text-3xl relative">
          <FaTrophy className="absolute -top-2 -left-[11.25rem] transform -translate-x-1/2 -translate-y-1/2 text-4xl bg-white p-1" />
        </p>
      )}
      <div className="flex flex-col w-full h-full">
        <div className="flex items-center">
          <Avatar className="mr-4">
            <AvatarImage src={user.user.metadata.avatar} />
            <AvatarFallback>
              {user.user.display_name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-xl font-bold">
              {user.user.metadata.team_name || user.user.display_name}
            </p>
            <p className="text-sm text-gray-400">@{user.user.display_name}</p>
            <p className="text-sm text-gray-400">
              {' '}
              {user.settings.wins} - {user.settings.losses}
            </p>
          </div>
        </div>
        {viewRoster && (
          <div className="mt-4 w-full group-hover:opacity-100 flex">
            <Button
              className="w-full"
              variant="expandIcon"
              Icon={ArrowRightIcon}
              iconPlacement="right"
            >
              View Roster
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  )
}

'use client'

import { cn } from '@/lib/utils'
import Marquee from '@/components/magicui/marquee'
import Link from 'next/link'
import Image from 'next/image'

const leagues = [
  {
    name: 'Wet-FF (Year 7)',
    description: '12 Team Half PPR',
    leagueId: '974399495632891904',
    body: '1 QB, 2 RB, 3 WR, 1 TE, 1 W/R/T, 1 K, 1 DEF',
    img: 'https://sleepercdn.com/avatars/thumbs/03c86c21e887fadf1b652885694af7cc',
  },
  {
    name: 'League of Legends',
    description: '8 Team, 3 Man Keeper',
    leagueId: '992142653368156160',
    body: '1 QB, 2 RB, 2 WR, 1 TE, 1 W/R/T, 1 K, 1 DEF',
    img: 'https://sleepercdn.com/images/v2/icons/league/nfl/orange.png',
  },
  {
    name: 'NHAT Remix 2',
    description: '10 Team Superflex',
    leagueId: '787735871108562944',
    body: '2 QB, 2 RB, 2 WR, 1 TE, 2 W/R/T',
    img: 'https://sleepercdn.com/avatars/thumbs/bfa3b179c17aa4264282a743e66218bf',
  },
  {
    name: 'NHAT Dynasty BB',
    description: '12 Team Best Ball',
    leagueId: '934226736143806464',
    body: '1 QB, 2 RB, 2 WR, 1 TE, 3 W/R/T',
    img: 'https://sleepercdn.com/avatars/thumbs/03c86c21e887fadf1b652885694af7cc',
  },
  {
    name: "Fantasy Fudus '23",
    description: '12 Team Full PPR',
    leagueId: '990360731344293888',
    body: '1 QB, 2 RB, 2 WR, 1 TE, 1 W/R/T, 1 K, 1 DEF',
    img: 'https://sleepercdn.com/avatars/thumbs/42f817ab2dc95dd29634cd84553902ad',
  },
  {
    name: 'TDP FF',
    description: '12 Team Superflex Half PPR',
    leagueId: '992179723217981440',
    body: '1 QB, 2 RB, 2 WR, 1 TE, 2 W/R/T, 1 K, 1 DEF',
    img: 'https://sleepercdn.com/avatars/thumbs/58f6c24fd240df16ed3d57054285b0ef',
  },
]

const firstRow = leagues.slice(0, leagues.length / 2)
const secondRow = leagues.slice(leagues.length / 2)

const ReviewCard = ({
  img,
  name,
  description,
  body,
  leagueId,
}: {
  img: string
  name: string
  description: string
  body: string
  leagueId: string
}) => {
  return (
    <Link href={`/${leagueId}`} prefetch={true} className="block">
      <figure
        className={cn(
          'relative w-60 h-32 cursor-pointer overflow-hidden rounded-lg p-4 transition-all duration-300 ease-in-out',
          'bg-white dark:bg-gray-800',
          'border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
        )}
      >
        <div className="flex items-center space-x-3">
          <Image
            className="rounded-full"
            width={40}
            height={40}
            alt=""
            src={img}
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {name}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {description}
            </p>
          </div>
        </div>
        <p className="mt-2 text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
          {body}
        </p>
      </figure>
    </Link>
  )
}

export default function LeaguesMarquee() {
  return (
    <div className="relative h-80 w-full overflow-hidden">
      <Marquee pauseOnHover className="[--duration:30s]">
        {firstRow.map((review) => (
          <ReviewCard key={review.description} {...review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:30s] mt-4">
        {secondRow.map((review) => (
          <ReviewCard key={review.description} {...review} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-white dark:from-gray-900"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-white dark:from-gray-900"></div>
    </div>
  )
}

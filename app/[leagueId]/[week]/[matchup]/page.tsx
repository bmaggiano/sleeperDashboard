// app/[matchup]/page.tsx

import { getMatchupsWithMatchupID } from '@/app/utils'
import MatchupServer from './matchupServer'
import type { Metadata, ResolvingMetadata } from 'next'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

type Props = {
  params: { week: string; leagueId: string; matchup: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

// This function is called to generate metadata for this specific page.
export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Destructure the necessary parameters
  const { week, leagueId, matchup } = params

  const data = await getMatchupsWithMatchupID({
    weekIndex: Number(week),
    leagueId: leagueId,
    matchupId: matchup,
  })

  const baseUrl = 'https://sleeper-dashboard.vercel.app/api/cards'

  // Create a URL object from the base URL
  let url = new URL(baseUrl)

  const paramsObj = {
    week: week,
    leagueId: leagueId,
    matchup: matchup,
    teamTwoName: data[1].user.metadata.team_name || data[1].user.display_name,
    teamOneName: data[0].user.metadata.team_name || data[0].user.display_name,
    teamOneDisplayName: data[0].user.display_name,
    teamTwoDisplayName: data[1].user.display_name,
    teamOnePoints: data[0].points,
    teamTwoPoints: data[1].points,
    teamOneWin: data[0].points > data[1].points ? true : false,
    teamOneAvatar:
      data[0].user.metadata.avatar || 'https://via.placeholder.com/64',
    teamTwoAvatar:
      data[1].user.metadata.avatar || 'https://via.placeholder.com/64',
  }
  // Append all parameters using a loop or Object.entries
  for (const [key, value] of Object.entries(paramsObj)) {
    url.searchParams.append(key, value)
  }

  // Fetch data if necessary, or use params to customize metadata
  const imageUrl = url.toString()

  return {
    title: `Matchup Details - Week ${week}`,
    description: `Detailed matchup information for week ${week}.`,
    openGraph: {
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: 'Matchup Details Image',
        },
      ],
      title: `Matchup Details - Week ${week}`,
      description: `Detailed matchup information for week ${week}.`,
    },
  }
}

// Component rendering the Matchup Page
export default function MatchupPage({
  params,
}: {
  params: { week: string; leagueId: string; matchup: string }
}) {
  const { week, leagueId, matchup } = params

  return (
    <div className="sm:py-6">
      <div className="flex justify-end">
        <Button variant={'outline'}>
          <Link prefetch={true} href="/playerSelect">
            Compare Players
          </Link>
        </Button>
      </div>
      <MatchupServer week={week} leagueId={leagueId} matchup={matchup} />
    </div>
  )
}

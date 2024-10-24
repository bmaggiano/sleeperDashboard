// pages/[leagueId]/page.tsx
import Link from 'next/link'
import { getCurrentWeek, getLeagueName, getLeagueWeeks } from '../utils'
import PlayersServer from './playersServer'
import ScoresComponent from './scoresServer'
import { Combobox } from '@/components/ui/combobox'
import { Metadata, ResolvingMetadata } from 'next'
import { redirect } from 'next/navigation'

type Props = {
  params: { leagueId: string }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.leagueId
  const leagueName = await getLeagueName(id)

  return {
    title: `Matchups - ${leagueName}`,
    description: `Check out the matchups for ${leagueName}.`,
    openGraph: {
      title: `Matchups - ${leagueName}`,
      description: `Check out the matchups for ${leagueName}.`,
      images: [
        {
          url: `/image.png`,
          width: 800,
          height: 600,
          alt: `Matchups for ${leagueName}`,
        },
      ],
    },
  }
}

export default async function Page({
  params,
}: {
  params: { leagueId: string }
}) {
  const { leagueId } = params

  const weeks = await getLeagueWeeks(leagueId)

  const mostRecentWeek = await getCurrentWeek(leagueId)

  // Check if the most recent week is "Winners Bracket"
  if (mostRecentWeek === 'Winners Bracket') {
    return redirect(`/${leagueId}/winners`)
  }

  return (
    <main className="mt-4">
      <div className="pt-4 pb-2 flex justify-between items-center">
        <h1 className="font-medium">
          <Link
            href={`/${leagueId}/${mostRecentWeek}`}
            className="hover:underline"
          >
            Matchups - {getLeagueName(leagueId)}
          </Link>
        </h1>
        <Combobox
          leagueId={leagueId}
          defaultValue={mostRecentWeek}
          data={weeks}
        />
      </div>
      {/* <PlayersServer leagueId={leagueId} /> */}
      <ScoresComponent leagueId={leagueId} week={mostRecentWeek} />
    </main>
  )
}

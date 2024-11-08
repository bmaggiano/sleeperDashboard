import { getLeagueName, getLeagueWeeks } from '../../utils'

import { Metadata, ResolvingMetadata } from 'next'
import TrendingPlayers from '../page'

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
    title: `Trending - ${leagueName}`,
    description: `Check out the trending players for ${leagueName}.`,
    openGraph: {
      title: `Trending - ${leagueName}`,
      description: `Check out the trending players for ${leagueName}.`,
      images: [
        {
          url: `/image.png`,
          width: 800,
          height: 600,
          alt: `Trending players for ${leagueName}`,
        },
      ],
    },
  }
}

export default async function LeagueTrending({
  params,
}: {
  params: { leagueId: string }
}) {
  const { leagueId } = params

  console.log(leagueId)

  return <TrendingPlayers leagueId={leagueId || ''} />
}

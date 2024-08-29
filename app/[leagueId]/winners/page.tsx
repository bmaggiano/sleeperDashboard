import WinnersBracket from './winnersBracket'
import WinnersBreadcrumb from './winnersBreadcrumb'
import { getLeagueName, getLeagueWeeks } from '../../utils'
import Link from 'next/link'
import { Metadata, ResolvingMetadata } from 'next'
import { Combobox } from '@/components/ui/combobox'

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
    title: `Winners Bracket - ${leagueName}`,
    description: `Check out the winners bracket for ${leagueName}.`,
    openGraph: {
      title: `Winners Bracket - ${leagueName}`,
      description: `Check out the winners bracket for ${leagueName}.`,
      images: [
        {
          url: `/image.png`,
          width: 800,
          height: 600,
          alt: `Winners Bracket for ${leagueName}`,
        },
      ],
    },
  }
}

export default async function WinnersPage({
  params,
}: {
  params: { leagueId: string }
}) {
  const { leagueId } = params
  const leagueName = await getLeagueName(leagueId)
  const weeks = await getLeagueWeeks(leagueId)

  return (
    <div>
      <div className="pt-4 pb-2 flex justify-between items-center">
        <h1 className="font-medium my-2">
          <Link href={`/${leagueId}`} className="hover:underline">
            Winners Bracket - {leagueName}
          </Link>
        </h1>
        {weeks && weeks.length > 0 && (
          <Combobox
            leagueId={leagueId}
            data={weeks}
            defaultValue="Winners Bracket"
          />
        )}
      </div>
      <WinnersBracket leagueId={leagueId} />
    </div>
  )
}

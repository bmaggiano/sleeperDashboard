import { getServerSession } from 'next-auth/next'
import { authOptions } from '../api/auth/[...nextauth]/options' // Adjust the path to where your auth options are
import PlayerCompareClientPage from './playerCompareClientPage'
import type { Metadata, ResolvingMetadata } from 'next'
import type { GetServerSidePropsContext } from 'next'
import { redirect } from 'next/navigation'
import Unauthenticated from '../unauthenticated'

type Props = {
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
  { searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const p1Name = Array.isArray(searchParams.p1Name)
    ? searchParams.p1Name[0]
    : (searchParams.p1Name ?? '')
  const p2Name = Array.isArray(searchParams.p2Name)
    ? searchParams.p2Name[0]
    : (searchParams.p2Name ?? '')
  const p1Pos = Array.isArray(searchParams.p1Pos)
    ? searchParams.p1Pos[0]
    : (searchParams.p1Pos ?? '')
  const p2Pos = Array.isArray(searchParams.p2Pos)
    ? searchParams.p2Pos[0]
    : (searchParams.p2Pos ?? '')
  const p1Team = Array.isArray(searchParams.p1Team)
    ? searchParams.p1Team[0]
    : (searchParams.p1Team ?? '')
  const p2Team = Array.isArray(searchParams.p2Team)
    ? searchParams.p2Team[0]
    : (searchParams.p2Team ?? '')
  const p1EId = Array.isArray(searchParams.p1EID)
    ? searchParams.p1EID[0]
    : (searchParams.p1EID ?? '')
  const p2EId = Array.isArray(searchParams.p2EID)
    ? searchParams.p2EID[0]
    : (searchParams.p2EID ?? '')

  const baseUrl = 'https://sleeper-dashboard.vercel.app/api/playerCompareOg'

  let url = new URL(baseUrl)

  const paramsObj = {
    p1Name: p1Name,
    p2Name: p2Name,
    p1Pos: p1Pos,
    p2Pos: p2Pos,
    p1Team: p1Team,
    p2Team: p2Team,
    p1EId: p1EId,
    p2EId: p2EId,
  }

  for (const [key, value] of Object.entries(paramsObj)) {
    url.searchParams.append(key, value)
  }

  const imageUrl = url.toString()

  return {
    title: `Player Compare - ${p1Name} vs ${p2Name}`,
    description: `A detailed comparison of player stats and games for ${p1Name} vs ${p2Name}.`,
    openGraph: {
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: 'Player Compare Image',
        },
      ],
    },
  }
}

export default async function PlayerCompareServer() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return <Unauthenticated />
  }

  return <PlayerCompareClientPage />
}

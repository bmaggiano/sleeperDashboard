import PlayerCompareClientPage from './playerCompareClientPage'
import type { Metadata, ResolvingMetadata } from 'next'

type Props = {
  params: {
    p1Name: string
    p2Name: string
    p1Position: string
    p2Position: string
    p1Team: string
    p2Team: string
  }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Destructure the necessary parameters
  const { p1Name, p2Name, p1Position, p2Position, p1Team, p2Team } = params

  const baseUrl = 'https://sleeper-dashboard.vercel.app/api/playerCompareOg'

  // Create a URL object from the base URL
  let url = new URL(baseUrl)

  const paramsObj = {
    p1Name: p1Name,
    p2Name: p2Name,
    p1Position: p1Position,
    p2Position: p2Position,
    p1Team: p1Team,
    p2Team: p2Team,
  }

  for (const [key, value] of Object.entries(paramsObj)) {
    url.searchParams.append(key, value)
  }

  // Fetch data if necessary, or use params to customize metadata
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

export default function PlayerCompareServer() {
  return <PlayerCompareClientPage />
}

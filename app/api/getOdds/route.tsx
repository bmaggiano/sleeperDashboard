import fetchAndFilterStories from '@/app/playerCompare/recentNews'
import redisClient from '@/lib/redis/redisClient'
import { getPlayerDetails } from '@/lib/sleeper/helpers'
import { NextRequest, NextResponse } from 'next/server'
import { openai } from '@ai-sdk/openai'
import { streamObject } from 'ai'
import db from '@/lib/db'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import teamMap from '../../parlai/teamMap'

interface User {
  dailyLimit: number
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = (await db.user.findUnique({
    where: { email: session.user.email as string },
    select: { dailyLimit: true } as any,
  })) as User | null

  if (!user || typeof user.dailyLimit !== 'number' || user.dailyLimit <= 0) {
    return NextResponse.json({ error: 'Daily limit reached' }, { status: 403 })
  }

  const context = await request.json()
  console.log('context', context)
  const { p1Id, p1Name, p1Team, opTeam, p1Prop } = context

  if (!p1Id || !p1Name || !p1Team || !opTeam || !p1Prop) {
    return NextResponse.json(
      { success: false, message: 'Missing required parameters' },
      { status: 400 }
    )
  }

  const cacheKey = `player-prop:${p1Id}-${p1Prop}`
  const cachedData = await redisClient?.get(cacheKey) // Await the promise
  if (cachedData) {
    console.log('cachedData hit')
    const parsedData = JSON.parse(cachedData)
    console.log('parsedData', parsedData)

    return NextResponse.json({
      success: true,
      game: parsedData,
    })
  }
  console.log('cacheKey', cacheKey)

  try {
    // Fetch the data from the Odds API
    const oddsApiUrl = `https://api.the-odds-api.com/v4/sports/americanfootball_nfl/odds?oddsFormat=american&regions=us&apiKey=${process.env.THE_ODDS_API_KEY}`
    const response = await fetch(oddsApiUrl)
    const data = await response.json()

    const matchingGame = data.find((game: any) => {
      return (
        (game.home_team === p1Team && game.away_team === opTeam) ||
        (game.home_team === opTeam && game.away_team === p1Team)
      )
    })

    const matchupId = matchingGame?.id
    const oddsUrl = `https://api.the-odds-api.com/v4/sports/americanfootball_nfl/events/${matchupId}/odds?oddsFormat=american&markets=${p1Prop}&regions=us&apiKey=${process.env.THE_ODDS_API_KEY}`
    const propOdds = await fetch(oddsUrl)
    const propOddsData = await propOdds.json()
    const markets = propOddsData?.bookmakers?.find(
      (book: any) => book.key === 'fanduel'
    ).markets

    const playerProp = markets?.[0]?.outcomes.filter(
      (outcome: any) => outcome.description === p1Name
    )

    console.log('playerProp', playerProp)

    if (playerProp) {
      redisClient?.set(cacheKey, JSON.stringify(playerProp), 'EX', 3600) // Cache for 1 hour
      return NextResponse.json({
        success: true,
        game: playerProp,
      })
    } else {
      return NextResponse.json({
        success: false,
        message: 'No matching game found.',
      })
    }
  } catch (error) {
    console.error('Error fetching odds data:', error)
    return NextResponse.json({
      success: false,
      message: 'Error fetching data.',
    })
  }
}

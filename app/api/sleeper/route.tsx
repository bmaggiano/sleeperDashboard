import { getIndividualMatchup } from '@/lib/sleeper/helpers'
import { NextResponse } from 'next/server'
import { z } from 'zod'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const week = parseInt(url.searchParams.get('week') || '17', 10)
    const matchupId = parseInt(url.searchParams.get('matchupId') || '1', 10)

    const matchup = await getIndividualMatchup(undefined, week, matchupId)

    if (!matchup) {
      return NextResponse.json({ error: 'Matchup not found' }, { status: 404 })
    }

    return NextResponse.json({ matchup })
  } catch (error) {
    console.error('Error fetching data:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Zod validation error', details: error.errors },
        { status: 400 }
      )
    }
    if (error instanceof Error) {
      return NextResponse.json(
        { error: 'Failed to fetch data', details: error.message },
        { status: 500 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to fetch data', details: String(error) },
      { status: 500 }
    )
  }
}

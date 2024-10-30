'use client'
import React, { Suspense, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { experimental_useObject as useObject } from 'ai/react'
import { ffDataSchema } from '../api/db/schema'
import { IoDiceOutline } from 'react-icons/io5'
import { FileText, User } from 'lucide-react'
import Image from 'next/image'
import { Sparkles } from 'lucide-react'
import { TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Certainty } from './certainty'
import { useSearchParams } from 'next/navigation'
import { Progress } from '@/components/ui/progress'
import CompareTableVsTeam from './playerVsTeam'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Globe } from 'lucide-react'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import AISkeleton from './aiSkeleton'
import { calculateHeight } from '../utils'
import PlayerProfile from './playerProfile'

export const dynamic = 'force-dynamic'

function PlayerNews({ playerNews }: { playerNews: any[] }) {
  return (
    <div className="max-w-full">
      {playerNews.length > 0 && (
        <>
          <Badge variant="outline" className="mt-4 mb-2">
            Recent News
          </Badge>
          <ScrollArea className="overflow-hidden whitespace-nowrap rounded-md">
            <div className="flex w-max space-x-4 py-2 px-1">
              {/* Iterate through player 1 stories */}
              {Array.isArray(playerNews) &&
                playerNews.map((data: any, index: number) => (
                  <NewsItem key={`newsitem-${index}`} data={data} />
                ))}
              {Array.isArray(playerNews) &&
                playerNews[0]?.player1Stories?.map(
                  (data: any, index: number) => (
                    <NewsItem key={`player1-${index}`} data={data} />
                  )
                )}
              {/* Iterate through player 2 stories */}
              {Array.isArray(playerNews) &&
                playerNews[0]?.player2Stories?.map(
                  (data: any, index: number) => (
                    <NewsItem key={`player2-${index}`} data={data} />
                  )
                )}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </>
      )}
    </div>
  )
}

function NewsItem({ data }: { data: any }) {
  return (
    <Link
      className="inline-block w-[250px] shrink-0 p-2 ring-1 ring-gray-200 rounded-md"
      href={data?.storyLink || '#'}
    >
      <span className="text-black flex items-center">
        <Globe className="text-gray-500 h-5 w-5 mr-2 shrink-0" />
        <span className="truncate max-w-full">
          {data?.storyTitle || 'link'}
        </span>
      </span>
      <span className="text-gray-500 text-sm block truncate">
        {data?.published && (
          <span>
            {new Date(data.published).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        )}
      </span>
    </Link>
  )
}

function PlayerProfileSkeleton() {
  return (
    <div className="p-8 rounded-md ring-1 ring-gray-200 w-full flex flex-col justify-center items-center">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-2xl">
        <User size={32} />
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold">No players selected</h3>
        <span className="text-gray-500">
          Get started by selecting players to compare
        </span>
      </div>
    </div>
  )
}

function RenderKeyStats({
  data,
  stats,
  player,
}: {
  data: any
  stats: any
  player: any
}) {
  const recommendedStats =
    data?.recommended_pick === data?.playerOneName
      ? stats?.[0]?.[0]?.player1?.nflverse_play_by_play_2024
      : stats?.[0]?.[0]?.player2?.nflverse_play_by_play_2024

  if (
    data?.playerOnePosition === 'WR' ||
    data?.playerTwoPosition === 'WR' ||
    data?.playerOnePosition === 'TE' ||
    data?.playerTwoPosition === 'TE' ||
    data?.playerOnePosition === 'RB' ||
    data?.playerTwoPosition === 'RB'
  ) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 px-2">
        <div className="inline-flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Receptions: {recommendedStats?.totalReceptions}
        </div>
        <div className="inline-flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Receiving Yards: {recommendedStats?.totalRecYards}
        </div>
        <div className="inline-flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Rushing Yards: {recommendedStats?.totalRushYards}
        </div>
        <div className="inline-flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Touchdowns: {recommendedStats?.totalTds}
        </div>
      </div>
    )
  }
  if (data?.playerOnePosition === 'QB' || data?.playerTwoPosition === 'QB') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <div className="inline-flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Pass Completions: {recommendedStats?.totalPassCompletions}
        </div>
        <div className="inline-flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Pass Yards: {recommendedStats?.totalPassYards}
        </div>
        <div className="inline-flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Pass Touchdowns: {recommendedStats?.totalPassTds}
        </div>
        <div className="inline-flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Rush Touchdowns: {recommendedStats?.totalTds}
        </div>
      </div>
    )
  }
}

export default function PlayerCompare() {
  const [selectedPlayer1, setSelectedPlayer1] = useState<any>(null)
  const [selectedPlayer2, setSelectedPlayer2] = useState<any>(null)
  const [playerStats, setPlayerStats] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [playerNews, setPlayerNews] = useState<any[]>([])
  const searchParams = useSearchParams()

  const getCleanedParam = (key: string) => {
    return searchParams.get(key) || searchParams.get(`amp;${key}`)
  }

  const player1Id = getCleanedParam('p1Id')
  const player2Id = getCleanedParam('p2Id')
  const player1Name = getCleanedParam('p1Name')
  const player1EID = getCleanedParam('p1EID')
  const player1Pos = getCleanedParam('p1Pos')
  const player1Team = getCleanedParam('p1Team')
  const player2Name = getCleanedParam('p2Name')
  const player2EID = getCleanedParam('p2EID')
  const player2Pos = getCleanedParam('p2Pos')
  const player2Team = getCleanedParam('p2Team')

  const { object, submit } = useObject({
    api: `/api/db`,
    schema: ffDataSchema,
  })
  const router = useRouter()

  useEffect(() => {
    const handleAutoSubmit = async () => {
      if (!player1Id || !player2Id) return // Prevent execution if IDs are not available
      setLoading(true)

      // Check if players are already selected
      setSelectedPlayer1({
        player_id: player1Id,
        full_name: player1Name,
        espn_id: player1EID,
        position: player1Pos,
        team: player1Team,
      })
      setSelectedPlayer2({
        player_id: player2Id,
        full_name: player2Name,
        espn_id: player2EID,
        position: player2Pos,
        team: player2Team,
      })

      try {
        const [playerStatsRes, playerNewsRes] = await Promise.all([
          fetch('/api/stats', {
            method: 'POST',
            body: JSON.stringify({
              playerId1: player1Id,
              playerId2: player2Id,
            }),
          }),
          fetch('/api/news', {
            method: 'POST',
            body: JSON.stringify({
              playerId1: player1Id,
              playerId2: player2Id,
            }),
          }),
        ])

        const playerStats = await playerStatsRes.json()
        const playerNews = await playerNewsRes.json()

        setPlayerStats([playerStats])

        const allStories = [
          ...playerNews.player1Stories,
          ...playerNews.player2Stories,
        ]
        const uniqueStories = Array.from(
          new Set(allStories.map((story) => story.storyTitle))
        ).map((title) => allStories.find((story) => story.storyTitle === title))
        setPlayerNews(uniqueStories)

        await submit({ playerId1: player1Id, playerId2: player2Id })
      } catch (error) {
        console.error('An error occurred during submission:', error)
      } finally {
        setLoading(false)
      }
    }

    handleAutoSubmit()
  }, [player1Id, player2Id]) // Ensure this only runs when IDs change

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex flex-col gap-4 my-4">
        {loading && selectedPlayer1 && selectedPlayer2 ? (
          <AISkeleton />
        ) : (
          <>
            {object?.analysis?.map((data, index) => (
              <div key={index}>
                {data?.undecided ? (
                  <Card>
                    <CardHeader className="overflow-hidden rounded-t-md bg-green-50">
                      <CardTitle className="flex items-center justify-between text-black text-lg gap-x-2">
                        Toss-up <IoDiceOutline className="h-5 w-5" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex sm:flex-row flex-col-reverse sm:items-center p-6">
                      {data?.undecided}
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader className="overflow-hidden rounded-t-md bg-green-50">
                      <CardTitle className="flex items-center justify-between text-black text-lg gap-x-2">
                        Recommended pick <Sparkles className="h-5 w-5" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="flex sm:flex-row flex-col-reverse sm:items-center sm:justify-around">
                        <div className="hidden">
                          <Certainty data={data} />
                        </div>
                        <div>
                          <div className="flex justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center text-2xl overflow-hidden">
                                <Image
                                  src={`https://a.espncdn.com/i/headshots/nfl/players/full/${data?.recommended_pick_espn_id}.png`}
                                  height={110}
                                  width={110}
                                  alt="recommended player"
                                />
                              </div>
                              <div className="text-xl flex flex-col font-semibold mb-2">
                                {data?.recommended_pick}
                                <span className="font-normal text-base text-gray-500">
                                  {data?.recommended_pick ===
                                  data?.playerOneName
                                    ? `${data?.playerOnePosition}`
                                    : `${data?.playerTwoPosition}`}{' '}
                                  -&nbsp;
                                  {data?.recommended_pick ===
                                  data?.playerOneName
                                    ? `${data?.playerOneTeam}`
                                    : `${data?.playerTwoTeam}`}
                                </span>
                                <div className="sm:hidden block">
                                  <Badge className="font-semibold text-xs sm:text-base">
                                    {data?.certainty}% Certainty
                                  </Badge>{' '}
                                </div>
                              </div>
                            </div>
                            <div className="sm:flex items-center hidden">
                              <Badge
                                variant={'outline'}
                                className="font-medium text-xs sm:text-sm text-gray-600"
                              >
                                {data?.certainty}% Certainty
                              </Badge>{' '}
                            </div>
                          </div>
                          <div>
                            <Progress
                              value={data?.certainty}
                              className="my-2 sm:block"
                            />
                            <div>{data?.explanation}</div>
                            <Badge className="mt-4" variant={'outline'}>
                              Key Stats (2024):
                            </Badge>
                            <RenderKeyStats
                              data={data}
                              stats={playerStats}
                              player={
                                data?.recommended_pick === data?.playerOneName
                                  ? playerStats?.[0]?.player1?.details.fullName
                                  : playerStats?.[0]?.player2?.details.fullName
                              }
                            />
                          </div>
                        </div>
                      </div>
                      <PlayerNews playerNews={playerNews} />
                    </CardContent>
                  </Card>
                )}
              </div>
            ))}
          </>
        )}
        <div className="flex flex-col sm:flex-row justify-center items-start flex-row gap-2 sm:space-y-0 space-y-4">
          <div className="flex flex-col w-full sm:w-1/2">
            {selectedPlayer1 && <PlayerProfile player={selectedPlayer1} />}
          </div>
          <div className="flex flex-col w-full sm:w-1/2">
            {selectedPlayer2 && <PlayerProfile player={selectedPlayer2} />}
          </div>
        </div>
        {!selectedPlayer1 && !selectedPlayer2 && <PlayerProfileSkeleton />}
        {playerStats.length > 0 && (
          <div>
            <CompareTableVsTeam
              data={playerStats?.[0] || {}}
              playerOneId={player1Id || ''}
              playerTwoId={player2Id || ''}
            />
          </div>
        )}
      </div>
    </Suspense>
  )
}

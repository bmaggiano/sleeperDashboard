'use client'
import React, { Suspense, useEffect, useState } from 'react'
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
import PlayerCompareModal from '../playerCompareModal'
import { Progress } from '@/components/ui/progress'
import CompareTableVsTeam from './playerVsTeam'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Globe } from 'lucide-react'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import AISkeleton from './aiSkeleton'

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

function PlayerProfile({ player }: { player: any }) {
  return (
    <Suspense
      fallback={
        <div className="w-full flex justify-center items-center">
          Loading...
        </div>
      }
    >
      <div className="w-full flex items-center space-x-4">
        <div className="flex items-center justify-center text-2xl">
          {player.espn_id ? (
            <Image
              src={`https://a.espncdn.com/i/headshots/nfl/players/full/${player.espn_id}.png`}
              height={90}
              width={90}
              alt={player.full_name}
            />
          ) : (
            <User size={32} />
          )}
        </div>
        <div>
          <h3 className="text-xl font-semibold">{player.full_name}</h3>
          <p className="text-gray-500">
            {player.position} - {player.team}
          </p>
          <Link
            className="flex items-center"
            href={`/boxScores?playerId1=${player.player_id}`}
            prefetch={true}
          >
            <FileText className="w-4 h-4 mr-2 text-gray-500 hover:text-gray-700" />
            Box Scores
          </Link>
        </div>
      </div>
    </Suspense>
  )
}

function PlayerProfileSkeleton({ playerIndex }: { playerIndex: number }) {
  return (
    <div className="w-full flex items-center space-x-4">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-2xl">
        <User size={32} />
      </div>
      <div>
        <h3 className="text-xl font-semibold">Select Player {playerIndex}</h3>
        <p className="text-gray-500">Search for a player</p>
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
        <p className="inline-flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Receptions: {recommendedStats?.totalReceptions}
        </p>
        <p className="inline-flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Receiving Yards: {recommendedStats?.totalRecYards}
        </p>
        <p className="inline-flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Rushing Yards: {recommendedStats?.totalRushYards}
        </p>
        <p className="inline-flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Touchdowns: {recommendedStats?.totalTds}
        </p>
      </div>
    )
  }
  if (data?.playerOnePosition === 'QB' || data?.playerTwoPosition === 'QB') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <p className="inline-flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Pass Completions: {recommendedStats?.totalPassCompletions}
        </p>
        <p className="inline-flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Pass Yards: {recommendedStats?.totalPassYards}
        </p>
        <p className="inline-flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Pass Touchdowns: {recommendedStats?.totalPassTds}
        </p>
        <p className="inline-flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Rush Touchdowns: {recommendedStats?.totalTds}
        </p>
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
  const player1Id = searchParams.get('p1Id')
  const player2Id = searchParams.get('p2Id')
  const player1Name = searchParams.get('p1Name')
  const player1EID = searchParams.get('p1EID')
  const player1Pos = searchParams.get('p1Pos')
  const player1Team = searchParams.get('p1Team')
  const player2Name = searchParams.get('p2Name')
  const player2EID = searchParams.get('p2EID')
  const player2Pos = searchParams.get('p2Pos')
  const player2Team = searchParams.get('p2Team')

  const { object, submit } = useObject({
    api: `/api/db`,
    schema: ffDataSchema,
  })

  useEffect(() => {
    const handleAutoSubmit = async () => {
      setLoading(true)
      if (player1Id && player2Id) {
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
          const playerStatsTest = await fetch('/api/stats', {
            method: 'POST',
            body: JSON.stringify({
              playerId1: player1Id,
              playerId2: player2Id,
            }),
          })
          const playerStats = await playerStatsTest.json()
          setPlayerStats([playerStats])

          const playerNewsFetch = await fetch('/api/news', {
            method: 'POST',
            body: JSON.stringify({
              playerId1: player1Id,
              playerId2: player2Id,
            }),
          })
          const playerNews = await playerNewsFetch.json()
          const allStories = [
            ...playerNews.player1Stories,
            ...playerNews.player2Stories,
          ]

          // Use a Set to remove duplicate articles based on storyTitle
          const uniqueStories = Array.from(
            new Set(allStories.map((story) => story.storyTitle))
          ).map((title) =>
            allStories.find((story) => story.storyTitle === title)
          )

          // Set the unique stories to state
          setPlayerNews(uniqueStories)

          await submit({
            playerId1: player1Id,
            playerId2: player2Id,
          })
          setLoading(false)
        } catch (error) {
          console.error('An error occurred during submission:', error)
        }
      }
    }

    handleAutoSubmit()
  }, [player1Id, player2Id])

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex flex-col gap-4 mt-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg my-2 font-semibold">Player Compare</h1>
          <PlayerCompareModal />
        </div>
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
                              <Image
                                src={`https://a.espncdn.com/i/headshots/nfl/players/full/${data?.recommended_pick_espn_id}.png`}
                                height={70}
                                width={70}
                                alt="recommended player"
                                className="rounded-full"
                              />
                              <p className="text-lg flex flex-col font-semibold mb-2">
                                {data?.recommended_pick}
                                <span className="font-normal text-gray-500">
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
                              </p>
                            </div>
                            <p className="sm:block flex flex-col">
                              <span className="font-semibold text-lg">
                                {data?.certainty}%
                              </span>{' '}
                              Certainty
                            </p>
                          </div>
                          <div>
                            <Progress
                              value={data?.certainty}
                              className="h-4 my-2 sm:block"
                            />
                            <p>{data?.explanation}</p>
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
            <div className="ring-1 ring-gray-200 p-4 rounded-md">
              {selectedPlayer1 ? (
                <PlayerProfile player={selectedPlayer1} />
              ) : (
                <PlayerProfileSkeleton playerIndex={1} />
              )}
            </div>
          </div>
          <div className="flex flex-col w-full sm:w-1/2">
            <div className="ring-1 ring-gray-200 p-4 rounded-md">
              {selectedPlayer2 ? (
                <PlayerProfile player={selectedPlayer2} />
              ) : (
                <PlayerProfileSkeleton playerIndex={2} />
              )}
            </div>
          </div>
        </div>
        {playerStats.length > 0 && (
          <div className="mb-4">
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

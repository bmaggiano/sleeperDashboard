'use client'
import React, { use, useEffect, useState } from 'react'
import { experimental_useObject as useObject } from 'ai/react'
import FuzzySearch from '../fuzzySearch'
import { Button } from '@/components/ui/button'
import { ffDataSchema } from '../api/db/schema'
import { MdNotes } from 'react-icons/md'
import { IoDiceOutline } from 'react-icons/io5'
import { User, ArrowRightLeft } from 'lucide-react'
import Image from 'next/image'
import { Loader2, Sparkles } from 'lucide-react'
import { CircleCheckBig, TrendingUp } from 'lucide-react'
import { YearByYear } from './yearByYear'
import CompareTable from './compareTable'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Certainty } from './certainty'
import { useRouter, useSearchParams } from 'next/navigation'
import PlayerCompareModal from '../[leagueId]/[week]/[matchup]/playerCompareModal'

function PlayerProfile({ player }: { player: any }) {
  return (
    <div className="w-full flex items-center space-x-4 mb-4">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-2xl">
        <Image
          src={`https://a.espncdn.com/i/headshots/nfl/players/full/${player.espn_id}.png`}
          height={50}
          width={50}
          alt={player.full_name}
        />
      </div>
      <div>
        <h3 className="text-xl font-semibold">{player.full_name}</h3>
        <p className="text-gray-500">
          {player.position} - {player.team}
        </p>
      </div>
    </div>
  )
}

function PlayerProfileSkeleton({ playerIndex }: { playerIndex: number }) {
  return (
    <div className="w-full flex items-center space-x-4 mb-4">
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

function RenderKeyStats({ data, player }: { data: any; player: any }) {
  const recommendedStats =
    data?.recommended_pick === data?.playerOneName
      ? data?.playerOneStats?.nflverse_play_by_play_2023
      : data?.playerTwoStats?.nflverse_play_by_play_2023

  if (
    data?.playerOnePosition === 'WR' ||
    data?.playerTwoPosition === 'WR' ||
    data?.playerOnePosition === 'TE' ||
    data?.playerTwoPosition === 'TE' ||
    data?.playerOnePosition === 'RB' ||
    data?.playerTwoPosition === 'RB'
  ) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <p className="inline-flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Receptions: {recommendedStats?.receptions}
        </p>
        <p className="inline-flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Receiving Yards: {recommendedStats?.recYards}
        </p>
        <p className="inline-flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Rushing Yards: {recommendedStats?.rushYards}
        </p>
        <p className="inline-flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Touchdowns: {recommendedStats?.touchdowns}
        </p>
      </div>
    )
  }
  if (data?.playerOnePosition === 'QB' || data?.playerTwoPosition === 'QB') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <p className="inline-flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Pass Completions: {recommendedStats?.passCompletion}
        </p>
        <p className="inline-flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Pass Yards: {recommendedStats?.passYards}
        </p>
        <p className="inline-flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Pass Touchdowns: {recommendedStats?.passTouchdowns}
        </p>
        <p className="inline-flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Rush Touchdowns: {recommendedStats?.touchdowns}
        </p>
      </div>
    )
  }
}

export default function PlayerCompare() {
  const [selectedPlayer1, setSelectedPlayer1] = useState<any>(null)
  const [selectedPlayer2, setSelectedPlayer2] = useState<any>(null)
  const [loading, setLoading] = useState(false)
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
  console.log(player1Id, player2Id)

  const { object, submit } = useObject({
    api: `/api/db`,
    schema: ffDataSchema,
  })

  const handlePlayerSelect = (player: any, playerIndex: number) => {
    if (playerIndex === 1) {
      setSelectedPlayer1(player)
    } else {
      setSelectedPlayer2(player)
    }
    console.log(selectedPlayer1, selectedPlayer2)
  }

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement> | null = null
  ) => {
    event?.preventDefault()
    setLoading(true)
    try {
      await submit({
        playerId1: selectedPlayer1?.player_id,
        playerId2: selectedPlayer2?.player_id,
      })
    } catch (error) {
      console.error('An error occurred during submission:', error)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    const handleAutoSubmit = async () => {
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
          await submit({
            playerId1: player1Id,
            playerId2: player2Id,
          })
        } catch (error) {
          console.error('An error occurred during submission:', error)
        } finally {
          setLoading(false)
        }
      }
    }

    handleAutoSubmit()
  }, [player1Id, player2Id])

  return (
    <div className="flex flex-col gap-4 mt-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg my-2 font-bold">Player Compare</h1>
        <PlayerCompareModal />
      </div>
      <div className="flex flex-col sm:flex-row justify-center items-start flex-row gap-2 sm:space-y-0 space-y-4">
        <div className="flex flex-col w-full sm:w-1/2">
          <div className="ring-1 ring-gray-200 p-4 rounded-md">
            {selectedPlayer1 ? (
              <PlayerProfile player={selectedPlayer1} />
            ) : (
              <PlayerProfileSkeleton playerIndex={1} />
            )}
            <FuzzySearch
              onPlayerSelect={(player) => handlePlayerSelect(player, 1)}
            />
          </div>
        </div>
        <div className="flex flex-col w-full sm:w-1/2">
          <div className="ring-1 ring-gray-200 p-4 rounded-md">
            {selectedPlayer2 ? (
              <PlayerProfile player={selectedPlayer2} />
            ) : (
              <PlayerProfileSkeleton playerIndex={2} />
            )}
            <FuzzySearch
              onPlayerSelect={(player) => handlePlayerSelect(player, 2)}
            />
          </div>
        </div>
      </div>
      {object?.analysis?.map((data, index) => (
        <CompareTable key={index} data={data} />
      ))}
      {object?.analysis && (
        <YearByYear key={0} stats={object?.analysis as any} />
      )}
      <div>
        {object?.analysis?.map((data, index) => (
          <Card key={index} className="flex flex-col">
            <CardHeader className="border-b p-6">
              <CardTitle className="flex items-center justify-between text-lg">
                Analysis <MdNotes className="h-5 w-5" />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p>{data?.explanation}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      {object?.analysis?.map((data, index) => (
        <div key={index}>
          {data?.undecided ? (
            <Card className="flex flex-col items-center">
              <CardHeader>
                <CardTitle>
                  <IoDiceOutline /> Toss-up
                </CardTitle>
              </CardHeader>
              <CardContent>{data?.undecided}</CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader className="overflow-hidden rounded-t-md bg-green-50">
                <CardTitle className="flex items-center justify-between text-black text-lg gap-x-2">
                  Recommended pick <Sparkles className="h-5 w-5" />
                </CardTitle>
              </CardHeader>
              <CardContent className="flex sm:flex-row flex-col items-center justify-center p-6">
                <Certainty data={data} />
                <div>
                  <p className="text-lg font-semibold mb-2">
                    {data?.recommended_pick}
                    <span className="ml-2 font-normal text-gray-500">
                      {data?.recommended_pick === data?.playerOneName
                        ? `${data?.playerOnePosition}`
                        : `${data?.playerTwoPosition}`}{' '}
                      -&nbsp;
                      {data?.recommended_pick === data?.playerOneName
                        ? `${data?.playerOneTeam}`
                        : `${data?.playerTwoTeam}`}
                    </span>
                  </p>
                  <div>
                    <p className="pt-2 pb-1 font-semibold">Key Stats (2023):</p>
                    <RenderKeyStats
                      data={data}
                      player={
                        data?.recommended_pick === data?.playerOneName
                          ? data?.playerOneStats
                          : data?.playerTwoStats
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      ))}
    </div>
  )
}

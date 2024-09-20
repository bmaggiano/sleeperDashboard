'use client'
import { Coins } from '@phosphor-icons/react'
import { useRouter } from 'next/navigation'
import FuzzySearch from '../fuzzySearch'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { ArrowDown, ArrowUp, Car, Target, User } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Combobox } from '@/components/ui/combobox'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { experimental_useObject as useObject } from 'ai/react'
import { propsResSchema } from '../api/analyzeParlay/schema'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import DailyLimitBanner from '../playerCompare/dailyLimitBanner'

type AnalysisObject = {
  analysis?: {
    overUnder: string
    certainty: number
    explanation: string
    prop: string
  }[]
}

const propMap: Record<string, string> = {
  player_rush_yds: 'Rushing Yards',
  player_reception_yds: 'Receiving Yards',
  player_anytime_td: 'Anytime Touchdown',
  // Add other mappings as needed
}

const teamMap = {
  'Arizona Cardinals': 'ARI',
  'Atlanta Falcons': 'ATL',
  'Baltimore Ravens': 'BAL',
  'Buffalo Bills': 'BUF',
  'Carolina Panthers': 'CAR',
  'Chicago Bears': 'CHI',
  'Cincinnati Bengals': 'CIN',
  'Cleveland Browns': 'CLE',
  'Dallas Cowboys': 'DAL',
  'Denver Broncos': 'DEN',
  'Detroit Lions': 'DET',
  'Green Bay Packers': 'GB',
  'Houston Texans': 'HOU',
  'Indianapolis Colts': 'IND',
  'Jacksonville Jaguars': 'JAC',
  'Kansas City Chiefs': 'KC',
  'Miami Dolphins': 'MIA',
  'Minnesota Vikings': 'MIN',
  'New England Patriots': 'NE',
  'New Orleans Saints': 'NO',
  'New York Giants': 'NYG',
  'New York Jets': 'NYJ',
  'Las Vegas Raiders': 'LV',
  'Philadelphia Eagles': 'PHI',
  'Pittsburgh Steelers': 'PIT',
  'Los Angeles Chargers': 'LAC',
  'Los Angeles Rams': 'LAR',
  'San Francisco 49ers': 'SF',
  'Seattle Seahawks': 'SEA',
  'Tampa Bay Buccaneers': 'TB',
  'Tennessee Titans': 'TEN',
  'Washington Commanders': 'WAS',
}

export default function ParlayHelperClient({
  data,
  searchParams,
}: {
  data: any
  searchParams: any
}) {
  const [addingPlayer, setAddingPlayer] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [paramsObj, setParamsObj] = useState<any>({})
  const [player, setPlayerDetails] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [filteredTeams, setFilteredTeams] = useState<string[]>([])
  const router = useRouter()

  const { object, submit } = useObject({
    api: `/api/analyzeParlay`,
    schema: propsResSchema,
  })

  useEffect(() => {
    console.log('paramsObj', paramsObj)
    console.log('player', player)
  }, [player, paramsObj])

  useEffect(() => {
    console.log('data', data)
    console.log('data?.game', data?.game)
    console.log('data length', data?.length)
    console.log('searchParams', searchParams)
  }, [data])

  useEffect(() => {
    setParamsObj({
      ...paramsObj,
      playerId: searchParams.p1Id,
      playerName: searchParams.p1Name,
      playerTeam: searchParams.p1Team,
      prop: searchParams.p1Prop,
      opponentTeam: searchParams.opTeam,
    })
  }, [searchParams])

  const handleAnalyzeBet = async () => {
    setLoading(true)
    await submit({
      ...paramsObj,
    })
    setLoading(false)
  }

  const handleNewAnalysis = () => {
    setParamsObj({
      playerId: null,
      playerName: null,
      playerTeam: null,
      prop: null,
      opponentTeam: null,
    })
  }

  const handlePlayerSelect = async (player: any) => {
    setAddingPlayer(true)
    const response = await fetch(`/api/cache?pid=${player.player_id}`)
    const data = await response.json()

    // Find the full team name (key) based on the team abbreviation (value)
    const fullTeamName = Object.keys(teamMap).find(
      (teamName) => teamMap[teamName as keyof typeof teamMap] === data.team
    )

    setPlayerDetails(data)

    setParamsObj({
      ...paramsObj,
      playerId: data.player_id, // Set playerId to the player ID
      playerName: data.full_name,
      playerTeam: fullTeamName, // Set playerTeam to the full team name
    })
    setAddingPlayer(false)
  }

  const handleAddParam = (key: string, value: string) => {
    if (paramsObj[key]) {
      delete paramsObj[key]
    }
    setParamsObj({ ...paramsObj, [key]: value })
  }

  const handleTeamSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value
    setSearchTerm(term)

    // Filter teams based on search term and limit to 5 results
    const filtered = Object.keys(teamMap)
      .filter((team) => team.toLowerCase().includes(term.toLowerCase()))
      .slice(0, 5)

    setFilteredTeams(filtered)
  }

  const handleTeamSelect = (team: string) => {
    handleAddParam('opponentTeam', team)
    setSearchTerm(team) // Set selected team name in the input field
    setFilteredTeams([]) // Clear suggestions after selection
  }

  const displayProp = propMap[paramsObj?.prop] || null

  return (
    <>
      <h2 className="text-3xl font-bold my-6">
        <Coins className="inline-block mr-2" />
        AI-Powered Sports Betting Analysis
      </h2>
      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User size={28} />
              <span>Player Selection</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">
                Find the player you want to bet on
              </label>
              <FuzzySearch onPlayerSelect={handlePlayerSelect} />
            </div>
            {addingPlayer && <p>Adding player...</p>}
            {paramsObj.playerId && (
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Select the player prop
                </label>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleAddParam('prop', 'player_rush_yds')}
                    variant={'outline'}
                    className={cn(
                      paramsObj.prop === 'player_rush_yds' && 'bg-green-50'
                    )}
                  >
                    Rushing Yards
                  </Button>
                  <Button
                    onClick={() =>
                      handleAddParam('prop', 'player_reception_yds')
                    }
                    variant={'outline'}
                    className={cn(
                      paramsObj.prop === 'player_reception_yds' && 'bg-green-50'
                    )}
                  >
                    Receiving Yards
                  </Button>
                  <Button
                    onClick={() => handleAddParam('prop', 'player_anytime_td')}
                    variant={'outline'}
                    className={cn(
                      paramsObj.prop === 'player_anytime_td' && 'bg-green-50'
                    )}
                  >
                    Anytime Td
                  </Button>
                </div>
              </div>
            )}
            {paramsObj.playerId && (
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Select the opposing team
                </label>
                <Input
                  value={searchTerm}
                  onChange={handleTeamSearch}
                  placeholder="Search for NFL team..."
                  className="mt-2 rounded-md"
                  showArrowButton={false}
                />
                {filteredTeams.length > 0 && (
                  <ul className="mt-2 border border-gray-300 rounded-md max-h-40 overflow-y-auto">
                    {filteredTeams.map((team) => (
                      <li
                        key={team}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                        onClick={() => handleTeamSelect(team)}
                      >
                        {team}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            {paramsObj.playerId && paramsObj.prop && paramsObj.opponentTeam && (
              <div className="flex justify-end">
                <Button>
                  <Link
                    href={{
                      pathname: '/parlai',
                      query: {
                        p1Id: paramsObj.playerId,
                        p1Name: paramsObj.playerName,
                        p1Team: paramsObj.playerTeam,
                        p1Prop: paramsObj.prop,
                        opTeam: paramsObj.opponentTeam,
                      },
                    }}
                  >
                    Get Odds
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="border-b-2">
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>Betting Analysis</span>
            </CardTitle>
            <CardDescription>
              AI-generated insights for your bet
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {data?.game ? (
              <>
                <div className="mb-6">
                  <h3 className="flex items-center text-xl font-semibold">
                    {paramsObj?.playerName}
                    <Badge className="ml-2" variant={'outline'}>
                      FanDuel Odds
                    </Badge>
                  </h3>
                  <p className="text-muted-foreground">{displayProp}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {data?.game?.map((bet: any, index: number) => (
                    <Card key={index} className="border-2 border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-lg font-semibold">
                            {bet.name}
                          </span>
                          {bet.name === 'Over' ? (
                            <ArrowUp className="w-5 h-5 text-green-600" />
                          ) : (
                            <ArrowDown className="w-5 h-5 text-red-600" />
                          )}
                        </div>
                        <div className="text-3xl font-bold mb-2">
                          {bet.point}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Odds: <span className="font-medium">{bet.price}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {object && (
                  <div className="my-4">
                    <p className="text-lg">
                      Stuart{' '}
                      <span className="bg-black text-white px-2 rounded-md">
                        AI
                      </span>{' '}
                      recommends taking the{' '}
                      {object?.analysis?.[0]?.overUnder === 'Over' ? (
                        <span className="font-semibold text-green-600">
                          OVER
                        </span>
                      ) : (
                        <span className="font-semibold text-red-600">
                          UNDER
                        </span>
                      )}{' '}
                    </p>
                    <p>Certainty: {object?.analysis?.[0]?.certainty}%</p>
                    <Progress
                      value={object?.analysis?.[0]?.certainty || 0}
                      className="h-4 my-2 sm:block"
                    />{' '}
                    <p>Explanation: {object?.analysis?.[0]?.explanation}</p>
                  </div>
                )}
                {!object ? (
                  <div className="my-4 flex justify-end">
                    <Button onClick={handleAnalyzeBet} disabled={loading}>
                      {loading ? 'Analyzing...' : 'Analyze Bet'}
                    </Button>{' '}
                  </div>
                ) : (
                  <div className="my-4 flex justify-end">
                    <Button onClick={handleNewAnalysis} disabled={loading}>
                      <Link href={'/parlai'}>New Analysis</Link>
                    </Button>{' '}
                  </div>
                )}
              </>
            ) : (
              <p>Please enter player information to generate analysis.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}

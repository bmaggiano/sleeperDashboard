'use client'
import { Coins } from '@phosphor-icons/react'
import { useRouter } from 'next/navigation'
import { useQueryState, parseAsJson, parseAsString } from 'nuqs'
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
import z from 'zod'
import DailyLimitBanner from '../compare/dailyLimitBanner'
import GameLogs from '../boxScores/page'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

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
  player_pass_yards: 'Pass Yards',
  player_pass_td: 'Pass Touchdown',
  // Add other mappings as needed
}

const fetchUrl =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://sleeper-dashboard.vercel.app'

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
  searchParams,
}: {
  searchParams: any
}) {
  const [data, setData] = useState<any>(null)
  const [addingPlayer, setAddingPlayer] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [paramsObj, setParamsObj] = useState<any>({})
  const [player, setPlayerDetails] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [filteredTeams, setFilteredTeams] = useState<string[]>([])
  const [test, setTest] = useQueryState('name')
  const [playerId, setPlayerId] = useQueryState('playerId', parseAsString)
  const [playerName, setPlayerName] = useQueryState('playerName', parseAsString)
  const [playerTeam, setPlayerTeam] = useQueryState('playerTeam', parseAsString)
  const [betProp, setBetProp] = useQueryState('prop', parseAsString)
  const [odds, setOdds] = useState<any>(null)
  const [opponentTeam, setOpponentTeam] = useQueryState(
    'opponentTeam',
    parseAsString
  )

  const [step, setStep] = useState(1)
  const router = useRouter()

  const { object, submit } = useObject({
    api: `/api/analyzeParlay`,
    schema: propsResSchema,
  })

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
    setStep(4)
    await submit({
      playerId: playerId,
      playerName: playerName,
      playerTeam: playerTeam,
      prop: betProp,
      opponentTeam: opponentTeam,
    })
    setLoading(false)
  }

  const handleNewAnalysis = () => {
    setPlayerDetails(null)
    setSearchTerm('')
    setPlayerId(null)
    setPlayerName(null)
    setPlayerTeam(null)
    setOpponentTeam(null)
    setBetProp(null)
    setStep(1)
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
    setPlayerName(data.full_name)
    setPlayerTeam(fullTeamName || '')
    setPlayerId(data.player_id)
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
    setOpponentTeam(team)
    setSearchTerm(team) // Set selected team name in the input field
    setFilteredTeams([]) // Clear suggestions after selection
  }

  const displayProp = propMap[paramsObj?.prop] || null

  const fetchOdds = async () => {
    setLoading(true)
    // Construct the URL for the API request using the query params
    const oddsUrl = `/api/getOdds?playerId=${playerId}&playerName=${encodeURIComponent(playerName || '')}&playerTeam=${encodeURIComponent(playerTeam || '')}&prop=${betProp || ''}&opponentTeam=${encodeURIComponent(opponentTeam || '')}`
    try {
      const response = await fetch(`${oddsUrl}`)
      const data = await response.json()
      setOdds(data)
      setData(data) // Store the fetched odds in state
    } catch (error) {
      console.error('Error fetching odds:', error)
    } finally {
      setLoading(false) // Stop loading indicator
    }
  }

  return (
    <>
      <h2 className="text-3xl font-bold my-6">
        <Coins className="inline-block mr-2" />
        AI-Powered Sports Betting Analysis
      </h2>
      <Progress value={(step / 4) * 100} className="w-full h-2 mb-6" />

      {/* ------- */}
      {/* STEP 1 */}
      {/* ------- */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User size={28} />
              <span>Step 1: Player Selection</span>
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
            {playerName && playerId && playerTeam && (
              <div className="flex justify-end">
                <Button
                  onClick={() => {
                    router.refresh()
                    setStep(2)
                  }}
                >
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
      {/* ------- */}
      {/* STEP 2 */}
      {/* ------- */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target size={28} />
              <span>Step 2: Bet Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="">
            <div>
              <div className="py-4">
                <label className="text-sm font-medium block">
                  Select the player prop
                </label>
                <ScrollArea className="overflow-hidden whitespace-nowrap rounded-md py-4">
                  {Object.entries(propMap).map(([key, value]) => (
                    <Button
                      key={key}
                      onClick={() => setBetProp(key)}
                      variant="outline"
                      className={cn(betProp === key && 'bg-green-50')}
                    >
                      {value}
                    </Button>
                  ))}
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </div>
              <div className="pb-4">
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
            </div>
            <div className="flex justify-between">
              <Button variant={'outline'} onClick={() => setStep(1)}>
                Back
              </Button>
              <Button
                disabled={
                  !playerName ||
                  !playerId ||
                  !playerTeam ||
                  !betProp ||
                  !opponentTeam
                }
                onClick={() => {
                  fetchOdds()
                  setStep(3)
                }}
              >
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ------- */}
      {/* STEP 3 */}
      {/* ------- */}
      {step === 3 && (
        <Card>
          <CardHeader className="border-b-2">
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>Step 3: Live Odds</span>
            </CardTitle>
            <CardDescription>
              Current odds for {playerName} - {propMap[betProp ?? '']} vs{' '}
              {opponentTeam}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {data?.game ? (
              <>
                <div className="mb-6">
                  <h3 className="flex items-center text-xl font-semibold">
                    {playerName}
                    <Badge className="ml-2" variant="outline">
                      FanDuel Odds
                    </Badge>
                  </h3>
                  <p className="text-muted-foreground">{displayProp}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {data?.game?.map((bet: any, index: number) => (
                    <Card
                      key={index}
                      className="border-none ring-1 ring-gray-200"
                    >
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
              </>
            ) : (
              <p>Fetching current odds...</p>
            )}
            <div className="flex justify-between mt-4">
              <Button variant={'outline'} onClick={() => setStep(2)}>
                Back
              </Button>

              <Button onClick={handleAnalyzeBet} disabled={loading}>
                {loading ? 'Analyzing...' : 'Analyze Bet'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* --------- */}
      {/* Step 4 */}
      {/* --------- */}

      {step === 4 && (
        <Card>
          <CardHeader className="border-b-2">
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>Step 4: Betting Analysis</span>
            </CardTitle>
            <CardDescription>
              AI-generated insights for your bet
            </CardDescription>
          </CardHeader>
          <CardContent>
            {object ? (
              <div className="my-4">
                <p className="text-lg">
                  Stuart{' '}
                  <span className="bg-black text-white px-2 rounded-md">
                    AI
                  </span>{' '}
                  recommends taking the{' '}
                  {object?.analysis?.[0]?.overUnder === 'Over' ? (
                    <span className="font-semibold text-green-600">OVER</span>
                  ) : (
                    <span className="font-semibold text-red-600">UNDER</span>
                  )}{' '}
                </p>
                <p>Certainty: {object?.analysis?.[0]?.certainty}%</p>
                <Progress
                  value={object?.analysis?.[0]?.certainty || 0}
                  className="h-4 my-2 sm:block"
                />
                <p>Explanation: {object?.analysis?.[0]?.explanation}</p>
              </div>
            ) : (
              <p className="flex justify-center p-4">
                Analyzing {playerName} - {propMap[betProp ?? '']} vs{' '}
                {opponentTeam}...
              </p>
            )}
            <div className="flex justify-between">
              <Button variant={'outline'} onClick={() => setStep(3)}>
                Back
              </Button>
              <Button onClick={handleNewAnalysis}>New Analysis</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}

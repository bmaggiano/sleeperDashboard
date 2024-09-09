'use client'

import { TrendingUp, TrendingDown } from 'lucide-react'
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'
import { ChartSpline } from 'lucide-react'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

interface PlayerStats {
  details: {
    gsis_id: string
    fullName: string
    position: string
    team: string
  }
  nflverse_play_by_play_2023?: {
    fantasyPoints: number
  }
  nflverse_play_by_play_2022?: {
    fantasyPoints: number
  }
  nflverse_play_by_play_2021?: {
    fantasyPoints: number
  }
}

interface FinalStats {
  playerOneName: string
  playerTwoName: string
  player1?: PlayerStats
  player2?: PlayerStats
  playerOneTeam: string
  playerTwoTeam: string
}

interface ChartDataPoint {
  month: string
  playerOneName: any
  playerTwoName: any
}

function renderTrend(value1: number, value2: number) {
  if (value1 > value2) {
    return <TrendingDown className="text-gray-500 h-4 w-4" />
  } else if (value1 < value2) {
    return <TrendingUp className="text-gray-500 h-4 w-4" />
  }
}

// Transform function to convert FinalStats to chartData format
const transformData = (stats: FinalStats[]): ChartDataPoint[] => {
  const playerOneName = stats?.[0]?.player1?.details?.fullName ?? 'Player 1'
  const playerTwoName = stats?.[0]?.player2?.details?.fullName ?? 'Player 2'
  return [
    {
      month: '2021',
      [playerOneName]:
        stats?.[0]?.player1?.nflverse_play_by_play_2021?.fantasyPoints ?? 0,
      [playerTwoName]:
        stats?.[0]?.player2?.nflverse_play_by_play_2021?.fantasyPoints ?? 0,
      playerOneName: undefined,
      playerTwoName: undefined,
    },
    {
      month: '2022',
      [playerOneName]:
        stats?.[0]?.player1?.nflverse_play_by_play_2022?.fantasyPoints ?? 0,
      [playerTwoName]:
        stats?.[0]?.player2?.nflverse_play_by_play_2022?.fantasyPoints ?? 0,
      playerOneName: undefined,
      playerTwoName: undefined,
    },
    {
      month: '2023',
      [playerOneName]:
        stats?.[0]?.player1?.nflverse_play_by_play_2023?.fantasyPoints ?? 0,
      [playerTwoName]:
        stats?.[0]?.player2?.nflverse_play_by_play_2023?.fantasyPoints ?? 0,
      playerOneName: undefined,
      playerTwoName: undefined,
    },
  ]
}

export function YearByYear({ stats }: { stats: FinalStats[] | [] }) {
  const chartData = transformData(stats as any)
  const playerOneName = stats?.[0]?.player1?.details?.fullName ?? 'Player 1'
  const playerTwoName = stats?.[0]?.player2?.details?.fullName ?? 'Player 2'
  const playerOneTeam = stats?.[0]?.player1?.details?.team ?? 'DEFAULT'
  const playerTwoTeam = stats?.[0]?.player2?.details?.team ?? 'DEFAULT'

  const NFL_TEAM_COLORS: Record<string, string> = {
    ARI: '#97233F',
    ATL: '#A71930',
    BAL: '#241773',
    BUF: '#00338D',
    CAR: '#0085CA',
    CHI: '#C83803',
    CIN: '#FB4F14',
    CLE: '#311D00',
    DAL: '#003594',
    DEN: '#FB4F14',
    DET: '#0076B6',
    GB: '#203731',
    HOU: '#03202F',
    IND: '#002C5F',
    JAX: '#006778',
    KC: '#E31837',
    LAC: '#0080C6',
    LAR: '#003594',
    LV: '#000000',
    MIA: '#008E97',
    MIN: '#4F2683',
    NE: '#002244',
    NO: '#D3BC8D',
    NYG: '#0B2265',
    NYJ: '#125740',
    PHI: '#004C54',
    PIT: '#FFB612',
    SEA: '#002244',
    SF: '#AA0000',
    TB: '#D50A0A',
    TEN: '#0C2340',
    WAS: '#773141',
    DEFAULT: 'black',
  }

  const chartConfig: ChartConfig = {
    [playerOneName]: {
      label: playerOneName,
      color: NFL_TEAM_COLORS[playerOneTeam],
    },
    [playerTwoName]: {
      label: playerTwoName,
      color: NFL_TEAM_COLORS[playerTwoTeam],
    },
  }

  return (
    <Card>
      <CardHeader className="flex justify-between border-b p-6">
        <CardTitle className="flex justify-between text-lg">
          Fantasy Points by Year
          <ChartSpline className="w-5 h-5" />{' '}
        </CardTitle>
        <CardDescription>2021-2023</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value}
            />
            <YAxis tickLine={false} axisLine={false} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey={playerOneName}
              type="monotone"
              stroke={NFL_TEAM_COLORS[playerOneTeam]}
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey={playerTwoName}
              type="monotone"
              stroke={NFL_TEAM_COLORS[playerTwoTeam]}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-center justify-center gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex justify-center items-center gap-2 leading-none text-gray-700">
              <span
                className="flex items-center gap-2 font-semibold"
                style={{ color: NFL_TEAM_COLORS[playerOneTeam] }}
              >
                {playerOneName}
                <span>
                  {renderTrend(
                    stats?.[0]?.player1?.nflverse_play_by_play_2022
                      ?.fantasyPoints ?? 0,
                    stats?.[0]?.player1?.nflverse_play_by_play_2023
                      ?.fantasyPoints ?? 0
                  )}
                </span>
              </span>{' '}
              and{' '}
              <span
                className="flex items-center gap-2 font-semibold"
                style={{ color: NFL_TEAM_COLORS[playerTwoTeam] }}
              >
                {playerTwoName}
                <span>
                  {renderTrend(
                    stats?.[0]?.player2?.nflverse_play_by_play_2022
                      ?.fantasyPoints ?? 0,
                    stats?.[0]?.player2?.nflverse_play_by_play_2023
                      ?.fantasyPoints ?? 0
                  )}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2 font-medium text-xs text-gray-500">
              * Fantasy points are approximate and based on a full ppr format.
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

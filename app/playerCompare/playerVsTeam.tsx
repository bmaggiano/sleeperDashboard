import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import Fuse from 'fuse.js'
import { BetweenHorizonalStart } from 'lucide-react'
import { useMemo, useState } from 'react'

const NFL_TEAMS = [
  'ARI',
  'ATL',
  'BAL',
  'BUF',
  'CAR',
  'CHI',
  'CIN',
  'CLE',
  'DAL',
  'DEN',
  'DET',
  'GB',
  'HOU',
  'IND',
  'JAX',
  'KC',
  'LV',
  'LAC',
  'LAR',
  'MIA',
  'MIN',
  'NE',
  'NO',
  'NYG',
  'NYJ',
  'PHI',
  'PIT',
  'SF',
  'SEA',
  'TB',
  'TEN',
  'WAS',
]

export default function CompareTableVsTeam({
  data,
  playerOneId,
  playerTwoId,
}: {
  data: any
  playerOneId: string | undefined
  playerTwoId: string | undefined
}) {
  const stats = []

  if (
    data?.playerOnePosition === 'WR' ||
    data?.playerTwoPosition === 'WR' ||
    data?.playerOnePosition === 'TE' ||
    data?.playerTwoPosition === 'TE' ||
    data?.playerOnePosition === 'RB' ||
    data?.playerTwoPosition === 'RB'
  ) {
    stats.push(
      { label: 'Receptions', key: 'receptions' },
      { label: 'Receiving Yards', key: 'recYards' },
      { label: 'Rushing Yards', key: 'rushYards' },
      { label: 'Air Yards', key: 'airYards' },
      { label: 'Yards After Catch', key: 'yardsAfterCatch' },
      { label: 'Yards Per Reception', key: 'yardsPerReception' },
      { label: 'Touchdowns', key: 'touchdowns' },
      { label: 'Weeks', key: 'totalWeeks' }
    )
  }
  if (data?.playerOnePosition === 'QB' || data?.playerTwoPosition === 'QB') {
    stats.push(
      { label: 'Pass Yards', key: 'passYards' },
      { label: 'Pass Completions', key: 'passCompletion' },
      { label: 'Rushing Yards', key: 'rushYards' },
      { label: 'Interceptions', key: 'interceptions' },
      { label: 'Rush Touchdowns', key: 'touchdowns' },
      { label: 'Pass Touchdowns', key: 'passTouchdowns' },
      { label: 'Weeks', key: 'totalWeeks' }
    )
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      <StatsCard
        title="Stats/Game Vs Team"
        stats={stats}
        playerOneName={data?.playerOneName ?? ''}
        playerOneId={playerOneId ?? ''}
        playerTwoName={data?.playerTwoName ?? ''}
        playerTwoId={playerTwoId ?? ''}
      />
    </div>
  )
}

function StatsCard({
  title,
  stats,
  playerOneName,
  playerOneId,
  playerTwoName,
  playerTwoId,
}: {
  title: string
  stats: { label: string; key: string }[]
  playerOneName: string
  playerOneId: string
  playerTwoName: string
  playerTwoId: string
}) {
  const [searchTermPlayer1, setSearchTermPlayer1] = useState('')
  const [selectedTeamPlayer1, setSelectedTeamPlayer1] = useState('')
  const [searchTermPlayer2, setSearchTermPlayer2] = useState('')
  const [selectedTeamPlayer2, setSelectedTeamPlayer2] = useState('')
  const [playerStats, setPlayerStats] = useState<{ [key: string]: any }>({})

  const fetchPlayerStats = async (
    playerId: string,
    year: string,
    team: string,
    playerNum: number
  ) => {
    try {
      const response = await fetch(
        `/api/vsTeam?playerId=${playerId}&year=${year}&team=${team}`
      )
      const result = await response.json()

      const stats = {
        receptions: result.totalReceptions,
        recYards: result.totalRecYards,
        rushYards: result.totalRushYards,
        airYards: result.totalAirYards,
        yardsAfterCatch: result.totalYac,
        yardsPerReception: result.totalYardsPerReception,
        touchdowns: result.totalTds,
        passYards: result.totalPassYards,
        passCompletion: result.totalPassCompletions,
        interceptions: result.totalInterceptions,
        passTouchdowns: result.totalPassTds,
        rushTouchdowns: result.totalRushTds,
        totalWeeks: result.totalWeeks,
      }

      setPlayerStats((prevStats) => ({
        ...prevStats,
        [`player${playerNum}Stats`]: stats,
      }))
    } catch (error) {
      console.error('Error fetching player stats:', error)
    }
  }

  const fuse = useMemo(
    () => new Fuse(NFL_TEAMS, { keys: ['name'], threshold: 0.3 }),
    []
  )

  const searchResultsPlayer1 = useMemo(() => {
    if (!searchTermPlayer1) return []
    return fuse.search(searchTermPlayer1).map((result) => result.item)
  }, [searchTermPlayer1, fuse])

  const searchResultsPlayer2 = useMemo(() => {
    if (!searchTermPlayer2) return []
    return fuse.search(searchTermPlayer2).map((result) => result.item)
  }, [searchTermPlayer2, fuse])

  const getColorClass = (player1: number, player2: number) => {
    return player1 > player2 ? 'text-green-600 font-bold' : 'text-gray-600'
  }

  return (
    <Card className="bg-white overflow-hidden">
      <CardHeader className="p-6 border-b">
        <CardTitle className="flex items-center justify-between text-lg font-semibold text-center">
          {title}
          <BetweenHorizonalStart className="w-5 h-5" />
        </CardTitle>
        <CardDescription className="flex text-base justify-between text-gray-500">
          {/* Player One */}
          <div>
            <p>{playerOneName}</p>
            {selectedTeamPlayer1 && <p>vs {selectedTeamPlayer1}</p>}
            <Input
              showArrowButton={false}
              placeholder="Search for NFL team..."
              value={searchTermPlayer1}
              onChange={(e) => setSearchTermPlayer1(e.target.value)}
              className="mt-2 rounded-md"
            />
            {searchResultsPlayer1.length > 0 && (
              <div className="max-h-40 max-w-44 ring-1 ring-gray-100 rounded-md overflow-y-auto absolute bg-white mt-2">
                {searchResultsPlayer1.map((team) => (
                  <Button
                    key={team}
                    variant="ghost"
                    className="hover:bg-gray-100 rounded-none w-full justify-start"
                    onClick={() => {
                      setSelectedTeamPlayer1(team)
                      setSearchTermPlayer1('')
                      fetchPlayerStats(
                        playerOneId,
                        'nflverse_play_by_play_2023',
                        team,
                        1
                      )
                    }}
                  >
                    {team}
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* Player Two */}
          <div>
            <p>{playerTwoName}</p>
            {selectedTeamPlayer2 && <p>vs {selectedTeamPlayer2}</p>}
            <Input
              showArrowButton={false}
              placeholder="Search for NFL team..."
              value={searchTermPlayer2}
              onChange={(e) => setSearchTermPlayer2(e.target.value)}
              className="mt-2 rounded-md"
            />
            {searchResultsPlayer2.length > 0 && (
              <div className="max-h-40 max-w-44 ring-1 ring-gray-100 rounded-md overflow-y-auto absolute bg-white mt-2">
                {searchResultsPlayer2.map((team) => (
                  <Button
                    key={team}
                    variant="ghost"
                    className="hover:bg-gray-100 rounded-none w-full justify-start"
                    onClick={() => {
                      setSelectedTeamPlayer2(team)
                      setSearchTermPlayer2('')
                      fetchPlayerStats(
                        playerTwoId,
                        'nflverse_play_by_play_2023',
                        team,
                        2
                      )
                    }}
                  >
                    {team}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </CardDescription>
      </CardHeader>
      {playerStats.player1Stats || playerStats.player2Stats ? (
        <CardContent className="p-0">
          <table className="w-full">
            <tbody>
              {stats.map((stat, index) => (
                <tr
                  key={stat.label}
                  className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                >
                  <td
                    className={`py-3 px-6 ${getColorClass(playerStats.player1Stats?.[stat.key] ?? 0, playerStats.player2Stats?.[stat.key] ?? 0)}`}
                  >
                    {playerStats.player1Stats?.[stat.key] ?? 0}
                  </td>
                  <td className="py-3 px-6 text-center text-gray-700">
                    {stat.label}
                  </td>
                  <td
                    className={`py-3 px-6 text-right ${getColorClass(playerStats.player2Stats?.[stat.key] ?? 0, playerStats.player1Stats?.[stat.key] ?? 0)}`}
                  >
                    {playerStats.player2Stats?.[stat.key] ?? 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      ) : null}
    </Card>
  )
}

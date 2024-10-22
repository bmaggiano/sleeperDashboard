import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { BetweenHorizonalStart } from 'lucide-react'

export default function CompareTable({ data }: { data: any }) {
  // Extracted data preparation logic
  const stats = []

  if (
    data?.[0]?.player1?.details?.position === 'WR' ||
    data?.[0]?.player2?.details?.position === 'WR' ||
    data?.[0]?.player1?.details?.position === 'TE' ||
    data?.[0]?.player2?.details?.position === 'TE' ||
    data?.[0]?.player1?.details?.position === 'RB' ||
    data?.[0]?.player2?.details?.position === 'RB'
  ) {
    stats.push(
      {
        label: 'Receptions',
        player1:
          data?.[0]?.player1?.nflverse_play_by_play_2024?.totalReceptions ?? 0,
        player2:
          data?.[0]?.player2?.nflverse_play_by_play_2024?.totalReceptions ?? 0,
      },
      {
        label: 'Receiving Yards',
        player1:
          data?.[0]?.player1?.nflverse_play_by_play_2024?.totalRecYards ?? 0,
        player2:
          data?.[0]?.player2?.nflverse_play_by_play_2024?.totalRecYards ?? 0,
      },
      {
        label: 'Rushing Yards',
        player1:
          data?.[0]?.player1?.nflverse_play_by_play_2024?.totalRushYards ?? 0,
        player2:
          data?.[0]?.player2?.nflverse_play_by_play_2024?.totalRushYards ?? 0,
      },
      {
        label: 'Air Yards',
        player1:
          data?.[0]?.player1?.nflverse_play_by_play_2024?.totalAirYards ?? 0,
        player2:
          data?.[0]?.player2?.nflverse_play_by_play_2024?.totalAirYards ?? 0,
      },
      {
        label: 'Yards After Catch',
        player1: data?.[0]?.player1?.nflverse_play_by_play_2024?.totalYac ?? 0,
        player2: data?.[0]?.player2?.nflverse_play_by_play_2024?.totalYac ?? 0,
      },
      {
        label: 'Yards Per Reception',
        player1:
          data?.[0]?.player1?.nflverse_play_by_play_2024?.totalYardsPerRec ?? 0,
        player2:
          data?.[0]?.player2?.nflverse_play_by_play_2024?.totalYardsPerRec ?? 0,
      },
      {
        label: 'Touchdowns',
        player1: data?.[0]?.player1?.nflverse_play_by_play_2024?.totalTds ?? 0,
        player2: data?.[0]?.player2?.nflverse_play_by_play_2024?.totalTds ?? 0,
      }
      // Add other relevant stats here...
    )
  }
  if (
    data?.[0]?.player1?.details?.position === 'QB' ||
    data?.[0]?.player2?.details?.position === 'QB'
  ) {
    stats.push(
      {
        label: 'Pass Yards',
        player1:
          data?.[0]?.player1?.nflverse_play_by_play_2024?.totalPassYards ?? 0,
        player2:
          data?.[0]?.player2?.nflverse_play_by_play_2024?.totalPassYards ?? 0,
      },
      {
        label: 'Pass Completions',
        player1:
          data?.[0]?.player1?.nflverse_play_by_play_2024
            ?.totalPassCompletions ?? 0,
        player2:
          data?.[0]?.player2?.nflverse_play_by_play_2024
            ?.totalPassCompletions ?? 0,
      },
      {
        label: 'Rushing Yards',
        player1:
          data?.[0]?.player1?.nflverse_play_by_play_2024?.totalRushYards ?? 0,
        player2:
          data?.[0]?.player2?.nflverse_play_by_play_2024?.totalRushYards ?? 0,
      },
      {
        label: 'Interceptions',
        player1:
          data?.[0]?.player1?.nflverse_play_by_play_2024?.totalInterceptions ??
          0,
        player2:
          data?.[0]?.player2?.nflverse_play_by_play_2024?.totalInterceptions ??
          0,
      },
      {
        label: 'Rush Touchdowns',
        player1: data?.[0]?.player1?.nflverse_play_by_play_2024?.totalTds ?? 0,
        player2: data?.[0]?.player2?.nflverse_play_by_play_2024?.totalTds ?? 0,
      },
      {
        label: 'Pass Touchdowns',
        player1:
          data?.[0]?.player1?.nflverse_play_by_play_2024?.totalPassTds ?? 0,
        player2:
          data?.[0]?.player2?.nflverse_play_by_play_2024?.totalPassTds ?? 0,
      }
      // Add other relevant stats here...
    )
  }
  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      <StatsCard
        title="Head to Head Comparison"
        stats={stats}
        playerOneName={data?.[0]?.player1?.details?.fullName}
        playerTwoName={data?.[0]?.player2?.details?.fullName}
      />
    </div>
  )
}

function StatsCard({
  title,
  stats,
  playerOneName,
  playerTwoName,
}: {
  title: string
  stats: any[]
  playerOneName: string
  playerTwoName: string
}) {
  const getColorClass = (player1: number, player2: number) => {
    if (player1 > player2) {
      return 'text-green-600 font-bold'
    } else {
      return 'text-gray-600'
    }
  }

  return (
    <Card className="bg-white overflow-hidden">
      <CardHeader className="p-6 border-b">
        <CardTitle className="flex items-center justify-between text-lg font-semibold text-center">
          {title}
          <BetweenHorizonalStart className="w-5 h-5" />{' '}
        </CardTitle>
        <CardDescription>2024 Stats</CardDescription>
        <div className="flex text-base justify-between text-gray-500">
          <div>{playerOneName}</div>
          <div>{playerTwoName}</div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <table className="w-full">
          <tbody>
            {stats.map((stat, index) => (
              <tr
                key={stat.label}
                className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
              >
                <td
                  className={`py-3 px-6 ${getColorClass(stat.player1, stat.player2)}`}
                >
                  {stat.player1}
                </td>
                <td className="py-3 px-6 text-center text-gray-700">
                  {stat.label}
                </td>
                <td
                  className={`py-3 px-6 text-right ${getColorClass(stat.player2, stat.player1)}`}
                >
                  {stat.player2}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}

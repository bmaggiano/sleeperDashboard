'use client'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from '@/components/ui/table'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { FileText } from 'lucide-react'
import Image from 'next/image'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from '@/components/ui/breadcrumb'
import { Badge } from '@/components/ui/badge'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

function renderTableHeaders(statline: string) {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[50px]">Week</TableHead>
        <TableHead className="w-[50px]">Opp</TableHead>
        {statline === 'passing' && (
          <>
            <TableHead>Comp/Att</TableHead>
            <TableHead>Pass Yds</TableHead>
            <TableHead>Pass Td</TableHead>
            <TableHead>Int</TableHead>
          </>
        )}
        {statline === 'receiving' && (
          <>
            <TableHead>Rec/Tar</TableHead>
            <TableHead>Rec Yds</TableHead>
            <TableHead>Rec Td</TableHead>
            <TableHead>Target Share</TableHead>
          </>
        )}
        {statline === 'rushing' && (
          <>
            <TableHead>Att</TableHead>
            <TableHead>Rush Yds</TableHead>
            <TableHead>Rush Td</TableHead>
            <TableHead>Fumbles</TableHead>
          </>
        )}
        <TableHead>Fps (PPR)</TableHead>
      </TableRow>
    </TableHeader>
  )
}

function renderTableData(data: any, statline: string) {
  return (
    <TableBody>
      {data?.map((player: any, index: any) => (
        <TableRow key={`${player.player_id}-week${player.week}`}>
          <TableCell>{player.week}</TableCell>
          <TableCell>{player.opponent_team}</TableCell>
          {statline === 'passing' && (
            <>
              <TableCell>
                {player.completions}/{player.attempts}
              </TableCell>
              <TableCell>{player.passing_yards}</TableCell>
              <TableCell>{player.passing_tds}</TableCell>
              <TableCell>{player.interceptions}</TableCell>
            </>
          )}
          {statline === 'receiving' && (
            <>
              <TableCell>
                {player.receptions}/{player.targets}
              </TableCell>
              <TableCell>{player.receiving_yards}</TableCell>
              <TableCell>{player.receiving_tds}</TableCell>
              <TableCell>{(player.target_share * 100).toFixed(2)}%</TableCell>
            </>
          )}
          {statline === 'rushing' && (
            <>
              <TableCell>{player.carries}</TableCell>
              <TableCell>{player.rushing_yards}</TableCell>
              <TableCell>{player.rushing_tds}</TableCell>
              <TableCell>{player.rushing_fumbles}</TableCell>
            </>
          )}
          <TableCell>{player.fantasy_points_ppr}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  )
}

export default function GameLogsClient({
  data,
  withBack,
}: {
  data: any
  withBack?: boolean
}) {
  const [statline, setStatline] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    if (data?.playerStats1?.[0]?.position === 'QB') {
      setStatline('passing')
    } else if (data?.playerStats1?.[0]?.position === 'RB') {
      setStatline('rushing')
    } else {
      setStatline('receiving')
    }
  }, [])

  const handleClick = (e: any, value: string) => {
    e.preventDefault()
    setStatline(value)
  }

  const renderPlayerTable = (playerStats: any[]) => {
    if (playerStats?.length === 0) return null

    return (
      <div key={playerStats?.[0]?.player_id} className="mb-8">
        <Table>
          {renderTableHeaders(statline)}
          {renderTableData(playerStats, statline)}
        </Table>
      </div>
    )
  }

  return (
    <>
      {withBack && (
        <Breadcrumb className="my-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                className="cursor-pointer"
                onClick={() => router.back()}
              >
                Back
              </BreadcrumbLink>{' '}
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      )}
      <Card>
        <CardHeader className="flex justify-between border-b p-6">
          <CardTitle className="flex justify-between text-lg">
            Game Logs
            <FileText className="w-5 h-5" />{' '}
          </CardTitle>
          <CardDescription>2024</CardDescription>
        </CardHeader>
        {/* Player 1 Stats */}
        <CardContent className="px-0 sm:p-4 py-4">
          <div className="flex items-center">
            <Image
              src={data?.playerStats1?.[0]?.headshot_url}
              height={90}
              width={90}
              alt={data?.playerStats1?.[0]?.player_display_name}
              className="rounded-full"
            />
            <div>
              <p className="font-semibold tracking-tight px-4">
                {data?.playerStats1?.[0]?.player_display_name}
              </p>
              <p className="text-gray-400 tracking-tight px-4">
                {data?.playerStats1?.[0]?.position} -{' '}
                {data?.playerStats1?.[0]?.recent_team}
              </p>
            </div>
          </div>
          <Badge
            variant="outline"
            onClick={(e) => handleClick(e, 'rushing')}
            className={cn(
              statline === 'rushing' && 'bg-gray-100',
              'cursor-pointer mt-4 mb-2'
            )}
          >
            Rushing
          </Badge>
          <Badge
            variant="outline"
            onClick={(e) => handleClick(e, 'receiving')}
            className={cn(
              statline === 'receiving' && 'bg-gray-100',
              'cursor-pointer mt-4 mb-2'
            )}
          >
            Receiving
          </Badge>
          <Badge
            variant="outline"
            onClick={(e) => handleClick(e, 'passing')}
            className={cn(
              statline === 'passing' && 'bg-gray-100',
              'cursor-pointer mt-4 mb-2'
            )}
          >
            Passing
          </Badge>
          {renderPlayerTable(data?.playerStats1)}
        </CardContent>
      </Card>
    </>
  )
}

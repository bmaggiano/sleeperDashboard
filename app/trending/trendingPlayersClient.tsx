'use client'

import { useState, useMemo } from 'react'
import { useQueryState, parseAsString } from 'nuqs'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

function PlayerCard({
  player,
  trending,
  forCompare,
}: {
  player: any
  trending: 'up' | 'down' | 'available'
  forCompare?: boolean
}) {
  const [p1Name, setP1Name] = useQueryState('p1Name', parseAsString)
  const [p2Name, setP2Name] = useQueryState('p2Name', parseAsString)
  const [p1Pos, setP1Pos] = useQueryState('p1Pos', parseAsString)
  const [p2Pos, setP2Pos] = useQueryState('p2Pos', parseAsString)
  const [p1Team, setP1Team] = useQueryState('p1Team', parseAsString)
  const [p2Team, setP2Team] = useQueryState('p2Team', parseAsString)
  const [p1Id, setP1Id] = useQueryState('p1Id', parseAsString)
  const [p2Id, setP2Id] = useQueryState('p2Id', parseAsString)
  const [p1EID, setP1EID] = useQueryState('p1EID', parseAsString)
  const [p2EID, setP2EID] = useQueryState('p2EID', parseAsString)
  const isSelected =
    p1Id === player.info.sleeper_id || p2Id === player.info.sleeper_id
  const imageUrl = player?.info?.image_url || '/NFL.svg'
  const isUp = trending === 'up'
  const isDown = trending === 'down'

  const handleAddPlayer = (player: any) => {
    if (p1Id === player.sleeper_id) {
      setP1Name(null)
      setP1Pos(null)
      setP1Team(null)
      setP1Id(null)
      setP1EID(null)
    } else if (p2Id === player.sleeper_id) {
      setP2Name(null)
      setP2Pos(null)
      setP2Team(null)
      setP2Id(null)
      setP2EID(null)
    } else if (!p1Id) {
      setP1Name(player.full_name)
      setP1Pos(player.position)
      setP1Team(player.team)
      setP1Id(player.sleeper_id || player.player_id)
      setP1EID(player.espn_id)
    } else if (!p2Id) {
      setP2Name(player.full_name)
      setP2Pos(player.position)
      setP2Team(player.team)
      setP2Id(player.sleeper_id || player.player_id)
      setP2EID(player.espn_id)
    }
  }

  return (
    <Button
      variant={'outline'}
      className={cn(
        'rounded-md w-sm p-0 h-auto overflow-hidden',
        forCompare ? '' : 'cursor-default'
      )}
      onClick={forCompare ? () => handleAddPlayer(player.info) : undefined}
      disabled={p1Id && p2Id && !isSelected ? true : undefined}
    >
      <Card
        className={cn(
          'w-[16rem] overflow-hidden border-l-4 transition-colors rounded-md',
          isUp
            ? 'border-l-green-500 hover:border-l-green-600'
            : isDown
              ? 'border-l-red-500 hover:border-l-red-600'
              : 'border-l-gray-500 hover:border-l-gray-600',
          isSelected ? 'bg-green-50' : 'bg-white'
        )}
      >
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
              <Image
                src={imageUrl}
                alt={`${player?.info?.first_name} ${player?.info?.last_name}`}
                width={64}
                height={64}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-lg truncate">
                  {player?.info?.first_name} {player?.info?.last_name}
                </p>
                {isUp ? (
                  <TrendingUp className="w-5 h-5 text-green-500" />
                ) : isDown ? (
                  <TrendingDown className="w-5 h-5 text-red-500" />
                ) : (
                  <span className="w-5 h-5 text-gray-500">🟢</span>
                )}
              </div>
              <p className="text-left text-sm text-muted-foreground truncate">
                {player?.info?.position} - {player?.info?.team}
              </p>
              <div className="mt-1 flex items-center">
                <span
                  className={cn(
                    'text-sm font-medium',
                    isUp
                      ? 'text-green-600'
                      : isDown
                        ? 'text-red-600'
                        : 'text-gray-600'
                  )}
                >
                  {isUp ? '+' : isDown ? '-' : ''}
                  {player?.count}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Button>
  )
}

export function TrendingPlayersClient({
  forCompare,
  availablePlayersUp,
  availablePlayersDown,
  trendingUpPlayers,
  trendingDownPlayers,
}: {
  forCompare?: boolean
  availablePlayersUp: any[]
  availablePlayersDown: any[]
  trendingUpPlayers: any[]
  trendingDownPlayers: any[]
}) {
  const [showOnlyAvailableUp, setShowOnlyAvailableUp] = useState(false)
  const [showOnlyAvailableDown, setShowOnlyAvailableDown] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('count')

  const filterAndSortPlayers = (players: any[]) => {
    return players
      .filter((player) =>
        player.info.full_name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        if (sortBy === 'count') {
          return b.count - a.count
        } else if (sortBy === 'name') {
          return a.info.full_name.localeCompare(b.info.full_name)
        } else if (sortBy === 'position') {
          return a.info.position.localeCompare(b.info.position)
        }
        return 0
      })
  }

  const filteredUpPlayers = useMemo(
    () =>
      filterAndSortPlayers(
        showOnlyAvailableUp ? availablePlayersUp : trendingUpPlayers
      ),
    [
      showOnlyAvailableUp,
      availablePlayersUp,
      trendingUpPlayers,
      searchQuery,
      sortBy,
    ]
  )

  const filteredDownPlayers = useMemo(
    () =>
      filterAndSortPlayers(
        showOnlyAvailableDown ? availablePlayersDown : trendingDownPlayers
      ),
    [
      showOnlyAvailableDown,
      availablePlayersDown,
      trendingDownPlayers,
      searchQuery,
      sortBy,
    ]
  )

  return (
    <div className="space-y-8 mt-8">
      {/* <div className="flex items-center space-x-4 mb-4">
        <div className="relative flex-grow">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search players..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-2 w-full"
          />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="count">Trend Count</SelectItem>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="position">Position</SelectItem>
          </SelectContent>
        </Select>
      </div> */}

      <div>
        <div className="text-lg font-semibold mb-4 flex items-center gap-2 justify-between">
          <h2 className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-green-500" />
            Trending Up {showOnlyAvailableUp ? '(Available)' : ''}
          </h2>
          {!forCompare && (
            <div className="flex items-center space-x-2">
              <Switch
                disabled={!availablePlayersUp.length}
                id="show-only-available-up"
                checked={showOnlyAvailableUp}
                onCheckedChange={setShowOnlyAvailableUp}
              />
              <Label htmlFor="show-only-available-up">
                Show Only Available
              </Label>
            </div>
          )}
        </div>
        <ScrollArea className="overflow-x-auto whitespace-nowrap rounded-md">
          <div className="flex space-x-4">
            {filteredUpPlayers.map((player, index) => (
              <PlayerCard
                key={player?.id || index}
                player={player}
                trending={'up'}
                forCompare={forCompare}
              />
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      <div>
        <div className="text-lg font-semibold mb-4 flex items-center gap-2 justify-between">
          <h2 className="flex items-center gap-2">
            <TrendingDown className="w-6 h-6 text-red-500" />
            Trending Down {showOnlyAvailableDown ? '(Available)' : ''}
          </h2>
          {!forCompare && (
            <div className="flex items-center space-x-2">
              <Switch
                disabled={availablePlayersDown.length === 0}
                id="show-only-available-down"
                checked={showOnlyAvailableDown}
                onCheckedChange={setShowOnlyAvailableDown}
              />
              <Label htmlFor="show-only-available-down">
                Show Only Available
              </Label>
            </div>
          )}
        </div>
        <ScrollArea className="overflow-x-auto whitespace-nowrap rounded-md">
          <div className="flex space-x-4">
            {filteredDownPlayers.map((player, index) => (
              <PlayerCard
                key={player?.id || index}
                player={player}
                trending={'down'}
                forCompare={forCompare}
              />
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  )
}

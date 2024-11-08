'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown } from 'lucide-react'

function PlayerCard({
  player,
  trending,
}: {
  player: any
  trending: 'up' | 'down' | 'available'
}) {
  const imageUrl = player?.info?.image_url || '/NFL.svg'
  const isUp = trending === 'up'
  const isDown = trending === 'down'

  return (
    <Card
      className={cn(
        'w-full max-w-sm overflow-hidden border-l-4 transition-colors rounded-md',
        isUp
          ? 'border-l-green-500 hover:border-l-green-600'
          : isDown
            ? 'border-l-red-500 hover:border-l-red-600'
            : 'border-l-gray-500 hover:border-l-gray-600'
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
            <p className="text-sm text-muted-foreground truncate">
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
  )
}

export function TrendingPlayersClient({
  availablePlayersUp,
  availablePlayersDown,
  trendingUpPlayers,
  trendingDownPlayers,
}: {
  availablePlayersUp: any[]
  availablePlayersDown: any[]
  trendingUpPlayers: any[]
  trendingDownPlayers: any[]
}) {
  const [showOnlyAvailableUp, setShowOnlyAvailableUp] = useState(false)
  const [showOnlyAvailableDown, setShowOnlyAvailableDown] = useState(false)

  return (
    <div className="space-y-8 mt-8">
      <div>
        <div className="text-lg font-semibold mb-4 flex items-center gap-2 justify-between">
          <h2 className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-green-500" />
            Trending Up {showOnlyAvailableUp ? '(Available)' : ''}
          </h2>
          <div className="flex items-center space-x-2">
            <Switch
              disabled={!availablePlayersUp.length}
              id="show-only-available-up"
              checked={showOnlyAvailableUp}
              onCheckedChange={setShowOnlyAvailableUp}
            />
            <Label htmlFor="show-only-available-up">Show Only Available</Label>
          </div>
        </div>
        <ScrollArea className="overflow-x-auto whitespace-nowrap rounded-md">
          <div className="flex space-x-4">
            {(showOnlyAvailableUp ? availablePlayersUp : trendingUpPlayers).map(
              (player, index) => (
                <PlayerCard
                  key={player?.id || index}
                  player={player}
                  trending={'up'}
                />
              )
            )}
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
        </div>
        <ScrollArea className="overflow-x-auto whitespace-nowrap rounded-md">
          <div className="flex space-x-4">
            {(showOnlyAvailableDown
              ? availablePlayersDown
              : trendingDownPlayers
            ).map((player, index) => (
              <PlayerCard
                key={player?.id || index}
                player={player}
                trending={'down'}
              />
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  )
}

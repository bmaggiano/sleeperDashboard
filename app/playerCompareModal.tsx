// components/PlayerCompareModal.tsx

'use client'

import React, { useEffect, useState } from 'react'
import FuzzySearch from '@/app/fuzzySearch'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogDescription,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog'
import Link from 'next/link'

export default function PlayerCompareModal({ open, setOpen }: any) {
  const [player1Details, setPlayer1Details] = useState<any>(null)
  const [player2Details, setPlayer2Details] = useState<any>(null)

  const handlePlayerSelect = async (player: any, playerIndex: number) => {
    const response = await fetch(`/api/cache?pid=${player.player_id}`)
    const data = await response.json()
    if (playerIndex === 1) {
      setPlayer1Details(data)
    } else {
      setPlayer2Details(data)
    }
  }

  const baseUrl =
    process.env.NODE_ENV === 'production'
      ? 'https://sleeper-dashboard.vercel.app'
      : 'http://localhost:3000'

  const compareUrl = new URL('/compare', baseUrl)

  // Update params based on the new data structure
  const params: { [key: string]: any } = {
    p1Id: player1Details?.player_id || '',
    p1Name: player1Details?.full_name || '',
    p1EID: player1Details?.espn_id || '',
    p1Pos: player1Details?.position || '',
    p1Team: player1Details?.team || '',
    p2Id: player2Details?.player_id || '',
    p2Name: player2Details?.full_name || '',
    p2EID: player2Details?.espn_id || '',
    p2Pos: player2Details?.position || '',
    p2Team: player2Details?.team || '',
  }

  // Ensure that only defined parameters are appended
  Object.keys(params).forEach((key) => {
    if (params[key]) {
      compareUrl.searchParams.append(key, params[key])
    }
  })

  return (
    <div className="flex items-center justify-end">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            Compare Players
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Compare Players</DialogTitle>
          </DialogHeader>
          <DialogDescription>Select two players to compare</DialogDescription>
          <form className="flex flex-col gap-2">
            <FuzzySearch
              onPlayerSelect={(player) => handlePlayerSelect(player, 1)}
            />
            <FuzzySearch
              onPlayerSelect={(player) => handlePlayerSelect(player, 2)}
            />
            {player1Details && player2Details && (
              <DialogTrigger asChild>
                <Link className="flex justify-end" href={compareUrl} passHref>
                  <Button type="submit">Compare</Button>
                </Link>
              </DialogTrigger>
            )}
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

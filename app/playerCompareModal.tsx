'use client'

import React, { useState } from 'react'
import FuzzySearch from '@/app/fuzzySearch'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogDescription,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog'
import Link from 'next/link'

export default function PlayerCompareModal({ open, setOpen }: any) {
  const [selectedPlayer1, setSelectedPlayer1] = useState<any>(null)
  const [selectedPlayer2, setSelectedPlayer2] = useState<any>(null)

  const handlePlayerSelect = (player: any, playerIndex: number) => {
    if (playerIndex === 1) {
      setSelectedPlayer1(player)
    } else {
      setSelectedPlayer2(player)
    }
    console.log(selectedPlayer1, selectedPlayer2)
  }

  // Define the parameters
  const player1Details = {
    playerId: selectedPlayer1?.player_id || '',
    playerName: selectedPlayer1?.full_name || '',
    playerEID: selectedPlayer1?.espn_id || '',
    playerPos: selectedPlayer1?.position || '',
    playerTeam: selectedPlayer1?.team || '',
  }

  const player2Details = {
    playerId: selectedPlayer2?.player_id || '',
    playerName: selectedPlayer2?.full_name || '',
    playerEID: selectedPlayer2?.espn_id || '',
    playerPos: selectedPlayer2?.position || '',
    playerTeam: selectedPlayer2?.team || '',
  }

  const baseUrl = 'https://sleeper-dashboard.vercel.app/playerCompare'

  // Create the base URL
  const compareUrl = new URL(baseUrl)

  // Define the parameters with a specific type
  const params: { [key: string]: any } = {
    p1Id: player1Details.playerId,
    p1Name: player1Details.playerName,
    p1EID: player1Details.playerEID,
    p1Pos: player1Details.playerPos,
    p1Team: player1Details.playerTeam,
    p2Id: player2Details.playerId,
    p2Name: player2Details.playerName,
    p2EID: player2Details.playerEID,
    p2Pos: player2Details.playerPos,
    p2Team: player2Details.playerTeam,
  }

  // Append parameters to the URL
  Object.keys(params).forEach((key) => {
    compareUrl.searchParams.append(key, params[key])
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
          <DialogDescription>
            <p>Select two players to compare</p>
          </DialogDescription>
          <form className="flex flex-col gap-2">
            <FuzzySearch
              onPlayerSelect={(player) => handlePlayerSelect(player, 1)}
            />
            <FuzzySearch
              onPlayerSelect={(player) => handlePlayerSelect(player, 2)}
            />
            {selectedPlayer1 && selectedPlayer2 && (
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

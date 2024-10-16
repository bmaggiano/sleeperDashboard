'use client'

import React, { useEffect, useState, KeyboardEvent } from 'react'
import Fuse from 'fuse.js'
import Image from 'next/image'
import playerData from './playerIds_updated.json' // Assuming your JSON file is named `playerIds_updated.json`
import { Input } from '@/components/ui/input'

// Default fallback image URL
const fallbackImage = '/NFL.svg'

type Player = {
  player_id: string
  search_rank?: number | null
  full_name?: string | null
  team?: string | null
  position?: string
  status?: string
  espn_id?: string
  gsis_id?: string
  headshot?: string
  injury_status?: string | null
}

interface FuzzySearchProps {
  onPlayerSelect: (player: Player) => void
}

const FuzzySearch: React.FC<FuzzySearchProps> = ({ onPlayerSelect }) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Player[]>([])
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null)

  const options = {
    keys: ['full_name', 'team', 'position'],
    threshold: 0.3,
    includeScore: true,
    minMatchCharLength: 2,
  }

  // Convert the player data object into an array of players
  const playersArray = Object?.values(playerData) as Player[]

  const fuse = new Fuse<Player>(playersArray, options)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    setQuery(input)

    if (input.length > 1) {
      const result = fuse.search(input) as { item: Player }[]
      setResults(
        result
          .map((res) => res.item)
          .filter(
            (player: Player) =>
              (player.status === 'Active' ||
                player.status === 'Out' ||
                player.status === 'Questionable' ||
                player.status === 'Injured Reserve' ||
                player.status === 'Inactive') &&
              (player.position === 'QB' ||
                player.position === 'RB' ||
                player.position === 'TE' ||
                player.position === 'WR')
          )
      )
      setFocusedIndex(null) // Reset focused index on new query
    } else {
      setResults([])
      setFocusedIndex(null) // Reset focused index when no results
    }
  }

  const handleSelect = (player: Player) => {
    setQuery(player?.full_name || '')
    setSelectedPlayer(player)
    setResults([])
    setFocusedIndex(null)
    onPlayerSelect(player)
  }

  function renderHeadshot(player: Player) {
    if (player.espn_id) {
      return (
        <Image
          src={`https://a.espncdn.com/i/headshots/nfl/players/full/${player.espn_id}.png`}
          alt={player?.full_name || 'player'}
          width={50}
          height={50}
        />
      )
    } else if (player.headshot) {
      return (
        <Image
          src={player.headshot}
          alt={player?.full_name || 'player'}
          width={50}
          height={50}
        />
      )
    } else {
      return (
        <Image
          src={fallbackImage}
          alt="Default player"
          width={50}
          height={50}
        />
      )
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setFocusedIndex((prevIndex) =>
        prevIndex === null
          ? 0
          : Math.min(results.length - 1, (prevIndex + 1) % results.length)
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setFocusedIndex((prevIndex) =>
        prevIndex === null
          ? results.length - 1
          : Math.max(0, (prevIndex - 1 + results.length) % results.length)
      )
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (focusedIndex !== null) {
        handleSelect(results[focusedIndex])
      }
    }
  }

  return (
    <div className="player-search">
      <Input
        showArrowButton={false}
        type="text"
        value={query}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Search for a player..."
        className="p-2 border rounded"
      />
      {results.length > 0 && (
        <ul className="search-results bg-white border rounded mt-2 overflow-y-auto">
          {results
            .sort((a, b) => {
              // Check if search_rank exists and handle undefined values
              if (a.search_rank === null && b.search_rank === null) return 0
              if (a.search_rank === null) return -1 // b goes after a
              if (b.search_rank === null) return -1 // b goes after a
              if (a.search_rank === undefined) return -1
              if (b.search_rank === undefined) return -1 // a goes after b if a.search_rank is undefined
              return a.search_rank - b.search_rank // Otherwise, sort by search_rank
            })
            .slice(0, 5)
            .map((player, index) => (
              <li
                key={index}
                onClick={() => handleSelect(player)}
                className={`p-2 hover:bg-gray-100 cursor-pointer ${focusedIndex === index ? 'bg-gray-200' : ''} ${selectedPlayer?.gsis_id === player.gsis_id ? 'bg-green-200' : ''}`}
                onMouseEnter={() => setFocusedIndex(index)}
              >
                <div className="flex items-center">
                  {renderHeadshot(player)}
                  <div className="ml-2">
                    <strong>{player.full_name}</strong> -{' '}
                    {player.team ?? 'Free Agent'} ({player.position})
                  </div>
                </div>
              </li>
            ))}
        </ul>
      )}
    </div>
  )
}

export default FuzzySearch

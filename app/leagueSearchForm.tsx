'use client'
import { useState, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { useAtom } from 'jotai'
import { leagueNameAtom, leagueAtom } from './atoms/atom'
import { getLeagueByUserId, getLeagueName } from './utils'
import { useToast } from '@/components/ui/use-toast'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

export default function LeagueSearchForm() {
  const { toast } = useToast()
  const [localLeagueId, setLocalLeagueId] = useState<string>('')
  const [leagueName, setLeagueName] = useAtom(leagueNameAtom)
  const [leagueId, setLeagueId] = useAtom(leagueAtom)
  const [userLeagues, setUserLeagues] = useState<any[]>([])

  const searchLeague = async (searchTerm: string) => {
    const leagueResponse = await getLeagueName(searchTerm)

    if (leagueResponse.error) {
      const userLeaguesResponse = await getLeagueByUserId(searchTerm)
      Array.isArray(userLeaguesResponse) && userLeaguesResponse.length > 0
        ? setUserLeagues(userLeaguesResponse)
        : showErrorToast(`No leagues found for "${searchTerm}"`)
    } else {
      handleSuccessfulLeagueSearch(leagueResponse, searchTerm)
    }
  }

  const debouncedSearch = useCallback(
    debounce((searchTerm: string) => {
      searchLeague(searchTerm)
    }, 300),
    []
  )

  const handleSuccessfulLeagueSearch = (name: string, id: string) => {
    setLeagueId(id)
    setLeagueName(name)
    updateRecentSearches(id)
  }

  const updateRecentSearches = (id: string) => {
    // Retrieve the existing searches from localStorage or initialize an empty array if not found
    const searches = JSON.parse(localStorage.getItem('recentSearches') || '[]')

    // Check if the id is already in the list
    if (!searches.includes(id)) {
      // Add the id to the list and update localStorage
      searches.push(id)
      localStorage.setItem('recentSearches', JSON.stringify(searches))
    }
  }

  const showErrorToast = (message: string) =>
    toast({ title: 'Error', description: message })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setLocalLeagueId(value)
    debouncedSearch(value)
  }

  const handleLeagueSelection = (league: any) => {
    setLeagueId(league.league_id)
    setLeagueName(league.name)
    updateRecentSearches(league.league_id)
  }

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)

  const getColorFromInitials = (initials: string) => {
    let hash = 0
    for (let i = 0; i < initials.length; i++) {
      hash = initials.charCodeAt(i) + ((hash << 5) - hash)
    }
    return `hsl(${hash % 360}, 70%, 50%)`
  }

  return (
    <div className="sm:w-1/2 w-full mx-auto pt-4 pb-2 text-center text-sm">
      <Input
        placeholder="Enter League ID or Username"
        onChange={handleInputChange}
        value={localLeagueId}
        className="w-full"
      />
      {userLeagues.length > 0 && (
        <div className="mt-4 bg-white rounded-md">
          <h3 className="text-base font-semibold mb-2">Select a league</h3>
          <ul className="space-y-2">
            {userLeagues.map((league) => {
              const initials = getInitials(league.name)
              const fallbackColor = getColorFromInitials(initials)
              return (
                <li
                  key={league.league_id}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100"
                >
                  <div className="flex items-center">
                    <Avatar className="mr-2 h-8 w-8">
                      <AvatarImage
                        src={
                          league.avatar
                            ? `https://sleepercdn.com/avatars/${league.avatar}`
                            : ''
                        }
                        alt={`${league.name} avatar`}
                      />
                      <AvatarFallback
                        style={{
                          backgroundColor: fallbackColor,
                          color: 'white',
                        }}
                      >
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs">
                      {league.name} ({league.season})
                    </span>
                  </div>
                  <Link href={`/${league.league_id}/${league.settings.leg}`}>
                    <Button
                      size="xs"
                      onClick={() => handleLeagueSelection(league)}
                    >
                      Select
                    </Button>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      )}
      <Popover>
        <PopoverTrigger className="text-xs text-gray-500 mt-2">
          Not sure how to find your league ID?
        </PopoverTrigger>
        <PopoverContent>
          <ol className="list-decimal list-inside text-xs text-gray-500">
            <li>
              Visit the{' '}
              <Link
                href="https://sleeper.app/leagues"
                target="_blank"
                rel="noreferrer"
                className="text-blue-500 underline"
              >
                Leagues
              </Link>{' '}
              page
            </li>
            <li>Select your league</li>
            <li>Copy ID from URL</li>
          </ol>
        </PopoverContent>
      </Popover>
    </div>
  )
}

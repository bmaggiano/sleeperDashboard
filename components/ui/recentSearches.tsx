'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAtom } from 'jotai'
import { leagueAtom, leagueNameAtom } from '@/app/atoms/atom'
import { Button } from './button'
import { getCurrentWeek, getLeagueName } from '@/app/utils'
import { useRouter } from 'next/navigation'

function RenderButtons({
  recentSearches,
  leagueNames,
  handleClick,
}: {
  recentSearches: string[]
  leagueNames: string[]
  handleClick: (leagueId: string) => void
}) {
  const filteredRecentSearches = Array.from(new Set(recentSearches))
  return filteredRecentSearches.map((leagueId, index) => (
    <Button
      variant={'outline'}
      className="mr-2 text-sm"
      onClick={() => handleClick(leagueId)}
      key={index}
    >
      {leagueNames[index]}
    </Button>
  ))
}

export default function RecentSearches() {
  const router = useRouter()
  const [leagueName, setLeagueName] = useAtom(leagueNameAtom)
  const [leagueId, setLeagueId] = useAtom(leagueAtom)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [leagueNames, setLeagueNames] = useState<string[]>([])

  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches')
    if (savedSearches) {
      const searches = JSON.parse(savedSearches)
      setRecentSearches(searches)
      fetchLeagueNames(searches)
    }
  }, [])

  const fetchLeagueNames = async (searches: string[]) => {
    const names = await Promise.all(searches.map((id) => getLeagueName(id)))
    setLeagueNames(names)
  }

  const handleClick = useCallback(
    async (leagueId: string) => {
      setLeagueId(leagueId)
      const leagueName = await getLeagueName(leagueId)
      const mostRecentWeek = await getCurrentWeek(leagueId)
      setLeagueName(leagueName)
      router.push(`/${leagueId}/${mostRecentWeek}`)
    },
    [setLeagueId, setLeagueName]
  )

  const handleClearRecentSearches = () => {
    setRecentSearches([])
    setLeagueNames([])
    localStorage.removeItem('recentSearches')
  }

  if (recentSearches.length === 0) return null

  return (
    <div className="py-2">
      <div className="flex justify-between items-center">
        <h2 className="font-medium">Recent Searches</h2>
        <Button variant={'link'} onClick={handleClearRecentSearches}>
          Clear Recent Searches
        </Button>
      </div>
      <div className="flex">
        <RenderButtons
          recentSearches={recentSearches}
          leagueNames={leagueNames}
          handleClick={handleClick}
        />
      </div>
    </div>
  )
}

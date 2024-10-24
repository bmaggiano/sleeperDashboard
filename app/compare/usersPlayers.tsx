'use client'

import { useEffect, useState } from 'react'
import { getLeagueDetails } from '../utils'

export default function UsersPlayers() {
  const [user, setUser] = useState<any>(null)
  const [leagueDetails, setLeagueDetails] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [noLeagues, setNoLeagues] = useState<boolean>(false)
  useEffect(() => {
    async function fetchUserLeagues() {
      const response = await fetch(`/api/user`)
      const userData = await response.json() // Parse the response to JSON
      setUser(userData.user)

      if (userData.user?.leagues && userData.user.leagues.length > 0) {
        // Fetch league details for each league
        const detailsPromises = userData.user.leagues.map((league: any) =>
          getLeagueDetails(league.leagueId)
        )
        const fetchedDetails = await Promise.all(detailsPromises)
        setLeagueDetails(fetchedDetails)
        console.log(fetchedDetails)
      } else {
        setNoLeagues(true)
      }

      setLoading(false)
    }

    fetchUserLeagues()
  }, [])

  return (
    <div>
      <h1>Users Players</h1>
      {loading ? (
        <div>Loading leagues...</div> // Loading state
      ) : noLeagues ? (
        <div>No leagues found.</div> // No leagues state
      ) : (
        <div>
          <h2>Leagues</h2>
          <div>
            {leagueDetails.map((details, index) => (
              <div key={index}>{details.name}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

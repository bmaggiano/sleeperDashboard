'use client'
import { Coins } from '@phosphor-icons/react'
import { useRouter } from 'next/navigation'
import FuzzySearch from '../fuzzySearch'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'

const teamMap = {
  'Arizona Cardinals': 'ARI',
  'Atlanta Falcons': 'ATL',
  'Baltimore Ravens': 'BAL',
  'Buffalo Bills': 'BUF',
  'Carolina Panthers': 'CAR',
  'Chicago Bears': 'CHI',
  'Cincinnati Bengals': 'CIN',
  'Cleveland Browns': 'CLE',
  'Dallas Cowboys': 'DAL',
  'Denver Broncos': 'DEN',
  'Detroit Lions': 'DET',
  'Green Bay Packers': 'GB',
  'Houston Texans': 'HOU',
  'Indianapolis Colts': 'IND',
  'Jacksonville Jaguars': 'JAC',
  'Kansas City Chiefs': 'KC',
  'Miami Dolphins': 'MIA',
  'Minnesota Vikings': 'MIN',
  'New England Patriots': 'NE',
  'New Orleans Saints': 'NO',
  'New York Giants': 'NYG',
  'New York Jets': 'NYJ',
  'Las Vegas Raiders': 'LV',
  'Philadelphia Eagles': 'PHI',
  'Pittsburgh Steelers': 'PIT',
  'Los Angeles Chargers': 'LAC',
  'Los Angeles Rams': 'LAR',
  'San Francisco 49ers': 'SF',
  'Seattle Seahawks': 'SEA',
  'Tampa Bay Buccaneers': 'TB',
  'Tennessee Titans': 'TEN',
  'Washington Commanders': 'WAS',
}

export default function ParlayHelperClient() {
  const [paramsObj, setParamsObj] = useState<any>({})
  const [player, setPlayerDetails] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    console.log('paramsObj', paramsObj)
    console.log('player', player)
  }, [player, paramsObj])

  const handlePlayerSelect = async (player: any) => {
    const response = await fetch(`/api/cache?pid=${player.player_id}`)
    const data = await response.json()
    setPlayerDetails(data)
    setParamsObj({
      ...paramsObj,
      playerId: data.player_id,
      playerTeam: data.team,
    })
  }

  const handleAddParam = (key: string, value: string) => {
    if (paramsObj[key]) {
      delete paramsObj[key]
    }
    setParamsObj({ ...paramsObj, [key]: value })
  }

  return (
    <>
      <h2 className="text-3xl font-bold my-6 text-center">
        <Coins className="inline-block mr-2" />
        AI-Powered Sports Betting Analysis
      </h2>
      <div className="flex flex-col items-start justify-center gap-4 p-4">
        <div>
          <p className="p-1">1. Find the player you want to bet on</p>
          <FuzzySearch onPlayerSelect={handlePlayerSelect} />
        </div>
        <div>
          <p className="p-1">2. Select the player prop you want to bet on</p>
          <div className="my-4 flex items-center justify-around">
            <Button
              onClick={() => handleAddParam('prop', 'player_reception_yards')}
              variant={'outline'}
            >
              Receiving Yards
            </Button>
            <Button
              onClick={() =>
                handleAddParam('prop', 'player_anytime_touchdowns')
              }
              variant={'outline'}
            >
              Anytime Touchdowns
            </Button>
            <Button
              onClick={() => handleAddParam('prop', 'player_receptions')}
              variant={'outline'}
            >
              Receptions
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

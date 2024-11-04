import { readFileSync, writeFileSync, unlinkSync } from 'fs'

interface PlayerIdEntry {
  gsis_id: string | null
  full_name: string
  first_name: string
  last_name: string
  position: string
  team_abbr: string | null
  headshot: string | null
  // Add other relevant fields
}

interface GsisEntry {
  gsis_id: string
  display_name: string
  first_name: string
  last_name: string
  position: string
  team_abbr: string
  headshot: string
  // Add other relevant fields
}

async function fetchSleeperData() {
  const response = await fetch('https://api.sleeper.app/v1/players/nfl')
  if (!response.ok) {
    throw new Error(`Error fetching data: ${response.statusText}`)
  }
  return await response.json()
}

// Fetch the latest data from the Sleeper API
async function updateGsisIds() {
  const sleeperData = await fetchSleeperData()
  // Read the JSON files
  const playerIdsRaw = readFileSync('./json/playerIds.json', 'utf-8')
  const gsisRaw = readFileSync('./json/gsis.json', 'utf-8')

  const playerIds: Record<string, PlayerIdEntry> = sleeperData
  const gsis: GsisEntry[] = JSON.parse(gsisRaw)
  // Create a map of GSIS entries for faster lookup
  const gsisMap = new Map(
    gsis.map((entry) => [entry.display_name.toLowerCase(), entry])
  )

  let updatedCount = 0

  // Iterate through playerIds
  for (const [id, player] of Object.entries(playerIds)) {
    if (player.gsis_id === null) {
      // Try to find a match in the GSIS data
      const gsisEntry =
        gsisMap.get(player.full_name.toLowerCase()) ||
        findBestMatch(player, gsis)

      if (gsisEntry) {
        player.gsis_id = gsisEntry.gsis_id
        player.headshot = gsisEntry.headshot
        updatedCount++
      }
    }
  }

  // Remove the previous file if it exists
  const previousFilePath = './playerIds_updated.json'
  try {
    unlinkSync(previousFilePath)
    console.log(`Removed old file: ${previousFilePath}`)
  } catch (err: any) {
    // If the file doesn't exist, we'll ignore the error
    if (err.code !== 'ENOENT') {
      console.error(`Error removing file: ${err.message}`)
    }
  }

  // Write the updated playerIds back to the file
  writeFileSync(previousFilePath, JSON.stringify(playerIds, null, 2))

  console.log(`Updated ${updatedCount} entries with GSIS IDs`)
}

function findBestMatch(
  player: PlayerIdEntry,
  gsis: GsisEntry[]
): GsisEntry | undefined {
  return gsis.find(
    (entry) =>
      entry.first_name.toLowerCase() === player.first_name.toLowerCase() &&
      entry.last_name.toLowerCase() === player.last_name.toLowerCase() &&
      entry.position === player.position &&
      (player.team_abbr === null || entry.team_abbr === player.team_abbr)
  )
}

updateGsisIds()

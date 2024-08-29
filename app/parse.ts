import { readFileSync, writeFileSync } from 'fs'

interface PlayerIdEntry {
  gsis_id: string | null
  full_name: string
  first_name: string
  last_name: string
  position: string
  team_abbr: string | null
  // Add other relevant fields
}

interface GsisEntry {
  gsis_id: string
  display_name: string
  first_name: string
  last_name: string
  position: string
  team_abbr: string
  // Add other relevant fields
}

function updateGsisIds() {
  // Read the JSON files
  const playerIdsRaw = readFileSync('./json/playerIds.json', 'utf-8')
  const gsisRaw = readFileSync('./json/gsis.json', 'utf-8')

  const playerIds: Record<string, PlayerIdEntry> = JSON.parse(playerIdsRaw)
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
        updatedCount++
      }
    }
  }
  // Write the updated playerIds back to the file
  writeFileSync('playerIds_updated.json', JSON.stringify(playerIds, null, 2))

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

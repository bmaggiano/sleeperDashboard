import { Prisma } from '@prisma/client'
import db from '@/lib/db'

export default async function getOpponentTeamAvg(
  team: string,
  position: string
) {
  // Define select fields based on position dynamically
  let selectFields = ''
  let secondSelectFields = ''

  if (position === 'QB') {
    selectFields = `
      SUM(CAST(passing_yards AS INTEGER)) AS total_passing_yards,
      AVG(CAST(passing_yards AS INTEGER)) AS avg_passing_yards_per_game,
      SUM(CAST(passing_tds AS INTEGER)) AS total_passing_tds,
      AVG(CAST(passing_tds AS INTEGER)) AS avg_passing_tds_per_game,
      SUM(CAST(rushing_yards AS INTEGER)) AS total_rushing_yards,
      AVG(CAST(rushing_yards AS INTEGER)) AS avg_rushing_yards_per_game
    `

    secondSelectFields = `
      SUM(total_passing_yards) AS total_passing_yards,
      AVG(total_passing_yards) AS avg_passing_yards_per_game,
      SUM(total_rushing_yards) AS total_rushing_yards,
      AVG(total_rushing_yards) AS avg_rushing_yards_per_game,
      SUM(total_passing_tds) AS total_passing_tds,
      AVG(total_passing_tds) AS avg_passing_tds_per_game
    `
  } else if (position === 'RB') {
    selectFields = `
      SUM(CAST(rushing_yards AS INTEGER)) AS total_rushing_yards,
      SUM(CAST(rushing_tds AS INTEGER)) AS total_rushing_tds,
      SUM(CAST(receiving_tds AS INTEGER)) AS total_receiving_tds
    `

    secondSelectFields = `
      SUM(total_rushing_yards) AS total_rushing_yards,
      AVG(total_rushing_yards) AS avg_rushing_yards_per_game,
      SUM(total_rushing_tds) AS total_rushing_tds,
      AVG(total_rushing_tds) AS avg_rushing_tds_per_game,
      SUM(total_receiving_tds) AS total_receiving_tds,
      AVG(total_receiving_tds) AS avg_receiving_tds_per_game
    `
  } else if (position === 'WR' || position === 'TE') {
    selectFields = `
      SUM(CAST(receiving_yards AS INTEGER)) AS total_receiving_yards,
      SUM(CAST(receiving_tds AS INTEGER)) AS total_receiving_tds,
      SUM(CAST(receptions AS INTEGER)) AS total_receptions
    `

    secondSelectFields = `
      SUM(total_receiving_yards) AS total_receiving_yards,
      AVG(total_receiving_yards) AS avg_receiving_yards_per_game,
      SUM(total_receiving_tds) AS total_receiving_tds,
      AVG(total_receiving_tds) AS avg_receiving_tds_per_game,
      SUM(total_receptions) AS total_receptions,
      AVG(total_receptions) AS avg_receptions_per_game
    `
  }
  // Add more position checks here as needed...

  // Construct the dynamic SQL query
  const query = Prisma.sql`
    WITH weekly_totals AS (
      SELECT 
        week, 
        ${Prisma.raw(selectFields)}
      FROM nflverse_player_stats_2024
      WHERE opponent_team = ${team}
      AND position = ${position}
      GROUP BY week
    )
    SELECT 
      CAST(COUNT(week) AS INTEGER) AS total_weeks, 
      ${Prisma.raw(secondSelectFields)} 
    FROM weekly_totals;
  `

  // Execute the raw query
  const result = await db.$queryRaw(query)
  return result
}

import { z } from 'zod'

const PlayerImageSchema = z.object({
  href: z.string().url(),
  alt: z.string().optional(),
})

const TeamLogoSchema = z.object({
  href: z.string().url(),
  alt: z.string().optional(),
})

export const ESPNPlayerSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  displayName: z.string(),
  shortName: z.string(),
  position: z.string().optional(),
  jersey: z.string().optional(),
  headshot: PlayerImageSchema.optional(),
  team: z
    .object({
      id: z.string(),
      name: z.string(),
      abbreviation: z.string(),
      displayName: z.string(),
      logo: TeamLogoSchema,
    })
    .optional(),
  imageUrl: z.string().url(),
})

export type ESPNPlayer = z.infer<typeof ESPNPlayerSchema>

/**
 * Describes the schema for a player in the players_id_mappings.json file.
 */
const PlayerIdMappingSchema = z.object({
  sleeper_id: z.string().optional().describe('Sleeper ID'),
  sleeper_name: z.string().optional().describe('Player name in Sleeper'),
  yahoo_id: z.string().optional().describe('Yahoo ID'),
  yahoo_name: z.string().optional().describe('Player name in Yahoo'),
  espn_id: z.string().optional().describe('ESPN ID'),
  espn_name: z.string().optional().describe('Player name in ESPN'),
  nffc_id: z.string().optional().describe('NFFC ID'),
  nffc_name: z.string().optional().describe('Player name in NFFC'),
  cbs_id: z.string().optional().describe('CBS ID'),
  cbs_name: z.string().optional().describe('Player name in CBS'),
  fftoday_id: z.string().optional().describe('FFToday ID'),
  fftoday_name: z.string().optional().describe('Player name in FFToday'),
  nfl_id: z.string().optional().describe('NFL.com ID'),
  nfl_name: z.string().optional().describe('Player name in NFL.com'),
  fantasypros_id: z.string().optional().describe('FantasyPros ID'),
  fantasypros_name: z
    .string()
    .optional()
    .describe('Player name in FantasyPros'),
  evanalytics_name: z
    .string()
    .optional()
    .describe('Player name in EVAnalytics'),
  gsis_id: z.string().nullable().optional(),
})

/**
 * Describes the schema for the entire players_id_mappings.json file.
 */
export const PlayersIdMappingsSchema = z.record(
  z.string(),
  PlayerIdMappingSchema
)

/**
 * Describes the default schema for a player.
 */
export const DefaultPlayerSchema = z.object({
  player_id: z.string(),
  full_name: z.string().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  position: z.string().nullable().optional(),
  team: z.string().nullable().optional(),
  age: z.union([z.string(), z.number()]).nullable().optional(),
  height: z.string().nullable().optional(),
  weight: z.union([z.string(), z.number()]).nullable().optional(),
  status: z.string().optional(),
  injury_status: z.string().nullable().optional(),
  fantasy_positions: z.array(z.string()).nullable().optional(),
  espn_id: z.union([z.string(), z.number()]).nullable().optional(),
  yahoo_id: z.union([z.string(), z.number()]).nullable().optional(),
  nfl_id: z.union([z.string(), z.number()]).nullable().optional(),
  fantasypros_id: z.union([z.string(), z.number()]).nullable().optional(),
  espn_player: ESPNPlayerSchema.nullable().optional(),
  player_stats: z.record(z.string(), z.any()).nullable().optional(), // Add this line
  gsis_id: z.string().nullable().optional(),
})

/**
 * Describes the schema for a single league matchup.
 *
 * @property starters - An array of strings representing the starting players.
 * @property roster_id - A number representing the unique identifier for the roster.
 * @property players - An array of strings representing all players in the roster.
 * @property matchup_id - A number or undefined representing the unique identifier for the matchup.
 * @property points - A number representing the total points scored in the matchup.
 * @property custom_points - A nullable number representing any custom points applied.
 */
export const LeagueMatchupSchema = z.object({
  starters: z.array(z.string()).describe('Array of starting player IDs'),
  roster_id: z.number().describe('Unique identifier for the roster'),
  players: z
    .array(z.string())
    .describe('Array of all player IDs in the roster'),
  matchup_id: z
    .number()
    .optional()
    .describe('Unique identifier for the matchup'),
  points: z.number().describe('Total points scored in the matchup'),
  custom_points: z
    .number()
    .nullable()
    .describe('Custom points applied to the matchup, if any'),
})

/**
 * Describes the schema for the response containing all league matchups.
 * It is an array of LeagueMatchupSchema objects.
 */
export const LeagueMatchupsResponseSchema = z
  .array(LeagueMatchupSchema)
  .describe('Array of league matchups')

/**
 * Describes the mapped schema for a league matchup with player details.
 */
export const MappedLeagueMatchupSchema = LeagueMatchupSchema.extend({
  starters: z.array(DefaultPlayerSchema),
  players: z.array(DefaultPlayerSchema),
})

/**
 * Describes the mapped schema for the response containing all league matchups with player details.
 */
export const MappedLeagueMatchupsResponseSchema = z
  .array(MappedLeagueMatchupSchema)
  .describe('Array of league matchups with player details')

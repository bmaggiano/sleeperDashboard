import {
    LeagueMatchupsResponseSchema,
    MappedLeagueMatchupsResponseSchema,
    DefaultPlayerSchema,
    LeagueMatchupSchema,
    ESPNPlayerSchema,
} from "./schemas";
import { z } from "zod";
import playersData from "./players.json";
import { getPlayerIdMappingsFromRedis } from "./cache";
import { getESPNPlayerInfo } from "@/lib/espn";
import type { ESPNPlayer } from "@/lib/sleeper/schemas";

const SLEEPER_API_BASE_URL = "https://api.sleeper.app/v1";
const DEFAULT_LEAGUE_ID = "974399495632891904";
const YEAR = 2023;

async function fetchMatchups(leagueId: string, week: number) {
    const response = await fetch(
        `${SLEEPER_API_BASE_URL}/league/${leagueId}/matchups/${week}`
    );

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
}

function sanitizeMatchups(matchups: z.infer<typeof LeagueMatchupSchema>[]) {
    return matchups.map(({ matchup_id, ...rest }) => ({
        ...rest,
        matchup_id: matchup_id ?? undefined,
    }));
}

async function fetchPlayerEventLog(playerId: string) {
    const response = await fetch(
        `https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/${YEAR}/athletes/${playerId}/eventlog`
    );

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
}

export async function getPlayerDetails(playerId: string, detailed = false) {
    const playerData = (playersData as Record<string, any>)[playerId] || {
        player_id: playerId,
    };
    const idMapping = await getPlayerIdMappingsFromRedis(playerId);
    const espnInfo = idMapping?.espn_id
        ? await getESPNPlayerInfo(idMapping.espn_id)
        : null;

    // Stub out the detailedInfo and playerStats for now
    const detailedInfo = null;
    const playerStats: Record<string, any> = {};

    return {
        ...DefaultPlayerSchema.parse({
            ...playerData,
            espn_id: idMapping?.espn_id ?? null,
        }),
        espn_info: espnInfo,
        // detailed_info: detailedInfo,
        player_stats: playerStats,
    };
}

async function getPlayerStatistics(
    eventId: string,
    competitionId: string,
    competitorId: string,
    playerId: string
) {
    const url = `https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/events/${eventId}/competitions/${competitionId}/competitors/${competitorId}/roster/${playerId}/statistics/0?lang=en&region=us`;

    const response = await fetch(url);

    if (!response.ok) {
        if (response.status === 404) {
            console.error(
                `404 Not Found: eventId=${eventId}, competitionId=${competitionId}, competitorId=${competitorId}, playerId=${playerId}. URL: ${url}`
            );
        }
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
}

async function mapMatchupsWithPlayerDetails(
    parsedMatchups: z.infer<typeof LeagueMatchupsResponseSchema>
) {
    return Promise.all(
        parsedMatchups.map(async ({ starters, players, ...rest }) => ({
            ...rest,
            starters: await Promise.all(
                starters.map((player) => getPlayerDetails(player, true))
            ),
            players: await Promise.all(
                players.map((player) => getPlayerDetails(player, true))
            ),
        }))
    );
}

export async function getLeagueMatchups(
    leagueId = DEFAULT_LEAGUE_ID,
    week: number,
    includePlayerDetails = true
) {
    try {
        const matchups = await fetchMatchups(leagueId, week);
        const sanitizedMatchups = sanitizeMatchups(matchups);
        const parsedMatchups =
            LeagueMatchupsResponseSchema.parse(sanitizedMatchups);

        if (!includePlayerDetails) return parsedMatchups;

        const mappedMatchups = await mapMatchupsWithPlayerDetails(parsedMatchups);
        return MappedLeagueMatchupsResponseSchema.parse(mappedMatchups);
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error("Zod validation error:", error.errors);
            throw new Error(`Zod validation error: ${JSON.stringify(error.errors)}`);
        }
        console.error("Error fetching league matchups:", error);
        throw error;
    }
}

export async function getIndividualMatchup(
    leagueId = DEFAULT_LEAGUE_ID,
    week: number,
    matchupId: number,
    includePlayerDetails = true
) {
    try {
        const allMatchups = await getLeagueMatchups(
            leagueId,
            week,
            includePlayerDetails
        );
        const matchup = allMatchups.filter((m) => m.matchup_id === matchupId);

        if (matchup.length === 0) {
            console.warn(
                `No matchup found for week ${week} and matchup ID ${matchupId}`
            );
            return null;
        }

        const matchupWithESPNInfo = await Promise.all(
            matchup.map(async ({ starters, players, ...rest }) => ({
                ...rest,
                starters: await Promise.all(starters.map(updatePlayerWithESPNInfo)),
                players: await Promise.all(players.map(updatePlayerWithESPNInfo)),
            }))
        );

        console.log({
            matchupWithESPNInfo: matchupWithESPNInfo[0].players[0].espn_info,
        });

        const ExtendedDefaultPlayerSchema = DefaultPlayerSchema.extend({
            espn_info: ESPNPlayerSchema.nullable(),
        });

        const ExtendedMappedLeagueMatchupSchema = LeagueMatchupSchema.extend({
            starters: z.array(ExtendedDefaultPlayerSchema),
            players: z.array(ExtendedDefaultPlayerSchema),
        });

        const ExtendedMappedLeagueMatchupsResponseSchema = z.array(
            ExtendedMappedLeagueMatchupSchema
        );

        const validatedMatchup =
            ExtendedMappedLeagueMatchupsResponseSchema.safeParse(matchupWithESPNInfo);

        if (!validatedMatchup.success) {
            console.error(
                "Matchup data does not match expected schema:",
                validatedMatchup.error
            );
            throw new Error("Invalid matchup data structure");
        }

        return validatedMatchup.data;
    } catch (error) {
        console.error("Error fetching individual matchup:", error);
        throw error;
    }
}

async function updatePlayerWithESPNInfo(player: any) {
    if (typeof player === "string") return player;

    const espnInfo =
        player.espn_id && typeof player.espn_id === "string"
            ? await getESPNPlayerInfo(player.espn_id)
            : null;

    return { ...player, espn_info: espnInfo };
}
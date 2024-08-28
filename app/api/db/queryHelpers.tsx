import { Prisma } from "@prisma/client";

export function createSqlQuery(playerGsis: string, year: string) {
    const playerStats = Prisma.sql`
        SELECT
            MAX(yards_gained) AS longest_play,
            SUM(CASE WHEN "receiver_player_id" = ${playerGsis} THEN yards_gained ELSE 0 END) AS total_rec_yards,
            SUM(CASE WHEN "rusher_player_id" = ${playerGsis} THEN yards_gained ELSE 0 END) AS total_rush_yards,
            SUM(air_yards) AS total_air_yards,
            SUM(yards_after_catch) AS total_yac,
            COUNT(CASE WHEN "td_player_id" = ${playerGsis} THEN 1 ELSE NULL END) AS total_tds,
            SUM(CASE WHEN "receiver_player_id" = ${playerGsis} THEN complete_pass ELSE 0 END) AS total_receptions,
            COUNT(DISTINCT "week") AS weeks,
            SUM(CASE WHEN "passer_player_id" = ${playerGsis} THEN pass_attempt ELSE 0 END) AS total_pass_attempts,
            SUM(CASE WHEN "passer_player_id" = ${playerGsis} THEN complete_pass ELSE 0 END) AS total_pass_completions,
            SUM(CASE WHEN "passer_player_id" = ${playerGsis} THEN passing_yards ELSE 0 END) AS total_pass_yards,
            SUM(CASE WHEN "passer_player_id" = ${playerGsis} AND "td_player_id" IS NOT NULL THEN pass_touchdown ELSE 0 END) AS total_pass_tds,
            (SELECT SUM(interception)
             FROM ${Prisma.raw(year)}
             WHERE "passer_player_id" = ${playerGsis}
             AND "season_type" = 'REG') AS total_interceptions
        FROM ${Prisma.raw(year)}
        WHERE ("receiver_player_id" = ${playerGsis}
        OR "rusher_player_id" = ${playerGsis}
        OR "passer_player_id" = ${playerGsis})
        AND "season_type" = 'REG'
        AND "yards_gained" != 0;
    `;
    return { playerStats };
}
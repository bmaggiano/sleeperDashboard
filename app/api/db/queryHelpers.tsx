import { Prisma } from "@prisma/client";

export function createSqlQueries(playerGsis: string, year: string) {
    const longestPlay = Prisma.sql`
            SELECT MAX(yards_gained) AS max_yards_gained
            FROM ${Prisma.raw(year)}
            WHERE ("receiver_player_id" = ${playerGsis} OR "rusher_player_id" = ${playerGsis})
            AND "season_type" = 'REG';
        `;
    const totalRecYards = Prisma.sql`
            SELECT SUM(yards_gained) AS total_yards
            FROM ${Prisma.raw(year)}
            WHERE "receiver_player_id" = ${playerGsis}
            AND "season_type" = 'REG';
        `;
    const totalRushYards = Prisma.sql`
            SELECT SUM(yards_gained) AS total_yards
            FROM ${Prisma.raw(year)}
            WHERE "rusher_player_id" = ${playerGsis}
            AND "season_type" = 'REG';
        `;
    const totalAirYards = Prisma.sql`
            SELECT SUM(air_yards) AS total_air_yards
            FROM ${Prisma.raw(year)}
            WHERE ("receiver_player_id" = ${playerGsis} OR "rusher_player_id" = ${playerGsis})
            AND "season_type" = 'REG'
            AND "yards_gained" != 0;
        `;
    const totalYAC = Prisma.sql`
            SELECT SUM(yards_after_catch) AS total_yac
            FROM ${Prisma.raw(year)}
            WHERE ("receiver_player_id" = ${playerGsis} OR "rusher_player_id" = ${playerGsis})
            AND "season_type" = 'REG'
            AND "yards_gained" != 0;
        `;
    const totalTds = Prisma.sql`
            SELECT COUNT(*) AS total_tds
            FROM ${Prisma.raw(year)}
            WHERE "td_player_id" = ${playerGsis}
            AND "season_type" = 'REG'
            AND "td_player_id" IS NOT NULL;
        `;
    const totalReceptions = Prisma.sql`
            SELECT SUM(complete_pass) AS total_receptions
            FROM ${Prisma.raw(year)}
            WHERE "receiver_player_id" = ${playerGsis}
            AND "season_type" = 'REG';
        `;
    const totalWeeks = Prisma.sql`
            SELECT COUNT(DISTINCT "week") AS weeks
            FROM ${Prisma.raw(year)}
            WHERE ("receiver_player_id" = ${playerGsis}
            OR "rusher_player_id" = ${playerGsis}
            OR "passer_player_id" = ${playerGsis})
            AND "season_type" = 'REG';
        `;
    const totalPassAttempts = Prisma.sql`
            SELECT SUM(pass_attempt) AS total_pass_attempts
            FROM ${Prisma.raw(year)}
            WHERE "passer_player_id" = ${playerGsis}
            AND "pass_location" IS NOT NULL
            AND "season_type" = 'REG';
        `;
    const totalPassCompletions = Prisma.sql`
            SELECT SUM(complete_pass) AS total_pass_completions
            FROM ${Prisma.raw(year)}
            WHERE "passer_player_id" = ${playerGsis}
            AND "season_type" = 'REG';
        `;
    const totalPassYards = Prisma.sql`
            SELECT SUM(passing_yards) AS total_pass_yards
            FROM ${Prisma.raw(year)}
            WHERE "passer_player_id" = ${playerGsis}
            AND "season_type" = 'REG';
        `;
    const totalPassTds = Prisma.sql`
            SELECT SUM(pass_touchdown) AS total_pass_tds
            FROM ${Prisma.raw(year)}
            WHERE "passer_player_id" = ${playerGsis}
            AND "season_type" = 'REG'
            AND "td_player_id" IS NOT NULL;
        `;
    const totalInterceptions = Prisma.sql`
            SELECT SUM(interception) AS total_interceptions
            FROM ${Prisma.raw(year)}
            WHERE "passer_player_id" = ${playerGsis}
            AND "season_type" = 'REG';
        `;
    return { longestPlay, totalRecYards, totalRushYards, totalAirYards, totalYAC, totalTds, totalReceptions, totalWeeks, totalPassAttempts, totalPassCompletions, totalPassYards, totalPassTds, totalInterceptions };
}


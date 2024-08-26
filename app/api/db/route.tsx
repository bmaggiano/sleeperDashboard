import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import redisClient from "@/lib/redis/redisClient";
import { getPlayerDetails } from "@/lib/sleeper/helpers";
import { generateObject, streamObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { ffDataSchema } from "./schema";

interface Play {
    game_id: string;
    play_id: number | null;
    desc: string | null;
    rushing_yards: number | null;
    receiving_yards: number | null;
    td_player_id: string | null;
    rush_attempt: number | null;
    pass_attempt: number | null;
    rush_touchdown: number | null;
    pass_touchdown: number | null;
    posteam_score: number | null;
    defteam_score: number | null;
    yards_gained: number | null;
}

interface PlayerStats {
    game_id: string;
    total_weeks: number;
    yards_gained: number | null;
    total_yards: number[];
    rushing_yards: number;
    receiving_yards: number;
    touchdowns: number;
    biggest_yardage_play: number;
    play_description: string;
    rush_attempts: number;
    pass_attempts: number;
    rush_touchdowns: number;
    pass_touchdowns: number;
    posteam_score: number | null;
    defteam_score: number | null;
}

// Helper function to execute a raw query
async function queryPlayerStat(playerGsis: string, statQuery: Prisma.Sql) {
    const result = await db.$queryRaw(statQuery) as { [key: string]: any }; // Cast result to a known type
    return result[0] || {};
}

// Helper function to create the SQL queries
function createSqlQueries(playerGsis: string) {
    return {
        longestPlay: Prisma.sql`
            SELECT MAX(yards_gained) AS max_yards_gained
            FROM "Nflverse_Play_by_Play_2023"
            WHERE ("receiver_player_id" = ${playerGsis} OR "rusher_player_id" = ${playerGsis})
            AND "season_type" = 'REG';
        `,
        totalRecYards: Prisma.sql`
            SELECT SUM(yards_gained) AS total_yards
            FROM "Nflverse_Play_by_Play_2023"
            WHERE "receiver_player_id" = ${playerGsis}
            AND "season_type" = 'REG';
        `,
        totalRushYards: Prisma.sql`
            SELECT SUM(yards_gained) AS total_yards
            FROM "Nflverse_Play_by_Play_2023"
            WHERE "rusher_player_id" = ${playerGsis}
            AND "season_type" = 'REG';
        `,
        totalAirYards: Prisma.sql`
            SELECT SUM(air_yards) AS total_air_yards
            FROM "Nflverse_Play_by_Play_2023"
            WHERE ("receiver_player_id" = ${playerGsis} OR "rusher_player_id" = ${playerGsis})
            AND "season_type" = 'REG'
            AND "yards_gained" != 0;
        `,
        totalYAC: Prisma.sql`
            SELECT SUM(yards_after_catch) AS total_yac
            FROM "Nflverse_Play_by_Play_2023"
            WHERE ("receiver_player_id" = ${playerGsis} OR "rusher_player_id" = ${playerGsis})
            AND "season_type" = 'REG'
            AND "yards_gained" != 0;
        `,
        totalTds: Prisma.sql`
            SELECT COUNT(*) AS total_tds
            FROM "Nflverse_Play_by_Play_2023"
            WHERE "td_player_id" = ${playerGsis}
            AND "season_type" = 'REG'
            AND "td_player_id" IS NOT NULL;
        `,
        totalReceptions: Prisma.sql`
            SELECT SUM(complete_pass) AS total_receptions
            FROM "Nflverse_Play_by_Play_2023"
            WHERE "receiver_player_id" = ${playerGsis}
            AND "season_type" = 'REG';
        `,
        totalWeeks: Prisma.sql`
            SELECT COUNT(DISTINCT "week") AS weeks
            FROM "Nflverse_Play_by_Play_2023"
            WHERE ("receiver_player_id" = ${playerGsis}
            OR "rusher_player_id" = ${playerGsis}
            OR "passer_player_id" = ${playerGsis})
            AND "season_type" = 'REG';
        `,
        totalPassAttempts: Prisma.sql`
            SELECT SUM(pass_attempt) AS total_pass_attempts
            FROM "Nflverse_Play_by_Play_2023"
            WHERE "passer_player_id" = ${playerGsis}
            AND "pass_location" IS NOT NULL
            AND "season_type" = 'REG';
        `,
        totalPassCompletions: Prisma.sql`
            SELECT SUM(complete_pass) AS total_pass_completions
            FROM "Nflverse_Play_by_Play_2023"
            WHERE "passer_player_id" = ${playerGsis}
            AND "season_type" = 'REG';
        `,
        totalPassYards: Prisma.sql`
            SELECT SUM(passing_yards) AS total_pass_yards
            FROM "Nflverse_Play_by_Play_2023"
            WHERE "passer_player_id" = ${playerGsis}
            AND "season_type" = 'REG';
        `,
        totalPassTds: Prisma.sql`
            SELECT SUM(pass_touchdown) AS total_pass_tds
            FROM "Nflverse_Play_by_Play_2023"
            WHERE "passer_player_id" = ${playerGsis}
            AND "season_type" = 'REG'
            AND "td_player_id" IS NOT NULL;
        `,
        totalInterceptions: Prisma.sql`
            SELECT SUM(interception) AS total_interceptions
            FROM "Nflverse_Play_by_Play_2023"
            WHERE "passer_player_id" = ${playerGsis}
            AND "season_type" = 'REG';
        `,
    };
}

export async function POST(request: NextRequest) {
    const context = await request.json();
    const { playerId1, playerId2 } = context;

    if (!playerId1 || !playerId2) {
        return NextResponse.json({ error: "Both Player IDs are required" }, { status: 400 });
    }

    const cacheKey = `player-comparison:${playerId1}:${playerId2}`;
    const cachedResponse = await redisClient?.get(cacheKey);
    if (cachedResponse) {
        return NextResponse.json(JSON.parse(cachedResponse));
    }

    const [player1, player2] = await Promise.all([
        getPlayerDetails(playerId1.trim()),
        getPlayerDetails(playerId2.trim()),
    ]);

    if (!player1 || !player2) {
        return NextResponse.json({ error: "One or both players not found" }, { status: 404 });
    }

    const player1Gsis = player1.gsis_id?.trim() || ""; // Ensure player1Gsis is a string
    const player2Gsis = player2.gsis_id?.trim() || ""; // Ensure player2Gsis is a string

    const queries1 = createSqlQueries(player1Gsis);
    const queries2 = createSqlQueries(player2Gsis);

    const [
        longestPlay1, longestPlay2,
        totalRecYards1, totalRecYards2,
        totalRushYards1, totalRushYards2,
        totalAirYards1, totalAirYards2,
        totalYAC1, totalYAC2,
        totalTds1, totalTds2,
        totalReceptions1, totalReceptions2,
        totalWeeks1, totalWeeks2,
        totalPassAttempts1, totalPassAttempts2,
        totalPassCompletions1, totalPassCompletions2,
        totalPassYards1, totalPassYards2,
        totalPassTds1, totalPassTds2,
        totalInterceptions1, totalInterceptions2
    ] = await Promise.all([
        queryPlayerStat(player1Gsis, queries1.longestPlay),
        queryPlayerStat(player2Gsis, queries2.longestPlay),
        queryPlayerStat(player1Gsis, queries1.totalRecYards),
        queryPlayerStat(player2Gsis, queries2.totalRecYards),
        queryPlayerStat(player1Gsis, queries1.totalRushYards),
        queryPlayerStat(player2Gsis, queries2.totalRushYards),
        queryPlayerStat(player1Gsis, queries1.totalAirYards),
        queryPlayerStat(player2Gsis, queries2.totalAirYards),
        queryPlayerStat(player1Gsis, queries1.totalYAC),
        queryPlayerStat(player2Gsis, queries2.totalYAC),
        queryPlayerStat(player1Gsis, queries1.totalTds),
        queryPlayerStat(player2Gsis, queries2.totalTds),
        queryPlayerStat(player1Gsis, queries1.totalReceptions),
        queryPlayerStat(player2Gsis, queries2.totalReceptions),
        queryPlayerStat(player1Gsis, queries1.totalWeeks),
        queryPlayerStat(player2Gsis, queries2.totalWeeks),
        queryPlayerStat(player1Gsis, queries1.totalPassAttempts),
        queryPlayerStat(player2Gsis, queries2.totalPassAttempts),
        queryPlayerStat(player1Gsis, queries1.totalPassCompletions),
        queryPlayerStat(player2Gsis, queries2.totalPassCompletions),
        queryPlayerStat(player1Gsis, queries1.totalPassYards),
        queryPlayerStat(player2Gsis, queries2.totalPassYards),
        queryPlayerStat(player1Gsis, queries1.totalPassTds),
        queryPlayerStat(player2Gsis, queries2.totalPassTds),
        queryPlayerStat(player1Gsis, queries1.totalInterceptions),
        queryPlayerStat(player2Gsis, queries2.totalInterceptions)
    ]);

    const playerDetailGather = async (player: any, playerNum: number) => {
        const playerId = playerNum === 1 ? player1Gsis : player2Gsis;
        const totalTds = playerNum === 1 ? totalTds1 : totalTds2;
        const totalWeeks = playerNum === 1 ? totalWeeks1 : totalWeeks2;

        // Dynamically select variables based on playerNum
        const totalRecYards = playerNum === 1 ? totalRecYards1 : totalRecYards2;
        const totalRushYards = playerNum === 1 ? totalRushYards1 : totalRushYards2;
        const totalAirYards = playerNum === 1 ? totalAirYards1 : totalAirYards2;
        const totalYAC = playerNum === 1 ? totalYAC1 : totalYAC2;
        const totalReceptions = playerNum === 1 ? totalReceptions1 : totalReceptions2;
        const longestPlay = playerNum === 1 ? longestPlay1 : longestPlay2;
        const totalPassAttempts = playerNum === 1 ? totalPassAttempts1 : totalPassAttempts2;
        const totalPassCompletions = playerNum === 1 ? totalPassCompletions1 : totalPassCompletions2;
        const totalPassYards = playerNum === 1 ? totalPassYards1 : totalPassYards2;
        const totalPassTds = playerNum === 1 ? totalPassTds1 : totalPassTds2;
        const totalInterceptions = playerNum === 1 ? totalInterceptions1 : totalInterceptions2;
        let playerDetails = {}
        playerDetails = {
            playerId: playerId,
            fullName: player.full_name,
            position: player.position,
            totalWeeks: Number(totalWeeks.weeks || 0),
            totalRushYards: Number(totalRushYards.total_yards || 0),
        };

        switch (player.position) {
            case "WR":
            case "TE":
            case "RB":
                playerDetails = {
                    ...playerDetails,
                    totalTds: Number(totalTds.total_tds || 0),
                    totalRecYards: Number(totalRecYards.total_yards || 0),
                    totalAirYards: Number(totalAirYards.total_air_yards || 0),
                    totalYAC: Number(totalYAC.total_yac || 0),
                    totalReceptions: Number(totalReceptions.total_receptions || 0),
                    longestPlay: Number(longestPlay.max_yards_gained || 0),
                };
                break;
            case "QB":
                // Add logic to gather additional details for QB if needed
                playerDetails = {
                    ...playerDetails,
                    totalRushTds: Number(totalTds.total_tds || 0),
                    totalPassAttempts: Number(totalPassAttempts.total_pass_attempts || 0),
                    totalPassCompletions: Number(totalPassCompletions.total_pass_completions || 0),
                    totalPassYards: Number(totalPassYards.total_pass_yards || 0),
                    totalPassTds: Number(totalPassTds.total_pass_tds || 0),
                    totalInterceptions: Number(totalInterceptions.total_interceptions || 0),
                };
                break;
            default:
                break;
        }

        return playerDetails as PlayerStats;
    };
    const player1Details = await playerDetailGather(player1, 1);
    const player2Details = await playerDetailGather(player2, 2);

    console.log(player1Details, player2Details)

    // return NextResponse.json({
    //     "hey": "there"
    // });


    const result = await streamObject({
        model: openai("gpt-4o-mini"),
        seed: 100,
        schema: ffDataSchema,
        system: `You are a fantasty footabll expert. You are an expert at analyzing player stats and making decisions based on that analysis. Users using this tool will be relying on you to provide accurate assessments of player stats and make informed decisions.`,
        prompt: `Compare the following two players based on their stats and availability:\n\nPlayer 1 (${player1.full_name}): ${JSON.stringify(player1Details, null, 2)}\n\nPlayer 2 (${player2.full_name}): ${JSON.stringify(player2Details, null, 2)}\n\nConsider the number of games played and the availability of each player. Provide a detailed comparison and categorize the players into the following: explanation (list the yards, tds, games played and provide a brief explanation), safe_pick, risky_pick, and recommended_pick. Please also compile their season stats that were provided and return playerOneRecYards, PlayerTwoRecYards, playerOneRushYards, PlayerTwoRushYards, PlayerOneTouchdowns, PlayerTwoTouchdowns, PlayerOneYardsAfterCatch, PlayerTwoYardsAfterCatch, PlayerOneAirYards, PlayerTwoAirYards, PlayerOneYardsPerReception, PlayerTwoYardsPerReception, PlayerOneReceptions, PlayerTwoReceptions LongestPlayOne, LongestPlayTwo. If the player is a QB, also return playerOnePassAttempt, PlayerTwoPassAttempt, playerOnePassCompletion, PlayerTwoPassCompletion, playerOneInterceptions, PlayerTwoInterceptions, playerOnePassYards, PlayerTwoPassYards, playerOnePassTouchdowns, PlayerTwoPassTouchdowns. With the recommended pick can you throw in a percentage of certainty (0-100)? If the decision is a toss-up, return 'undecided' instead of 'recommended_pick'.`,
        onFinish: async ({ object }) => {
            await redisClient?.set(cacheKey, JSON.stringify(object), 'EX', 3600); // Cache for 1 hour
        },
    });

    const response = result.toTextStreamResponse();

    return response;
}
import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { generateObject, streamObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { ffDataSchema } from "./schema";
import { getPlayerDetails } from "@/lib/sleeper/helpers";
import { getPlayerIdMappingsFromRedis } from "@/lib/sleeper/cache";
import redisClient from "@/lib/redis/redisClient";
import { Prisma } from "@prisma/client";

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

function calculatePlayerStats(
    playerYards: Play[]
): Record<string, PlayerStats> {
    return playerYards.reduce((acc: Record<string, PlayerStats>, play: Play) => {
        const totalYards = (play.yards_gained || 0);
        if (!acc[play.game_id]) {
            acc[play.game_id] = {
                game_id: play.game_id,
                total_yards: [],
                rushing_yards: 0,
                receiving_yards: 0,
                touchdowns: 0,
                biggest_yardage_play: 0,
                play_description: "",
                rush_attempts: 0,
                pass_attempts: 0,
                rush_touchdowns: 0,
                pass_touchdowns: 0,
                posteam_score: play.posteam_score,
                defteam_score: play.defteam_score,
                yards_gained: play.yards_gained,
            };
        }
        acc[play.game_id].total_yards.push(totalYards);
        acc[play.game_id].rushing_yards += play.rushing_yards || 0;
        acc[play.game_id].receiving_yards += play.receiving_yards || 0;
        acc[play.game_id].rush_attempts += play.rush_attempt || 0;
        acc[play.game_id].pass_attempts += play.pass_attempt || 0;
        acc[play.game_id].rush_touchdowns += play.rush_touchdown || 0;
        acc[play.game_id].pass_touchdowns += play.pass_touchdown || 0;
        if (play.td_player_id) {
            acc[play.game_id].touchdowns += 1;
        }
        if (totalYards > acc[play.game_id].biggest_yardage_play) {
            acc[play.game_id].biggest_yardage_play = totalYards;
            acc[play.game_id].play_description = play.desc || "";
        }
        return acc;
    }, {});
}

export async function POST(request: NextRequest) {
    const context = await request.json();
    const { playerId1, playerId2 } = context;

    if (!playerId1 || !playerId2) {
        return NextResponse.json(
            { error: "Both Player IDs are required" },
            { status: 400 }
        );
    }

    const cacheKey = `player-comparison:${playerId1}:${playerId2}`;
    const cachedResponse = await redisClient?.get(cacheKey);

    if (cachedResponse) {
        return NextResponse.json(JSON.parse(cachedResponse));
    }

    const player1 = await getPlayerDetails(playerId1.trim());
    const player2 = await getPlayerDetails(playerId2.trim());

    console.log(player1, player2)

    if (!player1 || !player2) {
        return NextResponse.json(
            { error: "One or both players not found" },
            { status: 404 }
        );
    }

    // const playerYards1: Play[] = await db.nflverse_Play_by_Play.findMany({
    //     where: {
    //         OR: [{ rusher_player_id: player1.gsis_id }, { receiver_player_id: player1.gsis_id }],
    //     },
    //     select: {
    //         game_id: true,
    //         play_id: true,
    //         desc: true,
    //         rushing_yards: true,
    //         receiving_yards: true,
    //         td_player_id: true,
    //         rush_attempt: true,
    //         pass_attempt: true,
    //         rush_touchdown: true,
    //         pass_touchdown: true,
    //         posteam_score: true,
    //         defteam_score: true,
    //         yards_gained: true,
    //     },
    // });

    // const playerYards2: Play[] = await db.nflverse_Play_by_Play.findMany({
    //     where: {
    //         OR: [{ rusher_player_id: player2.gsis_id }, { receiver_player_id: player2.gsis_id }],
    //     },
    //     select: {
    //         game_id: true,
    //         play_id: true,
    //         desc: true,
    //         rushing_yards: true,
    //         receiving_yards: true,
    //         td_player_id: true,
    //         rush_attempt: true,
    //         pass_attempt: true,
    //         rush_touchdown: true,
    //         pass_touchdown: true,
    //         posteam_score: true,
    //         defteam_score: true,
    //         yards_gained: true,
    //     },
    // });

    // const playerStats1 = calculatePlayerStats(playerYards1);
    // const playerStats2 = calculatePlayerStats(playerYards2);

    // TODO: WE WANT YAC,

    const roundToTwoDecimals = (value: number) => Math.round(value * 100) / 100;
    const player1Gsis = player1.gsis_id?.trim();
    const player2Gsis = player2.gsis_id?.trim();



    const playerLongestPlay1 = await db.$queryRaw<
        {
            max_yards_gained: number; total_yards: BigInt
        }[]
    >(Prisma.sql`
SELECT MAX(yards_gained) AS max_yards_gained
  FROM "Nflverse_Play_by_Play"
  WHERE ("receiver_player_id" = ${player1Gsis}
  OR "rusher_player_id" = ${player1Gsis})
  AND "season_type" = 'REG';
  `);
    const playerLongestPlay2 = await db.$queryRaw<
        {
            max_yards_gained: number; total_yards: BigInt
        }[]
    >(Prisma.sql`
 SELECT MAX(yards_gained) AS max_yards_gained
  FROM "Nflverse_Play_by_Play"
  WHERE ("receiver_player_id" = ${player2Gsis}
  OR "rusher_player_id" = ${player2Gsis})
  AND "season_type" = 'REG';
  `);
    const playerTotalRecYards1 = await db.$queryRaw<
        { total_yards: BigInt }[]
    >(Prisma.sql`
    SELECT SUM(yards_gained) AS total_yards
    FROM "Nflverse_Play_by_Play"
    WHERE "receiver_player_id" = ${player1Gsis}
    AND "season_type" = 'REG';
  `);

    const playerTotalRushYards1 = await db.$queryRaw<
        { total_yards: BigInt }[]
    >(Prisma.sql`
    SELECT SUM(yards_gained) AS total_yards
    FROM "Nflverse_Play_by_Play"
    WHERE "rusher_player_id" = ${player1Gsis}
    AND "season_type" = 'REG';
  `);
    const playerTotalRushYards2 = await db.$queryRaw<
        { total_yards: BigInt }[]
    >(Prisma.sql`
    SELECT SUM(yards_gained) AS total_yards
    FROM "Nflverse_Play_by_Play"
    WHERE "rusher_player_id" = ${player2Gsis}
    AND "season_type" = 'REG';
  `);

    const playerTotalAirYards1 = await db.$queryRaw<{ total_air_yards: number }[]>(Prisma.sql`
  SELECT SUM(air_yards) AS total_air_yards
  FROM "Nflverse_Play_by_Play"
  WHERE ("receiver_player_id" = ${player1Gsis}
  OR "rusher_player_id" = ${player1Gsis})
  AND "season_type" = 'REG'
  AND "yards_gained" != 0;
`);

    const playerTotalAirYards2 = await db.$queryRaw<{ total_air_yards: number }[]>(Prisma.sql`
SELECT SUM(air_yards) AS total_air_yards
FROM "Nflverse_Play_by_Play"
WHERE ("receiver_player_id" = ${player2Gsis}
OR "rusher_player_id" = ${player2Gsis})
AND "season_type" = 'REG'
AND "yards_gained" != 0;
`);

    const playerTotalYAC1 = await db.$queryRaw<{ total_yac: number }[]>(Prisma.sql`
SELECT SUM(yards_after_catch) AS total_yac
FROM "Nflverse_Play_by_Play"
WHERE ("receiver_player_id" = ${player1Gsis}
OR "rusher_player_id" = ${player1Gsis})
AND "season_type" = 'REG'
AND "yards_gained" != 0;
`);

    const playerTotalYAC2 = await db.$queryRaw<{ total_yac: number }[]>(Prisma.sql`
SELECT SUM(yards_after_catch) AS total_yac
FROM "Nflverse_Play_by_Play"
WHERE ("receiver_player_id" = ${player2Gsis}
OR "rusher_player_id" = ${player2Gsis})
AND "season_type" = 'REG'
AND "yards_gained" != 0;
`);

    const playerTotalTds1 = await db.$queryRaw<{ total_tds: number }[]>(Prisma.sql`
    SELECT COUNT(*) AS total_tds
    FROM "Nflverse_Play_by_Play"
    WHERE "td_player_id" = ${player1Gsis}
    AND "season_type" = 'REG'
    AND "td_player_id" IS NOT NULL;
    `);

    const player1Receptions = await db.$queryRaw<{ total_receptions: number }[]>(Prisma.sql`
        SELECT sum(complete_pass) AS total_receptions
        FROM "Nflverse_Play_by_Play"
        WHERE "receiver_player_id" = ${player1Gsis}
        AND "season_type" = 'REG';
        `);

    const player2Receptions = await db.$queryRaw<{ total_receptions: number }[]>(Prisma.sql`
        SELECT sum(complete_pass) AS total_receptions
        FROM "Nflverse_Play_by_Play"
        WHERE "receiver_player_id" = ${player2Gsis}
        AND "season_type" = 'REG';
        `);

    const playerTotalRecYards2 = await db.$queryRaw<
        { total_yards: BigInt }[]
    >(Prisma.sql`
    SELECT SUM(yards_gained) AS total_yards
    FROM "Nflverse_Play_by_Play"
    WHERE "receiver_player_id" = ${player2Gsis}
    AND "season_type" = 'REG';
  `);

    const playerTotalTds2 = await db.$queryRaw<{ total_tds: number }[]>(Prisma.sql`
    SELECT COUNT(*) AS total_tds
    FROM "Nflverse_Play_by_Play"
    WHERE "td_player_id" = ${player2Gsis}
    AND "season_type" = 'REG'
    AND "td_player_id" IS NOT NULL;
    `);

    const player1Weeks = await db.$queryRaw<{ weeks: number }[]>(Prisma.sql`
        SELECT COUNT(DISTINCT "week") AS weeks
FROM "Nflverse_Play_by_Play"
WHERE "receiver_player_id" = ${player1Gsis}
AND "season_type" = 'REG';
`);
    const player2Weeks = await db.$queryRaw<{ weeks: number }[]>(Prisma.sql`
        SELECT COUNT(DISTINCT "week") AS weeks
FROM "Nflverse_Play_by_Play"
WHERE "receiver_player_id" = ${player2Gsis}
AND "season_type" = 'REG';
`);

    const totalYardsRecPlayer1 = Number(playerTotalRecYards1[0]?.total_yards || 0);
    const totalYardsRecPlayer2 = Number(playerTotalRecYards2[0]?.total_yards || 0);
    const longestPlay1 = Number(playerLongestPlay1[0]?.max_yards_gained || 0);
    const longestPlay2 = Number(playerLongestPlay2[0]?.max_yards_gained || 0);
    const totalYardsRushPlayer1 = Number(playerTotalRushYards1[0]?.total_yards || 0);
    const totalYardsRushPlayer2 = Number(playerTotalRushYards2[0]?.total_yards || 0);
    const totalTdsPlayer1 = Number(playerTotalTds1[0]?.total_tds || 0);
    const totalTdsPlayer2 = Number(playerTotalTds2[0]?.total_tds || 0);
    const totalAirYardsPlayer1 = Number(playerTotalAirYards1[0]?.total_air_yards || 0);
    const totalAirYardsPlayer2 = Number(playerTotalAirYards2[0]?.total_air_yards || 0);
    const totalYACPlayer1 = Number(playerTotalYAC1[0]?.total_yac || 0);
    const totalYACPlayer2 = Number(playerTotalYAC2[0]?.total_yac || 0);
    const totalWeeksPlayer1 = Number(player1Weeks[0]?.weeks || 0);
    const totalWeeksPlayer2 = Number(player2Weeks[0]?.weeks || 0);
    const totalReceptionsPlayer1 = Number(player1Receptions[0]?.total_receptions || 0);
    const totalReceptionsPlayer2 = Number(player2Receptions[0]?.total_receptions || 0);

    let player1Details;
    if (player1.position === "WR") {
        player1Details = {
            playerId: player1Gsis,
            fullName: player1.full_name,
            totalRecYards: totalYardsRecPlayer1,
            totalRushYards: totalYardsRushPlayer1,
            totalAirYards: totalAirYardsPlayer1,
            totalTds: totalTdsPlayer1,
            totalYac: totalYACPlayer1,
            totalTouchdowns: totalTdsPlayer1,
            yardsPerReception: totalTdsPlayer1 > 0 ? roundToTwoDecimals(totalYardsRecPlayer1 / totalReceptionsPlayer1) : 0,
            weeks: totalWeeksPlayer1,
            receptions: totalReceptionsPlayer1,
            longestPlay: longestPlay1,
        };
    }
    if (player1.position === "RB") {
        player1Details = {
            playerId: player1Gsis,
            fullName: player1.full_name,
            totalRecYards: totalYardsRecPlayer1,
            totalRushYards: totalYardsRushPlayer1,
            totalAirYards: totalAirYardsPlayer1,
            totalTds: totalTdsPlayer1,
            totalYac: totalYACPlayer1,
            totalTouchdowns: totalTdsPlayer1,
            yardsPerReception: totalTdsPlayer1 > 0 ? roundToTwoDecimals(totalYardsRecPlayer1 / totalReceptionsPlayer1) : 0,
            weeks: totalWeeksPlayer1,
            receptions: totalReceptionsPlayer1,
            longestPlay: longestPlay1,
        };
    }
    let player2Details;
    if (player2.position === "WR") {
        player2Details = {
            playerId: player2Gsis,
            fullName: player2.full_name,
            totalRecYards: totalYardsRecPlayer2,
            totalRushYards: totalYardsRushPlayer2,
            totalAirYards: totalAirYardsPlayer2,
            totalTds: totalTdsPlayer2,
            totalYac: totalYACPlayer2,
            totalTouchdowns: totalTdsPlayer2,
            yardsPerReception: totalTdsPlayer2 > 0 ? roundToTwoDecimals(totalYardsRecPlayer2 / totalReceptionsPlayer2) : 0,
            weeks: totalWeeksPlayer2,
            receptions: totalReceptionsPlayer2,
            longestPlay: longestPlay2,
        };
    }
    if (player2.position === "RB") {
        player2Details = {
            playerId: player2Gsis,
            fullName: player2.full_name,
            totalRecYards: totalYardsRecPlayer2,
            totalRushYards: totalYardsRushPlayer2,
            totalTds: totalTdsPlayer2,
            totalTouchdowns: totalTdsPlayer2,
            weeks: totalWeeksPlayer2,
            receptions: totalReceptionsPlayer2,
            longestPlay: longestPlay2,
        };
    }

    // console.log(totalYardsPlayer1, totalYardsPlayer2);
    // console.log(totalTdsPlayer1, totalTdsPlayer2)
    // console.log(totalAirYardsPlayer1, totalAirYardsPlayer2)
    // console.log(totalYACPlayer1, totalYACPlayer2)
    // console.log(totalWeeksPlayer1, totalWeeksPlayer2)
    // console.log(totalReceptionsPlayer1, totalReceptionsPlayer2)
    console.log(player1Details, player2Details)
    // const result1 = Object.values(playerStats1).map((stats) => ({
    //     game_id: stats.game_id,
    //     average_yards: stats.total_yards.reduce((a, b) => a + b, 0) / stats.total_yards.length,
    //     biggest_yardage_play: stats.biggest_yardage_play,
    //     play_description: stats.play_description,
    //     touchdowns: stats.touchdowns,
    //     total_rushing_yards: stats.rushing_yards,
    //     total_receiving_yards: stats.receiving_yards,
    //     rush_attempts: stats.rush_attempts,
    //     pass_attempts: stats.pass_attempts,
    //     rush_touchdowns: stats.rush_touchdowns,
    //     pass_touchdowns: stats.pass_touchdowns,
    //     posteam_score: stats.posteam_score,
    //     defteam_score: stats.defteam_score,
    // }));

    // const result2 = Object.values(playerStats2).map((stats) => ({
    //     game_id: stats.game_id,
    //     average_yards: stats.total_yards.reduce((a, b) => a + b, 0) / stats.total_yards.length,
    //     biggest_yardage_play: stats.biggest_yardage_play,
    //     play_description: stats.play_description,
    //     touchdowns: stats.touchdowns,
    //     total_rushing_yards: stats.rushing_yards,
    //     total_receiving_yards: stats.receiving_yards,
    //     rush_attempts: stats.rush_attempts,
    //     pass_attempts: stats.pass_attempts,
    //     rush_touchdowns: stats.rush_touchdowns,
    //     pass_touchdowns: stats.pass_touchdowns,
    //     posteam_score: stats.posteam_score,
    //     defteam_score: stats.defteam_score,
    // }));

    const result = await streamObject({
        model: openai("gpt-4o-mini"),
        seed: 100,
        schema: ffDataSchema,
        system: `You are a fantasty footabll expert. You are an expert at analyzing player stats and making decisions based on that analysis. Users using this tool will be relying on you to provide accurate assessments of player stats and make informed decisions.`,
        prompt: `Compare the following two players based on their stats and availability:\n\nPlayer 1 (${player1.full_name}): ${JSON.stringify(player1Details, null, 2)}\n\nPlayer 2 (${player2.full_name}): ${JSON.stringify(player2Details, null, 2)}\n\nConsider the number of games played (Player 1: ${player1Details?.weeks} games, Player 2: ${player2Details?.weeks} games) and the availability of each player. Provide a detailed comparison and categorize the players into the following: explanation (list the yards, tds, games played and provide a brief explanation), safe_pick, risky_pick, and recommended_pick. Please also compile their season stats that were provided and return playerOneRecYards, PlayerTwoRecYards, playerOneRushYards, PlayerTwoRushYards, PlayerOneTouchdowns, PlayerTwoTouchdowns, PlayerOneYardsAfterCatch, PlayerTwoYardsAfterCatch, PlayerOneAirYards, PlayerTwoAirYards, PlayerOneYardsPerReception, PlayerTwoYardsPerReception, PlayerOneReceptions, PlayerTwoReceptions LongestPlayOne, LongestPlayTwo. With the recommended pick can you throw in a percentage of certainty (0-100)? If the decision is a toss-up, return 'undecided' instead of 'recommended_pick'.`,
        onFinish: async ({ object }) => {
            await redisClient?.set(cacheKey, JSON.stringify(object), 'EX', 3600); // Cache for 1 hour
        },
    });

    const response = result.toTextStreamResponse();

    return response;
    // return NextResponse.json({
    //     "hey": "there"
    // });
}
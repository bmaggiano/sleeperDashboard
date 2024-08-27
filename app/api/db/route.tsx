import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { createSqlQueries } from "./queryHelpers";
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

    const years = ["nflverse_play_by_play_2023", "nflverse_play_by_play_2022", "nflverse_play_by_play_2021"];

    async function getPlayerStats(playerGsis: string, playerDetails: { full_name: string, position: string, team: string }) {
        let playerStats: { [key: string]: { [key: string]: any } } = {};

        // Add player details inside a "details" key
        playerStats["details"] = {
            gsis_id: playerGsis,
            fullName: playerDetails.full_name,
            position: playerDetails.position,
            team: playerDetails.team,
        };

        for (const year of years) {
            const query = createSqlQueries(playerGsis, year);

            // Initialize an object to store the results for the current year
            let yearResults: { [key: string]: any } = {};

            // Loop over each query in the `query` object
            for (const key in query) {
                if (query.hasOwnProperty(key)) {

                    // Execute the current query
                    const result = await db.$queryRaw(query[key as keyof typeof query]) as { [key: string]: any };

                    const value = result[0] ? Number(Object.values(result[0])[0]) : 0;

                    yearResults[key] = value;
                }
            }
            playerStats[year] = yearResults;
        }

        return playerStats;
    }

    async function getAllPlayerStats() {
        const player1Stats = await getPlayerStats(player1Gsis, {
            full_name: player1.full_name || "",
            position: player1.position || "",
            team: player1.team || ""
        });
        const player2Stats = await getPlayerStats(player2Gsis, {
            full_name: player2.full_name || "",
            position: player2.position || "",
            team: player2.team || ""
        });

        // Combine results for both players
        const combinedStats = {
            player1: player1Stats,
            player2: player2Stats
        };
        return combinedStats;
    }

    // Call the function to get all player stats
    const finalStats = await getAllPlayerStats();
    console.log("Final Stats:", finalStats);

    // return NextResponse.json({
    //     finalStats
    // });


    const result = await streamObject({
        model: openai("gpt-4o-mini"),
        seed: 100,
        schema: ffDataSchema,
        system: `You are a fantasy football expert. You are an expert at analyzing player stats and making decisions based on that analysis. Users using this tool will be relying on you to provide accurate assessments of player stats and make informed decisions.`,
        prompt: `Compare the following two players based on their stats and availability:\n\nPlayer 1 (${player1.full_name}): ${JSON.stringify(finalStats.player1, null, 2)}\n\nPlayer 2 (${player2.full_name}): ${JSON.stringify(finalStats.player2, null, 2)}\n\nConsider the number of games played and the availability of each player. Also take into consideration previous seasons that should be included in this data. Provide a detailed comparison and categorize the players into the following: explanation (list the yards, touchdowns, games played, and provide a brief explanation), safe_pick, risky_pick, and recommended_pick. Please also compile their season stats that were provided and return playerOneRecYards, playerTwoRecYards, playerOneRushYards, playerTwoRushYards, playerOneTouchdowns, playerTwoTouchdowns, playerOneYardsAfterCatch, playerTwoYardsAfterCatch, playerOneAirYards, playerTwoAirYards, playerOneYardsPerReception, playerTwoYardsPerReception, playerOneReceptions, playerTwoReceptions, longestPlayOne, longestPlayTwo. If the player is a QB, return playerOnePassAttempt, playerTwoPassAttempt, playerOnePassCompletion, playerTwoPassCompletion, playerOneInterceptions, playerTwoInterceptions, playerOnePassYards, playerTwoPassYards, playerOnePassTouchdowns, playerTwoPassTouchdowns. With the recommended pick, can you also include a percentage of certainty (0-100)? If the decision is a toss-up, return 'undecided' instead of 'recommended_pick'.`,
        onFinish: async ({ object }) => {
            await redisClient?.set(cacheKey, JSON.stringify(object), 'EX', 3600); // Cache for 1 hour
        },
    });

    const response = result.toTextStreamResponse();

    return response;
}
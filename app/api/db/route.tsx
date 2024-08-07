import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { generateObject, generateText, streamObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

interface Play {
    game_id: string;
    play_id: string;
    desc: string;
    rushing_yards: number | null;
    receiving_yards: number | null;
    td_player_id: string | null;
    rush_attempt: number | null;
    pass_attempt: number | null;
    rush_touchdown: number | null;
    pass_touchdown: number | null;
    posteam_score: number | null;
    defteam_score: number | null;
}

interface PlayerStats {
    game_id: string;
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
        const totalYards = (play.rushing_yards || 0) + (play.receiving_yards || 0);
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
            acc[play.game_id].play_description = play.desc;
        }
        return acc;
    }, {});
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const playerId1 = searchParams.get("pid1");
    const playerId2 = searchParams.get("pid2");

    if (!playerId1 || !playerId2) {
        return NextResponse.json(
            { error: "Both Player IDs are required" },
            { status: 400 }
        );
    }

    const player1 = await db.players.findUnique({
        where: { id: playerId1 },
        select: { display_name: true },
    });

    const player2 = await db.players.findUnique({
        where: { id: playerId2 },
        select: { display_name: true },
    });

    if (!player1 || !player2) {
        return NextResponse.json(
            { error: "One or both players not found" },
            { status: 404 }
        );
    }

    const playerYards1: Play[] = await db.nflverse_Play_by_Play.findMany({
        where: {
            OR: [{ rusher_player_id: playerId1 }, { receiver_player_id: playerId1 }],
        },
        select: {
            game_id: true,
            play_id: true,
            desc: true,
            rushing_yards: true,
            receiving_yards: true,
            td_player_id: true,
            rush_attempt: true,
            pass_attempt: true,
            rush_touchdown: true,
            pass_touchdown: true,
            posteam_score: true,
            defteam_score: true,
        },
    });

    const playerYards2: Play[] = await db.nflverse_Play_by_Play.findMany({
        where: {
            OR: [{ rusher_player_id: playerId2 }, { receiver_player_id: playerId2 }],
        },
        select: {
            game_id: true,
            play_id: true,
            desc: true,
            rushing_yards: true,
            receiving_yards: true,
            td_player_id: true,
            rush_attempt: true,
            pass_attempt: true,
            rush_touchdown: true,
            pass_touchdown: true,
            posteam_score: true,
            defteam_score: true,
        },
    });

    const playerStats1 = calculatePlayerStats(playerYards1);
    const playerStats2 = calculatePlayerStats(playerYards2);

    const result1 = Object.values(playerStats1).map((stats) => ({
        game_id: stats.game_id,
        average_yards:
            stats.total_yards.reduce((a, b) => a + b, 0) / stats.total_yards.length,
        biggest_yardage_play: stats.biggest_yardage_play,
        play_description: stats.play_description,
        touchdowns: stats.touchdowns,
        total_rushing_yards: stats.rushing_yards,
        total_receiving_yards: stats.receiving_yards,
        rush_attempts: stats.rush_attempts,
        pass_attempts: stats.pass_attempts,
        rush_touchdowns: stats.rush_touchdowns,
        pass_touchdowns: stats.pass_touchdowns,
        posteam_score: stats.posteam_score,
        defteam_score: stats.defteam_score,
    }));

    const result2 = Object.values(playerStats2).map((stats) => ({
        game_id: stats.game_id,
        average_yards:
            stats.total_yards.reduce((a, b) => a + b, 0) / stats.total_yards.length,
        biggest_yardage_play: stats.biggest_yardage_play,
        play_description: stats.play_description,
        touchdowns: stats.touchdowns,
        total_rushing_yards: stats.rushing_yards,
        total_receiving_yards: stats.receiving_yards,
        rush_attempts: stats.rush_attempts,
        pass_attempts: stats.pass_attempts,
        rush_touchdowns: stats.rush_touchdowns,
        pass_touchdowns: stats.pass_touchdowns,
        posteam_score: stats.posteam_score,
        defteam_score: stats.defteam_score,
    }));

    const { object } = await generateObject({
        model: openai("gpt-4-turbo"),
        seed: 100,
        schema: z.object({
            explanation: z.string(),
            safe_pick: z.string(),
            risky_pick: z.string(),
            recommended_pick: z.string().optional(),
            undecided: z.string().optional(),
        }),
        prompt: `Compare the following two players based on their stats and availability:\n\nPlayer 1 (${player1.display_name
            }): ${JSON.stringify(result1, null, 2)}\n\nPlayer 2 (${player2.display_name
            }): ${JSON.stringify(
                result2,
                null,
                2
            )}\n\nConsider the number of games played (Player 1: ${result1.length
            } games, Player 2: ${result2.length
            } games) and the availability of each player. Provide a detailed comparison and categorize the players into the following: explanation, safe_pick, risky_pick, and recommended_pick. If the decision is a toss-up, return 'undecided' instead of 'recommended_pick'.`,
    });

    return NextResponse.json({
        object,
        player1Stats: result1,
        player2Stats: result2,
    });
}
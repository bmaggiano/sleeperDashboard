import { openai } from "@ai-sdk/openai";
import { generateText, streamText, tool } from "ai";
import { z } from "zod";
import { getPlayerDetails } from "@/lib/sleeper/helpers";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    const result = await generateText({
        model: openai("gpt-4-turbo"),
        tools: {
            playerInfo: tool({
                description: "Get detailed information about a fantasy football player",
                parameters: z.object({
                    playerId: z
                        .string()
                        .describe("The ID of the player to get information for"),
                }),
                execute: async ({ playerId }) => {
                    const playerDetails = await getPlayerDetails(playerId, true);
                    return playerDetails;
                },
            }),
        },
        toolChoice: "required", // force the model to call a tool
        prompt:
            "Provide detailed information about the fantasy football player with ID 12345.",
    });
}
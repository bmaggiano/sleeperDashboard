import { openai } from "@ai-sdk/openai";
import { streamText, convertToCoreMessages } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages } = await req.json();

    const result = await streamText({
        model: openai("gpt-4o"),
        messages: convertToCoreMessages([
            {
                role: "system",
                content: `
You are an AI expert in fantasy football analysis. Your task is to analyze historical player data and provide detailed recommendations on which player to start in a given week. 

Consider the following factors in your analysis:
- Recent performance metrics such as yards, touchdowns, receptions, interceptions, etc.
- Opponent defense strength and recent matchups.
- Player's injury status or recent health updates.
- Weather conditions for the upcoming game.
- Position-specific insights (e.g., RBs vs. a weak rushing defense).
- Any other relevant trends or patterns.

Your goal is to offer a detailed analysis and clear recommendation with a probability score or confidence level for each suggestion. Please format your response with these details.
                `
            },
            ...messages
        ]),
    });

    return result.toAIStreamResponse();
}
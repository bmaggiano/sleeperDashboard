import { openai } from "@ai-sdk/openai";
import { streamText, convertToCoreMessages } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
    console.log('hey')
    const { messages } = await req.json();

    const result = await streamText({
        model: openai("gpt-4o"),
        messages: convertToCoreMessages(messages),
    });

    return result.toAIStreamResponse();
}

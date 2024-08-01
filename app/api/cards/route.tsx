// app/api/og/route.tsx

import { ImageResponse } from '@vercel/og';
import type { NextRequest } from 'next/server';

// Use a named export for the GET method
export async function GET(req: NextRequest) {
    try {
        // Create a URL object from the request URL
        const { searchParams } = new URL(req.url);
        console.log("req.url", req.url);
        let paramsObj: Record<string, string | string[]> = {}
        // Iterate over the search parameters and populate the object
        searchParams.forEach((value, key) => {
            paramsObj[key] = value;
        });

        // Return an Open Graph image response
        return new ImageResponse(
            (
                <div tw="flex flex-col items-center justify-center w-full h-full p-5 bg-[#F7F9FC] rounded-lg border border-[#E5E7EB] shadow-md font-inter">
                    <h1 tw="text-7xl mb-16 font-bold text-center">Matchup Details - Week {paramsObj.week}</h1>
                    <div tw="flex items-center mx-auto">

                        {/* Left Side Team Info */}
                        <div tw="flex items-center w-2/5 pl-8">
                            <img tw="h-20 w-20 mr-4 rounded-full" src={`${paramsObj.teamOneAvatar}`} />
                            <div tw="flex flex-col mr-4">
                                <span tw="text-sm text-2xl text-[#9CA3AF] overflow-hidden overflow-ellipsis">{paramsObj.teamOneDisplayName}</span>
                                <span tw="font-bold text-3xl overflow-hidden overflow-ellipsis">{paramsObj.teamOneName}</span>
                                <span tw="flex items-center text-2xl text-[#6B7280] overflow-hidden overflow-ellipsis">{paramsObj.teamOnePoints}</span>
                            </div>
                        </div>

                        {/* VS Section */}
                        <div tw="flex items-center justify-center w-1/5 text-center">
                            <h1 tw="text-[#111827] font-bold text-3xl m-0">VS</h1>
                        </div>

                        {/* Right Side Team Info */}
                        <div tw="flex items-center justify-end w-2/5 pr-8">
                            <div tw="flex flex-col items-end ml-4">
                                <span tw="text-sm text-2xl text-[#9CA3AF] overflow-hidden overflow-ellipsis text-right">{paramsObj.teamTwoDisplayName}</span>
                                <span tw="font-bold text-3xl overflow-hidden overflow-ellipsis text-right">{paramsObj.teamTwoName}</span>
                                <span tw="flex items-center text-2xl text-[#6B7280] overflow-hidden overflow-ellipsis text-right">
                                    {paramsObj.teamTwoPoints}
                                    <span tw="ml-1 text-[#FFD700] text-2xl">🏆</span>
                                </span>
                            </div>
                            <img tw="h-20 w-20 rounded-full ml-4" src={`${paramsObj.teamTwoAvatar}`} />
                        </div>
                    </div>
                </div>
            ),
            {
                // Define the dimensions of the image
                width: 1200,
                height: 630,
            }
        );
    } catch (error) {
        // Log the error for debugging
        console.error("Error generating Open Graph image:", error);

        // Return a JSON response with error details
        return new Response(
            JSON.stringify({
                error:
                    error instanceof Error ? error.message : 'Unknown error occurred',
            }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
}
// app/api/og/route.tsx

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ImageResponse } from '@vercel/og';
import type { NextRequest } from 'next/server';

// Use a named export for the GET method
export async function GET(req: NextRequest) {
    try {
        // Create a URL object from the request URL
        const { searchParams } = new URL(req.url);

        console.log(searchParams);

        // Retrieve the 'title' query parameter, defaulting to 'Fantasy Dashboard' if not provided
        const week = searchParams.get('week') || 'Viewing Matchup Details';

        // Return an Open Graph image response
        return new ImageResponse(
            (
                <div tw="flex flex-col items-center justify-center w-full h-full p-5 bg-[#F7F9FC] rounded-lg border border-[#E5E7EB] shadow-md font-inter">
                    <h1 tw="text-center">Matchup Details - Week {week}</h1>
                    <div tw="flex items-center w-4/5 mx-auto">

                        {/* Left Side Team Info */}
                        <div tw="flex items-center w-2/5 pl-8">
                            <img tw="h-10 w-10 mr-4 rounded-full" src="https://sleepercdn.com/uploads/32b31d6b8bf8cda3baf19a723b82af3b.jpg" />
                            <div tw="flex flex-col mr-4">
                                <span tw="text-sm text-[#9CA3AF] overflow-hidden overflow-ellipsis">@bhastings1019</span>
                                <span tw="font-bold text-lg overflow-hidden overflow-ellipsis">Ben&apos;d me over Sidd</span>
                                <span tw="flex items-center text-[#6B7280] text-base overflow-hidden overflow-ellipsis">102.2</span>
                            </div>
                        </div>

                        {/* VS Section */}
                        <div tw="flex items-center justify-center w-1/5 text-center">
                            <h1 tw="text-[#111827] font-bold text-xl m-0">VS</h1>
                        </div>

                        {/* Right Side Team Info */}
                        <div tw="flex items-center justify-end w-2/5 pr-8">
                            <div tw="flex flex-col items-end ml-4">
                                <span tw="text-sm text-[#9CA3AF] overflow-hidden overflow-ellipsis text-right">@jsngr</span>
                                <span tw="font-bold text-lg overflow-hidden overflow-ellipsis text-right">FOR ALL THE DOGS</span>
                                <span tw="flex items-center text-[#6B7280] text-base overflow-hidden overflow-ellipsis text-right">
                                    137.56
                                    <span tw="ml-1 text-[#FFD700] text-sm">🏆</span>
                                </span>
                            </div>
                            <img tw="h-10 w-10 rounded-full ml-4" src="https://sleepercdn.com/avatars/thumbs/918dc290ebefdd426d9d1341e02609ae" />
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
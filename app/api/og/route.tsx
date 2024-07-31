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
    const title = searchParams.get('leagueId') || 'Fantasy Dashboard Title';
    console.log(title);

    // Return an Open Graph image response
    return new ImageResponse(
      (
        <div tw="flex flex-col items-center justify-center">
          <h1 tw="text-center">Fantasy Dashboard Main</h1>
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
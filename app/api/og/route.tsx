// app/api/og/route.tsx

import { ImageResponse } from '@vercel/og';
import type { NextRequest } from 'next/server';

// Use a named export for the GET method
export async function GET(req: NextRequest) {
  try {
    // Create a URL object from the request URL
    const { searchParams } = new URL(req.url);

    // Retrieve the 'title' query parameter, defaulting to 'Hello, World!' if not provided
    const title = searchParams.get('title') || 'Hello, World!';

    console.log("Generating image for title:", title);

    // Return an Open Graph image response
    return new ImageResponse(
      (
        <div
          style={{
            backgroundColor: 'lavender',
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 128,
            color: 'black',
          }}
        >
          Sleeper Dashboard
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
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error occurred' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
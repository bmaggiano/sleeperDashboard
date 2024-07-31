// app/api/og/route.tsx

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ImageResponse } from '@vercel/og';
import type { NextRequest } from 'next/server';

// Use a named export for the GET method
export async function GET(req: NextRequest) {
  try {
    // Create a URL object from the request URL
    const { searchParams } = new URL(req.url);

    // Retrieve the 'title' query parameter, defaulting to 'Fantasy Dashboard' if not provided
    const title = searchParams.get('title') || 'Fantasy Dashboard';

    // Return an Open Graph image response
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            padding: '20px',
            backgroundColor: '#F7F9FC',
            borderRadius: '10px',
            border: '1px solid #E5E7EB',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            fontFamily: '"Inter", sans-serif',
          }}
        >
          <div style={{ margin: "0 auto", display: 'flex', alignItems: 'center', width: '80%' }}>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                width: '40%',
                paddingLeft: '30px',
              }}
            >
              <Avatar style={{ marginRight: "16px" }}>
                <AvatarImage src="" />
                <AvatarFallback>
                  B
                </AvatarFallback>
              </Avatar>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  marginRight: '16px',
                }}
              >
                <span
                  style={{
                    fontSize: '16px',
                    color: '#9CA3AF',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  @bhastings1019
                </span>
                <span
                  style={{
                    fontWeight: 'bold',
                    fontSize: '20px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  Ben&apos;d me over Sidd
                </span>
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '18px',
                    color: '#6B7280',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  102.2
                </span>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                width: '20%',
                justifyContent: 'center',
                textAlign: 'center',
                alignItems: 'center',
              }}
            >
              <h1
                style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  margin: 0,
                  color: '#111827',
                }}
              >
                VS
              </h1>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                width: '40%',
                paddingRight: '30px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  marginRight: '16px',
                }}
              >
                <span
                  style={{
                    fontSize: '16px',
                    color: '#9CA3AF',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    textAlign: 'right',
                  }}
                >
                  @jsngr
                </span>
                <span
                  style={{
                    fontWeight: 'bold',
                    fontSize: '20px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    textAlign: 'right',
                  }}
                >
                  FOR ALL THE DOGS
                </span>
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '18px',
                    color: '#6B7280',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    textAlign: 'right',
                  }}
                >
                  137.56
                  <span
                    style={{
                      marginLeft: '5px',
                      color: '#FFD700',
                      fontSize: '16px',
                    }}
                  >
                    🏆
                  </span>
                </span>
              </div>
              <Avatar style={{ marginLeft: '16px' }}>
                <AvatarImage src="https://sleepercdn.com/avatars/thumbs/918dc290ebefdd426d9d1341e02609ae" />
                <AvatarFallback>
                  J
                </AvatarFallback>
              </Avatar>
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
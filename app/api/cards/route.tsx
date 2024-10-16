import { ImageResponse } from '@vercel/og'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

const font1 = fetch(
  new URL('/public/assets/fonts/Inter-Bold.ttf', import.meta.url)
).then((res) => res.arrayBuffer())
// Use a named export for the GET method
export async function GET(req: NextRequest) {
  try {
    const fontData1 = await font1

    // Create a URL object from the request URL
    const { searchParams } = new URL(req.url)
    let paramsObj: Record<string, string | string[]> = {}
    searchParams.forEach((value, key) => {
      paramsObj[key] = value
    })

    // Return an Open Graph image response
    return new ImageResponse(
      (
        <div tw="flex flex-col items-center justify-center w-full h-full p-5 bg-[#F7F9FC] rounded-lg border border-[#E5E7EB] shadow-md">
          <h1
            tw="text-[80px] mb-16"
            style={{
              fontFamily: 'Inter-Bold', // Use font name directly
            }}
          >
            Matchup Details - Week {paramsObj.week}
          </h1>
          <div tw="flex items-center mx-auto">
            {/* Left Side Team Info */}
            <div tw="flex items-center w-2/5 pl-8">
              <img
                tw="h-20 w-20 mr-4 rounded-full"
                src={`${paramsObj.teamOneAvatar}`}
              />
              <div tw="flex flex-col mr-4">
                <span
                  tw="text-sm text-3xl text-[#9CA3AF] overflow-hidden overflow-ellipsis"
                  style={{
                    fontFamily: 'Inter-Regular', // Use regular font
                    fontWeight: 'normal',
                  }}
                >
                  @{paramsObj.teamOneDisplayName}
                </span>
                <span
                  tw="font-bold text-4xl overflow-hidden overflow-ellipsis"
                  style={{
                    fontFamily: 'Inter-Regular', // Use regular font
                    fontWeight: 'normal',
                  }}
                >
                  {paramsObj.teamOneName}
                </span>
                <span
                  tw="flex items-center text-3xl font-bold text-[#6B7280] overflow-hidden overflow-ellipsis"
                  style={{
                    fontFamily: 'Inter-Bold', // Use regular font
                    fontWeight: 'normal',
                  }}
                >
                  {paramsObj.teamOneWin === 'true' ? (
                    <span tw="mr-1 text-[#FFD700] text-3xl">🏆</span>
                  ) : null}
                  {paramsObj.teamOnePoints}
                </span>
              </div>
            </div>
            {/* VS Section */}
            <div tw="flex items-center justify-center w-1/5 text-center">
              <h1
                tw="text-[#111827] font-bold text-3xl m-0"
                style={{
                  fontFamily: 'Inter-Regular', // Use regular font
                  fontWeight: 'normal',
                }}
              >
                VS
              </h1>
            </div>
            {/* Right Side Team Info */}
            <div tw="flex items-center justify-end w-2/5 pr-8">
              <div tw="flex flex-col items-end ml-4">
                <span
                  tw="text-sm text-3xl text-[#9CA3AF] overflow-hidden overflow-ellipsis text-right"
                  style={{
                    fontFamily: 'Inter-Regular', // Use regular font
                    fontWeight: 'normal',
                  }}
                >
                  @{paramsObj.teamTwoDisplayName}
                </span>
                <span
                  tw="font-bold text-4xl overflow-hidden overflow-ellipsis text-right"
                  style={{
                    fontFamily: 'Inter-Regular', // Use regular font
                    fontWeight: 'normal',
                  }}
                >
                  {paramsObj.teamTwoName}
                </span>
                <span
                  tw="flex items-center text-3xl font-bold text-[#6B7280] overflow-hidden overflow-ellipsis text-right"
                  style={{
                    fontFamily: 'Inter-Semi', // Use regular font
                    fontWeight: 'normal',
                  }}
                >
                  {paramsObj.teamTwoPoints}
                  {paramsObj.teamOneWin === 'false' ? (
                    <span tw="ml-1 text-[#FFD700] text-3xl">🏆</span>
                  ) : null}
                </span>
              </div>
              <img
                tw="h-20 w-20 rounded-full ml-4"
                src={`${paramsObj.teamTwoAvatar}`}
              />
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'Inter-Bold',
            data: fontData1,
            style: 'normal',
          },
        ],
      }
    )
  } catch (error) {
    console.error('Error generating Open Graph image:', error)
    return new Response(
      JSON.stringify({
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}

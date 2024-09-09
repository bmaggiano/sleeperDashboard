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

    const fontSize = '80px'

    // Return an Open Graph image response
    return new ImageResponse(
      (
        <div
          tw="flex relative flex-col p-12 w-full h-full items-center"
          style={{
            color: 'fff',
            background: 'white',
          }}
        >
          <div tw="flex flex-col flex-1 py-10">
            <div
              tw="flex text-xl uppercase font-bold tracking-tight"
              style={{ fontFamily: 'Inter', fontWeight: 'normal' }}
            >
              {/* {values.type} */}
            </div>
            <div tw="flex items-center">
              <p
                tw="leading-[1.1] text-black text-[80px] font-bold tracking-tighter mb-6"
                style={{
                  fontFamily: 'Inter',
                  fontWeight: 'bolder',
                  marginLeft: '-3px',
                  fontSize,
                }}
              >
                Stuart
                <span tw="ml-6 bg-black text-white pl-4 pr-6 rounded-md">
                  AI
                </span>
              </p>
              <p tw="ml-4 flex leading-[1.1] text-gray-400 text-[80px] font-bold">
                /Player Compare
              </p>
            </div>
            <div tw="flex mt-8 justify-between">
              <div tw="flex p-6 rounded-md border border-[#E5E7EB] ">
                <img
                  tw="mr-4 rounded-full"
                  height={120}
                  width={160}
                  src={`https://a.espncdn.com/i/headshots/nfl/players/full/${paramsObj.p1EID}.png`}
                />
                <div tw="flex text-black flex-col justify-start">
                  <p tw="text-[50px] p-0 m-0">{paramsObj.p1Name}</p>
                  <p tw="text-gray-500 text-[30px] p-0 m-0">
                    {paramsObj.p1Position} - {paramsObj.p1Team}
                  </p>
                </div>
              </div>
              <div tw="flex p-6 rounded-md border border-[#E5E7EB]">
                <img
                  tw="mr-4 rounded-full"
                  height={120}
                  width={160}
                  src={`https://a.espncdn.com/i/headshots/nfl/players/full/${paramsObj.p2EID}.png`}
                />
                <div tw="flex flex-col justify-start">
                  <p tw="text-[50px] text-black p-0 m-0">{paramsObj.p2Name}</p>
                  <p tw="text-gray-500 text-[30px] p-0 m-0">
                    {paramsObj.p2Position} - {paramsObj.p2Team}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <p tw="mb-0 ml-2 text-gray-500">Powered by OpenAI</p>
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

import { ImageResponse } from '@vercel/og'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

const font1 = fetch(
  new URL('/public/assets/fonts/Inter-Bold.ttf', import.meta.url)
).then((res) => res.arrayBuffer())

const fontSize = '80px'

export async function GET(req: NextRequest) {
  try {
    const fontData1 = await font1

    const { searchParams } = new URL(req.url)
    let paramsObj: Record<string, string | string[]> = {}
    searchParams.forEach((value, key) => {
      paramsObj[key] = value
    })

    // Check if required params are missing and render skeleton if so
    if (!paramsObj.p1EId || !paramsObj.p2EId) {
      return new ImageResponse(
        (
          <div
            tw="flex relative flex-col p-12 w-full h-full items-center"
            style={{
              color: 'fff',
              background: 'white',
            }}
          >
            <div tw="flex flex-col py-10">
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
                <p tw="ml-4 flex leading-[1.1] text-gray-400 text-[80px] font-bold tracking-tighter">
                  /Player Compare
                </p>
              </div>
              <div tw="flex justify-between items-center py-10">
                <div tw="flex items-center">
                  <div
                    tw="bg-gray-300 rounded-full"
                    style={{ height: '160px', width: '160px' }}
                  />
                  <div tw="flex text-black flex-col justify-start ml-6">
                    <p
                      tw="bg-gray-300 rounded-md"
                      style={{ width: '300px', height: '40px' }}
                    />
                    <p
                      tw="bg-gray-200 rounded-md mt-2"
                      style={{ width: '200px', height: '30px' }}
                    />
                  </div>
                </div>

                <div tw="flex items-center">
                  <div
                    tw="bg-gray-300 rounded-full"
                    style={{ height: '160px', width: '160px' }}
                  />
                  <div tw="flex text-black flex-col justify-start ml-6">
                    <p
                      tw="bg-gray-300 rounded-md"
                      style={{ width: '300px', height: '40px' }}
                    />
                    <p
                      tw="bg-gray-200 rounded-md mt-2"
                      style={{ width: '200px', height: '30px' }}
                    />
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
    }

    // Existing code to render image with actual player data

    return new ImageResponse(
      (
        <div
          tw="flex relative flex-col p-12 w-full h-full items-center"
          style={{
            color: 'fff',
            background: 'white',
          }}
        >
          <div tw="flex flex-col py-10">
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
              <p tw="ml-4 flex leading-[1.1] text-gray-400 text-[80px] font-bold tracking-tighter">
                /Player Compare
              </p>
            </div>
            <div tw="flex items-center mt-8 justify-between">
              <div tw="flex p-6 rounded-md border border-[#E5E7EB]">
                <img
                  tw="rounded-full"
                  height={120}
                  width={160}
                  src={`https://a.espncdn.com/i/headshots/nfl/players/full/${paramsObj.p1EId}.png`}
                />
                <div tw="flex text-black flex-col justify-start">
                  <p
                    tw="tracking-tighter leading-[1.1]"
                    style={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      fontSize: '40px',
                      maxWidth: '300px',
                    }}
                  >
                    {paramsObj.p1Name}
                  </p>
                  <p tw="text-gray-500 text-[30px] p-0 m-0 tracking-tight">
                    {paramsObj.p1Pos} - {paramsObj.p1Team}
                  </p>
                </div>
              </div>

              <div tw="flex p-6 rounded-md border border-[#E5E7EB]">
                <img
                  tw="rounded-full"
                  height={120}
                  width={160}
                  src={`https://a.espncdn.com/i/headshots/nfl/players/full/${paramsObj.p2EId}.png`}
                />
                <div tw="flex text-black flex-col justify-start">
                  <p
                    tw="tracking-tighter leading-[1.1]"
                    style={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      fontSize: '40px',
                      maxWidth: '300px',
                    }}
                  >
                    {paramsObj.p2Name}
                  </p>
                  <p tw="text-gray-500 text-[30px] p-0 m-0 tracking-tight">
                    {paramsObj.p2Pos} - {paramsObj.p2Team}
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

import { NextRequest } from 'next/server'
import { ImageResponse } from '@vercel/og'

export const runtime = 'edge'

const interBold = fetch(
  new URL('/public/assets/fonts/Inter-Bold.ttf', import.meta.url)
).then((res) => res.arrayBuffer())

export async function GET(req: NextRequest) {
  try {
    const fontBold = await interBold

    const fontSize = '80px'

    return new ImageResponse(
      (
        <div
          tw="flex relative flex-col p-12 w-full h-full items-start"
          style={{
            color: 'fff',
            background: 'linear-gradient(90deg, #000 0%, #111 100%)',
          }}
        >
          <div tw="flex flex-col flex-1 py-10">
            <div
              tw="flex text-xl uppercase font-bold tracking-tight"
              style={{ fontFamily: 'Inter', fontWeight: 'normal' }}
            >
              {/* {values.type} */}
            </div>
            <div tw="flex">
              <p
                tw="leading-[1.1] text-white text-[80px] font-bold tracking-tighter mb-6"
                style={{
                  fontFamily: 'Inter',
                  fontWeight: 'bolder',
                  marginLeft: '-3px',
                  fontSize,
                }}
              >
                Stuart
                <span tw="ml-6 bg-white text-black pl-4 pr-6 rounded-md">
                  AI
                </span>
              </p>
            </div>
            <div tw="flex leading-[1.1] text-gray-400 text-[50px] font-bold">
              Your fantasy football knowledge base
            </div>
          </div>

          <p tw="mb-0 ml-2 text-gray-400">Connect with Sleeper</p>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'Inter',
            data: fontBold,
            weight: 700,
            style: 'normal',
          },
        ],
      }
    )
  } catch (error) {
    return new Response(`Failed to generate image`, {
      status: 500,
    })
  }
}

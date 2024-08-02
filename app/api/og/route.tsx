import { NextRequest } from "next/server"
import { ImageResponse } from "@vercel/og"

export const runtime = "edge"

const interBold = fetch(
  new URL("/public/assets/fonts/Inter-Bold.ttf", import.meta.url)
).then((res) => res.arrayBuffer())

export async function GET(req: NextRequest) {
  try {
    const fontBold = await interBold

    const fontSize = "80px"

    return new ImageResponse(
      (
        <div
          tw="flex relative flex-col p-12 w-full h-full items-start"
          style={{
            color: "fff",
            background:

              "linear-gradient(90deg, #000 0%, #111 100%)"
          }}
        >
          <div tw="flex flex-col flex-1 py-10">
            <div
              tw="flex text-xl uppercase font-bold tracking-tight"
              style={{ fontFamily: "Inter", fontWeight: "normal" }}
            >
              {/* {values.type} */}
            </div>
            <div tw="flex">
              <p
                tw="leading-[1.1] text-white text-[80px] font-bold tracking-tighter mb-6"
                style={{
                  fontFamily: "Inter",
                  fontWeight: "bolder",
                  marginLeft: "-3px",
                  fontSize,
                }}
              >
                Stuart
                <span tw="ml-6 bg-white text-black pl-4 pr-6 rounded-md">
                  AI
                </span>
              </p>
            </div>
            <div tw="flex leading-[1.1] text-gray-400 text-[50px] font-bold">Your fantasy football knowledge base</div>
          </div>
          <div tw="flex flex-col items-start w-full">
            <div tw="flex flex-row items-center">
              <img
                src="https://sleeper-dashboard.vercel.app/logo.png"
                tw="h-12 w-12 rounded-full mr-4"
                alt="football"
              />
              <div tw="flex flex-col items-start font-bold text-gray-400">
                <p tw="mb-0">
                  Connect with Sleeper
                </p>
                <p tw="mt-0">
                  v1.0.0
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: "Inter",
            data: fontBold,
            weight: 700,
            style: "normal",
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
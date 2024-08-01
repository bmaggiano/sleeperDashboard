import { NextRequest } from "next/server"
import { ImageResponse } from "@vercel/og"
import { promises as fs } from "fs"
import path from "path"

import { getAppUrl } from "@/lib/utils"
import { ogImageSchema } from "@/lib/validations/og"

export const config = { runtime: "edge" }

// Function to read font files from disk
// Function to read font files from disk
async function loadFont(filePath: string) {
  try {
    const absolutePath = path.resolve("./public/assets/fonts", filePath);
    const fontData = await fs.readFile(absolutePath);
    return fontData.buffer;
  } catch (error) {
    console.error(`Failed to load font at ${filePath}`, error);
    throw new Error(`Failed to load font: ${filePath}`);
  }
}

// Load the fonts
const interRegular = loadFont("Inter-Regular.ttf")
const interBold = loadFont("Inter-Bold.ttf")

export async function GET(req: NextRequest) {
  console.log("step 1")
  try {
    const fontRegular = await interRegular
    console.log("step 2")
    const fontBold = await interBold
    console.log("step 3")

    console.log("step 4")
    console.log(req.url)
    const url = new URL(req.url)
    console.log("hey", ogImageSchema.parse(Object.fromEntries(url.searchParams)))
    const values = ogImageSchema.parse(Object.fromEntries(url.searchParams))
    const heading =
      values.heading.length > 140
        ? `${values.heading.substring(0, 140)}...`
        : values.heading

    const { mode } = values
    const paint = mode === "dark" ? "#fff" : "#000"

    const fontSize = heading.length > 100 ? "70px" : "100px"
    console.log("step 5")

    return new ImageResponse(
      (
        <div
          tw="flex relative flex-col p-12 w-full h-full items-start"
          style={{
            color: paint,
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
            <div
              tw="flex leading-[1.1] text-[80px] font-bold tracking-tighter"
              style={{
                fontFamily: "Inter",
                fontWeight: "bolder",
                marginLeft: "-3px",
                fontSize,
              }}
            >
              {heading}
            </div>
          </div>
          <div tw="flex flex-col space-y-8 items-start w-full justify-between">
            <div tw="flex items-center space-x-2">
              {/* <img
                src={`${getAppUrl()}/headshot.jpg`}
                tw="h-12 w-12 rounded-full mr-2"
                alt="sidd"
              /> */}
              <div tw="font-bold">Sidd</div>
              <div tw="font-normal">harth Sharma</div>
            </div>
            <div
              tw="flex text-xl mt-4"
              style={{ fontFamily: "Inter", fontWeight: "normal" }}
            >
              thesiddd.com
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
            data: fontRegular,
            weight: 400,
            style: "normal",
          },
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
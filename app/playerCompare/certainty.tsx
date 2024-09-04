'use client'

import { TrendingUp } from 'lucide-react'
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ChartConfig, ChartContainer } from '@/components/ui/chart'

const chartConfig = {
  visitors: {
    label: 'Visitors',
  },
  safari: {
    label: 'Safari',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig

export function Certainty({ data }: { data: any }) {
  const maxAngle = 360 // Maximum angle for certainty of 100
  const calculatedEndAngle = (data?.certainty / 100) * maxAngle

  const chartData = [
    {
      browser: 'safari',
      visitors: data?.certainty,
      fill: 'rgb(22 163 74)', // Green 700 color code
    },
  ]

  return (
    <div className="flex-1 pb-0">
      <ChartContainer
        config={chartConfig}
        className="flex mx-auto sm:aspect-square min-h-[200px] sm:max-h-[200px]"
      >
        <RadialBarChart
          data={chartData}
          startAngle={0}
          endAngle={calculatedEndAngle} // Dynamic end angle
          innerRadius={80}
          outerRadius={110}
        >
          <PolarGrid
            gridType="circle"
            radialLines={false}
            stroke="none"
            className="first:fill-muted last:fill-background"
            polarRadius={[86, 74]}
          />
          <RadialBar
            dataKey="visitors"
            background
            cornerRadius={10}
            fill={chartData[0].fill} // Apply the green 700 color here
          />
          <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
            <Label
              content={({ viewBox }) => {
                if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-4xl font-bold"
                      >
                        {chartData[0]?.visitors?.toLocaleString()}%
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-muted-foreground"
                      >
                        Certainty
                      </tspan>
                    </text>
                  )
                }
              }}
            />
          </PolarRadiusAxis>
        </RadialBarChart>
      </ChartContainer>
    </div>
  )
}

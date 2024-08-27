"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

interface PlayerStats {
    details: {
        gsis_id: string;
        fullName: string;
        position: string;
        team: string;
    };
    nflverse_play_by_play_2023?: {
        recYards: number;
    };
    nflverse_play_by_play_2022?: {
        recYards: number;
    };
    nflverse_play_by_play_2021?: {
        recYards: number;
    };
}

interface FinalStats {
    playerOneName: string;
    playerTwoName: string;
    playerOneStats?: PlayerStats;
    playerTwoStats?: PlayerStats;
}

interface ChartDataPoint {
    month: string;
    playerOneName: any;
    playerTwoName: any;
}

// Transform function to convert FinalStats to chartData format
const transformData = (stats: FinalStats[]): ChartDataPoint[] => {
    const playerOneName = stats?.[0]?.playerOneName ?? "Player 1";
    const playerTwoName = stats?.[0]?.playerTwoName ?? "Player 2";
    return [
        {
            month: "2021",
            [playerOneName]: stats?.[0]?.playerOneStats?.nflverse_play_by_play_2021?.recYards ?? 0,
            [playerTwoName]: stats?.[0]?.playerTwoStats?.nflverse_play_by_play_2021?.recYards ?? 0,
            playerOneName: undefined,
            playerTwoName: undefined
        },
        {
            month: "2022",
            [playerOneName]: stats?.[0]?.playerOneStats?.nflverse_play_by_play_2022?.recYards ?? 0,
            [playerTwoName]: stats?.[0]?.playerTwoStats?.nflverse_play_by_play_2022?.recYards ?? 0,
            playerOneName: undefined,
            playerTwoName: undefined
        },
        {
            month: "2023",
            [playerOneName]: stats?.[0]?.playerOneStats?.nflverse_play_by_play_2023?.recYards ?? 0,
            [playerTwoName]: stats?.[0]?.playerTwoStats?.nflverse_play_by_play_2023?.recYards ?? 0,
            playerOneName: undefined,
            playerTwoName: undefined
        },
    ]
}


export function YearByYear({ stats }: { stats: FinalStats[] | [] }) {
    const chartData = transformData(stats as any);
    const playerOneName = stats?.[0]?.playerOneName ?? "Player 1";
    const playerTwoName = stats?.[0]?.playerTwoName ?? "Player 2";

    const chartConfig: ChartConfig = {
        [playerOneName]: {
            label: playerOneName,
            color: "blue",
        },
        [playerTwoName]: {
            label: playerTwoName,
            color: "black",
        },
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Year by Year</CardTitle>
                <CardDescription>2021-2023</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <LineChart
                        accessibilityLayer
                        data={chartData}
                        margin={{ left: 12, right: 12 }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value}
                        />
                        <YAxis tickLine={false} axisLine={false} />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                        <Line
                            dataKey={playerOneName}
                            type="monotone"
                            stroke="blue"
                            strokeWidth={2}
                            dot={false}
                        />
                        <Line
                            dataKey={playerTwoName}
                            type="monotone"
                            stroke="black"
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
            <CardFooter>
                <div className="flex w-full items-start gap-2 text-sm">
                    <div className="grid gap-2">
                        <div className="flex items-center gap-2 font-medium leading-none">
                            Trend data will go here <TrendingUp className="h-4 w-4" />
                        </div>
                        <div className="flex items-center gap-2 leading-none text-muted-foreground">
                            <span className="text-blue-700 font-semibold">{playerOneName}</span> and <span className="font-semibold text-black font-semibold">{playerTwoName}</span>
                        </div>
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}
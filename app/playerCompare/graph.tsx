import React from 'react';
import { Progress } from "@/components/ui/progress";
import { FaRegChartBar } from "react-icons/fa6";

const StatBar = ({ label, value1, value2, max }: { label: string, value1: number, value2: number, max: number }) => {
    const percent1 = (value1 / max) * 100;
    const percent2 = (value2 / max) * 100;

    return (
        <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
                <span className='font-semibold'>{label}</span>
                <span className='text-gray-500'>{value1} vs {value2}</span>
            </div>
            <div className="flex">
                <div className="w-1/2 pr-1">
                    <Progress value={percent1} className="h-2 bg-gray-200" />
                </div>
                <div className="w-1/2 pl-1">
                    <Progress value={percent2} className="h-2 bg-gray-200" />
                </div>
            </div>
        </div>
    );
};

export default function StatsGraph({ data }: { data: any }) {
    const stats = [];

    // Base stats for WR
    if (data?.playerOnePosition === "WR" || data?.playerTwoPosition === "WR") {
        stats.push(
            { label: 'Receptions', value1: data?.playerOneStats?.nflverse_play_by_play_2023?.receptions ?? 0, value2: data?.playerTwoStats?.nflverse_play_by_play_2023?.receptions ?? 0 },
            { label: 'Receiving Yards', value1: data?.playerOneStats?.nflverse_play_by_play_2023?.recYards ?? 0, value2: data?.playerTwoStats?.nflverse_play_by_play_2023?.recYards ?? 0 },
            { label: 'Rushing Yards', value1: data?.playerOneStats?.nflverse_play_by_play_2023?.rushYards ?? 0, value2: data?.playerTwoStats?.nflverse_play_by_play_2023?.rushYards ?? 0 },
            { label: 'Yards per Reception', value1: data?.playerOneStats?.nflverse_play_by_play_2023?.yardsPerReception ?? 0, value2: data?.playerTwoStats?.nflverse_play_by_play_2023?.yardsPerReception ?? 0 },
            { label: 'Yards After Catch', value1: data?.playerOneStats?.nflverse_play_by_play_2023?.yardsAfterCatch ?? 0, value2: data?.playerTwoStats?.nflverse_play_by_play_2023?.yardsAfterCatch ?? 0 },
            { label: 'Air Yards', value1: data?.playerOneStats?.nflverse_play_by_play_2023?.airYards ?? 0, value2: data?.playerTwoStats?.nflverse_play_by_play_2023?.airYards ?? 0 },
            { label: 'Longest Play', value1: data?.longestPlayOne, value2: data?.longestPlayTwo },
            { label: 'Touchdowns', value1: data?.playerOneStats?.nflverse_play_by_play_2023?.touchdowns ?? 0, value2: data?.playerTwoStats?.nflverse_play_by_play_2023?.touchdowns ?? 0 }
        );
    }

    // QB-specific stats
    if (data?.playerOnePosition === 'QB' || data?.playerTwoPosition === 'QB') {
        stats.push(
            { label: 'Pass Completions', value1: data?.playerOneStats?.nflverse_play_by_play_2023?.passCompletions, value2: data?.playerTwoStats?.nflverse_play_by_play_2023?.passCompletions },
            { label: 'Pass Attempts', value1: data?.playerOneStats?.nflverse_play_by_play_2023?.passAttemp, value2: data?.playerTwoStats?.nflverse_play_by_play_2023?.passAttempt },
            { label: 'Pass Yards', value1: data?.playerOneStats?.nflverse_play_by_play_2023?.passYards, value2: data?.playerTwoStats?.nflverse_play_by_play_2023?.passYards },
            { label: 'Interceptions', value1: data?.playerOneStats?.nflverse_play_by_play_2023?.interceptions, value2: data?.playerTwoStats?.nflverse_play_by_play_2023?.interceptions },
            { label: 'Pass Touchdowns', value1: data?.playerOneStats?.nflverse_play_by_play_2023?.passTouchdowns, value2: data?.playerTwoStats?.nflverse_play_by_play_2023?.passTouchdowns },
            { label: 'Total Touchdowns', value1: data?.playerOneStats?.nflverse_play_by_play_2023?.touchdowns, value2: data?.playerTwoStats?.nflverse_play_by_play_2023?.touchdowns }
        );
    }

    return (
        <div className="p-2">
            <h2 className="flex items-center text-lg font-bold mb-6"><FaRegChartBar className='h-4 w-4 mr-2' /> Head-to-Head Comparison</h2>
            {stats.map((stat, index) => (
                <StatBar
                    key={index}
                    label={stat.label}
                    value1={stat.value1}
                    value2={stat.value2}
                    max={Math.max(stat.value1, stat.value2)}
                />
            ))}
        </div>
    );
}
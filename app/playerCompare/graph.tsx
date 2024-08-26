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
            { label: 'Receptions', value1: data?.playerOneReceptions, value2: data?.playerTwoReceptions },
            { label: 'Receiving Yards', value1: data?.playerOneRecYards, value2: data?.playerTwoRecYards },
            { label: 'Rushing Yards', value1: data?.playerOneRushYards, value2: data?.playerTwoRushYards },
            { label: 'Yards per Reception', value1: data?.playerOneYardsPerReception, value2: data?.playerTwoYardsPerReception },
            { label: 'Yards After Catch', value1: data?.playerOneYardsAfterCatch, value2: data?.playerTwoYardsAfterCatch },
            { label: 'Air Yards', value1: data?.playerOneAirYards, value2: data?.playerTwoAirYards },
            { label: 'Longest Play', value1: data?.longestPlayOne, value2: data?.longestPlayTwo },
            { label: 'Touchdowns', value1: data?.playerOneTouchdowns, value2: data?.playerTwoTouchdowns }
        );
    }

    // QB-specific stats
    if (data?.playerOnePosition === 'QB' || data?.playerTwoPosition === 'QB') {
        stats.push(
            { label: 'Pass Completions', value1: data?.playerOnePassCompletion, value2: data?.playerTwoPassCompletion },
            { label: 'Pass Attempts', value1: data?.playerOnePassAttempt, value2: data?.playerTwoPassAttempt },
            { label: 'Pass Yards', value1: data?.playerOnePassYards, value2: data?.playerTwoPassYards },
            { label: 'Interceptions', value1: data?.playerOneInterceptions, value2: data?.playerTwoInterceptions },
            { label: 'Pass Touchdowns', value1: data?.playerOnePassTouchdowns, value2: data?.playerTwoPassTouchdowns },
            { label: 'Total Touchdowns', value1: data?.playerOneTouchdowns, value2: data?.playerTwoTouchdowns }
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
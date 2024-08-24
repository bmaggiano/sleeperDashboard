import React from 'react';
import { Progress } from "@/components/ui/progress"
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
    return (
        <div className="p-2">
            <h2 className="flex items-center text-lg font-bold mb-6"><FaRegChartBar className='h-4 w-4 mr-2' /> Head-to-Head Comparison</h2>
            <StatBar
                label="Receiving Yards"
                value1={data.playerOneRecYards}
                value2={data.playerTwoRecYards}
                max={Math.max(data.playerOneRecYards, data.playerTwoRecYards)}
            />
            <StatBar
                label="Rushing Yards"
                value1={data.playerOneRushYards}
                value2={data.playerTwoRushYards}
                max={Math.max(data.playerOneRushYards, data.playerTwoRushYards)}
            />
            <StatBar
                label="Touchdowns"
                value1={data.playerOneTouchdowns}
                value2={data.playerTwoTouchdowns}
                max={Math.max(data.playerOneTouchdowns, data.playerTwoTouchdowns)}
            />
            <StatBar
                label="Receptions"
                value1={data.playerOneReceptions}
                value2={data.playerTwoReceptions}
                max={Math.max(data.playerOneReceptions, data.playerTwoReceptions)}
            />
            <StatBar
                label="Yards per Reception"
                value1={data.playerOneYardsPerReception}
                value2={data.playerTwoYardsPerReception}
                max={Math.max(data.playerOneYardsPerReception, data.playerTwoYardsPerReception)}
            />
        </div>
    );
}
"use client";
import React, { useState } from 'react';
import { experimental_useObject as useObject } from 'ai/react';
import FuzzySearch from "../fuzzySearch";
import { Button } from '@/components/ui/button';
import { z } from 'zod';
import { ffDataSchema } from '../api/db/schema';

export default function PlayerCompare() {
    const [selectedPlayer1, setSelectedPlayer1] = useState<any>(null);
    const [selectedPlayer2, setSelectedPlayer2] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const { object, submit } = useObject({
        api: `/api/db`,
        schema: ffDataSchema,
    });


    const handlePlayerSelect = (player: any, playerIndex: number) => {
        if (playerIndex === 1) {
            setSelectedPlayer1(player);
        } else {
            setSelectedPlayer2(player);
        }
    };

    return (
        <div className="flex flex-col gap-4 mt-4">
            <h1 className="text-2xl font-bold">Player Compare</h1>
            <div className="flex justify-center items-start flex-row gap-2">
                <div className='w-1/2'>
                    <FuzzySearch onPlayerSelect={(player) => handlePlayerSelect(player, 1)} />
                </div>
                <div className='w-1/2'>
                    <FuzzySearch onPlayerSelect={(player) => handlePlayerSelect(player, 2)} />
                </div>
            </div>
            <div className='flex justify-center items-start flex-row gap-2'>
                <p className='w-1/2'><strong>Selected Player 1:</strong> {selectedPlayer1 && selectedPlayer1.full_name}</p>
                <p className='w-1/2'><strong>Selected Player 2:</strong> {selectedPlayer2 && selectedPlayer2.full_name}</p>
            </div>
            {selectedPlayer1 && selectedPlayer2 && (
                <Button
                    disabled={loading}
                    onClick={async () => {
                        setLoading(true);
                        try {
                            await submit({ playerId1: selectedPlayer1.player_id, playerId2: selectedPlayer2.player_id });
                        } catch (error) {
                            console.error("An error occurred during submission:", error);
                        } finally {
                            setLoading(false);
                        }
                    }}
                >
                    {loading ? "Analyzing..." : "Compare Players"}
                </Button>
            )}
            <div>
                {object?.analysis?.map((data, index) => (
                    <div key={index}>
                        {data?.recommended_pick ? <p><strong>Recommended pick:</strong> {data?.recommended_pick}</p> : null}
                        {data?.undecided ? <p><strong>Tossup:</strong> {data?.undecided}</p> : null}
                        <p><strong>Analysis:</strong> {data?.explanation}</p>
                        <p><strong>Safe pick:</strong> {data?.safe_pick}</p>
                        <p><strong>Risky pick:</strong> {data?.risky_pick}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
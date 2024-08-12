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
        <div className="flex flex-col">
            <h1 className="text-2xl font-bold">Player Compare</h1>
            <div className="flex flex-row gap-2">
                <FuzzySearch onPlayerSelect={(player) => handlePlayerSelect(player, 1)} />
                <FuzzySearch onPlayerSelect={(player) => handlePlayerSelect(player, 2)} />
            </div>
            {selectedPlayer1 && selectedPlayer2 && (
                <Button onClick={() => {
                    console.log(selectedPlayer1.gsis_id, selectedPlayer2.gsis_id)
                    submit({ playerId1: selectedPlayer1.gsis_id, playerId2: selectedPlayer2.gsis_id })
                }
                }>
                    Compare Players
                </Button>
            )}
            <div>
                {selectedPlayer1 && <p><strong>Selected Player 1:</strong> {selectedPlayer1.display_name}</p>}
                {selectedPlayer2 && <p><strong>Selected Player 2:</strong> {selectedPlayer2.display_name}</p>}
            </div>
            <div>
                {object?.analysis?.map((data, index) => (
                    <div key={index}>
                        <p>Analysis: {data?.explanation}</p>
                        <p>Safe pick: {data?.safe_pick}</p>
                        <p>Risky pick: {data?.risky_pick}</p>
                        {data?.recommended_pick ? <p>Recommended pick: {data?.recommended_pick}</p> : null}
                        {data?.undecided ? <p>Tossup: {data?.undecided}</p> : null}
                    </div>
                ))}
            </div>
        </div>
    );
}
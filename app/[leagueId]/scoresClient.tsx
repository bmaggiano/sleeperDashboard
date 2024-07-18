'use client';

import Scoreboard from "../scoreboard";

export function ScoreClient({ scoresData }: { scoresData: any }) {
    return (
        <div>
            <Scoreboard scoresData={scoresData} />
        </div>
    );
}
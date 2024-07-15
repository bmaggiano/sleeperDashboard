// ScoresComponent_Client.tsx
'use client';

import Scoreboard from "../scoreboard";

export function Score({ scoresData }: { scoresData: any }) {
    return (
        <div>
            <Scoreboard scoresData={scoresData} />
        </div>
    );
}
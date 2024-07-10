import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { valueAtom, leagueAtom, weekAtom } from "@/app/atoms/atom";
import { getMatchups } from "./utils";

interface Matchup {
    matchup_id: string;
    points: number;
}

export default function Scoreboard() {
    const [weekIndex] = useAtom(weekAtom);
    const [leagueId] = useAtom(leagueAtom);
    const [scoresData, setScoresData] = useState<Matchup[] | null>(null);

    useEffect(() => {
        async function fetchData() {
            const data = await getMatchups({ weekIndex, leagueId });
            setScoresData(data);
        }
        fetchData();
        console.log(scoresData)
    }, [weekIndex]);

    return (
        <div>
            <h1>Scoreboard</h1>
            <h2>Player 1: {scoresData?.[0].points}</h2>
            <h2>Player 2: {scoresData?.[1].points}</h2>
            <h2>AUGHHHHH</h2>
            {scoresData ? JSON.stringify(scoresData, null, 2) : "Loading..."}
        </div>
    );
}
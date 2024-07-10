import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { valueAtom, leagueAtom, weekAtom } from "@/app/atoms/atom";
import { getMatchups } from "./utils";
import MatchupCard from "@/components/ui/matchupCard";

interface Matchup {
    matchup_id: string;
    points: number;
    user?: {
        avatar: string;
        display_name: string;
        metadata: {
            team_name: string;
        },
    }
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
    }, [weekIndex]);

    return (
        <div>
            <h1>Scoreboard</h1>
            {scoresData?.map((matchup) => {
                return (
                    <h2 key={matchup.matchup_id}>
                        {matchup.user ? matchup.user.metadata.team_name : "Unknown Team"} {matchup.points}
                    </h2>
                )
            })}
            <MatchupCard team1={scoresData?.[0]} team2={scoresData?.[1]} />
            <MatchupCard team1={scoresData?.[2]} team2={scoresData?.[3]} />
            <MatchupCard team1={scoresData?.[4]} team2={scoresData?.[5]} />
            <MatchupCard team1={scoresData?.[6]} team2={scoresData?.[7]} />
            <MatchupCard team1={scoresData?.[8]} team2={scoresData?.[9]} />
            <MatchupCard team1={scoresData?.[10]} team2={scoresData?.[11]} />
            {scoresData ? JSON.stringify(scoresData, null, 2) : "Loading..."}
        </div>
    );
}
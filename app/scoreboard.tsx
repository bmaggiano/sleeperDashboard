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

const renderMatchupCards = (matchups: Matchup[] | null) => {
    if (!matchups) return null;

    const cards = [];
    for (let i = 0; i < matchups.length; i += 2) {
        cards.push(
            <MatchupCard
                key={i}
                team1={matchups[i]}
                team2={matchups[i + 1]}
                withVsLink
            />
        );
    }
    return cards;
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
    }, [weekIndex, leagueId]);

    return (
        <div>
            {renderMatchupCards(scoresData)}
        </div>
    );
}
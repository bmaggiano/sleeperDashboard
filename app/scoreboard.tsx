import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { leagueNameAtom, leagueAtom, weekAtom } from "@/app/atoms/atom";
import { getMatchups } from "./utils";
import MatchupCard from "@/components/ui/matchupCard";
import { Combobox } from "@/components/ui/combobox";

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

const weeks = Array.from({ length: 17 }, (_, i) => ({ index: i + 1, week: `Week ${i + 1}` }));

const renderMatchupCards = (matchups: Matchup[] | null) => {
    if (!matchups) return null;

    const cards = [];
    for (let i = 0; i < matchups.length; i += 2) {
        cards.push(
            <MatchupCard
                key={i}
                team1={matchups[i]}
                team2={matchups[i + 1] || {}}
                withVsLink
            />
        );
    }
    return cards;
}

export default function Scoreboard() {
    const [leagueName, setLeagueName] = useAtom(leagueNameAtom);
    const [weekIndex] = useAtom(weekAtom);
    const [leagueId] = useAtom(leagueAtom);
    const [scoresData, setScoresData] = useState<Matchup[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            const data = await getMatchups({ weekIndex, leagueId });
            if (data.error) {
                return;
            } else {
                setScoresData(data);
                setError(null);
            }
        }
        fetchData();
    }, [weekIndex, leagueId]);

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    if (!scoresData) return null;

    return (
        <div>
            <div className="pt-4 pb-2 flex justify-between items-center">
                <h1 className="font-medium">Matchups - {leagueName}</h1>
                <Combobox data={weeks} />
            </div>
            {renderMatchupCards(scoresData)}
        </div>
    );
}
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { leagueNameAtom, leagueAtom, weekAtom } from "@/app/atoms/atom";
import { getMatchups } from "./utils";
import MatchupCard from "@/components/ui/matchupCard";
import { Combobox } from "@/components/ui/combobox";
import MatchupCardSkeleton from "@/components/matchupCardSkeleton";
import { useToast } from "@/components/ui/use-toast";

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

const renderSkeletons = () => {
    return Array.from({ length: 8 }, (_, i) => (
        <div key={`skeleton-${i}`}>
            <MatchupCardSkeleton />
        </div>
    ));
}

const weeks = Array.from({ length: 17 }, (_, i) => ({ index: i + 1, week: `Week ${i + 1}` }));

const renderMatchupCards = (matchups: Matchup[] | null) => {
    if (!matchups) return <MatchupCardSkeleton />;

    const cards = [];
    for (let i = 0; i < matchups.length; i += 2) {
        cards.push(
            <MatchupCard
                key={i}
                team1={matchups[i]}
                team2={matchups[i + 1] || null}
                withVsLink
            />
        );
    }
    return cards;
}

export default function Scoreboard({ scoresData }: { scoresData: Matchup[] | null }) {
    const { toast } = useToast();
    const [leagueName, setLeagueName] = useAtom(leagueNameAtom);
    const [weekIndex] = useAtom(weekAtom);
    const [leagueId] = useAtom(leagueAtom);

    if (!scoresData) return renderSkeletons();

    return (
        <div>
            {renderMatchupCards(scoresData)}
        </div>
    );
}
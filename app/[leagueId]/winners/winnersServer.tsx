"use client";

import React, { useEffect, useState } from "react";
import { matchBracketToMatchup, getChampionInfo, getTotalWeeks, getLeagueWeeks } from "../../utils";
import MatchupCard from "@/components/ui/matchupCard";
import MatchupCardSkeleton from "@/components/ui/matchupCardSkeleton";
import UserCard from "@/components/ui/userCard";

type TeamInfo = {
    displayName: string;
    rosterId: number;
    points: number;
    starters: string[];
    players: string[];
};

type Matchup = {
    round: number;
    matchupId: number;
    team1: TeamInfo;
    team2: TeamInfo;
};

const WinnersBracket = ({ leagueId }: { leagueId: any }) => {
    const [matchupDetails, setMatchupDetails] = useState<Matchup[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [champion, setChampion] = useState<any[]>([]);
    const [weekLengthNum, setWeekLengthNum] = useState<number>(0);
    const [regSeasonWeekNum, setRegSeasonWeekNum] = useState<number>(0);

    useEffect(() => {
        const fetchMatchupDetails = async () => {
            try {
                const weekLength = await getTotalWeeks(leagueId)
                const details = await matchBracketToMatchup({
                    week: weekLength,
                    leagueId: leagueId,
                });
                const championInfo = await getChampionInfo(leagueId);
                const regSeason = await getLeagueWeeks(leagueId);
                setRegSeasonWeekNum(regSeason.length - 1);
                setWeekLengthNum(weekLength);
                setChampion(championInfo);
                setMatchupDetails(details);
            } catch (err) {
                setError("Failed to load matchup details.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchMatchupDetails();
    }, []);

    if (loading) {
        return (
            Array.from({ length: 6 }).map((_, i) => (
                <div className="mx-auto w-full max-w-3xl" key={i}>
                    <MatchupCardSkeleton />
                </div>
            ))
        );
    }

    // Group matchups by round number
    const matchupsByRound = matchupDetails.reduce<Record<number, Matchup[]>>(
        (acc, matchup) => {
            if (!acc[matchup.round]) {
                acc[matchup.round] = [];
            }
            acc[matchup.round].push(matchup);
            return acc;
        },
        {}
    );

    return (
        <div className="pt-4">
            <UserCard user={champion} />
            {Object.keys(matchupsByRound).length > 0 ? (
                Object.entries(matchupsByRound)
                    .sort(([a], [b]) => Number(b) - Number(a)) // Sort rounds in descending order
                    .map(([round, matchups]) => (
                        <div key={round}>
                            <h3 className="text-2xl font-semibold text-gray-700 mt-4">
                                Round {round}
                            </h3>
                            {matchups.map((matchup, index) => (
                                <MatchupCard
                                    key={index}
                                    team1={matchup.team1}
                                    team2={matchup.team2}
                                    withVsLink
                                    withWeekRef={regSeasonWeekNum + parseInt(round)}
                                />
                            ))}
                        </div>
                    ))
            ) : (
                <p className="text-xl text-gray-600">No matchups found for this round.</p>
            )}
        </div>
    );
};

export default WinnersBracket;
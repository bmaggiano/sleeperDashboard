"use client";

import React, { useEffect, useState } from "react";
import { matchBracketToMatchup } from "../../utils";
import MatchupCard from "@/components/ui/matchupCard";

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

    useEffect(() => {
        const fetchMatchupDetails = async () => {
            try {
                const details = await matchBracketToMatchup({
                    week: 17,
                    leagueId: leagueId,
                });
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
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-xl text-gray-600">Loading matchups...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-xl text-red-600">{error}</p>
            </div>
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
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Winners Bracket</h2>
            {Object.keys(matchupsByRound).length > 0 ? (
                Object.entries(matchupsByRound)
                    .sort(([a], [b]) => Number(b) - Number(a)) // Sort rounds in descending order
                    .map(([round, matchups]) => (
                        <div key={round}>
                            <h3 className="text-2xl font-semibold text-gray-700 mb-4">
                                Round {round}
                            </h3>
                            {matchups.map((matchup, index) => (
                                <MatchupCard
                                    key={index}
                                    team1={matchup.team1}
                                    team2={matchup.team2}
                                    withVsLink
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
"use server"

export const getLeagueName = async (leagueId: string) => {
    try {
        const response = await fetch(`https://api.sleeper.app/v1/league/${leagueId}`);
        if (!response.ok) throw new Error("Failed to fetch league info");
        const leagueInfo = await response.json();
        return leagueInfo.name;
    } catch (error: any) {
        return { error: error.message };
    }
}

const getUsersInfo = async (leagueId: string) => {
    try {
        const response = await fetch(`https://api.sleeper.app/v1/league/${leagueId}/users`);
        if (!response.ok) throw new Error("Failed to fetch user info");
        const userInfo = await response.json();
        return userInfo;
    } catch (error: any) {
        return { error: error.message };
    }
}

const getRosterInfo = async (leagueId: string) => {
    try {
        const response = await fetch(`https://api.sleeper.app/v1/league/${leagueId}/rosters`);
        if (!response.ok) throw new Error("Failed to fetch roster info");
        const rosterInfo = await response.json();
        return rosterInfo;
    } catch (error: any) {
        return { error: error.message };
    }
}

const getMatchupInfo = async (leagueId: string, weekIndex: number) => {
    try {
        const response = await fetch(`https://api.sleeper.app/v1/league/${leagueId}/matchups/${weekIndex}`);
        if (!response.ok) throw new Error("Failed to fetch matchup info");
        const matchupInfo = await response.json();
        return matchupInfo;
    } catch (error: any) {
        return { error: error.message };
    }
}

const combineUserAndRosterInfo = (userInfo: any, rosterInfo: any) => {
    if (!userInfo || !rosterInfo) return [];
    return rosterInfo.map((roster: any) => {
        const user = userInfo.find((user: any) => user.user_id === roster.owner_id);
        return {
            ...roster,
            user
        }
    });
}

const combineRosterAndMatchupInfo = (rosterInfo: any, matchupInfo: any) => {
    if (!rosterInfo || !matchupInfo) return [];
    return matchupInfo.map((matchup: any) => {
        const roster = rosterInfo.find((roster: any) => roster.roster_id === matchup.roster_id);
        return {
            ...matchup,
            ...roster
        }
    });
}

export const getMatchupsWithMatchupID = async ({ weekIndex, leagueId, matchupId }: { weekIndex: number, leagueId: string, matchupId: string }) => {
    const userInfo = await getUsersInfo(leagueId);
    if (userInfo?.error) return userInfo;

    const rosterInfo = await getRosterInfo(leagueId);
    if (rosterInfo?.error) return rosterInfo;

    const matchupInfo = await getMatchupInfo(leagueId, weekIndex);
    if (matchupInfo?.error) return matchupInfo;

    const combinedUserAndRosterInfo = combineUserAndRosterInfo(userInfo, rosterInfo);
    const finalData = combineRosterAndMatchupInfo(combinedUserAndRosterInfo, matchupInfo);

    const matchupIdNumber = Number(matchupId);
    const filteredData = finalData.filter((matchup: any) => matchup.matchup_id === matchupIdNumber);

    return filteredData;
}

export const getMatchups = async ({ weekIndex, leagueId }: { weekIndex: number, leagueId: string }) => {
    const userInfo = await getUsersInfo(leagueId);
    if (userInfo?.error) return userInfo;

    const rosterInfo = await getRosterInfo(leagueId);
    if (rosterInfo?.error) return rosterInfo;

    const matchupInfo = await getMatchupInfo(leagueId, weekIndex);
    if (matchupInfo?.error) return matchupInfo;

    const combinedUserAndRosterInfo = combineUserAndRosterInfo(userInfo, rosterInfo);
    const finalData = combineRosterAndMatchupInfo(combinedUserAndRosterInfo, matchupInfo);

    finalData.sort((a: any, b: any) => a.matchup_id - b.matchup_id);

    return finalData;
}

export const getWinnersBracket = async ({ leagueId }: { leagueId: string }) => {
    const response = await fetch(`https://api.sleeper.app/v1/league/${leagueId}/winners_bracket`);
    if (!response.ok) throw new Error("Failed to fetch winners bracket");
    const winnersBracket = await response.json();
    return winnersBracket;
}

export const matchBracketToMatchup = async ({
    leagueId,
    week,
}: {
    leagueId: string;
    week: number;
}) => {
    const winnersBracket = await getWinnersBracket({ leagueId });
    const matchupResults: any[] = []; // Array to store matchup results

    const numBracketLength = winnersBracket.length;
    let roundsLength = winnersBracket[numBracketLength - 1].r;

    // Start from the initial week
    let currentWeek = week;

    // Iterate through rounds from the highest to the lowest
    while (roundsLength > 0) {
        // Get matchup details for the current week
        const matchupDetailsInfo = await getMatchups({
            weekIndex: currentWeek,
            leagueId,
        });

        // Filter for matchups corresponding to the current round
        winnersBracket.forEach((bracketMatchup: any) => {
            if (bracketMatchup.r === roundsLength) {
                // Find the corresponding teams
                const matchupTeam1 = matchupDetailsInfo.find(
                    (matchup: any) => matchup.roster_id === bracketMatchup.t1
                );
                const matchupTeam2 = matchupDetailsInfo.find(
                    (matchup: any) => matchup.roster_id === bracketMatchup.t2
                );

                // If both teams are found, add to the results array
                if (matchupTeam1 && matchupTeam2) {
                    matchupResults.push({
                        round: roundsLength,
                        week: currentWeek, // Include the current week in the result
                        matchupId: bracketMatchup.m,
                        team1: matchupTeam1,
                        team2: matchupTeam2,
                    });
                }
            }
        });

        // Move to the next round and week
        console.log(currentWeek);
        roundsLength--;
        currentWeek--;
    }

    return matchupResults; // Return the array of matchup results
};
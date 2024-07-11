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

export const getMatchups = async ({ weekIndex, leagueId }: { weekIndex: number, leagueId: string }) => {
    const userInfo = await getUsersInfo(leagueId);
    if (userInfo?.error) return userInfo;

    const rosterInfo = await getRosterInfo(leagueId);
    if (rosterInfo?.error) return rosterInfo;

    const matchupInfo = await getMatchupInfo(leagueId, weekIndex);
    if (matchupInfo?.error) return matchupInfo;

    const combinedUserAndRosterInfo = combineUserAndRosterInfo(userInfo, rosterInfo);
    const finalData = combineRosterAndMatchupInfo(combinedUserAndRosterInfo, matchupInfo);

    return finalData;
}
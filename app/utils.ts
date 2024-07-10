"use server"

const getUsersInfo = async (leagueId: string) => {
    const response = await fetch(`https://api.sleeper.app/v1/league/${leagueId}/users`);
    const userInfo = await response.json();
    return userInfo;
}

const getRosterInfo = async (leagueId: string) => {
    const response = await fetch(`https://api.sleeper.app/v1/league/${leagueId}/rosters`);
    const rosterInfo = await response.json();
    return rosterInfo;
}

const getMatchupInfo = async (leagueId: string, weekIndex: number) => {
    const response = await fetch(`https://api.sleeper.app/v1/league/${leagueId}/matchups/${weekIndex}`);
    const matchupInfo = await response.json();
    return matchupInfo;
}

const combineUserAndRosterInfo = (userInfo: any, rosterInfo: any) => {
    return rosterInfo.map((roster: any) => {
        const user = userInfo.find((user: any) => user.user_id === roster.owner_id);
        return {
            ...roster,
            user
        }
    });
}

const combineRosterAndMatchupInfo = (rosterInfo: any, matchupInfo: any) => {
    return matchupInfo.map((matchup: any) => {
        const roster = rosterInfo.find((roster: any) => roster.roster_id === matchup.roster_id);
        return {
            ...matchup,
            ...roster
        }
    });
}

const getAllData = async (leagueId: string) => {
    const userInfo = await getUsersInfo(leagueId);
    const rosterInfo = await getRosterInfo(leagueId);
    const combinedInfo = combineUserAndRosterInfo(userInfo, rosterInfo);
    return combinedInfo;
}

export const getMatchups = async ({ weekIndex, leagueId }: { weekIndex: number, leagueId: string }) => {
    const userInfo = await getUsersInfo(leagueId);
    const rosterInfo = await getRosterInfo(leagueId);
    const matchupInfo = await getMatchupInfo(leagueId, weekIndex);

    const combinedUserAndRosterInfo = combineUserAndRosterInfo(userInfo, rosterInfo);
    const finalData = combineRosterAndMatchupInfo(combinedUserAndRosterInfo, matchupInfo);

    return finalData;
}
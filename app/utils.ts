"use server";

const LEAGUE_DEFAULT_YEAR = 2023;

export const getTotalWeeks = async (leagueId: string) => {
  try {
    const response = await fetch(
      `https://api.sleeper.app/v1/league/${leagueId}`
    );
    if (!response.ok) throw new Error("Failed to fetch league weeks");
    const leagueWeeks = await response.json();
    return leagueWeeks.settings.leg;
  } catch (error: any) {
    return 0;
  }
};

export const getLeagueWeeks = async (leagueId: string) => {
  try {
    const response = await fetch(
      `https://api.sleeper.app/v1/league/${leagueId}`
    );
    if (!response.ok) throw new Error("Failed to fetch league weeks");
    const leagueWeeks = await response.json();
    const leagueWeekNum = leagueWeeks.settings.playoff_week_start - 1;
    const leagueWeeksArray = Array.from({ length: leagueWeekNum }, (_, i) => ({
      index: i + 1,
      week: `Week ${i + 1}`,
    }));
    leagueWeeksArray.push({
      index: leagueWeekNum + 1,
      week: "Winners Bracket",
    });
    return leagueWeeksArray;
  } catch (error: any) {
    return [];
  }
};

export const getLeagueName = async (leagueId: string) => {
  try {
    const response = await fetch(
      `https://api.sleeper.app/v1/league/${leagueId}`
    );
    if (!response.ok) throw new Error("Failed to fetch league info");
    const leagueInfo = await response.json();
    return leagueInfo.name;
  } catch (error: any) {
    return { error: error.message };
  }
};

export const getLeagueByUserId = async (username: string) => {
  try {
    // First, get the user ID from the username
    const userResponse = await fetch(
      `https://api.sleeper.app/v1/user/${username}`
    );
    if (!userResponse.ok) throw new Error("Failed to fetch user info");
    const userData = await userResponse.json();
    const userId = userData.user_id;

    const currentYear = LEAGUE_DEFAULT_YEAR;
    let leagues = [];

    // Try current year first
    const currentYearResponse = await fetch(
      `https://api.sleeper.app/v1/user/${userId}/leagues/nfl/${currentYear}`
    );
    if (currentYearResponse.ok) {
      leagues = await currentYearResponse.json();
    }

    // If no results for current year, try LEAGUE_DEFAULT_YEAR
    if (leagues.length === 0) {
      const fallbackResponse = await fetch(
        `https://api.sleeper.app/v1/user/${userId}/leagues/nfl/${LEAGUE_DEFAULT_YEAR}`
      );
      if (fallbackResponse.ok) {
        leagues = await fallbackResponse.json();
      }
    }

    return leagues;
  } catch (error: any) {
    return { error: error.message };
  }
};

const getUsersInfo = async (leagueId: string) => {
  try {
    const response = await fetch(
      `https://api.sleeper.app/v1/league/${leagueId}/users`
    );
    if (!response.ok) throw new Error("Failed to fetch user info");
    const userInfo = await response.json();
    return userInfo;
  } catch (error: any) {
    return { error: error.message };
  }
};

const getRosterInfo = async (leagueId: string) => {
  try {
    const response = await fetch(
      `https://api.sleeper.app/v1/league/${leagueId}/rosters`
    );
    if (!response.ok) throw new Error("Failed to fetch roster info");
    const rosterInfo = await response.json();
    return rosterInfo;
  } catch (error: any) {
    return { error: error.message };
  }
};

export const getChampionInfo = async (leagueId: string) => {
  // owner id on rosters is user id on users
  try {
    const response = await fetch(
      `https://api.sleeper.app/v1/league/${leagueId}`
    );
    if (!response.ok) throw new Error("Failed to fetch champion info");
    const championInfo = await response.json();
    const rosterInfo = await getRosterInfo(leagueId);
    const userInfo = await getUsersInfo(leagueId);
    const champion = rosterInfo.find(
      (roster: any) =>
        roster.roster_id == championInfo.metadata.latest_league_winner_roster_id
    );
    const user = userInfo.find(
      (user: any) => user.user_id == champion.owner_id
    );
    const championObj = {
      ...champion,
      user: { ...user }, // Nest the user object inside championObj
    };
    return championObj;
  } catch (error: any) {
    return;
  }
};

const getMatchupInfo = async (leagueId: string, weekIndex: number) => {
  try {
    const response = await fetch(
      `https://api.sleeper.app/v1/league/${leagueId}/matchups/${weekIndex}`
    );
    if (!response.ok) throw new Error("Failed to fetch matchup info");
    const matchupInfo = await response.json();
    return matchupInfo;
  } catch (error: any) {
    return { error: error.message };
  }
};

const combineUserAndRosterInfo = (userInfo: any, rosterInfo: any) => {
  if (!userInfo || !rosterInfo) return [];
  return rosterInfo.map((roster: any) => {
    const user = userInfo.find((user: any) => user.user_id === roster.owner_id);
    return {
      ...roster,
      user,
    };
  });
};

export const combineUserAndRosterInfoCard = async (leagueId: string) => {
  const userInfo = await getUsersInfo(leagueId);
  const rosterInfo = await getRosterInfo(leagueId);
  return rosterInfo.map((roster: any) => {
    const user = userInfo.find((user: any) => user.user_id === roster.owner_id);
    return {
      ...roster,
      user,
    };
  });
};

const combineRosterAndMatchupInfo = (rosterInfo: any, matchupInfo: any) => {
  if (!rosterInfo || !matchupInfo) return [];
  return matchupInfo.map((matchup: any) => {
    const roster = rosterInfo.find(
      (roster: any) => roster.roster_id === matchup.roster_id
    );
    return {
      ...matchup,
      ...roster,
    };
  });
};

export const getMatchupsWithMatchupID = async ({
  weekIndex,
  leagueId,
  matchupId,
}: {
  weekIndex: number;
  leagueId: string;
  matchupId: string;
}) => {
  const userInfo = await getUsersInfo(leagueId);
  if (userInfo?.error) return userInfo;

  const rosterInfo = await getRosterInfo(leagueId);
  if (rosterInfo?.error) return rosterInfo;

  const matchupInfo = await getMatchupInfo(leagueId, weekIndex);
  if (matchupInfo?.error) return matchupInfo;

  const combinedUserAndRosterInfo = combineUserAndRosterInfo(
    userInfo,
    rosterInfo
  );
  const finalData = combineRosterAndMatchupInfo(
    combinedUserAndRosterInfo,
    matchupInfo
  );

  const matchupIdNumber = Number(matchupId);
  const filteredData = finalData.filter(
    (matchup: any) => matchup.matchup_id === matchupIdNumber
  );

  return filteredData;
};

export const getMatchups = async ({
  weekIndex,
  leagueId,
}: {
  weekIndex: number;
  leagueId: string;
}) => {
  const userInfo = await getUsersInfo(leagueId);
  if (userInfo?.error) return userInfo;

  const rosterInfo = await getRosterInfo(leagueId);
  if (rosterInfo?.error) return rosterInfo;

  const matchupInfo = await getMatchupInfo(leagueId, weekIndex);
  if (matchupInfo?.error) return matchupInfo;

  const combinedUserAndRosterInfo = combineUserAndRosterInfo(
    userInfo,
    rosterInfo
  );
  const finalData = combineRosterAndMatchupInfo(
    combinedUserAndRosterInfo,
    matchupInfo
  );

  finalData.sort((a: any, b: any) => a.matchup_id - b.matchup_id);

  return finalData;
};

export const getWinnersBracket = async ({ leagueId }: { leagueId: string }) => {
  const response = await fetch(
    `https://api.sleeper.app/v1/league/${leagueId}/winners_bracket`
  );
  if (!response.ok) throw new Error("Failed to fetch winners bracket");
  const winnersBracket = await response.json();
  return winnersBracket;
};

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
    roundsLength--;
    currentWeek--;
  }

  return matchupResults; // Return the array of matchup results
};

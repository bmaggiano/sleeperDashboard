
"use server"
export const getMatchups = async ({ weekIndex, leagueId }: { weekIndex: number, leagueId: string }) => {
    const data = await fetch(`https://api.sleeper.app/v1/league/${leagueId}/matchups/${weekIndex}`)
    const scoresData = await data.json()
    return scoresData;
}
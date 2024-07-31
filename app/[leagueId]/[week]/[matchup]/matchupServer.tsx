"use server";

import { getMatchupsWithMatchupID } from "@/app/utils"
import MatchupDetails from "@/app/matchupDetails";


export default async function MatchupServer({ week, leagueId, matchup }: { week: string, leagueId: string, matchup: string }) {

    const data = await getMatchupsWithMatchupID({ weekIndex: Number(week), leagueId: leagueId, matchupId: matchup });

    return (
        <div>
            <MatchupDetails teamOne={data[0]} teamTwo={data[1]} />
        </div>
    )
}
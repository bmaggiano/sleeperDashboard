"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { getMatchupsWithMatchupID } from "@/app/utils"
import MatchupDetails from "@/app/matchupDetails";

export default function MatchupPage() {
    const { week, leagueId, matchup } = useParams()
    const [teamOne, setTeamOne] = useState<any | null>(null);
    const [teamTwo, setTeamTwo] = useState<any | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const weekIndex = Array.isArray(week) ? Number(week[0]) : Number(week);
            const leagueIdStr = Array.isArray(leagueId) ? leagueId[0] : leagueId;
            const matchupId = Array.isArray(matchup) ? matchup[0] : matchup;
            const data = await getMatchupsWithMatchupID({ weekIndex, leagueId: leagueIdStr, matchupId });
            setTeamOne(data[0]);
            setTeamTwo(data[1]);
        }
        fetchData();
    }, []);
    return (
        <div>
            <MatchupDetails teamOne={teamOne} teamTwo={teamTwo} />
        </div>
    )
}
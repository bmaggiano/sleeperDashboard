"use server";

import { getMatchupsWithMatchupID } from "@/app/utils"
import MatchupDetails from "@/app/matchupDetails";

import type { Metadata, ResolvingMetadata } from 'next'

type Props = {
    params: { id: string }
    searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
    { params, searchParams }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    // read route params
    const id = params.id

    // fetch data

    // optionally access and extend (rather than replace) parent metadata

    return {
        title: "Matchup Details",
        openGraph: {
            images: "https://sleeper-dashboard.vercel.app/api/cards",
        },
    }
}

export default async function MatchupServer({ week, leagueId, matchup }: { week: string, leagueId: string, matchup: string }) {

    const data = await getMatchupsWithMatchupID({ weekIndex: Number(week), leagueId: leagueId, matchupId: matchup });

    return (
        <div>
            <MatchupDetails teamOne={data[0]} teamTwo={data[1]} />
        </div>
    )
}
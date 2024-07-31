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
    // Read route params
    const id = params.id;

    // Fetch data or construct specific metadata logic here
    // For example, determine a custom image URL based on the matchup
    const imageUrl = `https://sleeper-dashboard.vercel.app/api/cards`;

    return {
        title: `Matchup Details`,
        description: "Detailed matchup information.",
        openGraph: {
            images: [{
                url: imageUrl,
                width: 1200,
                height: 630,
                alt: 'Matchup Details Image',
            }],
            title: `Matchup Details`,
            description: "Detailed matchup information.",
        },
    };
}

export default async function MatchupServer({ week, leagueId, matchup }: { week: string, leagueId: string, matchup: string }) {

    const data = await getMatchupsWithMatchupID({ weekIndex: Number(week), leagueId: leagueId, matchupId: matchup });

    return (
        <div>
            <MatchupDetails teamOne={data[0]} teamTwo={data[1]} />
        </div>
    );
}
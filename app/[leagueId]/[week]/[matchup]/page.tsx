// app/[matchup]/page.tsx

import { getMatchupsWithMatchupID } from "@/app/utils";
import MatchupServer from "./matchupServer";
import type { Metadata, ResolvingMetadata } from "next";

type Props = {
    params: { week: string; leagueId: string; matchup: string };
    searchParams: { [key: string]: string | string[] | undefined };
};

// This function is called to generate metadata for this specific page.
export async function generateMetadata(
    { params, searchParams }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    // Destructure the necessary parameters
    const { week, leagueId, matchup } = params;

    // Fetch data if necessary, or use params to customize metadata
    const imageUrl = `https://sleeper-dashboard.vercel.app/api/cards?week=${week}`;

    return {
        title: `Matchup Details - Week ${week}`,
        description: `Detailed matchup information for week ${week}.`,
        openGraph: {
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: "Matchup Details Image",
                },
            ],
            title: `Matchup Details - Week ${week}`,
            description: `Detailed matchup information for week ${week}.`,
        },
    };
}

// Component rendering the Matchup Page
export default function MatchupPage({ params }: { params: { week: string; leagueId: string; matchup: string } }) {
    const { week, leagueId, matchup } = params;

    return (
        <div>
            <MatchupServer week={week} leagueId={leagueId} matchup={matchup} />
        </div>
    );
}
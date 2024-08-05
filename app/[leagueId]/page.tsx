// pages/[leagueId]/page.tsx
import { getLeagueName, getLeagueWeeks } from "../utils";
import PlayersServer from "./playersServer";
import ScoresComponent from "./scoresServer";
import { Combobox } from "@/components/ui/combobox";
import { Metadata, ResolvingMetadata } from 'next';

type Props = {
    params: { leagueId: string }
}

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const id = params.leagueId;
    const leagueName = await getLeagueName(id);

    return {
        title: `Matchups - ${leagueName}`,
        description: `Check out the matchups for ${leagueName}.`,
        openGraph: {
            title: `Matchups - ${leagueName}`,
            description: `Check out the matchups for ${leagueName}.`,
            images: [
                {
                    url: `/image.png`,
                    width: 800,
                    height: 600,
                    alt: `Matchups for ${leagueName}`,
                },
            ],
        },
    };
}

export default async function Page({ params }: { params: { leagueId: string } }) {
    const { leagueId } = params;

    const weeks = await getLeagueWeeks(leagueId);
    return (
        <main className="mt-4">
            <div className="pt-4 pb-2 flex justify-between items-center">
                <h1 className="font-medium">Matchups - {getLeagueName(leagueId)}</h1>
                <Combobox leagueId={leagueId} data={weeks} />
            </div>
            <ScoresComponent leagueId={leagueId} week={1} />
        </main>
    );
}
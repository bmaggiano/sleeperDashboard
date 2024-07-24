
import ScoresComponent from "../scoresServer";
import { Combobox } from "@/components/ui/combobox";
import { getLeagueName, getLeagueWeeks } from "../../utils";

import { Metadata, ResolvingMetadata } from 'next';

type Props = {
    params: { leagueId: string, week: number }
}

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const id = params.leagueId;
    const week = params.week;
    const leagueName = await getLeagueName(id);

    return {
        title: `Matchups - ${leagueName} | Week ${week}`,
        description: `Check out the matchups for ${leagueName} for week ${week}.`,
        openGraph: {
            title: `Matchups - ${leagueName} | Week ${week}`,
            description: `Check out the matchups for ${leagueName} for week ${week}.`,
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

export default async function WeekMatchup({ params }: { params: { week: number, leagueId: string } }) {
    const { week, leagueId } = params;
    const weeks = await getLeagueWeeks(leagueId);
    return (
        <div>
            <div className="pt-4 pb-2 flex justify-between items-center">
                <h1 className="font-medium my-2">Matchups - {getLeagueName(leagueId)}</h1>
                <Combobox leagueId={leagueId} data={weeks} />
            </div>
            <ScoresComponent leagueId={leagueId} week={week} />
        </div>
    );
}
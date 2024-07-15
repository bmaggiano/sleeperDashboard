// page.tsx
import { getLeagueName } from "../utils";
import ScoresComponent from "./scoresServer";
import { Combobox } from "@/components/ui/combobox";

export default function Page({ params }: { params: { leagueId: string } }) {
    const { leagueId } = params;

    const weeks = Array.from({ length: 17 }, (_, i) => ({ index: i + 1, week: `Week ${i + 1}` }));

    return (
        <main>
            <div className="pt-4 pb-2 flex justify-between items-center">
                <h1 className="font-medium">Matchups - {getLeagueName(leagueId)}</h1>
                <Combobox leagueId={leagueId} data={weeks} />
            </div>
            <ScoresComponent leagueId={leagueId} week={1} />
        </main>
    );
}
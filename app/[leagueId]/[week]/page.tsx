
import ScoresComponent from "../scoresServer";
import { Combobox } from "@/components/ui/combobox";

const weeks = Array.from({ length: 17 }, (_, i) => ({ index: i + 1, week: `Week ${i + 1}` }));

export default function WeekMatchup({ params }: { params: { week: number, leagueId: string } }) {
    const { week, leagueId } = params;
    return (
        <div>
            <div className="pt-4 pb-2 flex justify-between items-center">
                <h1 className="font-medium">Matchups - {leagueId} {week}</h1>
                <Combobox leagueId={leagueId} data={weeks} />
            </div>
            <ScoresComponent leagueId={leagueId} week={week} />
        </div>
    );
}
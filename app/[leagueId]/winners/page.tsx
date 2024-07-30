import WinnersBracket from "./winnersBracket";
import WinnersBreadcrumb from "./winnersBreadcrumb";


export default function WinnersPageClient({ params }: { params: { leagueId: string } }) {
    const { leagueId } = params;

    return (
        <div>
            <div className="flex items-center justify-between">
                <WinnersBreadcrumb />
            </div>
            <WinnersBracket leagueId={leagueId} />
        </div>
    );
}
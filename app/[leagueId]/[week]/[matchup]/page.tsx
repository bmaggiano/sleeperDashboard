
import { getMatchupsWithMatchupID } from "@/app/utils"
import MatchupDetails from "@/app/matchupDetails";
import MatchupServer from "./matchupServer";

export default function MatchupPage({ params }: { params: { week: string, leagueId: string, matchup: string } }) {
    const { week, leagueId, matchup } = params

    return (
        <div>
            <MatchupServer week={week} leagueId={leagueId} matchup={matchup} />
        </div>
    )
}
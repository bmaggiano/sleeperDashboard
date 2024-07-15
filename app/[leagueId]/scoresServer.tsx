import { getMatchups } from "../utils";
import { Score } from "./scoresClient";

async function ScoresComponent({ leagueId, week }: { leagueId: string, week: number }) {
    const scores = await getMatchups({ weekIndex: week, leagueId });
    return <Score scoresData={scores} />;
}

export default ScoresComponent;
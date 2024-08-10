import { getMatchups } from "../utils";
import { ScoreClient } from "./scoresClient";

async function ScoresComponent({
  leagueId,
  week,
}: {
  leagueId: string;
  week: number;
}) {
  const scores = await getMatchups({ weekIndex: week, leagueId });
  return <ScoreClient scoresData={scores} />;
}

export default ScoresComponent;

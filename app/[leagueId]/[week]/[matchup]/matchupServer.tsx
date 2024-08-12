//@ts-nocheck
// TODO: FIX TYPES

"use server";

import { getMatchupsWithMatchupID, sleeperToESPNMapping } from "@/app/utils";
import MatchupDetails from "@/app/matchupDetails";
import { cache } from "react";

const cachedSleeperToESPNMapping = cache(sleeperToESPNMapping);

export default async function MatchupServer({
  week,
  leagueId,
  matchup,
}: {
  week: string;
  leagueId: string;
  matchup: string;
}) {
  const data = await getMatchupsWithMatchupID({
    weekIndex: Number(week),
    leagueId: leagueId,
    matchupId: matchup,
  });

  const processedData = await Promise.all(
    data.map(async (team) => {
      const starters = await Promise.all(
        team.starters.map(async (playerId, index) => {
          const info = await cachedSleeperToESPNMapping(playerId);
          return {
            id: playerId,
            points: team.starters_points[index],
            info: info || null, // Handle potential null value
          };
        })
      );

      const bench = await Promise.all(
        team.players
          .filter((playerId) => !team.starters.includes(playerId))
          .map(async (playerId) => {
            const info = await cachedSleeperToESPNMapping(playerId);
            return {
              id: playerId,
              points: team.players_points[playerId],
              info: info || null, // Handle potential null value
            };
          })
      );

      return {
        ...team,
        starters,
        bench,
      };
    })
  );

  return (
    <div>
      <MatchupDetails teamOne={processedData[0]} teamTwo={processedData[1]} />
    </div>
  );
}

"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useAtom } from "jotai";
import { leagueNameAtom, leagueAtom } from "./atoms/atom";
import { getAvatarUrl, getLeagueByUserId, getLeagueName } from "./utils";
import { useToast } from "@/components/ui/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function LeagueSearchForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [localLeagueId, setLocalLeagueId] = useState<string>("");
  const [leagueName, setLeagueName] = useAtom(leagueNameAtom);
  const [leagueId, setLeagueId] = useAtom(leagueAtom);
  const [userLeagues, setUserLeagues] = useState<any[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await searchLeague();
  };

  const searchLeague = async () => {
    const leagueResponse = await getLeagueName(localLeagueId);

    if (leagueResponse.error) {
      const userLeaguesResponse = await getLeagueByUserId(localLeagueId);

      if (Array.isArray(userLeaguesResponse)) {
        setUserLeagues(userLeaguesResponse);
      } else {
        showErrorToast(userLeaguesResponse.error || "Failed to fetch leagues");
      }
    } else {
      handleSuccessfulLeagueSearch(leagueResponse);
    }
  };

  const handleSuccessfulLeagueSearch = (leagueName: string) => {
    setLeagueId(localLeagueId);
    setLeagueName(leagueName);
    updateRecentSearches(localLeagueId);
    router.push(`/${localLeagueId}`);
  };

  const updateRecentSearches = (id: string) => {
    const recentSearches = JSON.parse(
      localStorage.getItem("recentSearches") || "[]"
    );
    localStorage.setItem(
      "recentSearches",
      JSON.stringify([...recentSearches, id])
    );
  };

  const showErrorToast = (message: string) => {
    toast({
      title: "Error",
      description: message,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalLeagueId(e.target.value);
  };

  const handleLeagueSelection = (selectedLeague: any) => {
    setLeagueId(selectedLeague.league_id);
    setLeagueName(selectedLeague.name);
    updateRecentSearches(selectedLeague.league_id);
    router.push(`/${selectedLeague.league_id}`);
  };

  return (
    <div className="sm:w-1/2 w-full mx-auto pt-4 pb-2 text-center">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center">
          <Input
            placeholder="League ID or Username"
            onChange={handleInputChange}
            value={localLeagueId}
            className="w-full"
          />
        </div>
      </form>
      {userLeagues.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Select a league</h3>
          <ul className="space-y-2">
            {userLeagues.map((league) => (
              <li
                key={league.league_id}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100"
              >
                <div className="flex items-center">
                  <Image
                    src={`https://sleepercdn.com/avatars/${league.avatar}`}
                    alt={`${league.name} avatar`}
                    width={32}
                    height={32}
                    className="rounded-full mr-2"
                  />
                  <span>
                    {league.name} ({league.season})
                  </span>
                </div>
                <Button size="sm" onClick={() => handleLeagueSelection(league)}>
                  Select
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <Popover>
        <PopoverTrigger className="text-sm text-gray-500 mt-2 font-medium">
          Not sure how to find your league ID?
        </PopoverTrigger>
        <PopoverContent>
          <ol className="list-decimal list-inside text-sm text-gray-500">
            <li>
              Go to the{" "}
              <a
                className="text-blue-500 underline"
                href="https://sleeper.app/leagues"
                target="_blank"
                rel="noreferrer"
              >
                Leagues
              </a>{" "}
              page on the Sleeper website.
            </li>
            <li>Click on the league you want to search for.</li>
            <li>Copy the league ID from the URL.</li>
          </ol>
        </PopoverContent>
      </Popover>
    </div>
  );
}

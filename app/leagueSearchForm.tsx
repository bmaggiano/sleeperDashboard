"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useAtom } from "jotai";
import { leagueNameAtom, leagueAtom } from "./atoms/atom";
import { getLeagueByUserId, getLeagueName } from "./utils";
import { useToast } from "@/components/ui/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function LeagueSearchForm() {
  const { toast } = useToast();
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
      Array.isArray(userLeaguesResponse)
        ? setUserLeagues(userLeaguesResponse)
        : showErrorToast(
            userLeaguesResponse.error || "Failed to fetch leagues"
          );
    } else {
      handleSuccessfulLeagueSearch(leagueResponse);
    }
  };

  const handleSuccessfulLeagueSearch = (name: string) => {
    setLeagueId(localLeagueId);
    setLeagueName(name);
    updateRecentSearches(localLeagueId);
  };

  const updateRecentSearches = (id: string) => {
    const searches = JSON.parse(localStorage.getItem("recentSearches") || "[]");
    localStorage.setItem("recentSearches", JSON.stringify([...searches, id]));
  };

  const showErrorToast = (message: string) =>
    toast({ title: "Error", description: message });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setLocalLeagueId(e.target.value);

  const handleLeagueSelection = (league: any) => {
    setLeagueId(league.league_id);
    setLeagueName(league.name);
    updateRecentSearches(league.league_id);
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const getColorFromInitials = (initials: string) => {
    let hash = 0;
    for (let i = 0; i < initials.length; i++) {
      hash = initials.charCodeAt(i) + ((hash << 5) - hash);
    }
    return `hsl(${hash % 360}, 70%, 50%)`;
  };

  return (
    <div className="sm:w-1/2 w-full mx-auto pt-4 pb-2 text-center text-sm">
      <form onSubmit={handleSubmit}>
        <Input
          placeholder="League ID or Username"
          onChange={handleInputChange}
          value={localLeagueId}
          className="w-full"
        />
      </form>
      {userLeagues.length > 0 && (
        <div className="mt-4">
          <h3 className="text-base font-semibold mb-2">Select a league</h3>
          <ul className="space-y-2">
            {userLeagues.map((league) => {
              const initials = getInitials(league.name);
              const fallbackColor = getColorFromInitials(initials);
              return (
                <li
                  key={league.league_id}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100"
                >
                  <div className="flex items-center">
                    <Avatar className="mr-2 h-8 w-8">
                      <AvatarImage
                        src={
                          league.avatar
                            ? `https://sleepercdn.com/avatars/${league.avatar}`
                            : ""
                        }
                        alt={`${league.name} avatar`}
                      />
                      <AvatarFallback
                        style={{
                          backgroundColor: fallbackColor,
                          color: "white",
                        }}
                      >
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs">
                      {league.name} ({league.season})
                    </span>
                  </div>
                  <Link href={`/${league.league_id}`}>
                    <Button
                      size="xs"
                      onClick={() => handleLeagueSelection(league)}
                    >
                      Select
                    </Button>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      <Popover>
        <PopoverTrigger className="text-xs text-gray-500 mt-2">
          Not sure how to find your league ID?
        </PopoverTrigger>
        <PopoverContent>
          <ol className="list-decimal list-inside text-xs text-gray-500">
            <li>
              Visit the{" "}
              <Link
                href="https://sleeper.app/leagues"
                target="_blank"
                rel="noreferrer"
                className="text-blue-500 underline"
              >
                Leagues
              </Link>{" "}
              page
            </li>
            <li>Select your league</li>
            <li>Copy ID from URL</li>
          </ol>
        </PopoverContent>
      </Popover>
    </div>
  );
}

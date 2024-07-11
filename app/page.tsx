"use client";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { useState } from "react";
import { useAtom } from "jotai";
import { valueAtom, leagueNameAtom, leagueAtom } from "./atoms/atom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getLeagueName } from "./utils";
import Scoreboard from "@/app/scoreboard";
import RecentSearches from "@/components/recentSearches";
import Header from "@/components/header";
import { Separator } from "@/components/ui/separator";

const weeks = Array.from({ length: 17 }, (_, i) => ({ index: i + 1, week: `Week ${i + 1}` }));

export default function Home() {
  const [value, setValue] = useAtom(valueAtom);
  const [localLeagueId, setLocalLeagueId] = useState<string>("");
  const [leagueId, setLeagueId] = useAtom(leagueAtom);
  const [leagueName, setLeagueName] = useAtom(leagueNameAtom);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLeagueId(localLeagueId); // Set the leagueId atom
    const response = await getLeagueName(localLeagueId);
    if (response.error) {
      setError(response.error);
    } else {
      setLeagueName(response);
      const recentSearches = JSON.parse(localStorage.getItem("recentSearches") || "[]");
      localStorage.setItem("recentSearches", JSON.stringify([...recentSearches, localLeagueId]));
      setError(null);
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalLeagueId(e.target.value);
  }

  return (
    <div className="p-2 sm:p-4">
      <Header />
      <Separator />
      <div className="w-full pt-4 pb-2">
        <form onSubmit={handleSubmit}>
          <Label className="text-base" htmlFor="leagueId">Enter your Sleeper league ID:</Label>
          <div className="flex items-center">
            <Input placeholder="ex. 992142653368156160" onChange={handleInputChange} value={localLeagueId} />
            <Button className="ml-2" type="submit">Submit</Button>
          </div>
        </form>
        {error && <p className="text-red-500">{error}</p>}
      </div>
      <RecentSearches />
      {leagueId && leagueName && !error ?
        <div className="py-2">
          <div className="flex justify-between items-center">
            <h1 className="font-medium">Matchups - {leagueName}</h1>
            <Combobox data={weeks} />
          </div>
          <Scoreboard />
        </div>
        : null}
    </div>
  );
}
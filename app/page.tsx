"use client"
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { useEffect } from "react";
import Image from "next/image";
import { useAtom } from "jotai";
import { valueAtom, leagueNameAtom, leagueAtom } from "./atoms/atom";
import { getMatchups } from "./utils";
import Scoreboard from "@/app/scoreboard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const weeks = Array.from({ length: 17 }, (_, i) => ({ index: i + 1, week: `Week ${i + 1}` }));

export default function Home() {
  const [value, setValue] = useAtom(valueAtom);
  const [leagueId, setLeagueId] = useAtom(leagueAtom);
  const [leagueName, setLeagueName] = useAtom(leagueNameAtom);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLeagueName(leagueId);
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLeagueId(e.target.value);
  }

  return (
    <div className="p-2 sm:p-4">
      <div className="w-full py-4">
        <form className="flex justify-evenly items-center" onSubmit={handleSubmit}>
          <Label className="w-[50%] text-base">Enter your Sleeper league ID:</Label>
          <Input placeholder="974399495632891904" onChange={handleInputChange} value={leagueId} />
        </form>
      </div>
      <div className="flex justify-between items-center">
        <h1 className="font-medium">Matchups - {leagueName}</h1>
        <Combobox data={weeks} />
      </div>
      <Scoreboard />
    </div>
  );
}
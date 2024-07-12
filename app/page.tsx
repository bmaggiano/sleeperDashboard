"use client";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { useState } from "react";
import { useAtom } from "jotai";
import { valueAtom, leagueNameAtom, leagueAtom } from "./atoms/atom";
import Scoreboard from "@/app/scoreboard";
import RecentSearches from "@/components/recentSearches";
import Header from "@/components/header";
import { Separator } from "@/components/ui/separator";
import { MarqueeDemo } from "./exampleLeagues";
import LeagueSearchForm from "./leagueSearchForm";

export default function Home() {
  const [leagueName, setLeagueName] = useAtom(leagueNameAtom);
  const [leagueId, setLeagueId] = useAtom(leagueAtom);

  return (
    <div className="p-2 sm:p-4 max-w-2xl mx-auto">
      <Header />
      <Separator />
      <RecentSearches />
      {leagueId && leagueName ?
        <Scoreboard />
        : <MarqueeDemo />}
      <LeagueSearchForm />
    </div>
  );
}
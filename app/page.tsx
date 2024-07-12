"use client";
import { useAtom } from "jotai";
import { leagueNameAtom, leagueAtom } from "./atoms/atom";
import Scoreboard from "@/app/scoreboard";
import RecentSearches from "@/components/recentSearches";
import Header from "@/components/header";
import { Separator } from "@/components/ui/separator";
import { MarqueeDemo } from "./exampleLeagues";
import LeagueSearchForm from "./leagueSearchForm";

export default function Home() {
  const [leagueName] = useAtom(leagueNameAtom);
  const [leagueId] = useAtom(leagueAtom);

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
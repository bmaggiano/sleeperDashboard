"use client";
import { useAtom } from "jotai";
import { leagueNameAtom, leagueAtom } from "./atoms/atom";
import RecentSearches from "@/components/recentSearches";
import { MarqueeDemo } from "./exampleLeagues";
import LeagueSearchForm from "./leagueSearchForm";

export default function Home() {

  return (
    <div className="p-2 sm:p-4 max-w-3xl mx-auto">
      <RecentSearches />
      <MarqueeDemo />
      <LeagueSearchForm />
    </div>
  );
}
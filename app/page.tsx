"use client";
import RecentSearches from "@/components/recentSearches";
import { LeaguesMarquee } from "./leaguesMarquee";
import LeagueSearchForm from "./leagueSearchForm";

export default function Home() {

  return (
    <div className="p-2 sm:p-4 max-w-3xl mx-auto">
      <RecentSearches />
      <LeaguesMarquee />
      <LeagueSearchForm />
    </div>
  );
}
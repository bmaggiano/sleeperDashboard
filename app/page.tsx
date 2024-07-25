"use client";
import RecentSearches from "@/components/ui/recentSearches";
import LeaguesMarquee from "./leaguesMarquee";
import LeagueSearchForm from "./leagueSearchForm";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";

export default function Home() {

  return (
    <div className="p-2 sm:p-4 max-w-3xl mx-auto">
      <Button variant={"expandIcon"} iconPlacement="right" Icon={ArrowRightIcon}>Test</Button>
      <RecentSearches />
      <LeaguesMarquee />
      <LeagueSearchForm />
    </div>
  );
}
"use client";
import RecentSearches from "@/components/ui/recentSearches";
import LeaguesMarquee from "./leaguesMarquee";
import LeagueSearchForm from "./leagueSearchForm";
import { AssistantModal } from "@/components/ui/assistant-ui/assistant-modal";
import FuzzySearch from "./fuzzySearch";
import { MatchupTableObj, columns } from "./columns"
import { DataTable } from "./data-table"

export default function Home() {


  return (
    <div className="p-2 sm:p-4 max-w-3xl mx-auto">

      {/* <FuzzySearch /> */}
      <AssistantModal />
      <RecentSearches />
      <LeaguesMarquee />
      <LeagueSearchForm />
    </div>
  );
}
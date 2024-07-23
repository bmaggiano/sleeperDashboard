"use client";
import { useParams } from "next/navigation";
import WinnersBracket from "./winnersServer";

export default function WinnersPageClient() {
    const { leagueId } = useParams();
    return (
        <div>
            <WinnersBracket leagueId={leagueId} />
        </div>
    );
}
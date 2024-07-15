"use client"

import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { leagueAtom, leagueNameAtom } from "@/app/atoms/atom";
import { Button } from "./ui/button";
import { getLeagueName } from "@/app/utils";

export default function RecentSearches() {
    const [leagueName, setLeagueName] = useAtom(leagueNameAtom);
    const [leagueId, setLeagueId] = useAtom(leagueAtom);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);

    useEffect(() => {
        localStorage.getItem("recentSearches");
        setRecentSearches(JSON.parse(localStorage.getItem("recentSearches") || "[]"));
    }, [leagueName]);

    const handleClick = async (leagueId: string) => {
        setLeagueId(leagueId);
        const leagueName = await getLeagueName(leagueId);
        setLeagueName(leagueName);
    }

    const handleClearRecentSearches = () => {
        setRecentSearches([]);
        localStorage.removeItem("recentSearches");
    }
    if (recentSearches.length === 0) return null;
    return (
        <div className="py-2">
            <div className="flex justify-between items-center">
                <h2 className="font-medium">Recent Searches</h2>
                <Button variant={"link"} onClick={handleClearRecentSearches}>Clear Recent Searches</Button>
            </div>
            <div className="flex">
                {recentSearches.map((leagueId, index) => (
                    <Button variant={"outline"} className="mr-2 text-sm" onClick={() => handleClick(leagueId)} key={index}>{leagueId}</Button>
                ))}
            </div>
        </div>
    )
}
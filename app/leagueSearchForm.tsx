"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAtom } from "jotai";
import { valueAtom, leagueNameAtom, leagueAtom } from "./atoms/atom";
import { getLeagueName } from "./utils";
import { useToast } from "@/components/ui/use-toast";
import { FiArrowRight } from "react-icons/fi";



export default function LeagueSearchForm() {
    const { toast } = useToast();
    const [value, setValue] = useAtom(valueAtom);
    const [localLeagueId, setLocalLeagueId] = useState<string>("");
    const [leagueName, setLeagueName] = useAtom(leagueNameAtom);
    const [leagueId, setLeagueId] = useAtom(leagueAtom);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLeagueId(localLeagueId); // Set the leagueId atom
        const response = await getLeagueName(localLeagueId);
        if (response.error) {
            toast({
                title: "Error",
                description: response.error,
            });
            return;
        } else {
            setLeagueName(response);
            const recentSearches = JSON.parse(localStorage.getItem("recentSearches") || "[]");
            localStorage.setItem("recentSearches", JSON.stringify([...recentSearches, localLeagueId]));
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalLeagueId(e.target.value);
    }
    return (

        <div className="sm:w-1/2 w-full mx-auto pt-4 pb-2">
            <form onSubmit={handleSubmit}>
                <div className="flex items-center">
                    <Input placeholder="League ID ex. 992142653368156160" onChange={handleInputChange} value={localLeagueId} className="w-full" />
                </div>
            </form>
        </div>
    )
}
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAtom } from "jotai";
import { valueAtom, leagueNameAtom, leagueAtom } from "./atoms/atom";
import { getLeagueName } from "./utils";


export default function LeagueSearchForm() {
    const [value, setValue] = useAtom(valueAtom);
    const [localLeagueId, setLocalLeagueId] = useState<string>("");
    const [leagueName, setLeagueName] = useAtom(leagueNameAtom);
    const [leagueId, setLeagueId] = useAtom(leagueAtom);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLeagueId(localLeagueId); // Set the leagueId atom
        const response = await getLeagueName(localLeagueId);
        if (response.error) {
            setError(response.error);
        } else {
            setLeagueName(response);
            const recentSearches = JSON.parse(localStorage.getItem("recentSearches") || "[]");
            localStorage.setItem("recentSearches", JSON.stringify([...recentSearches, localLeagueId]));
            setError(null);
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalLeagueId(e.target.value);
    }
    return (

        <div className="w-full pt-4 pb-2">
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col justify-center items-center mx-auto">
                    <Input placeholder="League ID ex. 992142653368156160" onChange={handleInputChange} value={localLeagueId} />
                    <Button className="mt-2" type="submit">Submit</Button>
                </div>
            </form>
            {error && <p className="text-red-500">{error}</p>}
        </div>
    )
}
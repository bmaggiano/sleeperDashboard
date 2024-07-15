"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useAtom } from "jotai";
import { valueAtom, leagueNameAtom, leagueAtom } from "./atoms/atom";
import { getLeagueName } from "./utils";
import { useToast } from "@/components/ui/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useRouter } from "next/navigation";



export default function LeagueSearchForm() {
    const { toast } = useToast();
    const router = useRouter();
    const [localLeagueId, setLocalLeagueId] = useState<string>("");
    const [leagueName, setLeagueName] = useAtom(leagueNameAtom);
    const [leagueId, setLeagueId] = useAtom(leagueAtom);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLeagueId(localLeagueId);
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
            localStorage.setItem("recentSearches", JSON.stringify([...recentSearches, localLeagueId]))
            router.push(`/${localLeagueId}`);
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalLeagueId(e.target.value);
    }
    return (

        <div className="sm:w-1/2 w-full mx-auto pt-4 pb-2 text-center">
            <form onSubmit={handleSubmit}>
                <div className="flex items-center">
                    <Input placeholder="League ID ex. 992142653368156160" onChange={handleInputChange} value={localLeagueId} className="w-full" />
                </div>
            </form>
            <Popover>
                <PopoverTrigger className="text-sm text-gray-500 mt-2 font-medium">Not sure how to find your league ID?</PopoverTrigger>
                <PopoverContent>
                    <ol className="list-decimal list-inside text-sm text-gray-500">
                        <li>Go to the <a className="text-blue-500 underline" href="https://sleeper.app/leagues" target="_blank" rel="noreferrer">Leagues</a> page on the Sleeper website.</li>
                        <li>Click on the league you want to search for.</li>
                        <li>Copy the league ID from the URL.</li>
                    </ol>
                </PopoverContent>
            </Popover>
        </div>
    )
}
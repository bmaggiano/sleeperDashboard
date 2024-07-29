"use client";

import React, { useState, useEffect } from "react";
import { FaTrophy } from "react-icons/fa6";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import MatchupCardSkeleton from "@/components/ui/matchupCardSkeleton";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { weekNumberAtom } from "@/app/atoms/atom";
import { Button } from "./button";
import { motion } from "framer-motion";
import { ArrowRightIcon } from "@radix-ui/react-icons";

const MatchupCard = ({
    team1,
    team2,
    withVsLink,
    withWeekRef,
}: {
    team1: any;
    team2: any;
    withVsLink: boolean;
    withWeekRef?: number;
}) => {
    const [teamOneStats, setTeamOneStats] = useState<any | null>(null);
    const [teamTwoStats, setTeamTwoStats] = useState<any | null>(null);
    const [weekIndex] = useAtom(weekNumberAtom);
    const router = useRouter();


    if (!team1 || !team2 || !team1.user || !team2.user) {
        return <MatchupCardSkeleton />;
    }

    const getResult = (score1: number, score2: number) => {
        if (score1 > score2) return <FaTrophy className="text-amber-400" />;
        if (score1 < score2) return;
        return null;
    };

    const handleRedirectToMatchupDetails = () => {
        setTeamOneStats(team1);
        setTeamTwoStats(team2);
        if (withWeekRef !== undefined) {
            router.push(`/${team1.league_id}/${withWeekRef}/${team1.matchup_id}`);
        } else {
            router.push(`/${team1.league_id}/${weekIndex}/${team1.matchup_id}`);
        }
    };

    return (
        <div
            className={withVsLink ? "cursor-pointer" : ""}
            onClick={withVsLink ? handleRedirectToMatchupDetails : undefined}
        >
            <div className="flex justify-evenly">
                <motion.div
                    className="w-full flex flex-col items-center justify-between bg-white rounded-lg p-2 sm:p-4 my-2 text-black ring-1 ring-gray-200 overflow-hidden h-[110px] sm:h-[100px]"
                    whileHover={withVsLink ? { height: "150px" } : undefined}
                    transition={{
                        duration: 0.2,
                        ease: "easeInOut",
                    }}
                >
                    <div className="w-full flex items-center justify-between">
                        <div className="sm:w-[40%] w-[45%]">
                            <div className="sm:flex items-center">
                                <Avatar className="mr-4">
                                    <AvatarImage
                                        src={`https://sleepercdn.com/avatars/thumbs/${team1.user.avatar}`}
                                        alt={`${team1.user.metadata.team_name} avatar`}
                                    />
                                    <AvatarFallback>
                                        {team1.user.display_name.charAt(0).toUpperCase() || ""}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col mr-4">
                                    <span className="text-xs sm:text-sm text-gray-400 truncate">
                                        @{team1.user.display_name}
                                    </span>
                                    <span className="font-bold text-sm sm:text-lg truncate">
                                        {team1.user.metadata.team_name ||
                                            team1.user.display_name}
                                    </span>
                                    <span className="inline-flex items-center text-sm text-gray-400 truncate">
                                        {team1.points} &nbsp; {getResult(team1.points, team2.points)}
                                    </span>
                                </div>
                                <span className="text-xl font-bold">{team1.score}</span>
                            </div>
                        </div>
                        <div className="sm:w-[5%] w-[10%]">
                            <h1 className="text-center font-bold pl-1">VS</h1>
                        </div>
                        <div className="sm:w-[40%] w-[45%]">
                            <div className="flex flex-col-reverse sm:flex-row justify-end">
                                <span className="text-xl font-bold">{team2.score}</span>
                                <div className="flex flex-col ml-4">
                                    <span className="text-xs sm:text-sm text-gray-400 text-right truncate">
                                        @{team2.user.display_name}
                                    </span>
                                    <span className="font-bold text-sm sm:text-lg truncate text-right">
                                        {team2.user.metadata.team_name ||
                                            team2.user.display_name}
                                    </span>
                                    <span className="inline-flex items-center justify-end text-sm text-gray-400 text-right truncate">
                                        {team2.points} &nbsp; {getResult(team2.points, team1.points)}
                                    </span>
                                </div>
                                <Avatar className="ml-4 sm:self-center self-end">
                                    <AvatarImage
                                        src={`https://sleepercdn.com/avatars/thumbs/${team2.user.avatar}`}
                                        alt={`${team2.user.metadata.team_name} avatar`}
                                    />
                                    <AvatarFallback>
                                        {team2.user.display_name.charAt(0).toUpperCase() || ""}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                        </div>
                    </div>

                    {/* The button reveal section */}
                    <div
                        className="mt-4 w-full group-hover:opacity-100 flex"
                    >
                        <Button
                            className="w-full"
                            variant="expandIcon"
                            Icon={ArrowRightIcon}
                            iconPlacement="right"
                            onClick={handleRedirectToMatchupDetails}
                        >
                            View Matchup
                        </Button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default MatchupCard;
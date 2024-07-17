"use client"

import React, { useState } from 'react';
import { FaTrophy } from "react-icons/fa6";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Button } from '@/components/ui/button';
import MatchupStatsDrawer from '@/app/matchupStatsDrawer';
import MatchupCardSkeleton from '@/components/matchupCardSkeleton';
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { weekAtom } from "@/app/atoms/atom";

const MatchupCard = ({ team1, team2, withVsLink }: { team1: any, team2: any, withVsLink: boolean }) => {
    const [open, setOpen] = useState(false);
    const [openStats, setOpenStats] = useState(false);
    const [teamOneStats, setTeamOneStats] = useState<any | null>(null);
    const [teamTwoStats, setTeamTwoStats] = useState<any | null>(null);
    const [drawerTeam, setDrawerTeam] = useState<any | null>(null);
    const [weekIndex] = useAtom(weekAtom);
    const router = useRouter();
    // ... existing code ...

    if (!team1 || !team2 || !team1.user || !team2.user) {
        return <MatchupCardSkeleton />
    }

    const getResult = (score1: number, score2: number) => {
        if (score1 > score2) return <FaTrophy className='text-amber-400' />;
        if (score1 < score2) return;
        return null;
    };

    const handleOpenDrawer = (team: any) => {
        setOpen(true);
        setDrawerTeam(team);
    }

    const handleOpenStatsDrawer = () => {
        setTeamOneStats(team1);
        setTeamTwoStats(team2);
        router.push(`/${team1.league_id}/${weekIndex}/${team1.matchup_id}`);
    }

    return (
        <>
            <div className="flex justify-evenly">
                <div className="w-full flex items-center justify-between bg-white rounded-lg p-2 sm:p-4 my-2 text-black ring-1 ring-gray-200">
                    <div className="sm:w-[40%] w-[45%]">
                        <div className="sm:flex items-center">
                            <Avatar className='mr-4 cursor-pointer'>
                                <AvatarImage src={`https://sleepercdn.com/avatars/thumbs/${team1.user.avatar}`} alt={`${team1.user.metadata.team_name} avatar`} />
                                <AvatarFallback>{team1.user.display_name.charAt(0).toUpperCase() || ""}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col mr-4">
                                <span className="text-xs sm:text-sm text-gray-400 truncate">@{team1.user.display_name}</span>
                                <span className="font-bold text-sm sm:text-lg truncate">{team1.user.metadata.team_name || team1.user.display_name}</span>
                                <span className="inline-flex items-center text-sm text-gray-400 truncate">{team1.points} &nbsp; {getResult(team1.points, team2.points)}</span>
                            </div>
                            <span className="text-xl font-bold">{team1.score}</span>
                        </div>
                    </div>
                    <div className='sm:w-[5%] w-[10%]'>
                        {withVsLink ? <Button variant={"link"} onClick={handleOpenStatsDrawer}>VS</Button>
                            : <h1 className='text-center pl-1'>VS</h1>}
                    </div>
                    <div className="sm:w-[40%] w-[45%]">
                        <div className="flex flex-col-reverse sm:flex-row justify-end">
                            <span className="text-xl font-bold">{team2.score}</span>
                            <div className="flex flex-col ml-4 mr-4">
                                <span className="text-xs sm:text-sm text-gray-400 text-right truncate">@{team2.user.display_name}</span>
                                <span className="font-bold text-sm sm:text-lg truncate text-right">{team2.user.metadata.team_name || team2.user.display_name}</span>
                                <span className="inline-flex items-center justify-end text-sm text-gray-400 text-right truncate">{team2.points} &nbsp; {getResult(team2.points, team1.points)}</span>
                            </div>
                            <Avatar className='mr-4 sm:self-center self-end cursor-pointer'>
                                <AvatarImage src={`https://sleepercdn.com/avatars/thumbs/${team2.user.avatar}`} alt={`${team2.user.metadata.team_name} avatar`} />
                                <AvatarFallback>{team2.user.display_name.charAt(0).toUpperCase() || ""}</AvatarFallback>
                            </Avatar>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MatchupCard;
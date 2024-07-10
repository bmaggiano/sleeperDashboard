"use client"

import React from 'react';
import { FaTrophy } from "react-icons/fa6";


const MatchupCard = ({ team1, team2 }: { team1: any, team2: any }) => {

    if (!team1 || !team2 || !team1.user || !team2.user) {
        return <div>Loading matchups...</div>;
    }

    const getResult = (score1: number, score2: number) => {
        if (score1 > score2) return <FaTrophy className='text-amber-400' />;
        if (score1 < score2) return;
        return null;
    };

    return (
        <div className="flex justify-evenly">
            <div className="w-full flex items-center justify-between bg-gray-800 rounded-lg p-2 sm:p-4 my-2 text-white">
                <div className="sm:w-[50%] w-[45%]">
                    <div className="sm:flex items-center">
                        <img src={`https://sleepercdn.com/avatars/thumbs/${team1.user.avatar}`} alt={`${team1.user.metadata.team_name} avatar`} className="w-12 h-12 rounded-full mr-4" />
                        <div className="flex flex-col mr-4">
                            <span className="text-xs sm:text-sm text-gray-400 truncate">@{team1.user.display_name}</span>
                            <span className="font-bold text-sm sm:text-lg truncate">{team1.user.metadata.team_name}</span>
                            <span className="inline-flex items-center text-sm text-gray-400 truncate">{team1.points} &nbsp; {getResult(team1.points, team2.points)}</span>
                        </div>
                        <span className="text-xl font-bold">{team1.score}</span>
                    </div>
                </div>
                <div className="text-xl font-bold sm:mx-6">VS</div>
                <div className="sm:w-[50%] w-[45%]">
                    <div className="flex flex-col-reverse sm:flex-row justify-end">
                        <span className="text-xl font-bold">{team2.score}</span>
                        <div className="flex flex-col ml-4 mr-4">
                            <span className="text-xs sm:text-sm text-gray-400 text-right truncate">@{team2.user.display_name}</span>
                            <span className="font-bold text-sm sm:text-lg truncate text-right">{team2.user.metadata.team_name}</span>
                            <span className="inline-flex items-center justify-end text-sm text-gray-400 text-right truncate">{team2.points} &nbsp; {getResult(team2.points, team1.points)}</span>
                        </div>
                        <img src={`https://sleepercdn.com/avatars/thumbs/${team2.user.avatar}`} alt={`${team2.user.metadata.team_name} avatar`} className="sm:self-center self-end w-12 h-12 rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MatchupCard;
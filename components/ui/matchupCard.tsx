"use client"

import React from 'react';

const MatchupCard = ({ team1, team2 }: { team1: any, team2: any }) => {

    if (!team1 || !team2 || !team1.user || !team2.user) {
        return <div>Loading matchups...</div>;
    }

    return (
        <div className="flex justify-evenly">
            <div className="w-full flex items-center justify-between bg-gray-800 rounded-lg p-4 my-2 text-white">
                <div className="w-[50%]">
                    <div className="flex items-center">
                        <img src={`https://sleepercdn.com/avatars/thumbs/${team1.user.avatar}`} alt={`${team1.user.metadata.team_name} avatar`} className="w-12 h-12 rounded-full mr-4" />
                        <div className="flex flex-col mr-4">
                            <span className="text-sm text-gray-400">@{team1.user.display_name}</span>
                            <span className="font-bold text-lg">{team1.user.metadata.team_name}</span>
                            <span className="text-sm text-gray-400">{team1.points}</span>
                        </div>
                        <span className="text-xl font-bold">{team1.score}</span>
                    </div>
                </div>
                <div className="text-xl font-bold mx-6">VS</div>
                <div className="w-[50%]">
                    <div className="flex justify-end">
                        <span className="text-xl font-bold">{team2.score}</span>
                        <div className="flex flex-col ml-4 mr-4">
                            <span className="text-sm text-gray-400 text-right">@{team2.user.display_name}</span>
                            <span className="font-bold text-lg">{team2.user.metadata.team_name}</span>
                            <span className="text-sm text-gray-400 text-right">{team2.points}</span>
                        </div>
                        <img src={`https://sleepercdn.com/avatars/thumbs/${team2.user.avatar}`} alt={`${team2.user.metadata.team_name} avatar`} className="w-12 h-12 rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MatchupCard;
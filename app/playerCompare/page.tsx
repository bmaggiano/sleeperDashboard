"use client";
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { experimental_useObject as useObject } from 'ai/react';
import FuzzySearch from "../fuzzySearch";
import { Button } from '@/components/ui/button';
import { z } from 'zod';
import { ffDataSchema } from '../api/db/schema';
import { AiOutlineSafety } from "react-icons/ai";
import { RiSkullLine } from "react-icons/ri";
import { GoVerified } from "react-icons/go";
import { MdNotes } from "react-icons/md";
import { IoStatsChart } from "react-icons/io5";
import { IoDiceOutline } from "react-icons/io5";
import { User, ArrowRightLeft } from 'lucide-react';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';

function PlayerProfileSkeleton({ playerIndex }: { playerIndex: number }) {
    return (
        <div className="w-full flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-2xl">
                <User size={32} />
            </div>
            <div>
                <h3 className="text-xl font-semibold">Select Player {playerIndex}</h3>
                <p className="text-gray-500">Search for a player</p>
            </div>
        </div>
    )
}

function PlayerProfile({ player }: { player: any }) {
    return (
        <div className="w-full flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-2xl">
                <Image src={`https://a.espncdn.com/i/headshots/nfl/players/full/${player.espn_id}.png`} height={50} width={50} alt={player.full_name} />
            </div>
            <div>
                <h3 className="text-xl font-semibold">{player.full_name}</h3>
                <p className="text-gray-500">{player.position} - {player.team}</p>
            </div>
        </div>
    );
}

export default function PlayerCompare() {
    const [selectedPlayer1, setSelectedPlayer1] = useState<any>(null);
    const [selectedPlayer2, setSelectedPlayer2] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const { object, submit } = useObject({
        api: `/api/db`,
        schema: ffDataSchema,
    });

    const handlePlayerSelect = (player: any, playerIndex: number) => {
        if (playerIndex === 1) {
            setSelectedPlayer1(player);
        } else {
            setSelectedPlayer2(player);
        }
    };

    useEffect(() => {
        console.log(selectedPlayer1, selectedPlayer2);
    }, [selectedPlayer1, selectedPlayer2]);

    return (
        <div className="flex flex-col gap-4 mt-4">
            <div className='flex items-center justify-between'>

                <h1 className="text-2xl my-2 font-bold">Player Compare</h1>
                {selectedPlayer1 && selectedPlayer2 && (
                    <Button
                        variant={"outline"}
                        className='flex self-end rounded-md'
                        disabled={loading}
                        onClick={async () => {
                            setLoading(true);
                            try {
                                await submit({ playerId1: selectedPlayer1.player_id, playerId2: selectedPlayer2.player_id });
                            } catch (error) {
                                console.error("An error occurred during submission:", error);
                            } finally {
                                setLoading(false);
                            }
                        }}
                    >
                        {loading ?
                            <div className='flex items-center gap-x-2'>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Analyzing...
                            </div> :
                            <div className='flex items-center gap-x-2'>
                                <ArrowRightLeft className='h-4 w-4' />
                                <p>Compare Players</p>
                            </div>
                        }
                    </Button>
                )}
            </div>
            <div className="flex flex-col sm:flex-row justify-center items-start flex-row gap-2 sm:space-y-0 space-y-4">
                <div className='w-full sm:w-1/2 ring-1 ring-gray-200 p-4 rounded-md'>
                    {selectedPlayer1 ? (
                        <PlayerProfile player={selectedPlayer1} />
                    ) :
                        <PlayerProfileSkeleton playerIndex={1} />
                    }
                    <FuzzySearch onPlayerSelect={(player) => handlePlayerSelect(player, 1)} />
                </div>
                <div className='w-full sm:w-1/2 ring-1 ring-gray-200 p-4 rounded-md'>
                    {selectedPlayer2 ? (
                        <PlayerProfile player={selectedPlayer2} />
                    ) :
                        <PlayerProfileSkeleton playerIndex={2} />
                    }
                    <FuzzySearch onPlayerSelect={(player) => handlePlayerSelect(player, 2)} />
                </div>
            </div>
            {object && (
                <Tabs defaultValue="analysis" className="w-full">
                    <TabsList>
                        <TabsTrigger className='flex items-center gap-x-1' value="analysis"><MdNotes /> Analysis</TabsTrigger>
                        <TabsTrigger className='flex items-center gap-x-1' value="picks"><GoVerified /> Picks</TabsTrigger>
                        <TabsTrigger className='flex items-center gap-x-1' value="stats"><IoStatsChart /> Stats</TabsTrigger>
                    </TabsList>

                    {/* Analysis Tab */}
                    <TabsContent className='ring-1 ring-gray-200 p-4' value="analysis">
                        {object?.analysis?.map((data, index) => (
                            <div key={index} className='space-y-2'>
                                <strong className='flex items-center gap-x-2 text-lg'><MdNotes className='text-gray-500' /> Analysis</strong>
                                <p>{data?.explanation}</p>
                            </div>
                        ))}
                    </TabsContent>

                    <TabsContent className='' value="picks">
                        {object?.analysis?.map((data, index) => (
                            <div key={index} className='space-y-2'>
                                <div className='bg-green-50 p-4 rounded-md'>
                                    <strong className='flex items-center gap-x-2 text-lg'><AiOutlineSafety className='text-green-400' /> Safe pick</strong>
                                    <p>{data?.safe_pick}</p>
                                </div>
                                <div className='bg-red-50 p-4 rounded-md'>
                                    <strong className='flex items-center gap-x-2 text-lg'><IoDiceOutline className='text-red-400' /> Risky pick</strong>
                                    <p>{data?.risky_pick}</p>
                                </div>
                                {data?.undecided ? (
                                    <div className='bg-yellow-50 p-4 rounded-md'>
                                        <strong className='flex items-center gap-x-2 text-lg'><IoDiceOutline className='text-yellow-400' /> Toss-up</strong>
                                        <p>{data?.undecided}</p>
                                    </div>
                                ) : (
                                    <div className='bg-blue-50 p-4 rounded-md'>
                                        <strong className='flex items-center gap-x-2 text-lg'><GoVerified className='text-blue-400' /> Recommended pick</strong>
                                        <p>{data?.recommended_pick}</p>
                                        {data?.certainty && <p>Certainty: {data?.certainty}%</p>}
                                    </div>
                                )}
                            </div>
                        ))}
                    </TabsContent>
                    <TabsContent className='ring-1 ring-gray-200 p-4' value="stats">
                        <div className='space-y-2'>
                            <strong className='flex items-center gap-x-2 text-lg'><IoStatsChart className='text-gray-500' /> Stats</strong>
                            <p>Player stats are currently in development. Please check back later for access to every play, from every player all the way back to 1999!</p>
                        </div>

                    </TabsContent>
                </Tabs >
            )
            }
        </div >
    );
}
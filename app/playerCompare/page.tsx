"use client";
import React, { useState } from 'react';
import { experimental_useObject as useObject } from 'ai/react';
import FuzzySearch from "../fuzzySearch";
import { Button } from '@/components/ui/button';
import { ffDataSchema } from '../api/db/schema';
import { MdNotes } from "react-icons/md";
import { IoDiceOutline } from "react-icons/io5";
import { User, ArrowRightLeft } from 'lucide-react';
import Image from 'next/image';
import { Loader2, Shield, Sparkles } from 'lucide-react';
import StatsGraph from './graph';
import { CircleCheckBig } from 'lucide-react';
import { YearByYear } from './yearByYear';
import CompareTable from './compareTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Recommended from './recommended';

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
    );
}

function RenderStats({ data, playerNum }: { data: any, playerNum: number }) {
    const stats = [];
    // Base stats that apply to all players
    if ((data?.playerOnePosition === "WR" || data?.playerTwoPosition === "WR") || (data?.playerOnePosition === "TE" || data?.playerTwoPosition === "TE")) {
        stats.push(
            { label: 'Receptions', value: playerNum === 1 ? data?.playerOneStats?.nflverse_play_by_play_2023?.receptions : data?.playerTwoStats?.nflverse_play_by_play_2023?.receptions },
            { label: 'Receiving Yards', value: playerNum === 1 ? data?.playerOneStats?.nflverse_play_by_play_2023?.recYards : data?.playerTwoStats?.nflverse_play_by_play_2023?.recYards },
            { label: 'Rushing Yards', value: playerNum === 1 ? data?.playerOneStats?.nflverse_play_by_play_2023?.rushYards : data?.playerTwoStats?.nflverse_play_by_play_2023?.rushYards },
            { label: 'Yards per Reception', value: playerNum === 1 ? data?.playerOneStats?.nflverse_play_by_play_2023?.yardsPerReception : data?.playerTwoStats?.nflverse_play_by_play_2023?.yardsPerReception },
            { label: 'Yards After Catch', value: playerNum === 1 ? data?.playerOneStats?.nflverse_play_by_play_2023?.yardsAfterCatch : data?.playerTwoStats?.nflverse_play_by_play_2023?.yardsAfterCatch },
            { label: 'Air Yards', value: playerNum === 1 ? data?.playerOneStats?.nflverse_play_by_play_2023?.airYards : data?.playerTwoStats?.nflverse_play_by_play_2023?.airYards },
            { label: 'Longest Play', value: playerNum === 1 ? data?.longestPlayOne : data?.longestPlayTwo },
            { label: 'Touchdowns', value: playerNum === 1 ? data?.playerOneStats?.nflverse_play_by_play_2023?.touchdowns : data?.playerTwoStats?.nflverse_play_by_play_2023?.touchdowns },
        );
    }
    if (data?.playerOnePosition === 'RB' || data?.playerTwoPosition === 'RB') {
        stats.push(
            { label: 'Receptions', value: playerNum === 1 ? data?.playerOneStats?.nflverse_play_by_play_2023?.receptions : data?.playerTwoStats?.nflverse_play_by_play_2023?.receptions },
            { label: 'Receiving Yards', value: playerNum === 1 ? data?.playerOneStats?.nflverse_play_by_play_2023?.recYards : data?.playerTwoStats?.nflverse_play_by_play_2023?.recYards },
            { label: 'Rushing Yards', value: playerNum === 1 ? data?.playerOneStats?.nflverse_play_by_play_2023?.rushYards : data?.playerTwoStats?.nflverse_play_by_play_2023?.rushYards },
            { label: 'Yards per Reception', value: playerNum === 1 ? data?.playerOneStats?.nflverse_play_by_play_2023?.yardsPerReception : data?.playerTwoStats?.nflverse_play_by_play_2023?.yardsPerReception },
            { label: 'Longest Play', value: playerNum === 1 ? data?.longestPlayOne : data?.longestPlayTwo },
            { label: 'Touchdowns', value: playerNum === 1 ? data?.playerOneStats?.nflverse_play_by_play_2023?.touchdowns : data?.playerTwoStats?.nflverse_play_by_play_2023?.touchdowns },
        )
    }
    // Conditionally add QB stats if the player is a QB
    if (data?.playerOnePosition === 'QB' || data?.playerTwoPosition === 'QB') {
        stats.push(
            { label: 'Pass Completions', value: playerNum === 1 ? data?.playerOneStats?.nflverse_play_by_play_2023?.passCompletion : data?.playerTwoStats?.nflverse_play_by_play_2023?.passCompletion },
            { label: 'Pass Attempts', value: playerNum === 1 ? data?.playerOneStats?.nflverse_play_by_play_2023?.passAttempt : data?.playerTwoStats?.nflverse_play_by_play_2023?.passAttempt },
            { label: 'Pass Yards', value: playerNum === 1 ? data?.playerOneStats?.nflverse_play_by_play_2023?.passYards : data?.playerTwoStats?.nflverse_play_by_play_2023?.passYards },
            { label: 'Interceptions', value: playerNum === 1 ? data?.playerOneStats?.nflverse_play_by_play_2023?.interceptions : data?.playerTwoStats?.nflverse_play_by_play_2023?.interceptions },
            { label: 'Pass Touchdowns', value: playerNum === 1 ? data?.playerOneStats?.nflverse_play_by_play_2023?.passTouchdowns : data?.playerTwoStats?.nflverse_play_by_play_2023?.passTouchdowns },
            { label: 'Rush Touchdowns', value: playerNum === 1 ? data?.playerOneStats?.nflverse_play_by_play_2023?.touchdowns : data?.playerTwoStats?.nflverse_play_by_play_2023?.touchdowns }
        );
    }

    return (
        <div className="grid grid-cols-2 gap-4 mt-4">
            {stats.map((stat, index) => (
                <div key={index} className='ring-1 ring-gray-200 p-2 rounded-md'>
                    <p className='text-gray-500'>{stat.label}</p>
                    <strong className='text-xl'>{stat.value}</strong>
                </div>
            ))}
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

    return (
        <div className="flex flex-col gap-4 mt-4">
            <div className='flex items-center justify-between'>
                <h1 className="text-lg my-2 font-bold">Player Compare</h1>
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
                <div className='flex flex-col w-full sm:w-1/2'>
                    <div className='ring-1 ring-gray-200 p-4 rounded-md'>
                        {selectedPlayer1 ? (
                            <PlayerProfile player={selectedPlayer1} />
                        ) : (
                            <PlayerProfileSkeleton playerIndex={1} />
                        )}
                        <FuzzySearch onPlayerSelect={(player) => handlePlayerSelect(player, 1)} />
                    </div>
                    {/* {object?.analysis && <RenderStats data={object.analysis[0]} playerNum={1} />} */}
                </div>
                <div className='flex flex-col w-full sm:w-1/2'>
                    <div className='ring-1 ring-gray-200 p-4 rounded-md'>
                        {selectedPlayer2 ? (
                            <PlayerProfile player={selectedPlayer2} />
                        ) : (
                            <PlayerProfileSkeleton playerIndex={2} />
                        )}
                        <FuzzySearch onPlayerSelect={(player) => handlePlayerSelect(player, 2)} />
                    </div>

                    {/* {object?.analysis && <RenderStats data={object.analysis[0]} playerNum={2} />} */}
                </div>
            </div>
            {object?.analysis?.map((data, index) => (
                <CompareTable key={index} data={data} />
            ))}
            {object?.analysis && (
                <YearByYear key={0} stats={object?.analysis as any} />
            )}
            <div>
                {object?.analysis?.map((data, index) => (
                    <Card key={index} className='flex flex-col'>
                        <CardHeader className='border-b p-6'>
                            <CardTitle className='flex items-center justify-between text-lg'>
                                AI Analysis <MdNotes className='h-5 w-5' />
                            </CardTitle>
                        </CardHeader>
                        <CardContent className='p-6'>
                            <p>{data?.explanation}</p>
                        </CardContent>

                    </Card>
                ))}
            </div>
            {/* <Recommended /> */}
            {object?.analysis?.map((data, index) => (
                <div key={index}>
                    {data?.undecided ? (
                        <Card className='flex flex-col items-center'>
                            <CardHeader>
                                <CardTitle>
                                    <IoDiceOutline /> Toss-up
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {data?.undecided}
                            </CardContent>
                        </Card>
                    ) : (
                        <Card>
                            <CardHeader className='overflow-hidden rounded-t-md bg-green-50'>
                                <CardTitle className='flex items-center justify-between text-black text-lg gap-x-2'>
                                    Recommended pick <Sparkles className='h-5 w-5' />
                                </CardTitle>
                            </CardHeader>
                            <CardContent className='p-6'>
                                <p className='text-lg font-semibold mb-2'>
                                    {data?.recommended_pick}
                                    <span className='ml-2 font-normal text-gray-500'>
                                        {data?.recommended_pick === data?.playerOneName ? `${data?.playerOnePosition}` : `${data?.playerTwoPosition}`} -&nbsp;
                                        {data?.recommended_pick === data?.playerOneName ? `${data?.playerOneTeam}` : `${data?.playerTwoTeam}`}
                                    </span>
                                </p>
                                <p className='flex items-center text-base text-gray-500'>
                                    <CircleCheckBig className='h-4 w-4 mr-2' />{data?.certainty && <p>Certainty: {data?.certainty}%</p>}
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            ))}
        </div>
    );
}
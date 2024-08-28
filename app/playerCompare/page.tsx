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
import { CircleCheckBig, TrendingUp } from 'lucide-react';
import { YearByYear } from './yearByYear';
import CompareTable from './compareTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

function RenderKeyStats({ data, player }: { data: any, player: any }) {
    const recommendedStats = data?.recommended_pick === data?.playerOneName
        ? data?.playerOneStats?.nflverse_play_by_play_2023
        : data?.playerTwoStats?.nflverse_play_by_play_2023;

    if ((data?.playerOnePosition === "WR" || data?.playerTwoPosition === "WR") ||
        (data?.playerOnePosition === "TE" || data?.playerTwoPosition === "TE") ||
        (data?.playerOnePosition === "RB" || data?.playerTwoPosition === "RB")) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <p className='inline-flex items-center gap-2'><TrendingUp className='h-4 w-4' />Receptions: {recommendedStats?.receptions}</p>
                <p className='inline-flex items-center gap-2'><TrendingUp className='h-4 w-4' />Receiving Yards: {recommendedStats?.recYards}</p>
                <p className='inline-flex items-center gap-2'><TrendingUp className='h-4 w-4' />Rushing Yards: {recommendedStats?.rushYards}</p>
                <p className='inline-flex items-center gap-2'><TrendingUp className='h-4 w-4' />Touchdowns: {recommendedStats?.touchdowns}</p>
            </div>
        );
    }
    if (data?.playerOnePosition === 'QB' || data?.playerTwoPosition === 'QB') {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <p className='inline-flex items-center gap-2'><TrendingUp className='h-4 w-4' />Pass Completions: {recommendedStats?.passCompletion}</p>
                <p className='inline-flex items-center gap-2'><TrendingUp className='h-4 w-4' />Pass Yards: {recommendedStats?.passYards}</p>
                <p className='inline-flex items-center gap-2'><TrendingUp className='h-4 w-4' />Pass Touchdowns: {recommendedStats?.passTouchdowns}</p>
                <p className='inline-flex items-center gap-2'><TrendingUp className='h-4 w-4' />Rush Touchdowns: {recommendedStats?.touchdowns}</p>
            </div>
        );
    }
};

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
                                Analysis <MdNotes className='h-5 w-5' />
                            </CardTitle>
                        </CardHeader>
                        <CardContent className='p-6'>
                            <p>{data?.explanation}</p>
                        </CardContent>

                    </Card>
                ))}
            </div>
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
                                <p className='flex items-center text-base text-gray-500 mb-2'>
                                    <CircleCheckBig className='h-4 w-4 mr-2' />{data?.certainty && <p>Certainty: {data?.certainty}%</p>}
                                </p>
                                <div>
                                    <p className='pt-2 pb-1 font-semibold'>Key Stats (2023):</p>
                                    <RenderKeyStats data={data} player={data?.recommended_pick === data?.playerOneName ? data?.playerOneStats : data?.playerTwoStats} />
                                </div>

                            </CardContent>
                        </Card>
                    )}
                </div>
            ))}
        </div>
    );
}
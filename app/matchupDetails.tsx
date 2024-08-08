"use client"
import playerIds from "@/app/json/playerIds.json";
import { useAtom } from "jotai";
import { weekNumberAtom } from "./atoms/atom";
import { Player, PlayerMatchupCardsProps, MatchupDetailProps } from "@/lib/definitions";
import MatchupCard from "@/components/ui/matchupCard";
import { Separator } from "@/components/ui/separator";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import MatchupCardSkeleton from "@/components/ui/matchupCardSkeleton";

const getPlayerInfo = (playerId: string): Player => {
    return (playerIds as { [key: string]: Player })[playerId] || { full_name: 'Unknown Player', position: null, team: null };
}

function PlayerMatchupCards({ teamOne, teamTwo }: PlayerMatchupCardsProps) {
    if (!teamOne.starters || !teamTwo.starters) return <MatchupCardSkeleton />;

    return (
        <div className="flex flex-col space-y-1">
            {teamOne.starters.map((starter, index) => (
                <div key={index} className="text-xs sm:text-sm flex justify-evenly items-center rounded-md p-2">
                    <div className="px-2 flex-1 flex flex-row justify-center items-center">
                        <div className="w-full  justify-between flex flex-col">
                            <p className="font-semibold hidden sm:block">{getPlayerInfo(starter).full_name} </p>
                            <p className="font-semibold sm:hidden">
                                {getPlayerInfo(starter).first_name?.charAt(0)}. {getPlayerInfo(starter).last_name}
                            </p>
                            <p className=" text-gray-500">{getPlayerInfo(starter).team}</p>
                        </div>
                        <p className="pr-4 font-semibold">{teamOne.starters_points![index]}</p>
                    </div>
                    <div className="flex-initial flex justify-center items-center">
                        <h1 className="">{getPlayerInfo(starter).position}</h1>
                    </div>
                    <div className="flex-1 flex flex-row justify-center items-center px-2">
                        {teamTwo.starters && (
                            <>
                                <p className="pl-4 font-semibold">{teamTwo.starters_points![index]}</p>
                                <div className="text-right  flex-row justify-between w-full items-center">
                                    <p className="font-semibold hidden sm:block">{getPlayerInfo(teamTwo.starters[index]).full_name} </p>
                                    <p className="font-semibold sm:hidden">
                                        {getPlayerInfo(teamTwo.starters[index]).first_name?.charAt(0)}.{" "}
                                        {getPlayerInfo(teamTwo.starters[index]).last_name}
                                    </p>
                                    <p className=" text-gray-500">{getPlayerInfo(teamTwo.starters[index]).team}</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

const MatchupDetails: React.FC<MatchupDetailProps> = ({ teamOne, teamTwo }) => {
    // Ensure hooks are called unconditionally at the top of the component

    // Early return logic
    if (!teamOne || !teamTwo) return null;
    if (!teamOne.starters || !teamTwo.starters) return null;

    return (
        <div className="max-h-screen flex flex-col">
            <div className="px-2 pb-1 flex-1">
                <div className="mx-auto w-full max-w-3xl">

                    <MatchupCard team1={teamOne} team2={teamTwo} withVsLink={false} />
                    <PlayerMatchupCards teamOne={teamOne} teamTwo={teamTwo} />
                </div>
            </div>
        </div>
    );
};

export default MatchupDetails;
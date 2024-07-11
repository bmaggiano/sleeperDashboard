import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import playerIds from "@/app/json/playerIds.json";
import { useEffect } from "react";
import { useAtom } from "jotai";
import { weekAtom } from "./atoms/atom";
import MatchupCard from "@/components/ui/matchupCard";

const getPlayerInfo = (playerId: string): Player => {
    return (playerIds as { [key: string]: Player })[playerId] || { full_name: 'Unknown Player', position: null, team: null };
}

interface PlayerMatchupCardsProps {
    teamOne: Team;
    teamTwo: Team;
}

function PlayerMatchupCards({ teamOne, teamTwo }: PlayerMatchupCardsProps) {
    if (!teamOne.starters || !teamTwo.starters) return null;

    return (
        <div className="flex flex-col space-y-1">
            {teamOne.starters.map((starter, index) => (
                <div key={index} className="flex justify-evenly items-center ring-1 ring-gray-200 rounded-md p-2">
                    <div className="flex-1 flex flex-col justify-center items-start sm:items-center">
                        <h1 className="text-xs sm:text-sm">{getPlayerInfo(starter).full_name}: {teamOne.starters_points![index]}</h1>
                        <span className="text-xs sm:text-sm text-gray-500">{getPlayerInfo(starter).team}</span>
                    </div>
                    <div className="flex-initial flex justify-center items-center">
                        <h1 className="text-xs sm:text-sm">{getPlayerInfo(starter).position}</h1>
                    </div>
                    <div className="flex-1 flex flex-col justify-center items-end sm:items-center">
                        {teamTwo.starters && (
                            <>
                                <h1 className="text-xs sm:text-sm">{getPlayerInfo(teamTwo.starters[index]).full_name}: {teamTwo.starters_points![index]}</h1>
                                <span className="text-xs sm:text-sm text-gray-500">{getPlayerInfo(teamTwo.starters[index]).team}</span>
                            </>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}

interface Player {
    full_name: string | null;
    position: string | null;
    team: string | null;
}

interface Team {
    user: {
        display_name: string | null;
    };
    starters: string[] | null;
    starters_points: number[] | null;
}

interface UserRecordDrawerProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    teamOne: Team | null;
    teamTwo: Team | null;
}

const UserRecordDrawer: React.FC<UserRecordDrawerProps> = ({ open, setOpen, teamOne, teamTwo }) => {
    const [week] = useAtom(weekAtom);
    if (!teamOne || !teamTwo) return null;
    if (!teamOne.starters || !teamTwo.starters) return null;

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerContent className="max-h-screen flex flex-col">
                <div className="flex-1 overflow-y-auto">
                    <div className="mx-auto w-full max-w-3xl">
                        <DrawerHeader className="flex">
                            <DrawerTitle>
                                Matchup Stats - Week {week}
                            </DrawerTitle>
                        </DrawerHeader>

                        <MatchupCard team1={teamOne} team2={teamTwo} withVsLink={false} />
                        <PlayerMatchupCards teamOne={teamOne} teamTwo={teamTwo} />
                    </div>
                </div>
                <DrawerFooter className="max-w-3xl flex justify-center mx-auto w-full">
                    <DrawerClose asChild>
                        <Button className="w-full">Close</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

export default UserRecordDrawer;
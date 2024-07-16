import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import playerIds from "@/app/json/playerIds.json";
import { useAtom } from "jotai";
import { weekAtom } from "./atoms/atom";
import { Player, PlayerMatchupCardsProps, UserRecordDrawerProps } from "@/lib/definitions";
import MatchupCard from "@/components/ui/matchupCard";

const getPlayerInfo = (playerId: string): Player => {
    return (playerIds as { [key: string]: Player })[playerId] || { full_name: 'Unknown Player', position: null, team: null };
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

const UserRecordDrawer: React.FC<UserRecordDrawerProps> = ({ open, setOpen, teamOne, teamTwo }) => {
    const [week] = useAtom(weekAtom);
    if (!teamOne || !teamTwo) return null;
    if (!teamOne.starters || !teamTwo.starters) return null;

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerContent className="max-h-screen flex flex-col">
                <div className="px-2 pb-1 flex-1 overflow-y-auto">
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
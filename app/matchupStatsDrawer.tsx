import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import playerIds from "@/app/json/playerIds.json";

interface Player {
    full_name: string;
}

interface Team {
    starters: string[];
    starters_points: number[];
}

interface UserRecordDrawerProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    teamOne: Team | null;
    teamTwo: Team | null;
}

const UserRecordDrawer: React.FC<UserRecordDrawerProps> = ({ open, setOpen, teamOne, teamTwo }) => {
    if (!teamOne || !teamTwo) return null;
    const getPlayerInfo = (playerId: string): Player => {
        return (playerIds as { [key: string]: Player })[playerId] || { full_name: 'Unknown Player' };
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerContent>
                <div className="mx-auto w-full max-w-7xl">
                    <DrawerHeader className="flex">
                        <DrawerTitle>
                            Matchup Stats
                        </DrawerTitle>
                    </DrawerHeader>
                    <div className="flex justify-evenly">
                        <div>
                            <h1>Team One</h1>
                            {teamOne.starters.map((starter, index) => (
                                <h1 key={index}>{getPlayerInfo(starter).full_name}: {teamOne.starters_points[index]}</h1>
                            ))}
                        </div>
                        <div>
                            <h1>Team Two</h1>
                            {teamTwo.starters.map((starter, index) => (
                                <h1 key={index}>{getPlayerInfo(starter).full_name}: {teamTwo.starters_points[index]}</h1>
                            ))}
                        </div>
                    </div>
                    <DrawerFooter>
                        <DrawerClose asChild>
                            <Button>Close</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    )
}

export default UserRecordDrawer;
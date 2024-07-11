import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";

export default function UserRecordDrawer({ open, setOpen, drawerTeam }: { open: boolean, setOpen: (open: boolean) => void, drawerTeam: any }) {
    if (!drawerTeam) return null;

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader className="flex">
                        <Avatar>
                            <AvatarImage src={`https://sleepercdn.com/avatars/thumbs/${drawerTeam.user.avatar}`} alt={`${drawerTeam.user.metadata.team_name} avatar`} />
                            <AvatarFallback>{drawerTeam.user.display_name.charAt(0).toUpperCase() || ""}</AvatarFallback>
                        </Avatar>
                        <div>
                            <DrawerTitle>
                                {drawerTeam.user.metadata.team_name}
                            </DrawerTitle>
                            <DrawerDescription className="text-left">@{drawerTeam.user.display_name}</DrawerDescription>
                            <DrawerDescription>Record: {drawerTeam.settings.wins} - {drawerTeam.settings.losses} - {drawerTeam.settings.ties}</DrawerDescription>
                            <DrawerDescription>PF: {drawerTeam.settings.fpts}</DrawerDescription>
                            <DrawerDescription>PA: {drawerTeam.settings.fpts_against}</DrawerDescription>
                        </div>
                    </DrawerHeader>

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
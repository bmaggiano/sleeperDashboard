import playerIds from "@/app/json/playerIds.json";
import { useAtom } from "jotai";
import { weekNumberAtom } from "./atoms/atom";
import { Player, PlayerMatchupCardsProps, UserRecordDrawerProps } from "@/lib/definitions";
import MatchupCard from "@/components/ui/matchupCard";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Link from "next/link";

const getPlayerInfo = (playerId: string): Player => {
    return (playerIds as { [key: string]: Player })[playerId] || { full_name: 'Unknown Player', position: null, team: null };
}

function PlayerMatchupCards({ teamOne, teamTwo }: PlayerMatchupCardsProps) {
    if (!teamOne.starters || !teamTwo.starters) return null;

    return (
        <div className="flex flex-col space-y-1">
            {teamOne.starters.map((starter, index) => (
                <div key={index} className="flex justify-evenly items-center ring-1 ring-gray-200 rounded-md p-2">
                    <div className="px-2 flex-1 flex flex-col justify-center items-start">
                        <div className="w-full text-xs sm:text-sm justify-between flex">
                            <p className="hidden sm:block">{getPlayerInfo(starter).full_name} </p>
                            <p className="sm:hidden">{getPlayerInfo(starter).first_name?.charAt(0)}. {getPlayerInfo(starter).last_name}</p>
                            <p className="pr-4 font-medium">{teamOne.starters_points![index]}</p>
                        </div>
                        <Separator className="my-1 w-[95%]" />
                        <p className="text-xs sm:text-sm text-gray-500">{getPlayerInfo(starter).team}</p>
                    </div>
                    <div className="flex-initial flex justify-center items-center">
                        <h1 className="text-xs sm:text-sm">{getPlayerInfo(starter).position}</h1>
                    </div>
                    <div className="flex-1 flex flex-col justify-center items-end px-2">
                        {teamTwo.starters && (
                            <>
                                <div className="text-xs sm:text-sm flex justify-between w-full items-center">
                                    <p className="pl-4 font-medium">{teamTwo.starters_points![index]}</p>
                                    <p className="hidden sm:block">{getPlayerInfo(teamTwo.starters[index]).full_name} </p>
                                    <p className="sm:hidden">{getPlayerInfo(teamTwo.starters[index]).first_name?.charAt(0)}. {getPlayerInfo(teamTwo.starters[index]).last_name}</p>

                                </div>
                                <Separator className="my-1 w-[95%]" />
                                <p className="text-xs sm:text-sm text-gray-500">{getPlayerInfo(teamTwo.starters[index]).team}</p>
                            </>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}

const UserRecordDrawer: React.FC<UserRecordDrawerProps> = ({ teamOne, teamTwo }) => {
    const router = useRouter();
    const [week] = useAtom(weekNumberAtom);
    const handleBack = () => {
        router.back();
    }
    if (!teamOne || !teamTwo) return null;
    if (!teamOne.starters || !teamTwo.starters) return null;
    return (
        <div className="max-h-screen flex flex-col">
            <div className="px-2 pb-1 flex-1 ">
                <div className="mx-auto w-full max-w-3xl">
                    <div className="py-4">
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink>
                                        <Link href="/">Home</Link>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbLink onClick={handleBack}>
                                        <Link href="/components">Week {week}
                                        </Link>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Matchup Stats - Week {week}</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    <MatchupCard team1={teamOne} team2={teamTwo} withVsLink={false} />
                    <PlayerMatchupCards teamOne={teamOne} teamTwo={teamTwo} />
                </div>
            </div>

        </div>
    )
}

export default UserRecordDrawer;
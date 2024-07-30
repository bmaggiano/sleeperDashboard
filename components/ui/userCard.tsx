import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar"
import { FaTrophy } from "react-icons/fa";

export default function UserCard({ user, champion, width }: { user: any, champion?: any, width?: boolean }) {
    return (
        <div className={cn(
            "flex relative p-4 flex mx-auto flex-col items-center justify-center h-full ring-1 ring-gray-200 rounded-lg",
            width ? `w-1/2` : `w-full`,
        )}>
            {champion && (
                <p className="inline-flex items-center gap-x-4 text-amber-400 text-3xl relative">
                    <FaTrophy className="absolute -top-2 -left-[11.25rem] transform -translate-x-1/2 -translate-y-1/2 text-4xl bg-white p-1" />
                </p>
            )}
            <div className="flex flex-col justify-center w-full h-full">
                <div className="flex items-center">
                    <Avatar className="mr-4">
                        <AvatarImage src={user.user.metadata.avatar} />
                        <AvatarFallback>{user.user.display_name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-xl font-bold">{user.user.metadata.team_name || user.user.display_name}</p>
                        <p className="text-sm text-gray-400">@{user.user.display_name}</p>
                        <p className="text-sm text-gray-400"> {user.settings.wins} - {user.settings.losses}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
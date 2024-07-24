import { Avatar, AvatarFallback, AvatarImage } from "./avatar"
import { FaTrophy } from "react-icons/fa";

export default function UserCard({ user }: { user: any }) {
    return (
        <div className="relative p-4 flex mx-auto flex-col items-center justify-center sm:w-1/2 h-full ring-1 ring-gray-200 rounded-lg">
            <p className="inline-flex items-center gap-x-4 text-amber-400 text-3xl relative">
                <FaTrophy className="absolute -top-2 -left-[11.25rem] transform -translate-x-1/2 -translate-y-1/2 text-4xl bg-white p-1" />
            </p>
            <div className="flex flex-col items-center justify-center w-full h-full">
                <div className="flex items-center">
                    <Avatar className="mr-4">
                        <AvatarImage src={user.user.metadata.avatar} />
                        <AvatarFallback>{user.user.display_name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-xl font-bold">{user.user.metadata.team_name}</p>
                        <p className="text-sm text-gray-400">@{user.user.display_name}</p>
                    </div>
                </div>
                <div className="text-gray-400 mt-2 flex flex-row justify-between gap-x-4">
                    <p className="text-sm">Record: {user.settings.wins} - {user.settings.losses}</p>
                    <p className="text-sm">FPS: {user.settings.fpts}.{user.settings.fpts_decimal}</p>
                    <p className="text-sm">FPA: {user.settings.fpts_against}.{user.settings.fpts_against_decimal}</p>
                </div>
            </div>
        </div>
    );
}
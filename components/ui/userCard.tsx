import { Avatar, AvatarFallback, AvatarImage } from "./avatar"
import { FaTrophy } from "react-icons/fa";

export default function UserCard({ user }: { user: any }) {
    return (
        <div className="p-4 flex mx-auto flex-col items-center justify-center sm:w-1/2 h-full ring-1 ring-gray-200 rounded-lg">
            <p className="relative right-[11.25rem] bottom-4 text-amber-400 text-3xl"><FaTrophy /></p>
            <div className="flex flex-col items-center justify-center w-full h-full">
                <Avatar>
                    <AvatarImage src={user.user.metadata.avatar} />
                    <AvatarFallback>UI</AvatarFallback>
                </Avatar>
                <div className="text-center">
                    <p className="text-xl font-bold">{user.user.metadata.team_name}</p>
                    <p className="text-sm text-gray-400">@{user.user.display_name}</p>
                    <p className="text-sm">Record: {user.settings.wins} - {user.settings.losses}</p>
                    <p className="text-sm">FPS: {user.settings.fpts}.{user.settings.fpts_decimal}</p>
                    <p className="text-sm">FPA: {user.settings.fpts_against}.{user.settings.fpts_against_decimal}</p>
                </div>
            </div>
        </div>
    );
}
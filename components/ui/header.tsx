import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Button } from "./button";

export default function Header() {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-center py-2">
            <div className="flex">
                <Avatar>
                    <Link href="/">
                        <AvatarImage className="h-6 w-6" src="./logo.png" alt="Sleeper Fantasy Football Logo" />
                        <AvatarFallback>S</AvatarFallback>
                    </Link>
                </Avatar>
                <h1 className="font-medium text-2xl">Fantasy Football Dashboard</h1>
            </div>
        </div>
    )
}
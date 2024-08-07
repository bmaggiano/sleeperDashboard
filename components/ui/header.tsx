import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import Image from "next/image";
import { Button } from "./button";

export default function Header() {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="flex justify-center items-center gap-4">
                <Link className="font-medium text-xl p-4 flex space-x-2" href="/">
                    <h1>Stuart</h1>
                </Link>
            </div>
        </div>
    )
}
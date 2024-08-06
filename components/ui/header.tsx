import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import Image from "next/image";
import { Button } from "./button";

export default function Header() {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-center py-2">
            <div className="flex justify-center items-center gap-4">
                <Link className="flex items-center" href="/">
                    <h1 className="font-medium text-3xl">Stuart <span className="bg-black text-white rounded-md pl-[0.5rem] pr-[0.6rem]">AI</span></h1>
                </Link>
            </div>
        </div>
    )
}
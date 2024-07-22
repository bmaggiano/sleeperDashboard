"use client";

import { cn } from "@/lib/utils";
import Marquee from "@/components/magicui/marquee";
import { useRouter } from "next/navigation";

const leagues = [
    {
        name: "Wet-FF (Year 7)",
        description: "12 Team Half PPR",
        leagueId: "974399495632891904",
        body: "1QB, 2RB, 3WR, 1TE, 1WRT, 1K, 1DEF",
        img: "https://sleepercdn.com/avatars/thumbs/03c86c21e887fadf1b652885694af7cc",
    },
    {
        name: "League of Legends",
        description: "8 Team, 3 Man Keeper",
        leagueId: "992142653368156160",
        body: "1QB, 2RB, 2WR, 1TE, 1WRT, 1K, 1DEF",
        img: "https://sleepercdn.com/images/v2/icons/league/nfl/orange.png",
    },
    {
        name: "NHAT Remix 2",
        description: "10 Team Superflex",
        leagueId: "787735871108562944",
        body: "2QB, 2RB, 2WR, 1TE, 2WRT",
        img: "https://sleepercdn.com/avatars/thumbs/bfa3b179c17aa4264282a743e66218bf",
    },
    {
        name: "NHAT Dynasty BB",
        description: "12 Team Best Ball",
        leagueId: "934226736143806464",
        body: "1QB, 2RB, 2WR, 1TE, 3WRT",
        img: "https://sleepercdn.com/avatars/thumbs/03c86c21e887fadf1b652885694af7cc",
    },
    {
        name: "Fantasy Fudus ‘23",
        description: "12 Team Full PPR",
        leagueId: "990360731344293888",
        body: "1QB, 2RB, 2WR, 1TE, 1WRT, 1K, 1DEF",
        img: "https://sleepercdn.com/avatars/thumbs/42f817ab2dc95dd29634cd84553902ad",
    },
    {
        name: "TDP FF",
        description: "12 Team Superflex Half PPR",
        leagueId: "992179723217981440",
        body: "1QB, 2RB, 2WR, 1TE, 2WRT, 1K, 1DEF",
        img: "https://sleepercdn.com/avatars/thumbs/58f6c24fd240df16ed3d57054285b0ef",
    },
];

const firstRow = leagues.slice(0, leagues.length / 2);
const secondRow = leagues.slice(leagues.length / 2);

const ReviewCard = ({
    img,
    name,
    description,
    body,
    onClick,
}: {
    img: string;
    name: string;
    description: string;
    body: string;
    onClick: () => void;
}) => {
    return (
        <figure
            onClick={onClick}
            className={cn(
                "relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
                // light styles
                "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
                // dark styles
                "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
            )}
        >
            <div className="flex flex-row items-center gap-2">
                <img className="rounded-full" width="32" height="32" alt="" src={img} />
                <div className="flex flex-col">
                    <figcaption className="text-sm font-medium dark:text-white">
                        {name}
                    </figcaption>
                    <p className="text-xs font-medium text-gray-400">{description}</p>
                </div>
            </div>
            <blockquote className="mt-2 text-sm text-gray-400">{body}</blockquote>
        </figure>
    );
};

export default function LeaguesMarquee() {
    const router = useRouter();
    const handleClick = async (leagueId: string) => {
        router.push(`/${leagueId}`);
    };
    return (
        <div className="my-2 relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg">
            <Marquee pauseOnHover className="[--duration:20s]">
                {firstRow.map((review) => (
                    <ReviewCard onClick={() => handleClick(review.leagueId)} key={review.description} {...review} />
                ))}
            </Marquee>
            <Marquee reverse pauseOnHover className="[--duration:20s]">
                {secondRow.map((review) => (
                    <ReviewCard onClick={() => handleClick(review.leagueId)} key={review.description} {...review} />
                ))}
            </Marquee>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"></div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"></div>
        </div>
    );
}
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Fantasy Dashboard",
    description: "A Matchup between team 1 and team 2",
    openGraph: {
        images: [{
            url: `https://sleeper-dashboard.vercel.app/api/cards`,
            width: 1200,
            height: 630,
            alt: 'Fantasy Dashboard',
        }],
    },
};
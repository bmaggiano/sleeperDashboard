import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Fantasy Dashboard",
    description: "Your one-stop dashboard for all your Fantasy data.",
    openGraph: {
        images: [{
            url: `https://sleeper-dashboard.vercel.app/api/cards`,
            width: 1200,
            height: 630,
            alt: 'Fantasy Dashboard',
        }],
    },
};
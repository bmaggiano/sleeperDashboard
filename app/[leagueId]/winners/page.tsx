"use client";
import { useParams, useRouter } from "next/navigation";
import WinnersBracket from "./winnersServer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Link from "next/link";


export default function WinnersPageClient() {
    const { leagueId } = useParams();
    const router = useRouter()

    return (
        <div>
            <div className="flex items-center justify-between">
                <Breadcrumb className="py-4">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <Link href="/">Home</Link>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink className="cursor-pointer" onClick={() => router.back()}>Back
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <WinnersBracket leagueId={leagueId} />
        </div>
    );
}
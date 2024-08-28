import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StarIcon, TrendingUpIcon, CheckCircleIcon } from 'lucide-react'

export default function Component() {
    return (
        <Card className="w-full max-w-md border-2 border-black">
            <CardHeader className="bg-black text-white">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Recommended Pick</h2>
                    <StarIcon className="h-6 w-6" />
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-3xl font-bold">Josh Allen</h3>
                        <Badge variant="outline" className="text-lg px-3 py-1 border-black">
                            QB
                        </Badge>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                        <CheckCircleIcon className="h-5 w-5" />
                        <span className="text-lg">Certainty: 70%</span>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm font-semibold">Key Stats (2023):</p>
                        <ul className="grid grid-cols-2 gap-2 text-sm">
                            <li className="flex items-center space-x-2">
                                <TrendingUpIcon className="h-4 w-4" />
                                <span>Games: 17</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <TrendingUpIcon className="h-4 w-4" />
                                <span>Pass Yds: 4,306</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <TrendingUpIcon className="h-4 w-4" />
                                <span>Pass TDs: 29</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <TrendingUpIcon className="h-4 w-4" />
                                <span>Rush Yds: 524</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
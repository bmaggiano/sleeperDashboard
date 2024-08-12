"use client"
import { Button } from "@/components/ui/button"
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface WaitlistModalProps {
    onJoinWaitlist: () => void;
}

export default function WaitlistModal({ onJoinWaitlist }: WaitlistModalProps) {
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        localStorage.setItem("isOnWaitlist", "true");
        onJoinWaitlist();
    };
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Enter Waitlist</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Stuart AI Waitlist</DialogTitle>
                    <DialogDescription>
                        Stuart AI is currently in production. Join the waitlist to be notified when AI features are ready.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-2">
                    <Input
                        required={true}
                        type="email"
                        showArrowButton={false}
                        placeholder="Enter your email" />
                    <Button type="submit">Join Waitlist</Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}

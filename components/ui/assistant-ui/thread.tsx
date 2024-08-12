"use client";

import {
  ComposerPrimitive,
  MessagePrimitive,
  ThreadPrimitive,
} from "@assistant-ui/react";
import type { FC } from "react";
import { BotIcon, SendHorizontalIcon } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TooltipIconButton } from "@/components/ui/assistant-ui/tooltip-icon-button";
import { useEffect, useState } from "react";
import WaitlistModal from "./waitlistModal";
import Confetti from "react-dom-confetti";

export const Thread: FC = () => {
  const [isOnWaitlist, setIsOnWaitlist] = useState(false);
  const [isConfettiActive, setIsConfettiActive] = useState(false);

  useEffect(() => {
    const isOnWaitlist = localStorage.getItem("isOnWaitlist");
    setIsOnWaitlist(isOnWaitlist === "true");
  }, []);

  // This function will update the state when the user joins the waitlist
  const handleWaitlistJoin = () => {
    setIsOnWaitlist(true);
    setIsConfettiActive(true);
  };


  const config = {
    angle: 180,
    spread: 360,
    startVelocity: 40,
    elementCount: 200,
    dragFriction: 0.12,
    duration: 3000,
    stagger: 3,
    width: "10px",
    height: "10px",
    perspective: "500px",
    colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"]
  };

  return (
    <ThreadPrimitive.Root className="bg-background h-full">
      <Confetti active={isConfettiActive} config={config} />
      <ThreadPrimitive.Viewport className="flex h-full flex-col items-center overflow-y-scroll scroll-smooth bg-inherit px-4">
        {isOnWaitlist ? <PendingWelcome /> : <WaitlistWelcome confettiActive={isConfettiActive} onJoinWaitlist={handleWaitlistJoin} />}
        <ThreadPrimitive.Messages
          components={{
            UserMessage,
            AssistantMessage,
          }}
        />
        {/* {isOnWaitlist && (
          <div className="sticky bottom-0 mt-4 flex w-full max-w-2xl flex-grow flex-col items-center justify-end rounded-t-lg bg-inherit pb-4">
            <Composer />
          </div>
        )} */}
      </ThreadPrimitive.Viewport>
    </ThreadPrimitive.Root>
  );
};

const PendingWelcome: FC = () => {
  return (
    <ThreadPrimitive.Empty>
      <div className="flex flex-grow basis-full flex-col items-center justify-center space-y-3">
        <p className="text-xl font-bold">Stuart <span className="bg-black text-white rounded-md pl-[0.4rem] pr-[0.5rem]">AI</span></p>
        <p className="my-0 text-gray-500">You&apos;re on the waitlist.</p>
        <p className="my-0 text-gray-500">We&apos;ll notify you when AI features are ready.</p>
      </div>
    </ThreadPrimitive.Empty>
  );
};

const ThreadWelcome: FC = () => {
  return (
    <ThreadPrimitive.Empty>
      <div className="flex flex-grow basis-full flex-col items-center justify-center">
        <BotIcon className="h-12 w-12 text-gray-600" />
        <p className="mt-4 font-medium">How can I help you today?</p>
      </div>
    </ThreadPrimitive.Empty>
  );
};


const WaitlistWelcome: FC<{ onJoinWaitlist: () => void, confettiActive: boolean }> = ({ onJoinWaitlist, confettiActive }) => {
  return (
    <ThreadPrimitive.Empty>
      <div className="flex flex-grow basis-full flex-col items-center justify-center space-y-3">
        <p className="text-xl font-bold">Stuart <span className="bg-black text-white rounded-md pl-[0.4rem] pr-[0.5rem]">AI</span></p>
        <p className="my-0 text-gray-500">AI coming soon</p>
        <WaitlistModal onJoinWaitlist={onJoinWaitlist} />
      </div>
    </ThreadPrimitive.Empty>
  );
};

const Composer: FC = () => {
  return (
    <ComposerPrimitive.Root className="relative flex w-full items-end rounded-lg border transition-shadow focus-within:shadow-sm">
      <ComposerPrimitive.Input
        autoFocus
        placeholder="Write a message..."
        rows={1}
        className="placeholder:text-muted-foreground size-full max-h-40 resize-none bg-transparent p-4 pr-12 text-sm outline-none"
      />
      <ComposerPrimitive.Send asChild>
        <TooltipIconButton
          tooltip="Send"
          variant="default"
          className="absolute bottom-0 right-0 m-2.5 size-8 p-2 transition-opacity"
        >
          <SendHorizontalIcon />
        </TooltipIconButton>
      </ComposerPrimitive.Send>
    </ComposerPrimitive.Root>
  );
};

const UserMessage: FC = () => {
  return (
    <MessagePrimitive.Root className="grid w-full max-w-2xl auto-rows-auto grid-cols-[minmax(72px,1fr)_auto] gap-y-2 py-4">
      <div className="bg-muted text-foreground col-start-2 row-start-1 max-w-xl break-words rounded-3xl px-5 py-2.5">
        <MessagePrimitive.Content />
      </div>
    </MessagePrimitive.Root>
  );
};

const AssistantMessage: FC = () => {
  return (
    <MessagePrimitive.Root className="relative grid w-full max-w-2xl grid-cols-[auto_1fr] grid-rows-[auto_1fr] py-4">
      <Avatar className="col-start-1 row-span-full row-start-1 mr-4">
        <AvatarFallback>A</AvatarFallback>
      </Avatar>

      <div className="text-foreground col-start-2 row-start-1 my-1.5 max-w-xl break-words leading-7">
        <MessagePrimitive.Content />
      </div>
    </MessagePrimitive.Root>
  );
};

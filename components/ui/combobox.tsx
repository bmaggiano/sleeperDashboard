"use client";
import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { CommandList } from "cmdk";
import { useAtom } from "jotai";
import { weekStringAtom, weekNumberAtom } from "@/app/atoms/atom";
import { useRouter, usePathname } from "next/navigation";

export function Combobox({ data, leagueId }: { data: { index: number, week: string }[], leagueId: string }) {
    const router = useRouter();
    const pathname = usePathname();
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = useAtom(weekStringAtom);
    const [weekIndex, setWeekIndex] = useAtom(weekNumberAtom);

    React.useEffect(() => {
        const weekFromUrl = parseInt(pathname.split("/")[2], 10);
        if (!isNaN(weekFromUrl)) {
            const weekItem = data.find(item => item.index === weekFromUrl);
            if (weekItem) {
                setWeekIndex(weekFromUrl);
                setValue(weekItem.week);
            }
        }
    }, []);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                >
                    {value
                        ? data.find((item) => item.week === value)?.week
                        : "Select item..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandList>
                        <CommandInput placeholder="Search item..." />
                        <CommandEmpty>No item found.</CommandEmpty>
                        <CommandGroup>
                            {data.map((item) => (
                                <CommandItem
                                    key={item.index}
                                    value={item.week}
                                    onSelect={() => {
                                        setWeekIndex(item.index);
                                        setValue(item.week === value ? "" : item.week);
                                        router.push(`/${leagueId}/${item.index}`);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === item.week ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {item.week}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
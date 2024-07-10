"use client"
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { useEffect } from "react";
import Image from "next/image";
import { useAtom } from "jotai";
import { valueAtom } from "./atoms/atom";
import { getMatchups } from "./utils";
import Scoreboard from "@/app/scoreboard";

const weeks = Array.from({ length: 17 }, (_, i) => ({ index: i + 1, week: `Week ${i + 1}` }));

export default function Home() {
  const [value, setValue] = useAtom(valueAtom);

  return (
    <div>
      <Combobox data={weeks} />
      <h1>You're currently viewing matchups for week {value}</h1>
      <Scoreboard />
    </div>
  );
}
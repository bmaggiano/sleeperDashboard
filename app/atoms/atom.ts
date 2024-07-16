import { atom, useAtom } from 'jotai';

// wetff = 974399495632891904
// league of legends = 992142653368156160

export const valueAtom = atom<string>("Week 1");
export const weekAtom = atom<number>(1);
export const leagueAtom = atom("")
export const leagueNameAtom = atom("")
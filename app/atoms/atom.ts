import { atom } from 'jotai'

// wetff = 974399495632891904
// league of legends = 992142653368156160

export const weekStringAtom = atom<string>('Week 1')
export const weekNumberAtom = atom<number>(1)
export const leagueAtom = atom('')
export const leagueNameAtom = atom('')
export const remainingApiCallsAtom = atom<number | null>(null)


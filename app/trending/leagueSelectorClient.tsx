'use client'

import * as React from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import Link from 'next/link'

type League = {
  id: string
  leagueId: string
  name: string
}

export default function LeagueSelectorClient({
  leagues,
  currentLeauge,
}: {
  leagues: League[]
  currentLeauge: string
}) {
  const [open, setOpen] = React.useState(false)
  const [selectedLeague, setSelectedLeague] = React.useState<League | null>(
    null
  )

  React.useEffect(() => {
    if (leagues && leagues.length > 0) {
      setSelectedLeague(
        leagues.find((league) => league.id === currentLeauge) || null
      )
    }
  }, [leagues, selectedLeague])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          <span className="truncate">
            {currentLeauge
              ? `${leagues.find((league) => league.id === currentLeauge)?.name}`
              : 'Select league...'}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search league..." />
          <CommandList>
            <CommandEmpty>No league found.</CommandEmpty>
            <CommandGroup>
              <CommandItem className="flex items-center">
                <Link className="flex items-center" href={`/trending`}>
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4 flex-shrink-0',
                      selectedLeague === null ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  <span className="truncate">Sleeper</span>
                </Link>
              </CommandItem>
              {leagues.map((league) => (
                <CommandItem
                  key={league.id}
                  onSelect={() => {
                    setSelectedLeague(league)
                    setOpen(false)
                  }}
                  className="flex items-center"
                >
                  <Link
                    className="flex items-center"
                    href={`/trending/${league.id}`}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4 flex-shrink-0',
                        selectedLeague?.id === league.id
                          ? 'opacity-100'
                          : 'opacity-0'
                      )}
                    />
                    <span className="truncate">{league.name}</span>
                  </Link>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

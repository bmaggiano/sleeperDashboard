'use client'

import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ListItem } from '@/components/ui/navigation-list-item'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import {
  Bell,
  ChartBar,
  ChartBarHorizontal,
  ChartLineUp,
  CurrencyDollar,
  Flag,
  List,
  Mailbox,
  Robot,
  Sparkle,
  Users,
  Coins,
} from '@phosphor-icons/react'
import Link from 'next/link'
import { Button } from './button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from './sheet'
import { Textarea } from './textarea'
import AuthStatus from '../authStatus'

const navigationItems = [
  {
    title: 'AI Features',
    items: [
      {
        title: 'AI Compare Players',
        href: '/compare',
        children: 'Compare players across your league',
        icon: <Users weight="duotone" size={16} />,
        comingSoon: false,
      },
      {
        title: 'Parlai',
        href: '/parlai',
        children: 'Sports betting just got a little bit easier',
        icon: <Coins weight="duotone" size={16} />,
        comingSoon: false,
      },
    ],
  },
  {
    title: 'League Management',
    items: [
      {
        title: 'Claim Your League',
        href: '/league/claim',
        children: 'Claim ownership and manage your fantasy football league',
        icon: <Flag weight="duotone" size={16} />,
        comingSoon: true,
      },
    ],
  },
]

const RequestFeatureDialog = () => (
  <Dialog>
    <DialogTrigger asChild>
      <Button variant="outline" className="flex items-center gap-2">
        <Sparkle weight="duotone" size={16} />
        <span>Request Feature</span>
      </Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Suggest a Feature</DialogTitle>
      </DialogHeader>
      <div className="py-4">
        <Textarea
          placeholder="What feature would you like to see?"
          className="min-h-[100px]"
        />
      </div>
      <DialogFooter className="flex justify-end gap-2">
        <DialogClose asChild>
          <Button variant="ghost">Cancel</Button>
        </DialogClose>
        <Button type="submit">Submit</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
)

const DesktopNavigation = () => (
  <NavigationMenu>
    <NavigationMenuList>
      {navigationItems.map((item) => (
        <NavigationMenuItem key={item.title}>
          <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {item.items.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                  icon={component.icon}
                  comingSoon={component.comingSoon}
                >
                  {component.children}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      ))}
    </NavigationMenuList>
  </NavigationMenu>
)

const MobileNavigation = () => (
  <Sheet>
    <SheetTrigger asChild>
      <Button variant="outline" size="icon">
        <List color="black" size={16} />
        <span className="sr-only">Toggle menu</span>
      </Button>
    </SheetTrigger>
    <SheetContent
      side="right"
      className="w-[85vw] sm:w-[350px] max-w-[350px] pt-10 overflow-y-auto"
    >
      <div className="gap-6">
        <AuthStatus />
      </div>
      <SheetDescription>
        <VisuallyHidden.Root>
          A list of Stuart AI features that are currently in development.
        </VisuallyHidden.Root>
      </SheetDescription>
      <SheetTitle>
        <VisuallyHidden.Root>Menu</VisuallyHidden.Root>
      </SheetTitle>
      <nav className="flex flex-col gap-6">
        {navigationItems.map((item) => (
          <div key={item.title}>
            <h2 className="text-lg font-semibold mb-3">{item.title}</h2>
            <NavigationMenu>
              <ul className="space-y-2">
                {item.items.map((component) => (
                  <ListItem
                    key={component.title}
                    {...component}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                  />
                ))}
              </ul>
            </NavigationMenu>
          </div>
        ))}
        <div className="mt-6">
          <RequestFeatureDialog />
        </div>
      </nav>
    </SheetContent>
  </Sheet>
)

export default function Header() {
  return (
    <header className="max-w-7xl bg-white dark:bg-gray-900">
      <div className="mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Stuart{' '}
              <span className="bg-black text-white px-2 rounded-md">AI</span>
            </h1>
          </Link>
          <div className="hidden md:block">
            <DesktopNavigation />
          </div>
        </div>
        <div className="md:hidden">
          <MobileNavigation />
        </div>
        <div className="hidden sm:block">
          <AuthStatus />
        </div>
      </div>
    </header>
  )
}

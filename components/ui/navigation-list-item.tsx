'use client'

import * as React from 'react'
import { Badge } from './badge'
import { cn } from '@/lib/utils'
import { NavigationMenuLink } from '@/components/ui/navigation-menu'
import Link from 'next/link'

export interface ListItemProps extends React.ComponentPropsWithoutRef<'a'> {
  icon?: React.ReactNode
  comingSoon?: boolean
  title: string
  children: React.ReactNode
  href: string
}

export const ListItem = React.forwardRef<React.ElementRef<'a'>, ListItemProps>(
  (
    { className, title, children, icon, comingSoon = false, href, ...props },
    ref
  ) => {
    const DISABLE_NAVIGATION = comingSoon
    return (
      <li>
        <NavigationMenuLink asChild>
          <Link
            href={href}
            className={cn(
              'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors',
              DISABLE_NAVIGATION
                ? 'cursor-not-allowed opacity-50'
                : 'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
              className
            )}
            onClick={(e) => {
              if (DISABLE_NAVIGATION) {
                e.preventDefault()
              }
            }}
            {...props}
          >
            <div className="flex items-center">
              {icon && (
                <span className="flex-shrink-0 mr-2 w-5 h-5 text-gray-500">
                  {React.cloneElement(icon as React.ReactElement, {
                    className: 'w-full h-full',
                  })}
                </span>
              )}
              <div className="text-sm font-medium leading-none">{title}</div>
              {comingSoon && (
                <Badge size="xs" className="ml-2">
                  Soon
                </Badge>
              )}
            </div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
              {children}
            </p>
          </Link>
        </NavigationMenuLink>
      </li>
    )
  }
)

ListItem.displayName = 'ListItem'

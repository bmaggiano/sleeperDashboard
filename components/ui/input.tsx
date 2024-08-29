import * as React from 'react'
import { cn } from '@/lib/utils'
import { FaSearch } from 'react-icons/fa' // Import an icon from react-icons
import { FiArrowRight } from 'react-icons/fi'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  showArrowButton?: boolean // New prop to control arrow button rendering
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, showArrowButton = true, ...props }, ref) => {
    return (
      <div className="w-full relative flex items-center">
        <input
          type={type}
          className={cn(
            'flex h-10 w-full rounded-full border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          ref={ref}
          {...props}
        />
        {showArrowButton && (
          <button type="submit" className="absolute right-2 p-1">
            <FiArrowRight />
          </button>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }

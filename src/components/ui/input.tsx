import * as React from "react"
import { cn } from "@/lib/utils"

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        {...props}
        className={cn(
          "flex h-10 w-full rounded-full border border-input bg-background px-3 py-2 text-sm " +
            "file:border-0 file:bg-transparent file:text-sm file:font-medium " +
            "placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 " +
            "focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 " +
            "active:outline-none active:ring-0 hover:outline-none hover:ring-0",
          className
        )}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }

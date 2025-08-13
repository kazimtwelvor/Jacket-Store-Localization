import * as React from "react"

import { cn } from "@/src/app/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

// FloatingLabelInput component
interface FloatingLabelInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: boolean
  required?: boolean
}

export const FloatingLabelInput = React.forwardRef<HTMLInputElement, FloatingLabelInputProps>(
  ({ label, error, required, className, value, onFocus, onBlur, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false)
    const hasValue = value !== undefined && value !== null && String(value).length > 0
    // Only show error if error prop is true
    const showError = !!error

    return (
      <div className="relative w-full">
        <input
          ref={ref}
          className={cn(
            // Vertically center text with py-3
            "block w-full h-12 px-3 py-3 border rounded-none bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-black transition-all [&:-webkit-autofill]:bg-white [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_white]",
            showError ? "border-red-500" : "border-gray-300",
            className
          )}
          value={value}
          required={required}
          onFocus={e => {
            setIsFocused(true)
            onFocus && onFocus(e)
          }}
          onBlur={e => {
            setIsFocused(false)
            onBlur && onBlur(e)
          }}
          {...props}
        />
        <label
          className={cn(
            "absolute left-3 top-3 pointer-events-none transition-all duration-200",
            (isFocused || hasValue)
              ? "-translate-y-6 scale-95 text-sm bg-white px-1 z-10 font-semibold"
              : "text-base text-gray-500",
            showError ? "text-red-600" : "text-gray-700"
          )}
        >
          {label}{required && " *"}
        </label>
      </div>
    )
  }
)
FloatingLabelInput.displayName = "FloatingLabelInput"

export { Input }

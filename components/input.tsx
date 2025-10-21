"use client"

import { forwardRef, type InputHTMLAttributes } from "react"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, className = "", ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium mb-2" style={{ color: "var(--color-text)" }}>
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`
            w-full px-4 py-3 rounded-xl
            transition-all duration-200
            outline-none
            ${error ? "border-2 border-red-500" : "border-2 focus:border-[var(--accent-color)]"}
            ${className}
          `}
        style={{
          backgroundColor: "var(--color-surface)",
          color: "var(--color-text)",
          borderColor: error ? "#EF4444" : "var(--color-border)",
        }}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  )
})

Input.displayName = "Input"

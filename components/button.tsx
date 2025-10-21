"use client"

import type { ButtonHTMLAttributes, ReactNode } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost"
  children: ReactNode
  isLoading?: boolean
}

export function Button({ variant = "primary", children, isLoading, className = "", disabled, ...props }: ButtonProps) {
  const baseStyles =
    "px-6 py-3 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"

  const variants = {
    primary: "text-white shadow-lg hover:shadow-xl active:scale-95",
    secondary: "border-2 hover:bg-opacity-10 active:scale-95",
    ghost: "hover:bg-opacity-10 active:scale-95",
  }

  const getStyles = () => {
    if (variant === "primary") {
      return {
        backgroundColor: "var(--accent-color)",
        borderColor: "var(--accent-color)",
      }
    }
    if (variant === "secondary") {
      return {
        borderColor: "var(--accent-color)",
        color: "var(--accent-color)",
        backgroundColor: "transparent",
      }
    }
    return {
      color: "var(--color-text)",
      backgroundColor: "transparent",
    }
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      style={getStyles()}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-2">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>Carregando...</span>
        </div>
      ) : (
        children
      )}
    </button>
  )
}

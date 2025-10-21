"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAuth } from "@/contexts/auth-context"
import { useTheme } from "@/contexts/theme-context"
import { loginSchema, type LoginFormData } from "@/lib/validations"
import { Input } from "@/components/input"
import { Button } from "@/components/button"
import Link from "next/link"

export default function LoginPage() {
  const { login } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setError("")

    const result = await login(data.email, data.senha)

    if (!result.success) {
      setError(result.error || "Erro ao fazer login")
    }

    setIsLoading(false)
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <button
        onClick={toggleTheme}
        className="fixed top-6 right-6 w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110"
        style={{ backgroundColor: "var(--color-surface)" }}
      >
        {theme === "light" ? "🌙" : "☀️"}
      </button>

      <div className="w-full max-w-md animate-slide-in">
        <div className="text-center mb-8">
          <p className="text-lg" style={{ color: "var(--color-text-secondary)" }}>
            Seu organizador financeiro
          </p>
        </div>

        <div className="rounded-3xl p-8 shadow-xl" style={{ backgroundColor: "var(--color-surface)" }}>
          <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--color-text)" }}>
            Entrar na conta
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="seu@email.com"
              error={errors.email?.message}
              {...register("email")}
            />

            <Input
              label="Senha"
              type="password"
              placeholder="••••••••"
              error={errors.senha?.message}
              {...register("senha")}
            />

            {error && (
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border-2 border-red-500">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Entrar
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p style={{ color: "var(--color-text-secondary)" }}>
              Não tem uma conta?{" "}
              <Link href="/register" className="font-medium hover:underline" style={{ color: "var(--accent-color)" }}>
                Criar conta
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

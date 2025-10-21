"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAuth } from "@/contexts/auth-context"
import { useTheme } from "@/contexts/theme-context"
import { registerSchema, type RegisterFormData } from "@/lib/validations"
import { Input } from "@/components/input"
import { Button } from "@/components/button"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const { register: registerUser } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const router = useRouter()
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    setError("")

    const result = await registerUser(data.nome, data.email, data.senha)

    if (result.success) {
      router.push("/login")
    } else {
      setError(result.error || "Erro ao criar conta")
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
          <div
            className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-4"
            style={{ backgroundColor: "var(--accent-color)" }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold mb-2" style={{ color: "var(--color-text)" }}>
            Criar conta
          </h1>
          <p className="text-lg" style={{ color: "var(--color-text-secondary)" }}>
            Comece a gerenciar suas finanças
          </p>
        </div>

        <div className="rounded-3xl p-8 shadow-xl" style={{ backgroundColor: "var(--color-surface)" }}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Nome completo"
              type="text"
              placeholder="João Silva"
              error={errors.nome?.message}
              {...register("nome")}
            />

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

            <Input
              label="Confirmar senha"
              type="password"
              placeholder="••••••••"
              error={errors.confirmarSenha?.message}
              {...register("confirmarSenha")}
            />

            {error && (
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border-2 border-red-500">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Criar conta
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p style={{ color: "var(--color-text-secondary)" }}>
              Já tem uma conta?{" "}
              <Link href="/login" className="font-medium hover:underline" style={{ color: "var(--accent-color)" }}>
                Entrar
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

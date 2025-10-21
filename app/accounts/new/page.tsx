"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { accountSchema, type AccountFormData } from "@/lib/validations"
import { ApiClient } from "@/lib/api"
import { Input } from "@/components/input"
import { Button } from "@/components/button"
import { BankCard } from "@/components/bank-card"
import { useAuth } from "@/contexts/auth-context"
import { useTheme } from "@/contexts/theme-context"

export default function NewAccountPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { accentColor, setAccentColor } = useTheme()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showColorPicker, setShowColorPicker] = useState(false)

  const colors = [
    "#3B82F6",
    "#8B5CF6",
    "#EC4899",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#06B6D4",
    "#6366F1",
    "#14B8A6",
    "#F97316",
    "#84CC16",
    "#A855F7",
  ]

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      balance: 0,
    },
  })

  const watchedValues = watch()

  const onSubmit = async (data: AccountFormData) => {
    setIsLoading(true)
    setError("")

    const result = await ApiClient.createAccount(data)

    if (result.error) {
      setError(result.error)
      setIsLoading(false)
      return
    }

    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--color-background)" }}>
      <header className="border-b" style={{ borderColor: "var(--color-border)" }}>
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 font-medium hover:opacity-80"
            style={{ color: "var(--color-text)" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Voltar
          </button>
          <h1 className="text-xl font-bold" style={{ color: "var(--color-text)" }}>
            Nova Conta
          </h1>
          <div className="w-20" />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Preview */}
          <div>
            <h2 className="text-lg font-bold mb-4" style={{ color: "var(--color-text)" }}>
              Prévia do cartão
            </h2>
            <BankCard
              name={watchedValues.name || "Minha Conta"}
              balance={watchedValues.balance || 0}
              color={accentColor}
              holderName={user?.nome}
            />

            <div className="mt-6">
              <h3 className="text-sm font-medium mb-3" style={{ color: "var(--color-text)" }}>
                Escolha a cor do cartão
              </h3>
              <div className="grid grid-cols-6 gap-3">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setAccentColor(color)}
                    className="w-full aspect-square rounded-xl border-2 transition-all hover:scale-110"
                    style={{
                      backgroundColor: color,
                      borderColor: color === accentColor ? "white" : "transparent",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div>
            <h2 className="text-lg font-bold mb-4" style={{ color: "var(--color-text)" }}>
              Dados da conta
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Nome da conta"
                placeholder="Ex: Conta Corrente"
                error={errors.name?.message}
                {...register("name")}
              />

              <Input
                label="Descrição (opcional)"
                placeholder="Ex: Minha conta principal"
                error={errors.description?.message}
                {...register("description")}
              />

              <Input
                label="Saldo inicial"
                type="number"
                step="0.01"
                placeholder="0.00"
                error={errors.balance?.message}
                {...register("balance", { valueAsNumber: true })}
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
          </div>
        </div>
      </main>
    </div>
  )
}

"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { categorySchema, type CategoryFormData } from "@/lib/validations"
import { ApiClient } from "@/lib/api"
import { Input } from "@/components/input"
import { Button } from "@/components/button"

export default function NewCategoryPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  })

  const onSubmit = async (data: CategoryFormData) => {
    setIsLoading(true)
    setError("")

    const result = await ApiClient.createCategory(data.name)

    if (result.error) {
      setError(result.error)
      setIsLoading(false)
      return
    }

    router.push("/dashboard")
  }

  const categoryIcons = [
    { name: "Alimentação", icon: "🍔" },
    { name: "Transporte", icon: "🚗" },
    { name: "Saúde", icon: "🏥" },
    { name: "Educação", icon: "📚" },
    { name: "Lazer", icon: "🎮" },
    { name: "Moradia", icon: "🏠" },
    { name: "Vestuário", icon: "👕" },
    { name: "Outros", icon: "📦" },
  ]

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--color-background)" }}>
      <header className="border-b" style={{ borderColor: "var(--color-border)" }}>
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
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
            Nova Categoria
          </h1>
          <div className="w-20" />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="rounded-3xl p-8 shadow-xl" style={{ backgroundColor: "var(--color-surface)" }}>
          <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--color-text)" }}>
            Criar categoria de gastos
          </h2>

          <div className="mb-8">
            <h3 className="text-sm font-medium mb-4" style={{ color: "var(--color-text)" }}>
              Sugestões rápidas
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {categoryIcons.map((cat) => (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => {
                    const input = document.querySelector('input[name="name"]') as HTMLInputElement
                    if (input) input.value = cat.name
                  }}
                  className="p-4 rounded-xl border-2 transition-all hover:scale-105"
                  style={{
                    borderColor: "var(--color-border)",
                    backgroundColor: "var(--color-background)",
                  }}
                >
                  <div className="text-3xl mb-2">{cat.icon}</div>
                  <div className="text-sm font-medium" style={{ color: "var(--color-text)" }}>
                    {cat.name}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Nome da categoria"
              placeholder="Ex: Alimentação"
              error={errors.name?.message}
              {...register("name")}
            />

            {error && (
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border-2 border-red-500">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Criar categoria
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}

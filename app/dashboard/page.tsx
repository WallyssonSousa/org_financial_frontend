"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useTheme } from "@/contexts/theme-context"
import { useRouter } from "next/navigation"
import { ApiClient } from "@/lib/api"
import { BankCard } from "@/components/bank-card"
import Link from "next/link"

export default function DashboardPage() {
  const { user, logout, isLoading: authLoading } = useAuth()
  const { theme, toggleTheme, accentColor, setAccentColor } = useTheme()
  const router = useRouter()
  const [accounts, setAccounts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [transactions, setTransactions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showColorPicker, setShowColorPicker] = useState(false)

  const colors = [
    "#3B82F6", // blue
    "#8B5CF6", // purple
    "#EC4899", // pink
    "#10B981", // green
    "#F59E0B", // amber
    "#EF4444", // red
    "#06B6D4", // cyan
    "#6366F1", // indigo
  ]

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      loadData()
    }
  }, [user])

  const loadData = async () => {
    setIsLoading(true)
    const [accountsRes, categoriesRes, transactionsRes] = await Promise.all([
      ApiClient.getAccounts(),
      ApiClient.getCategories(),
      ApiClient.getTransactions(),
    ])

    if (accountsRes.data) setAccounts(accountsRes.data)
    if (categoriesRes.data) setCategories(categoriesRes.data)
    if (transactionsRes.data) setTransactions(transactionsRes.data)
    setIsLoading(false)
  }

  if (authLoading || !user) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "var(--color-background)" }}
      >
        <div
          className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: "var(--accent-color)" }}
        />
      </div>
    )
  }

  const hasAccount = accounts.length > 0
  const hasCategory = categories.length > 0

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--color-background)" }}>
      {/* Header */}
      <header className="border-b" style={{ borderColor: "var(--color-border)" }}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: "var(--accent-color)" }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: "var(--color-text)" }}>
                BankApp
              </h1>
              <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                Olá, {user.nome}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="w-10 h-10 rounded-full border-2 transition-all hover:scale-110"
                style={{ backgroundColor: accentColor, borderColor: "var(--color-border)" }}
              />
              {showColorPicker && (
                <div
                  className="absolute right-0 mt-2 p-3 rounded-2xl shadow-xl z-10 animate-slide-in"
                  style={{ backgroundColor: "var(--color-surface)" }}
                >
                  <div className="grid grid-cols-4 gap-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => {
                          setAccentColor(color)
                          setShowColorPicker(false)
                        }}
                        className="w-10 h-10 rounded-full border-2 transition-all hover:scale-110"
                        style={{
                          backgroundColor: color,
                          borderColor: color === accentColor ? "white" : "transparent",
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{ backgroundColor: "var(--color-surface)" }}
            >
              {theme === "light" ? "🌙" : "☀️"}
            </button>

            <button
              onClick={logout}
              className="px-4 py-2 rounded-xl font-medium transition-all hover:opacity-80"
              style={{ backgroundColor: "var(--color-surface)", color: "var(--color-text)" }}
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Cards Section */}
        {hasAccount && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--color-text)" }}>
              Suas contas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {accounts.map((account) => (
                <BankCard
                  key={account.id}
                  name={account.name}
                  balance={account.balance}
                  color={accentColor}
                  holderName={user.nome}
                />
              ))}
            </div>
          </section>
        )}

        {/* Quick Actions */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--color-text)" }}>
            Ações rápidas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/accounts/new">
              <div
                className="p-6 rounded-2xl border-2 transition-all hover:scale-105 cursor-pointer"
                style={{
                  borderColor: "var(--accent-color)",
                  backgroundColor: "var(--color-surface)",
                }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: "var(--accent-color)" }}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <line x1="12" y1="9" x2="12" y2="15" />
                    <line x1="9" y1="12" x2="15" y2="12" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: "var(--color-text)" }}>
                  Nova Conta
                </h3>
                <p style={{ color: "var(--color-text-secondary)" }}>Crie uma conta bancária simulada</p>
              </div>
            </Link>

            <Link href={hasAccount ? "/categories/new" : "#"}>
              <div
                className={`p-6 rounded-2xl border-2 transition-all ${hasAccount ? "hover:scale-105 cursor-pointer" : "opacity-50 cursor-not-allowed"}`}
                style={{
                  borderColor: "var(--accent-color)",
                  backgroundColor: "var(--color-surface)",
                }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: "var(--accent-color)" }}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M4 7h16M4 12h16M4 17h16" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: "var(--color-text)" }}>
                  Nova Categoria
                </h3>
                <p style={{ color: "var(--color-text-secondary)" }}>
                  {hasAccount ? "Organize seus gastos" : "Crie uma conta primeiro"}
                </p>
              </div>
            </Link>

            <Link href={hasAccount && hasCategory ? "/transactions/new" : "#"}>
              <div
                className={`p-6 rounded-2xl border-2 transition-all ${hasAccount && hasCategory ? "hover:scale-105 cursor-pointer" : "opacity-50 cursor-not-allowed"}`}
                style={{
                  borderColor: "var(--accent-color)",
                  backgroundColor: "var(--color-surface)",
                }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: "var(--accent-color)" }}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <line x1="12" y1="1" x2="12" y2="23" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: "var(--color-text)" }}>
                  Nova Transação
                </h3>
                <p style={{ color: "var(--color-text-secondary)" }}>
                  {hasAccount && hasCategory ? "Registre uma movimentação" : "Crie conta e categoria primeiro"}
                </p>
              </div>
            </Link>
          </div>
        </section>

        {/* Recent Transactions */}
        {transactions.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold" style={{ color: "var(--color-text)" }}>
                Transações recentes
              </h2>
              <Link
                href="/transactions"
                className="font-medium hover:underline"
                style={{ color: "var(--accent-color)" }}
              >
                Ver todas
              </Link>
            </div>
            <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "var(--color-surface)" }}>
              {transactions.slice(0, 5).map((transaction, index) => (
                <div
                  key={transaction.id}
                  className="p-4 flex items-center justify-between border-b last:border-b-0"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${transaction.tipo === "entrada" ? "bg-green-500" : "bg-red-500"}`}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        {transaction.tipo === "entrada" ? (
                          <path d="M12 5v14M19 12l-7 7-7-7" />
                        ) : (
                          <path d="M12 19V5M5 12l7-7 7 7" />
                        )}
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium" style={{ color: "var(--color-text)" }}>
                        {transaction.descricao}
                      </p>
                      <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                        {new Date(transaction.data).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`text-lg font-bold ${transaction.tipo === "entrada" ? "text-green-500" : "text-red-500"}`}
                  >
                    {transaction.tipo === "entrada" ? "+" : "-"}
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(transaction.valor)}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

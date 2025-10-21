"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { ApiClient } from "@/lib/api"

interface User {
  id: number
  nome: string
  email: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, senha: string) => Promise<{ success: boolean; error?: string }>
  register: (nome: string, email: string, senha: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    const savedUser = localStorage.getItem("user")

    if (token && savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, senha: string) => {
    const { data, error } = await ApiClient.login(email, senha)

    if (error) {
      return { success: false, error }
    }

    if (data?.token) {
      localStorage.setItem("token", data.token)
      const userData = { id: 1, nome: email.split("@")[0], email }
      localStorage.setItem("user", JSON.stringify(userData))
      setUser(userData)
      router.push("/dashboard")
      return { success: true }
    }

    return { success: false, error: "Erro ao fazer login" }
  }

  const register = async (nome: string, email: string, senha: string) => {
    const { data, error } = await ApiClient.register(nome, email, senha)

    if (error) {
      return { success: false, error }
    }

    if (data) {
      return { success: true }
    }

    return { success: false, error: "Erro ao criar conta" }
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
    router.push("/login")
  }

  return <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}

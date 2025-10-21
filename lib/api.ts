declare const process: { env?: { NEXT_PUBLIC_API_URL?: string } };

const API_URL =
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_API_URL) ||
  "http://localhost:8090"

interface ApiResponse<T = any> {
  data?: T
  error?: string
}

export class ApiClient {
  private static getToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem("token")
  }

  private static async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const token = this.getToken()

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    }

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Erro desconhecido" }))
        return { error: error.message || "Erro na requisição" }
      }

      if (response.status === 204) {
        return { data: null as T }
      }

      const data = await response.json()
      return { data }
    } catch {
      return { error: "Erro de conexão com o servidor" }
    }
  }

  static async login(email: string, senha: string) {
    return this.request<{ token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, senha }),
    })
  }

  static async register(nome: string, email: string, senha: string) {
    return this.request<{ id: number; nome: string; email: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ nome, email, senha }),
    })
  }

  static async getAccounts() {
    return this.request<
      Array<{
        id: number
        name: string
        description?: string
        balance: number
      }>
    >("/account")
  }

  static async createAccount(data: { name: string; description?: string; balance: number }) {
    return this.request("/account", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  static async updateAccount(id: number, data: { name?: string; description?: string; balance?: number }) {
    return this.request(`/account/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  static async deleteAccount(id: number) {
    return this.request(`/account/${id}`, { method: "DELETE" })
  }

  static async getCategories() {
    return this.request<
      Array<{ id: number; name: string }>
    >("/category")
  }

  static async createCategory(name: string) {
    return this.request("/category", {
      method: "POST",
      body: JSON.stringify({ name }),
    })
  }

  static async updateCategory(id: number, name: string) {
    return this.request(`/category/${id}`, {
      method: "PUT",
      body: JSON.stringify({ name }),
    })
  }

  static async deleteCategory(id: number) {
    return this.request(`/category/${id}`, { method: "DELETE" })
  }

  static async getTransactions(filtro?: "semana" | "mes" | "tres-meses") {
    const query = filtro ? `?filtro=${filtro}` : ""
    return this.request(`/transaction${query}`)
  }

  static async createTransaction(data: {
    descricao: string
    valor: number
    tipo: "entrada" | "saida"
    metodoPagamento: "debito" | "credito" | "pix" | "dinheiro"
    contaId: number
    categoriaId?: number
    fixa?: boolean
    parcelas?: number | null
  }) {
    return this.request("/transaction", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  static async updateTransaction(id: number, data: Partial<{
    descricao: string
    valor: number
    tipo: "entrada" | "saida"
    metodoPagamento: "debito" | "credito" | "pix" | "dinheiro"
    contaId: number
    categoriaId: number
  }>) {
    return this.request(`/transaction/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  static async deleteTransaction(id: number) {
    return this.request(`/transaction/${id}`, { method: "DELETE" })
  }
}

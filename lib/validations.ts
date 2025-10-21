import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  senha: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
})

export const registerSchema = z
  .object({
    nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
    email: z.string().email("Email inválido"),
    senha: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
    confirmarSenha: z.string(),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    message: "As senhas não coincidem",
    path: ["confirmarSenha"],
  })

export const accountSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  description: z.string().optional(),
  balance: z.number().min(0, "Saldo não pode ser negativo"),
})

export const categorySchema = z.object({
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
})

export const transactionSchema = z
  .object({
    descricao: z.string().min(3, "Descrição deve ter no mínimo 3 caracteres"),
    valor: z.number().positive("Valor deve ser positivo"),
    tipo: z.enum(["entrada", "saida"]),
    metodoPagamento: z.enum(["debito", "credito", "dinheiro", "pix"]),
    parcelas: z.number().min(1).max(24).optional(),
    categoriaId: z.number().positive("Selecione uma categoria"),
    contaId: z.number().positive("Selecione uma conta"),
  })
  .refine(
    (data) => {
      if (data.metodoPagamento === "credito" && !data.parcelas) {
        return false
      }
      return true
    },
    {
      message: "Informe o número de parcelas para crédito",
      path: ["parcelas"],
    },
  )

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type AccountFormData = z.infer<typeof accountSchema>
export type CategoryFormData = z.infer<typeof categorySchema>
export type TransactionFormData = z.infer<typeof transactionSchema>

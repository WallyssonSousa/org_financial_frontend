"use client"

interface BankCardProps {
  name: string
  balance: number
  color: string
  holderName?: string
}

export function BankCard({ name, balance, color, holderName }: BankCardProps) {
  return (
    <div
      className="relative w-full aspect-[1.586/1] rounded-2xl p-6 shadow-2xl overflow-hidden"
      style={{
        backgroundColor: color,
        backgroundImage: `linear-gradient(135deg, ${color} 0%, ${adjustColor(color, -20)} 100%)`,
      }}
    >
      {/* Decorative circles */}
      <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10" />
      <div className="absolute -left-5 -bottom-5 w-32 h-32 rounded-full bg-white/10" />

      <div className="relative h-full flex flex-col justify-between text-white">
        <div>
          <div className="text-sm font-medium opacity-90">BankApp</div>
          <div className="mt-1 text-xs opacity-75">Conta Digital</div>
        </div>

        <div>
          <div className="text-xs opacity-75 mb-1">Saldo disponível</div>
          <div className="text-3xl font-bold tracking-tight">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(balance)}
          </div>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <div className="text-xs opacity-75 mb-1">Titular</div>
            <div className="text-sm font-medium">{holderName || name}</div>
          </div>
          <div className="flex gap-2">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm" />
            <div className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm -ml-4" />
          </div>
        </div>
      </div>
    </div>
  )
}

function adjustColor(color: string, amount: number): string {
  const num = Number.parseInt(color.replace("#", ""), 16)
  const r = Math.max(0, Math.min(255, (num >> 16) + amount))
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + amount))
  const b = Math.max(0, Math.min(255, (num & 0x0000ff) + amount))
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`
}

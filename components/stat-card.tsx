export interface StatCardProps {
  title: string
  value: string | number
  icon?: string
}

export function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-muted-foreground text-sm mb-2">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
        </div>
        {icon && <span className="text-3xl">{icon}</span>}
      </div>
    </div>
  )
}

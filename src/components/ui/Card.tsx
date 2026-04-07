import { cn } from '@/lib/utils'
interface CardProps { children: React.ReactNode; className?: string; onClick?: () => void; hoverable?: boolean }

export function Card({ children, className, onClick, hoverable }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'glass border border-border rounded-2xl p-6',
        hoverable && 'cursor-pointer hover:border-accent/40 transition-all duration-200',
        className,
      )}
    >
      {children}
    </div>
  )
}

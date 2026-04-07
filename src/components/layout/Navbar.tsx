import { Link, useLocation } from 'react-router-dom'
import { Moon, Sun, Zap } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/case-studies', label: 'Case Studies' },
]

export function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const { pathname } = useLocation()
  return (
    <nav className="fixed top-0 inset-x-0 z-50 glass border-b border-border">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Zap size={18} className="text-accent" />
          <span className="text-gradient font-bold tracking-tight">OneStopCareers</span>
        </Link>
        <div className="flex items-center gap-6">
          {NAV_LINKS.map(({ to, label }) => (
            <Link key={to} to={to} className={cn('text-sm transition-colors', pathname === to ? 'text-ink font-medium' : 'text-ink2 hover:text-ink')}>
              {label}
            </Link>
          ))}
          <Button variant="ghost" size="sm" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </Button>
        </div>
      </div>
    </nav>
  )
}

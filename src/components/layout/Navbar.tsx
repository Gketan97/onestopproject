import { Link, useLocation } from 'react-router-dom'
import { Moon, Sun, Zap }    from 'lucide-react'
import { useTheme }          from '@/hooks/useTheme'
import { Button }            from '@/components/ui/Button'
import { cn }                from '@/lib/utils'

const NAV_LINKS = [
  { to: '/',              label: 'Home'         },
  { to: '/case-studies',  label: 'Case Studies' },
]

export function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const { pathname }           = useLocation()

  return (
    <nav
      className="fixed top-0 inset-x-0 z-50"
      style={{
        background:    theme === 'dark'
          ? 'rgba(13,13,13,0.85)'
          : 'rgba(247,247,245,0.90)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom:  '1px solid var(--border-subtle)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Zap size={18} style={{ color: 'var(--accent-primary)' }} />
          <span
            className="font-bold tracking-tight text-base"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}
          >
            OneStopCareers
          </span>
        </Link>

        <div className="flex items-center gap-6">
          {NAV_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="text-sm transition-colors duration-200"
              style={{
                color:      pathname === to ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: pathname === to ? 600 : 400,
                fontFamily: 'var(--font-heading)',
              }}
            >
              {label}
            </Link>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'dark'
              ? <Sun  size={16} style={{ color: 'var(--text-secondary)' }} />
              : <Moon size={16} style={{ color: 'var(--text-secondary)' }} />}
          </Button>
        </div>
      </div>
    </nav>
  )
}

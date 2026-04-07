import { Providers } from './Providers'
import { AppRouter } from './Router'
import { useTheme } from '@/hooks/useTheme'
import '@/styles/globals.css'

function ThemeSync() { useTheme(); return null }

export default function App() {
  return (
    <Providers>
      <ThemeSync />
      <AppRouter />
    </Providers>
  )
}

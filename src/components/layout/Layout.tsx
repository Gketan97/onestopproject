import { Navbar } from './Navbar'
interface LayoutProps { children: React.ReactNode }
export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <main className="pt-16">{children}</main>
    </div>
  )
}

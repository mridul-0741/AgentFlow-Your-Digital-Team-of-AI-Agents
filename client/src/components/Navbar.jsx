"use client"
import Link from "next/link"
import logo from '../../public/logo.png'
import Image from "next/image"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useState } from "react"

const links = [
  { label: "OpsRoom", href: "/opsRoom" },
  { label: "Agents", href: "/agents" },
  { label: "Tasks", href: "/tasks" },
  { label: "Orchestrator", href: "/orchestrator" },
  { label: "Memory", href: "/memory" },
  { label: "Analytics", href: "/analytics" },
]

export default function Navbar() {
  const { isAuthenticated, user, logout, loading } = useAuth()
  const router = useRouter()
  const [showDropdown, setShowDropdown] = useState(false)

  const handleLogout = () => {
    logout()
    router.push('/auth/login')
    setShowDropdown(false)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/20 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href={isAuthenticated ? "/home" : "/"} className="flex items-center gap-2">
          <Image src={logo} alt="AgentFlow Logo" className="h-8 w-8" />
          <span className="text-lg font-semibold tracking-wide">AgentFlow</span>
        </Link>

        {isAuthenticated && (
          <ul className="hidden md:flex items-center font-semibold gap-2">
            {links.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="rounded-full px-3 py-1.5 text-sm text-foreground/90 transition-colors border border-transparent hover:border-border/60 hover:bg-[color:var(--secondary)]/40 hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        )}

        <div className="flex items-center gap-3">
          {!loading && (
            isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 rounded-full border border-white/20 bg-indigo-500/20 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500/30 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-400 to-cyan-400 flex items-center justify-center text-xs font-bold">
                    {user.username?.[0]?.toUpperCase()}
                  </div>
                  <span className="hidden sm:inline">{user.username}</span>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50">
                    <div className="px-4 py-3 border-b border-gray-700">
                      <p className="text-sm text-gray-300">Signed in as</p>
                      <p className="text-sm font-semibold text-white truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="rounded-full px-5 py-2 text-sm font-semibold text-white border border-white/20 hover:border-white/40 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="rounded-full border border-white/20 bg-blue-500/20 px-5 py-2 text-sm font-semibold text-white shadow-[0_0_18px_rgba(56,189,248,0.18)] transition duration-200 hover:bg-blue-500/30 hover:shadow-[0_0_12px_rgba(56,189,248,0.4)]"
                >
                  Get Started →
                </Link>
              </>
            )
          )}
        </div>
      </div>
    </header>
  )
}

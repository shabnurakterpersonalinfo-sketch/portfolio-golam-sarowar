"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BookOpen,
  GraduationCap,
  Briefcase,
  Award,
  Lightbulb,
  Heart,
  FileText,
  User,
  LogOut,
  Menu,
  X,
  Images,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"

const navItems = [
  { name: "Dashboard", href: "/admin", icon: User },
  { name: "Profile", href: "/admin/profile", icon: User },
  { name: "Education", href: "/admin/education", icon: GraduationCap },
  { name: "Experiences", href: "/admin/experiences", icon: Briefcase },
  { name: "Publications", href: "/admin/publications", icon: BookOpen },
  { name: "Skills", href: "/admin/skills", icon: Lightbulb },
  { name: "Awards", href: "/admin/awards", icon: Award },
  { name: "Certifications", href: "/admin/certifications", icon: FileText },
  { name: "Volunteering", href: "/admin/volunteering", icon: Heart },
  { name: "Scholarly Activities", href: "/admin/scholarly-activities", icon: GraduationCap },
  { name: "Gallery", href: "/admin/gallery", icon: Images },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <>
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-primary text-white z-50 flex items-center px-4 shadow-lg">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 hover:bg-primary-dark rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
        <h1 className="ml-4 text-lg font-bold">Admin Panel</h1>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-primary text-white p-6 z-40 transition-transform duration-300 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:z-30`}
      >
        <div className="flex flex-col h-full">
          <div className="mb-8 pt-16 md:pt-0">
            <h1 className="text-2xl font-bold hidden md:block">Admin Panel</h1>
            <p className="text-sm text-primary-light opacity-80 hidden md:block">Portfolio Management</p>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive ? "bg-white text-primary" : "hover:bg-primary-dark"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              )
            })}
          </nav>

          <div className="pt-6 border-t border-primary-dark">
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full justify-start text-white hover:bg-primary-dark"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div onClick={() => setIsMobileMenuOpen(false)} className="md:hidden fixed inset-0 bg-black/50 z-30" />
      )}
    </>
  )
}

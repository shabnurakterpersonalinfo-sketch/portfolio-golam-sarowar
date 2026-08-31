"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface NavItem {
  name: string
  href: string
  scrollTo: string
}

interface NavbarClientProps {
  navItems: NavItem[]
}

export function NavbarClient({ navItems }: NavbarClientProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- close the mobile menu on route change
    setIsMobileMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isMobileMenuOpen])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, scrollTo: string, href: string) => {
    // Close mobile menu immediately
    setIsMobileMenuOpen(false)

    // If clicking on current page's link, scroll to top or section
    if (pathname === href) {
      e.preventDefault()
      if (href === "/" && scrollTo === "home") {
        window.scrollTo({ top: 0, behavior: "smooth" })
      } else if (scrollTo) {
        const element = document.getElementById(scrollTo)
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      }
      return
    }

    // For navigation to different pages, use router.push
    e.preventDefault()
    router.push(href)
  }

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    setIsMobileMenuOpen(false)

    if (pathname === "/") {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else {
      e.preventDefault()
      router.push("/")
    }
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev)
  }

  return (
    <nav
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        isScrolled ? "bg-primary border-primary shadow-md" : "bg-white/95 backdrop-blur-sm border-border"
      }`}
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex h-14 sm:h-16 items-center justify-between">
          <Link
            href="/"
            onClick={handleLogoClick}
            className={`text-base sm:text-lg lg:text-xl font-bold transition-colors whitespace-nowrap ${isScrolled ? "text-white" : "text-primary"}`}
          >
            M. SAROWAR
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.scrollTo, item.href)}
                  className={`px-3 py-2 text-sm font-medium transition-colors rounded whitespace-nowrap ${
                    isScrolled
                      ? isActive
                        ? "bg-white/20 text-white"
                        : "text-white/90 hover:bg-white/10 hover:text-white"
                      : isActive
                        ? "bg-primary-light text-primary"
                        : "text-foreground hover:bg-primary-light hover:text-primary"
                  }`}
                >
                  {item.name}
                </Link>
              )
            })}
          </div>

          {/* Mobile Menu Button - CRITICAL: Must have higher z-index */}
          <Button
            variant="ghost"
            size="icon"
            className={`lg:hidden relative z-[100] ${isScrolled ? "text-white hover:bg-white/10" : "text-primary hover:bg-primary-light"}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
            type="button"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
          </Button>
        </div>
      </div>

      {/* Overlay - appears when menu is open */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 top-14 sm:top-16 bg-black/50 backdrop-blur-sm lg:hidden z-40"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Panel */}
      <div
        className={`fixed top-14 sm:top-16 right-0 h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] w-full sm:w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:hidden z-50 ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col p-4 space-y-1 overflow-y-auto h-full">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.scrollTo, item.href)}
                className={`px-4 py-3 text-base font-medium transition-colors rounded-lg ${
                  isActive ? "bg-primary text-white" : "text-foreground hover:bg-primary-light hover:text-primary"
                }`}
              >
                {item.name}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

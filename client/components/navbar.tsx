"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import LanguageSwitcher from "@/components/language-switcher"
import { useLanguage } from "@/contexts/language-context"
import gsap from "gsap"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { t } = useLanguage()
  const animationApplied = useRef(false)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled)
      }
    }

    window.addEventListener("scroll", handleScroll)

    // Animate navbar items on load - only once
    if (!animationApplied.current) {
      gsap.fromTo(
        ".nav-item",
        { y: -20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.6,
          ease: "power2.out",
          delay: 0.2,
        },
      )
      animationApplied.current = true
    }

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [scrolled])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? "bg-background/90 backdrop-blur-md shadow-md" : "bg-background/50 backdrop-blur-sm"}`}
    >
      <div className="container-custom flex items-center justify-between h-16">
        <Link href="/" className="flex items-center nav-item">
          <Image
            src="https://i.ibb.co/JRrzFBcd/Group-2159.png"
            alt="Recordss AI Logo"
            width={250}
            height={80}
            className="h-14 w-auto"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4">
          <Link href="/whitelist" className="text-foreground/80 hover:text-foreground transition-colors nav-item">
            {t("nav.whitelist")}
          </Link>
          <Link href="/privacy" className="text-foreground/80 hover:text-foreground transition-colors nav-item">
            {t("nav.privacy")}
          </Link>
          <Link href="/offres" className="text-foreground/80 hover:text-foreground transition-colors nav-item">
            {t("nav.offers")}
          </Link>
          <LanguageSwitcher />
          <Button
            className="gradient-bg btn-with-icon nav-item"
            onClick={() => {
              router.push("/").then(() => {
                setTimeout(() => {
                  const testFormsSection = document.getElementById("test-forms")
                  if (testFormsSection) {
                    testFormsSection.scrollIntoView({ behavior: "smooth" })
                  }
                }, 100)
              })
            }}
          >
            {t("nav.test")}
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center md:hidden">
          <LanguageSwitcher />
          <button
            className="ml-2 nav-item"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden glass-effect border-t border-border">
          <div className="container-custom py-4 flex flex-col space-y-4">
            <Link
              href="/whitelist"
              className="text-foreground/80 hover:text-foreground transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              {t("nav.whitelist")}
            </Link>
            <Link
              href="/privacy"
              className="text-foreground/80 hover:text-foreground transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              {t("nav.privacy")}
            </Link>
            <Link
              href="/offres"
              className="text-foreground/80 hover:text-foreground transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              {t("nav.offers")}
            </Link>
            <Button
              className="gradient-bg btn-with-icon w-full"
              onClick={() => {
                setIsMenuOpen(false)
                const testFormsSection = document.getElementById("test-forms")
                if (testFormsSection) {
                  testFormsSection.scrollIntoView({ behavior: "smooth" })
                }
              }}
            >
              {t("nav.test")}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}


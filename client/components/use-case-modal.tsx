"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { cn } from "@/lib/utils"

interface UseCaseModalProps {
  type: "individuals" | "companies" | "web3devs" | "agencies"
  children: React.ReactNode
}

export default function UseCaseModal({ type, children }: UseCaseModalProps) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { t } = useLanguage()

  // Vérifier si le composant est monté côté client
  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  // Empêcher le défilement du body lorsque le modal est ouvert
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [open])

  const getTitle = () => {
    switch (type) {
      case "individuals":
        return t("home.usecases.individuals.title")
      case "companies":
        return t("home.usecases.companies.title")
      case "web3devs":
        return t("home.usecases.web3devs.title")
      case "agencies":
        return t("home.usecases.agencies.title")
      default:
        return ""
    }
  }

  const getDescription = () => {
    switch (type) {
      case "individuals":
        return t("home.usecases.individuals.desc")
      case "companies":
        return t("home.usecases.companies.desc")
      case "web3devs":
        return t("home.usecases.web3devs.desc")
      case "agencies":
        return t("home.usecases.agencies.desc")
      default:
        return ""
    }
  }

  const getContent = () => {
    switch (type) {
      case "individuals":
        return (
          <div className="space-y-6 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gradient">{t("modal.usecase.features")}</h3>
                <ul className="space-y-2">
                  <li className="use-case-feature p-2 rounded-md flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-purple-500/20 flex items-center justify-center mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                    </div>
                    <span>{t("modal.usecase.individuals.feature1")}</span>
                  </li>
                  <li className="use-case-feature p-2 rounded-md flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-pink-500/20 flex items-center justify-center mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-pink-500"></div>
                    </div>
                    <span>{t("modal.usecase.individuals.feature2")}</span>
                  </li>
                  <li className="use-case-feature p-2 rounded-md flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-orange-500/20 flex items-center justify-center mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                    </div>
                    <span>{t("modal.usecase.individuals.feature3")}</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gradient">{t("modal.usecase.benefits")}</h3>
                <ul className="space-y-2">
                  <li className="use-case-feature p-2 rounded-md flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    </div>
                    <span>{t("modal.usecase.individuals.benefit1")}</span>
                  </li>
                  <li className="use-case-feature p-2 rounded-md flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-blue-500/20 flex items-center justify-center mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    </div>
                    <span>{t("modal.usecase.individuals.benefit2")}</span>
                  </li>
                  <li className="use-case-feature p-2 rounded-md flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-indigo-500/20 flex items-center justify-center mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
                    </div>
                    <span>{t("modal.usecase.individuals.benefit3")}</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="testimonial-card bg-primary/10 p-4 rounded-lg mt-6">
              <p className="italic text-sm">"{t("modal.usecase.individuals.testimonial")}"</p>
              <p className="text-sm mt-2 text-right">— {t("modal.usecase.individuals.author")}</p>
            </div>
          </div>
        )
      case "companies":
        return (
          <div className="space-y-6 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gradient">{t("modal.usecase.features")}</h3>
                <ul className="space-y-2">
                  <li className="use-case-feature p-2 rounded-md flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-purple-500/20 flex items-center justify-center mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                    </div>
                    <span>{t("modal.usecase.companies.feature1")}</span>
                  </li>
                  <li className="use-case-feature p-2 rounded-md flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-pink-500/20 flex items-center justify-center mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-pink-500"></div>
                    </div>
                    <span>{t("modal.usecase.companies.feature2")}</span>
                  </li>
                  <li className="use-case-feature p-2 rounded-md flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-orange-500/20 flex items-center justify-center mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                    </div>
                    <span>{t("modal.usecase.companies.feature3")}</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gradient">{t("modal.usecase.benefits")}</h3>
                <ul className="space-y-2">
                  <li className="use-case-feature p-2 rounded-md flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    </div>
                    <span>{t("modal.usecase.companies.benefit1")}</span>
                  </li>
                  <li className="use-case-feature p-2 rounded-md flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-blue-500/20 flex items-center justify-center mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    </div>
                    <span>{t("modal.usecase.companies.benefit2")}</span>
                  </li>
                  <li className="use-case-feature p-2 rounded-md flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-indigo-500/20 flex items-center justify-center mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
                    </div>
                    <span>{t("modal.usecase.companies.benefit3")}</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="testimonial-card bg-primary/10 p-4 rounded-lg mt-6">
              <p className="italic text-sm">"{t("modal.usecase.companies.testimonial")}"</p>
              <p className="text-sm mt-2 text-right">— {t("modal.usecase.companies.author")}</p>
            </div>
          </div>
        )
      case "web3devs":
        return (
          <div className="space-y-6 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gradient">{t("modal.usecase.features")}</h3>
                <ul className="space-y-2">
                  <li className="use-case-feature p-2 rounded-md flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-purple-500/20 flex items-center justify-center mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                    </div>
                    <span>{t("modal.usecase.web3devs.feature1")}</span>
                  </li>
                  <li className="use-case-feature p-2 rounded-md flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-pink-500/20 flex items-center justify-center mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-pink-500"></div>
                    </div>
                    <span>{t("modal.usecase.web3devs.feature2")}</span>
                  </li>
                  <li className="use-case-feature p-2 rounded-md flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-orange-500/20 flex items-center justify-center mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                    </div>
                    <span>{t("modal.usecase.web3devs.feature3")}</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gradient">{t("modal.usecase.benefits")}</h3>
                <ul className="space-y-2">
                  <li className="use-case-feature p-2 rounded-md flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    </div>
                    <span>{t("modal.usecase.web3devs.benefit1")}</span>
                  </li>
                  <li className="use-case-feature p-2 rounded-md flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-blue-500/20 flex items-center justify-center mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    </div>
                    <span>{t("modal.usecase.web3devs.benefit2")}</span>
                  </li>
                  <li className="use-case-feature p-2 rounded-md flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-indigo-500/20 flex items-center justify-center mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
                    </div>
                    <span>{t("modal.usecase.web3devs.benefit3")}</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="testimonial-card bg-primary/10 p-4 rounded-lg mt-6">
              <p className="italic text-sm">"{t("modal.usecase.web3devs.testimonial")}"</p>
              <p className="text-sm mt-2 text-right">— {t("modal.usecase.web3devs.author")}</p>
            </div>
          </div>
        )
      case "agencies":
        return (
          <div className="space-y-6 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gradient">{t("modal.usecase.features")}</h3>
                <ul className="space-y-2">
                  <li className="use-case-feature p-2 rounded-md flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-purple-500/20 flex items-center justify-center mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                    </div>
                    <span>{t("modal.usecase.agencies.feature1")}</span>
                  </li>
                  <li className="use-case-feature p-2 rounded-md flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-pink-500/20 flex items-center justify-center mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-pink-500"></div>
                    </div>
                    <span>{t("modal.usecase.agencies.feature2")}</span>
                  </li>
                  <li className="use-case-feature p-2 rounded-md flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-orange-500/20 flex items-center justify-center mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                    </div>
                    <span>{t("modal.usecase.agencies.feature3")}</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gradient">{t("modal.usecase.benefits")}</h3>
                <ul className="space-y-2">
                  <li className="use-case-feature p-2 rounded-md flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    </div>
                    <span>{t("modal.usecase.agencies.benefit1")}</span>
                  </li>
                  <li className="use-case-feature p-2 rounded-md flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-blue-500/20 flex items-center justify-center mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    </div>
                    <span>{t("modal.usecase.agencies.benefit2")}</span>
                  </li>
                  <li className="use-case-feature p-2 rounded-md flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-indigo-500/20 flex items-center justify-center mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
                    </div>
                    <span>{t("modal.usecase.agencies.benefit3")}</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="testimonial-card bg-primary/10 p-4 rounded-lg mt-6">
              <p className="italic text-sm">"{t("modal.usecase.agencies.testimonial")}"</p>
              <p className="text-sm mt-2 text-right">— {t("modal.usecase.agencies.author")}</p>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  // Élément déclencheur qui ouvre la modale
  const trigger = (
    <div onClick={() => setOpen(true)} className="cursor-pointer">
      {children}
    </div>
  )

  // Contenu de la modale
  const modalContent =
    open && mounted
      ? createPortal(
          <div
            className={cn(
              "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300 use-case-modal",
              open ? "opacity-100" : "opacity-0 pointer-events-none",
            )}
            onClick={(e) => {
              if (e.target === e.currentTarget) setOpen(false)
            }}
          >
            <div
              className={cn(
                "bg-gradient-to-br from-gray-900/90 to-black/95 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto m-4 transition-all duration-300 use-case-modal-content border border-white/10",
                open ? "scale-100 opacity-100" : "scale-95 opacity-0",
                "md:m-0 md:max-h-[85vh]",
              )}
            >
              {/* En-tête de la modale avec titre et bouton de fermeture */}
              <div className="sticky top-0 z-10 flex items-center justify-between p-4 md:p-6 border-b border-gray-800/50 bg-black/50 backdrop-blur-sm">
                <div>
                  <h3 className="text-xl font-semibold text-white">{getTitle()}</h3>
                  <p className="text-sm text-gray-400 mt-1">{getDescription()}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setOpen(false)}
                  className="shrink-0 h-10 w-10 rounded-full hover:bg-white/10"
                  aria-label="Fermer"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Corps de la modale avec contenu */}
              <div className="p-4 md:p-6">{getContent()}</div>

              {/* Bouton de fermeture en bas pour mobile */}
              <div className="sticky bottom-0 p-4 border-t border-gray-800/50 bg-black/50 backdrop-blur-sm md:hidden">
                <Button onClick={() => setOpen(false)} className="w-full" variant="outline">
                  {t("modal.close")}
                </Button>
              </div>
            </div>
          </div>,
          document.body,
        )
      : null

  return (
    <>
      {trigger}
      {modalContent}
    </>
  )
}


"use client"

import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowRight, AlertCircle, CheckIcon, XIcon, ExternalLink, RefreshCw } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import type { DomainAvailabilityResponse } from "@/types/api-responses"

interface AvailabilityFormProps {
  onDomainAvailable?: (domain: string) => void
}

export default function AvailabilityForm({ onDomainAvailable }: AvailabilityFormProps) {
  const { t } = useLanguage()
  const [availabilityDomain, setAvailabilityDomain] = useState<string>("")
  const [availabilityResult, setAvailabilityResult] = useState<DomainAvailabilityResponse | null>(null)
  const [availabilityLoading, setAvailabilityLoading] = useState<boolean>(false)
  const [availabilityError, setAvailabilityError] = useState<string | null>(null)

  // Fonction pour vérifier la disponibilité du domaine
  const checkDomainAvailability = async (e: FormEvent) => {
    e.preventDefault()
    if (!availabilityDomain) return

    setAvailabilityLoading(true)
    setAvailabilityError(null)
    setAvailabilityResult(null)

    try {
      const response = await fetch("https://recordss-api.vercel.app/api/domain-availability", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ domain: availabilityDomain }),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const data = await response.json()
      console.log("API Response:", data) // Log pour déboguer
      setAvailabilityResult(data)
    } catch (error) {
      console.error("Error checking domain availability:", error)
      setAvailabilityError(error instanceof Error ? error.message : t("common.unknownError"))
    } finally {
      setAvailabilityLoading(false)
    }
  }

  // Fonction pour copier du texte dans le presse-papiers
  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log("Texte copié dans le presse-papiers")
      })
      .catch((err) => {
        console.error("Erreur lors de la copie dans le presse-papiers:", err)
      })
  }

  // Fonction pour continuer vers la connexion de domaine
  const handleContinueToConnect = () => {
    if (availabilityResult && onDomainAvailable) {
      onDomainAvailable(availabilityResult.domain)
    }
  }

  return (
    <>
      <form className="space-y-6" onSubmit={checkDomainAvailability}>
        <div className="space-y-2">
          <Label htmlFor="domain-availability">{t("home.tabs.availability.domain")}</Label>
          <Input
            id="domain-availability"
            placeholder={t("home.tabs.availability.placeholder")}
            className="glass-effect"
            value={availabilityDomain}
            onChange={(e) => setAvailabilityDomain(e.target.value)}
            disabled={availabilityLoading}
          />
          <p className="text-xs text-muted-foreground">{t("home.tabs.availability.help")}</p>
        </div>

        <Button
          type="submit"
          className="w-full gradient-bg btn-with-icon"
          disabled={availabilityLoading || !availabilityDomain}
        >
          {availabilityLoading ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>{t("common.loading")}</span>
            </>
          ) : (
            <>
              {t("home.tabs.availability.check")}
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      {/* Résultats de disponibilité */}
      {availabilityError && (
        <Alert variant="destructive" className="mt-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t("common.error")}</AlertTitle>
          <AlertDescription>{availabilityError}</AlertDescription>
        </Alert>
      )}

      {availabilityLoading && (
        <div className="mt-6 space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      )}

      {availabilityResult && (
        <div className="mt-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">{availabilityResult.domain}</h3>
            <Badge
              className={
                availabilityResult.availability.available
                  ? "bg-green-500/20 text-green-500"
                  : "bg-red-500/20 text-red-500"
              }
            >
              {availabilityResult.availability.available
                ? t("domain.status.available")
                : t("domain.status.unavailable")}
            </Badge>
          </div>

          {availabilityResult.availability.note && (
            <Alert className="bg-blue-500/10 border-blue-500/20 text-blue-400">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{t("common.note")}</AlertTitle>
              <AlertDescription>{availabilityResult.availability.note}</AlertDescription>
            </Alert>
          )}

          {/* Modifier la section d'affichage des prix pour gérer les deux formats possibles */}
          {availabilityResult.pricing && (
            <div className="card-fancy p-4">
              <div className="flex flex-col space-y-4">
                {availabilityResult.pricing.note && (
                  <p className="text-sm text-muted-foreground">{availabilityResult.pricing.note}</p>
                )}

                {typeof availabilityResult.pricing.registration === "string" ? (
                  // Format simple: prix unique
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">{t("domain.pricing.registration")}</p>
                      <p className="text-xl font-bold">
                        {availabilityResult.pricing.registration} {availabilityResult.pricing.currency}
                      </p>
                    </div>
                    {typeof availabilityResult.pricing.renewal === "string" && (
                      <div>
                        <p className="text-sm text-muted-foreground">{t("domain.pricing.renewal")}</p>
                        <p className="text-xl font-bold">
                          {availabilityResult.pricing.renewal} {availabilityResult.pricing.currency}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  // Format détaillé: prix par registrar
                  <div className="space-y-4">
                    <h4 className="font-semibold">
                      {t("domain.pricing.estimatedPrices")} ({availabilityResult.pricing.currency}):
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[500px]">
                        <thead>
                          <tr className="border-b border-white/10">
                            <th className="text-left py-2 px-4">{t("domain.pricing.registrar")}</th>
                            <th className="text-right py-2 px-4">{t("domain.pricing.registration")}</th>
                            <th className="text-right py-2 px-4">{t("domain.pricing.renewal")}</th>
                            {availabilityResult.pricing.transfer && (
                              <th className="text-right py-2 px-4">{t("domain.pricing.transfer")}</th>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {availabilityResult.pricing.registration &&
                            typeof availabilityResult.pricing.registration === "object" &&
                            Object.entries(availabilityResult.pricing.registration).map(([registrar, price]) => (
                              <tr key={registrar} className="border-b border-white/5">
                                <td className="py-2 px-4 capitalize">{registrar}</td>
                                <td className="py-2 px-4 text-right">${price}</td>
                                <td className="py-2 px-4 text-right">
                                  {availabilityResult.pricing.renewal &&
                                  typeof availabilityResult.pricing.renewal === "object" &&
                                  availabilityResult.pricing.renewal[registrar]
                                    ? `$${availabilityResult.pricing.renewal[registrar]}`
                                    : "-"}
                                </td>
                                {availabilityResult.pricing.transfer && (
                                  <td className="py-2 px-4 text-right">
                                    {availabilityResult.pricing.transfer[registrar]
                                      ? `$${availabilityResult.pricing.transfer[registrar]}`
                                      : "-"}
                                  </td>
                                )}
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {availabilityResult.purchaseLinks &&
            typeof availabilityResult.purchaseLinks === "object" &&
            Object.keys(availabilityResult.purchaseLinks).length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold">
                  {availabilityResult.availability.available
                    ? t("domain.purchase.buyAt")
                    : t("domain.purchase.checkAt")}
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(availabilityResult.purchaseLinks).map(([provider, url], index) => (
                    <a
                      key={index}
                      href={typeof url === "string" ? url : "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-3 rounded-md bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      {provider.charAt(0).toUpperCase() + provider.slice(1)}
                      <ExternalLink className="h-4 w-4 ml-auto" />
                    </a>
                  ))}
                </div>
              </div>
            )}

          {availabilityResult.availability.dnsCheckResult &&
            availabilityResult.availability.dnsCheckResult.hasRecords && (
              <div className="space-y-2">
                <h4 className="font-semibold">{t("domain.dnsRecords.found")}:</h4>
                <div className="grid grid-cols-2 gap-2">
                  {Object.keys(availabilityResult.availability.dnsCheckResult.recordsFound || {}).map((recordType) => {
                    const hasAnswers = availabilityResult.availability.dnsCheckResult?.recordsFound[recordType]?.Answer
                    return (
                      <div key={recordType} className="p-3 rounded-md bg-white/5">
                        <div className="flex items-center justify-between mb-1">
                          <h5 className="font-medium">{recordType}</h5>
                          {hasAnswers ? (
                            <CheckIcon className="h-4 w-4 text-green-500" />
                          ) : (
                            <XIcon className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                        {hasAnswers && recordType === "A" && (
                          <div className="text-xs font-mono text-muted-foreground">
                            {Array.isArray(
                              availabilityResult.availability.dnsCheckResult.recordsFound[recordType].Answer,
                            ) &&
                              availabilityResult.availability.dnsCheckResult.recordsFound[recordType].Answer.map(
                                (answer: any, i: number) => <div key={i}>{answer.data}</div>,
                              )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

          {/* Bouton pour continuer vers la connexion de domaine - toujours visible maintenant */}
          <div className="mt-4">
            <Button className="w-full gradient-bg btn-with-icon" onClick={handleContinueToConnect}>
              {t("domain.continue.toConnect")}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  )
}


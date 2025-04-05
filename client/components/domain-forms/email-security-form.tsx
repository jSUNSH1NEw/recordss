"use client"

import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  ArrowRight,
  RefreshCw,
  AlertCircle,
  CheckIcon,
  XIcon,
  Copy,
  ExternalLink,
  Server,
  Mail,
  FileCode,
  BookOpen,
} from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import type { EmailSecurityResponse } from "@/types/api-responses"

export default function EmailSecurityForm() {
  const { t } = useLanguage()
  const [emailDomain, setEmailDomain] = useState<string>("")
  const [emailSecurityResult, setEmailSecurityResult] = useState<EmailSecurityResponse | null>(null)
  const [emailSecurityLoading, setEmailSecurityLoading] = useState<boolean>(false)
  const [emailSecurityError, setEmailSecurityError] = useState<string | null>(null)
  const [selectedRegistrar, setSelectedRegistrar] = useState<string>("namecheap")

  // Fonction pour vérifier la sécurité email
  const checkEmailSecurity = async (e: FormEvent) => {
    e.preventDefault()
    if (!emailDomain) return

    setEmailSecurityLoading(true)
    setEmailSecurityError(null)
    setEmailSecurityResult(null)

    try {
      const response = await fetch("https://recordss-api.vercel.app/api/email-security", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ domain: emailDomain }),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const data = await response.json()
      console.log("Email Security API Response:", data) // Log pour déboguer
      setEmailSecurityResult(data)
    } catch (error) {
      console.error("Error checking email security:", error)
      setEmailSecurityError(error instanceof Error ? error.message : "An unknown error occurred")
    } finally {
      setEmailSecurityLoading(false)
    }
  }

  // Fonction pour copier du texte dans le presse-papiers
  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        // Pourrait ajouter une notification de succès ici
        console.log("Texte copié dans le presse-papiers")
      })
      .catch((err) => {
        console.error("Erreur lors de la copie dans le presse-papiers:", err)
      })
  }

  // Fonction pour obtenir la couleur en fonction du niveau de sécurité
  const getSecurityLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "critical":
        return "bg-red-500/20 text-red-500"
      case "low":
      case "poor":
        return "bg-orange-500/20 text-orange-500"
      case "medium":
      case "fair":
        return "bg-yellow-500/20 text-yellow-500"
      case "high":
      case "good":
      case "excellent":
        return "bg-green-500/20 text-green-500"
      default:
        return "bg-gray-500/20 text-gray-500"
    }
  }

  // Fonction pour obtenir la couleur en fonction du statut
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "success":
        return "text-green-500"
      case "warning":
        return "text-yellow-500"
      case "error":
        return "text-red-500"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <>
      <form className="space-y-6" onSubmit={checkEmailSecurity}>
        <div className="space-y-2">
          <Label htmlFor="email-domain">{t("home.tabs.security.domain")}</Label>
          <Input
            id="email-domain"
            placeholder={t("home.tabs.security.placeholder")}
            className="glass-effect"
            value={emailDomain}
            onChange={(e) => setEmailDomain(e.target.value)}
            disabled={emailSecurityLoading}
          />
          <p className="text-xs text-muted-foreground">{t("home.tabs.security.help")}</p>
        </div>

        <Button
          type="submit"
          className="w-full gradient-bg btn-with-icon"
          disabled={emailSecurityLoading || !emailDomain}
        >
          {emailSecurityLoading ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>{t("common.loading")}</span>
            </>
          ) : (
            <>
              {t("home.tabs.security.check")}
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      {/* Résultats de sécurité email */}
      {emailSecurityError && (
        <Alert variant="destructive" className="mt-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{emailSecurityError}</AlertDescription>
        </Alert>
      )}

      {emailSecurityLoading && (
        <div className="mt-6 space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      )}

      {emailSecurityResult && (
        <div className="mt-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">{emailSecurityResult.domain}</h3>
            <Badge className={getSecurityLevelColor(emailSecurityResult.securityScore.rating)}>
              {emailSecurityResult.securityScore.rating}
            </Badge>
          </div>

          {/* Score de sécurité */}
          <div className="card-fancy p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold">Score de sécurité email</h4>
              <div className="flex items-center gap-2">
                <div className="w-16 h-4 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      emailSecurityResult.securityScore.percentage >= 80
                        ? "bg-green-500"
                        : emailSecurityResult.securityScore.percentage >= 60
                          ? "bg-yellow-500"
                          : emailSecurityResult.securityScore.percentage >= 40
                            ? "bg-orange-500"
                            : "bg-red-500"
                    }`}
                    style={{ width: `${emailSecurityResult.securityScore.percentage}%` }}
                  ></div>
                </div>
                <span className="font-bold">
                  {emailSecurityResult.securityScore.score}/{emailSecurityResult.securityScore.total} (
                  {emailSecurityResult.securityScore.percentage}%)
                </span>
              </div>
            </div>

            {/* Serveurs MX */}
            {emailSecurityResult.hasMxRecords && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Server className="h-4 w-4 text-blue-400" />
                  <h5 className="font-medium">Serveurs email détectés</h5>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Ce domaine a {emailSecurityResult.mxRecords.length} enregistrement(s) MX configuré(s).
                </p>
                <div className="space-y-1">
                  {emailSecurityResult.mxRecords.map((record, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="font-mono">{record.value}</span>
                      <Badge variant="outline" className="ml-auto">
                        Priorité: {record.priority}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Grille des enregistrements de sécurité */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* SPF */}
              <div className={`p-3 rounded-md ${emailSecurityResult.spf.exists ? "bg-green-500/10" : "bg-red-500/10"}`}>
                <div className="flex items-center justify-between mb-1">
                  <h5 className="font-medium">SPF Record</h5>
                  {emailSecurityResult.spf.exists ? (
                    <CheckIcon className="h-4 w-4 text-green-500" />
                  ) : (
                    <XIcon className="h-4 w-4 text-red-500" />
                  )}
                </div>
                {emailSecurityResult.spf.exists ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <code className="text-xs font-mono bg-black/30 p-1 rounded flex-1 overflow-x-auto">
                        {emailSecurityResult.spf.value}
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => copyToClipboard(emailSecurityResult.spf.value)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className={`text-xs ${getStatusColor(emailSecurityResult.spf.analysis.status)}`}>
                      {emailSecurityResult.spf.analysis.message}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Aucun enregistrement SPF trouvé. Cela est recommandé pour la sécurité des emails.
                  </p>
                )}
              </div>

              {/* DMARC */}
              <div
                className={`p-3 rounded-md ${emailSecurityResult.dmarc.exists ? "bg-green-500/10" : "bg-red-500/10"}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h5 className="font-medium">DMARC Record</h5>
                  {emailSecurityResult.dmarc.exists ? (
                    <CheckIcon className="h-4 w-4 text-green-500" />
                  ) : (
                    <XIcon className="h-4 w-4 text-red-500" />
                  )}
                </div>
                {emailSecurityResult.dmarc.exists ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <code className="text-xs font-mono bg-black/30 p-1 rounded flex-1 overflow-x-auto">
                        {emailSecurityResult.dmarc.value}
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => copyToClipboard(emailSecurityResult.dmarc.value)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className={`text-xs ${getStatusColor(emailSecurityResult.dmarc.analysis.status)}`}>
                      {emailSecurityResult.dmarc.analysis.message}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Aucun enregistrement DMARC trouvé. Cela est recommandé pour la sécurité des emails.
                  </p>
                )}
              </div>

              {/* DKIM */}
              <div
                className={`p-3 rounded-md ${emailSecurityResult.dkim.found ? "bg-green-500/10" : "bg-yellow-500/10"}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h5 className="font-medium">DKIM Records</h5>
                  {emailSecurityResult.dkim.found ? (
                    <CheckIcon className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                  )}
                </div>
                <div className={`text-xs ${getStatusColor(emailSecurityResult.dkim.analysis.status)}`}>
                  {emailSecurityResult.dkim.analysis.message}
                </div>
              </div>

              {/* MTA-STS */}
              <div
                className={`p-3 rounded-md ${emailSecurityResult.mtaSts.exists ? "bg-green-500/10" : "bg-yellow-500/10"}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h5 className="font-medium">MTA-STS</h5>
                  {emailSecurityResult.mtaSts.exists ? (
                    <CheckIcon className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {emailSecurityResult.mtaSts.exists
                    ? "MTA-STS configuré pour le chiffrement des emails."
                    : "Aucun enregistrement MTA-STS trouvé. Optionnel mais recommandé pour une sécurité renforcée."}
                </p>
              </div>

              {/* TLS-RPT si disponible */}
              {emailSecurityResult.tlsRpt && (
                <div
                  className={`p-3 rounded-md ${emailSecurityResult.tlsRpt.exists ? "bg-green-500/10" : "bg-yellow-500/10"}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h5 className="font-medium">TLS-RPT</h5>
                    {emailSecurityResult.tlsRpt.exists ? (
                      <CheckIcon className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                  {emailSecurityResult.tlsRpt.exists && emailSecurityResult.tlsRpt.value && (
                    <div className="flex items-center gap-2">
                      <code className="text-xs font-mono bg-black/30 p-1 rounded flex-1 overflow-x-auto">
                        {emailSecurityResult.tlsRpt.value}
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => copyToClipboard(emailSecurityResult.tlsRpt.value)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Configuration DNS recommandée */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Configuration DNS recommandée pour {emailSecurityResult.domain}</h4>

            <Tabs defaultValue="namecheap" className="w-full" onValueChange={setSelectedRegistrar}>
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="namecheap">Namecheap</TabsTrigger>
                <TabsTrigger value="cloudflare">Cloudflare</TabsTrigger>
                <TabsTrigger value="godaddy">GoDaddy</TabsTrigger>
              </TabsList>

              <TabsContent value="namecheap" className="space-y-4">
                <div className="card-fancy p-4">
                  <h5 className="font-medium mb-2">Enregistrements DNS à ajouter :</h5>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[500px]">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-2 px-4">Type</th>
                          <th className="text-left py-2 px-4">Hôte</th>
                          <th className="text-left py-2 px-4">Valeur</th>
                          <th className="text-left py-2 px-4">TTL</th>
                          <th className="text-left py-2 px-4">Notes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {emailSecurityResult.dnsConfig.namecheap.records.map((record, index) => (
                          <tr key={index} className="border-b border-white/5">
                            <td className="py-2 px-4">{record.type}</td>
                            <td className="py-2 px-4 font-mono text-xs">{record.host}</td>
                            <td className="py-2 px-4 font-mono text-xs">
                              <div className="flex items-center gap-2">
                                <span className="truncate max-w-[200px]">{record.value}</span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => copyToClipboard(record.value)}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            </td>
                            <td className="py-2 px-4">{record.ttl}</td>
                            <td className="py-2 px-4 text-xs text-muted-foreground">{record.notes}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="space-y-2">
                  <h5 className="font-medium">Instructions :</h5>
                  <ol className="list-decimal pl-5 space-y-1 text-sm">
                    {emailSecurityResult.dnsConfig.namecheap.instructions.map((instruction, index) => (
                      <li key={index}>{instruction}</li>
                    ))}
                  </ol>
                </div>
              </TabsContent>

              <TabsContent value="cloudflare" className="space-y-4">
                <div className="card-fancy p-4">
                  <h5 className="font-medium mb-2">Enregistrements DNS à ajouter :</h5>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[500px]">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-2 px-4">Type</th>
                          <th className="text-left py-2 px-4">Nom</th>
                          <th className="text-left py-2 px-4">Contenu</th>
                          <th className="text-left py-2 px-4">TTL</th>
                          <th className="text-left py-2 px-4">Notes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {emailSecurityResult.dnsConfig.cloudflare.records.map((record, index) => (
                          <tr key={index} className="border-b border-white/5">
                            <td className="py-2 px-4">{record.type}</td>
                            <td className="py-2 px-4 font-mono text-xs">{record.name}</td>
                            <td className="py-2 px-4 font-mono text-xs">
                              <div className="flex items-center gap-2">
                                <span className="truncate max-w-[200px]">{record.content}</span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => copyToClipboard(record.content)}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            </td>
                            <td className="py-2 px-4">{record.ttl}</td>
                            <td className="py-2 px-4 text-xs text-muted-foreground">{record.notes}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="space-y-2">
                  <h5 className="font-medium">Instructions :</h5>
                  <ol className="list-decimal pl-5 space-y-1 text-sm">
                    {emailSecurityResult.dnsConfig.cloudflare.instructions.map((instruction, index) => (
                      <li key={index}>{instruction}</li>
                    ))}
                  </ol>
                </div>
              </TabsContent>

              <TabsContent value="godaddy" className="space-y-4">
                <div className="card-fancy p-4">
                  <h5 className="font-medium mb-2">Enregistrements DNS à ajouter :</h5>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[500px]">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-2 px-4">Type</th>
                          <th className="text-left py-2 px-4">Nom</th>
                          <th className="text-left py-2 px-4">Valeur</th>
                          <th className="text-left py-2 px-4">TTL</th>
                          <th className="text-left py-2 px-4">Notes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {emailSecurityResult.dnsConfig.godaddy.records.map((record, index) => (
                          <tr key={index} className="border-b border-white/5">
                            <td className="py-2 px-4">{record.type}</td>
                            <td className="py-2 px-4 font-mono text-xs">{record.name}</td>
                            <td className="py-2 px-4 font-mono text-xs">
                              <div className="flex items-center gap-2">
                                <span className="truncate max-w-[200px]">{record.value}</span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => copyToClipboard(record.value)}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            </td>
                            <td className="py-2 px-4">{record.ttl}</td>
                            <td className="py-2 px-4 text-xs text-muted-foreground">{record.notes}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="space-y-2">
                  <h5 className="font-medium">Instructions :</h5>
                  <ol className="list-decimal pl-5 space-y-1 text-sm">
                    {emailSecurityResult.dnsConfig.godaddy.instructions.map((instruction, index) => (
                      <li key={index}>{instruction}</li>
                    ))}
                  </ol>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Vérification et dépannage */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="verification">
              <AccordionTrigger className="text-base font-medium">
                <div className="flex items-center gap-2">
                  <FileCode className="h-4 w-4" />
                  Vérification
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-2">
                <div className="flex items-center gap-2 p-2 bg-black/30 rounded-md font-mono text-sm">
                  <code>{emailSecurityResult.dnsConfig.verification.command}</code>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 ml-auto"
                    onClick={() => copyToClipboard(emailSecurityResult.dnsConfig.verification.command)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">{emailSecurityResult.dnsConfig.verification.notes}</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="troubleshooting">
              <AccordionTrigger className="text-base font-medium">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Dépannage
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  {emailSecurityResult.dnsConfig.troubleshooting.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="resources">
              <AccordionTrigger className="text-base font-medium">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Ressources
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {emailSecurityResult.dnsConfig.resources.map((resource, index) => (
                    <a
                      key={index}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2 rounded-md bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <span>{resource.name}</span>
                      <ExternalLink className="h-4 w-4 ml-auto" />
                    </a>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}
    </>
  )
}


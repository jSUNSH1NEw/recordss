"use client"

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { useLanguage } from "@/contexts/language-context"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  CheckIcon,
  XIcon,
  RefreshCw,
  AlertCircle,
  Copy,
  ExternalLink,
  Server,
  Database,
  Shield,
  Code,
  BookOpen,
  Globe,
  Mail,
  Download,
} from "lucide-react"
import type { ConnectDomainResponse } from "@/types/api-responses"
import DnsRecordsTable from "./dns-records-table"
import DnsChecksList from "./dns-checks-list"
import Web3ServicesList from "./web3-services-list"

interface ConnectDomainResultProps {
  result: ConnectDomainResponse
}

export default function ConnectDomainResult({ result }: ConnectDomainResultProps) {
  const [selectedRegistrar, setSelectedRegistrar] = useState<string>("namecheap")
  const [selectedCategory, setSelectedCategory] = useState<string>("icp")
  const { t } = useLanguage()

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

  // Ajouter une nouvelle fonction pour télécharger les fichiers
  // Ajouter cette fonction juste après la fonction copyToClipboard

  // Fonction pour télécharger un fichier
  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Vérifier si c'est une réponse ICP
  const isIcpResponse = result.canisterId !== undefined || (result as any).isIcpDomain !== undefined

  // Vérifier si c'est une réponse Web2 standard
  const isStandardResponse = result.records !== undefined && result.success !== undefined

  // Vérifier si c'est une réponse de notre nouvelle API
  const isNewApiResponse = (result as any).dnsConfig !== undefined && (result as any).domainInfo !== undefined

  return (
    <div className="mt-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">{result.domain}</h3>
        {isStandardResponse && (
          <Badge className={result.success ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"}>
            {result.success ? t("domain.status.connected") : t("domain.status.connectionFailed")}
          </Badge>
        )}
        {isIcpResponse && (
          <Badge
            className={
              (result as any).dnsChecks?.summary?.valid
                ? "bg-green-500/20 text-green-500"
                : "bg-yellow-500/20 text-yellow-500"
            }
          >
            {(result as any).dnsChecks?.summary?.valid
              ? t("domain.status.validConfig")
              : t("domain.status.incompleteConfig")}
          </Badge>
        )}
        {isNewApiResponse && (
          <Badge
            className={
              (result as any).domainInfo?.registered ? "bg-blue-500/20 text-blue-500" : "bg-green-500/20 text-green-500"
            }
          >
            {(result as any).domainInfo?.registered ? t("domain.status.registered") : t("domain.status.available")}
          </Badge>
        )}
      </div>

      {/* Affichage pour les réponses de notre nouvelle API */}
      {isNewApiResponse && (
        <div className="space-y-6">
          {/* Informations sur le domaine */}
          <Card className="bg-black/40 border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-400" />
                {t("domain.info.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{t("domain.info.status")}:</span>
                    <Badge
                      className={
                        (result as any).domainInfo?.registered
                          ? "bg-blue-500/20 text-blue-500"
                          : "bg-green-500/20 text-green-500"
                      }
                    >
                      {(result as any).domainInfo?.registered
                        ? t("domain.status.registered")
                        : t("domain.status.available")}
                    </Badge>
                  </div>
                  {(result as any).domainInfo?.registered && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">{t("domain.info.website")}:</span>
                        <Badge
                          className={
                            (result as any).domainInfo?.hasWebsite
                              ? "bg-green-500/20 text-green-500"
                              : "bg-yellow-500/20 text-yellow-500"
                          }
                        >
                          {(result as any).domainInfo?.hasWebsite
                            ? t("domain.status.active")
                            : t("domain.status.notDetected")}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">{t("domain.info.email")}:</span>
                        <Badge
                          className={
                            (result as any).domainInfo?.hasEmail
                              ? "bg-green-500/20 text-green-500"
                              : "bg-yellow-500/20 text-yellow-500"
                          }
                        >
                          {(result as any).domainInfo?.hasEmail
                            ? t("domain.status.configured")
                            : t("domain.status.notConfigured")}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">{t("domain.info.ssl")}:</span>
                        <Badge
                          className={
                            (result as any).domainInfo?.hasSSL
                              ? "bg-green-500/20 text-green-500"
                              : "bg-yellow-500/20 text-yellow-500"
                          }
                        >
                          {(result as any).domainInfo?.hasSSL
                            ? t("domain.status.active")
                            : t("domain.status.notDetected")}
                        </Badge>
                      </div>
                    </>
                  )}
                </div>

                {!(result as any).domainInfo?.registered &&
                  (result as any).domainAvailability?.purchaseInfo?.purchaseLinks && (
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">{t("domain.purchase.title")}:</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries((result as any).domainAvailability.purchaseInfo.purchaseLinks).map(
                          ([provider, url], index) => (
                            <a
                              key={index}
                              href={url as string}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 p-3 rounded-md bg-white/5 hover:bg-white/10 transition-colors"
                            >
                              {provider.charAt(0).toUpperCase() + provider.slice(1)}
                              <ExternalLink className="h-4 w-4 ml-auto" />
                            </a>
                          ),
                        )}
                      </div>
                    </div>
                  )}
              </div>
            </CardContent>
          </Card>

          {/* Configuration DNS */}
          {(result as any).dnsConfig && (
            <Card className="bg-black/40 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Code className="h-5 w-5 text-orange-400" />
                  Configuration DNS recommandée
                </CardTitle>
                <CardDescription>Enregistrements DNS à configurer pour {result.domain}</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="namecheap" className="w-full" onValueChange={setSelectedRegistrar}>
                  <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="namecheap">Namecheap</TabsTrigger>
                    <TabsTrigger value="cloudflare">Cloudflare</TabsTrigger>
                    <TabsTrigger value="godaddy">GoDaddy</TabsTrigger>
                  </TabsList>

                  <TabsContent value="namecheap">
                    <DnsRecordsTable
                      records={(result as any).dnsConfig.namecheap.records || []}
                      registrar="namecheap"
                      onCopy={copyToClipboard}
                    />
                  </TabsContent>

                  <TabsContent value="cloudflare">
                    <DnsRecordsTable
                      records={(result as any).dnsConfig.cloudflare.records || []}
                      registrar="cloudflare"
                      onCopy={copyToClipboard}
                    />
                  </TabsContent>

                  <TabsContent value="godaddy">
                    <DnsRecordsTable
                      records={(result as any).dnsConfig.godaddy.records || []}
                      registrar="godaddy"
                      onCopy={copyToClipboard}
                    />
                  </TabsContent>
                </Tabs>

                <div className="mt-4 space-y-2">
                  <h5 className="font-medium">Instructions :</h5>
                  <ol className="list-decimal pl-5 space-y-1 text-sm">
                    {(result as any).dnsConfig[selectedRegistrar]?.instructions?.map(
                      (instruction: string, index: number) => (
                        <li key={index}>{instruction}</li>
                      ),
                    )}
                  </ol>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Informations sur l'hébergeur */}
          {(result as any).dnsConfig?.selectedHostingProvider && (
            <Card className="bg-black/40 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Server className="h-5 w-5 text-green-400" />
                  Informations sur l'hébergeur
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <h4 className="font-medium">{(result as any).dnsConfig.selectedHostingProvider.name}</h4>

                  {(result as any).dnsConfig.selectedHostingProvider.ipLocation && (
                    <div className="space-y-1">
                      <h5 className="text-sm font-medium">Où trouver l'adresse IP:</h5>
                      <p className="text-sm text-muted-foreground">
                        {(result as any).dnsConfig.selectedHostingProvider.ipLocation}
                      </p>
                    </div>
                  )}

                  <div className="space-y-1">
                    <h5 className="text-sm font-medium">Instructions:</h5>
                    <ol className="list-decimal pl-5 space-y-1 text-sm">
                      {(result as any).dnsConfig.selectedHostingProvider.instructions.map(
                        (instruction: string, index: number) => (
                          <li key={index}>{instruction}</li>
                        ),
                      )}
                    </ol>
                  </div>

                  {(result as any).dnsConfig.selectedHostingProvider.docsUrl && (
                    <div className="mt-2">
                      <a
                        href={(result as any).dnsConfig.selectedHostingProvider.docsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        Documentation officielle
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Informations sur le fournisseur d'email */}
          {(result as any).dnsConfig?.selectedEmailProvider && (
            <Card className="bg-black/40 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Mail className="h-5 w-5 text-pink-400" />
                  Informations sur le fournisseur d'email
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <h4 className="font-medium">{(result as any).dnsConfig.selectedEmailProvider.name}</h4>

                  <div className="space-y-1">
                    <h5 className="text-sm font-medium">Instructions:</h5>
                    <ol className="list-decimal pl-5 space-y-1 text-sm">
                      {(result as any).dnsConfig.selectedEmailProvider.instructions.map(
                        (instruction: string, index: number) => (
                          <li key={index}>{instruction}</li>
                        ),
                      )}
                    </ol>
                  </div>

                  {(result as any).dnsConfig.selectedEmailProvider.mxRecords && (
                    <div className="space-y-1">
                      <h5 className="text-sm font-medium">Enregistrements MX:</h5>
                      <div className="space-y-1">
                        {(result as any).dnsConfig.selectedEmailProvider.mxRecords.map((record: any, index: number) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <code className="bg-black/30 px-2 py-1 rounded text-xs">
                              Priorité: {record.priority}, Serveur: {record.value}
                            </code>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {(result as any).dnsConfig.selectedEmailProvider.docsUrl && (
                    <div className="mt-2">
                      <a
                        href={(result as any).dnsConfig.selectedEmailProvider.docsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        Documentation officielle
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Configuration Odoo */}
          {(result as any).odooEmailConfig && (
            <Card className="bg-black/40 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Mail className="h-5 w-5 text-orange-400" />
                  Configuration des alias email Odoo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">{(result as any).odooEmailConfig.aliasSetup.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {(result as any).odooEmailConfig.aliasSetup.description}
                    </p>
                  </div>

                  <Accordion type="single" collapsible className="w-full">
                    {(result as any).odooEmailConfig.aliasSetup.steps.map((step: any, index: number) => (
                      <AccordionItem key={index} value={`step-${index}`}>
                        <AccordionTrigger className="text-base font-medium">{step.title}</AccordionTrigger>
                        <AccordionContent>
                          <ol className="list-decimal pl-5 space-y-1 text-sm">
                            {step.instructions.map((instruction: string, i: number) => (
                              <li key={i}>{instruction}</li>
                            ))}
                          </ol>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Vérification et dépannage */}
          {(result as any).dnsConfig && (
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="verification">
                <AccordionTrigger className="text-base font-medium">
                  <div className="flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    Vérification
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-2">
                  <div className="flex items-center gap-2 p-2 bg-black/30 rounded-md font-mono text-sm">
                    <code>{(result as any).dnsConfig.verification?.command}</code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 ml-auto"
                      onClick={() => copyToClipboard((result as any).dnsConfig.verification?.command)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">{(result as any).dnsConfig.verification?.notes}</p>
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
                    {(result as any).dnsConfig.troubleshooting?.map((item: string, index: number) => (
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
                    {(result as any).dnsConfig.resources?.map((resource: any, index: number) => (
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
          )}
        </div>
      )}

      {/* Affichage pour les réponses ICP */}
      {isIcpResponse && (
        <div className="space-y-6">
          {/* Informations sur le canister */}
          {(result as any).canisterInfo && (
            <Card className="bg-black/40 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Database className="h-5 w-5 text-purple-400" />
                  Informations du canister
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">ID du canister:</span>
                    <div className="flex items-center gap-2">
                      <code className="bg-black/30 px-2 py-1 rounded text-sm">{(result as any).canisterId}</code>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => copyToClipboard((result as any).canisterId)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Statut:</span>
                    <Badge className="bg-green-500/20 text-green-500">
                      {(result as any).canisterInfo?.exists ? "Existe" : "Non trouvé"}
                    </Badge>
                  </div>
                  {(result as any).canisterInfo?.dashboardUrl && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Dashboard:</span>
                      <a
                        href={(result as any).canisterInfo.dashboardUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        Voir sur IC Dashboard
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Vérifications DNS */}
          {(result as any).dnsChecks && (
            <Card className="bg-black/40 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5 text-pink-400" />
                  Vérifications DNS
                </CardTitle>
                <CardDescription>État de la configuration DNS pour l'Internet Computer</CardDescription>
              </CardHeader>
              <CardContent>
                <DnsChecksList dnsChecks={(result as any).dnsChecks} />
              </CardContent>
            </Card>
          )}

          {/* Configuration DNS */}
          {(result as any).dnsConfig && (
            <Card className="bg-black/40 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Code className="h-5 w-5 text-orange-400" />
                  Configuration DNS recommandée
                </CardTitle>
                <CardDescription>Enregistrements DNS à configurer pour {result.domain}</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="icp" className="w-full" onValueChange={setSelectedCategory}>
                  <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="icp">Requis</TabsTrigger>
                    <TabsTrigger value="web3">Web3</TabsTrigger>
                    <TabsTrigger value="email">Email</TabsTrigger>
                  </TabsList>

                  <TabsContent value="icp">
                    <Tabs defaultValue="namecheap" className="w-full" onValueChange={setSelectedRegistrar}>
                      <TabsList className="grid grid-cols-3 mb-4">
                        <TabsTrigger value="namecheap">Namecheap</TabsTrigger>
                        <TabsTrigger value="cloudflare">Cloudflare</TabsTrigger>
                        <TabsTrigger value="godaddy">GoDaddy</TabsTrigger>
                      </TabsList>

                      <TabsContent value="namecheap">
                        <DnsRecordsTable
                          records={(result as any).dnsConfig.recordsByCategory?.icp?.namecheap || []}
                          registrar="namecheap"
                          onCopy={copyToClipboard}
                        />
                      </TabsContent>

                      <TabsContent value="cloudflare">
                        <DnsRecordsTable
                          records={(result as any).dnsConfig.recordsByCategory?.icp?.cloudflare || []}
                          registrar="cloudflare"
                          onCopy={copyToClipboard}
                        />
                      </TabsContent>

                      <TabsContent value="godaddy">
                        <DnsRecordsTable
                          records={(result as any).dnsConfig.recordsByCategory?.icp?.godaddy || []}
                          registrar="godaddy"
                          onCopy={copyToClipboard}
                        />
                      </TabsContent>
                    </Tabs>

                    <div className="mt-4 space-y-2">
                      <h5 className="font-medium">Instructions :</h5>
                      <ol className="list-decimal pl-5 space-y-1 text-sm">
                        {(result as any).dnsConfig.instructions[selectedRegistrar]?.map(
                          (instruction: string, index: number) => (
                            <li key={index}>{instruction}</li>
                          ),
                        )}
                      </ol>
                    </div>
                  </TabsContent>

                  <TabsContent value="web3">
                    <Tabs defaultValue="namecheap" className="w-full" onValueChange={setSelectedRegistrar}>
                      <TabsList className="grid grid-cols-3 mb-4">
                        <TabsTrigger value="namecheap">Namecheap</TabsTrigger>
                        <TabsTrigger value="cloudflare">Cloudflare</TabsTrigger>
                        <TabsTrigger value="godaddy">GoDaddy</TabsTrigger>
                      </TabsList>

                      <TabsContent value="namecheap">
                        <DnsRecordsTable
                          records={(result as any).dnsConfig.recordsByCategory?.web3?.namecheap || []}
                          registrar="namecheap"
                          onCopy={copyToClipboard}
                        />
                      </TabsContent>

                      <TabsContent value="cloudflare">
                        <DnsRecordsTable
                          records={(result as any).dnsConfig.recordsByCategory?.web3?.cloudflare || []}
                          registrar="cloudflare"
                          onCopy={copyToClipboard}
                        />
                      </TabsContent>

                      <TabsContent value="godaddy">
                        <DnsRecordsTable
                          records={(result as any).dnsConfig.recordsByCategory?.web3?.godaddy || []}
                          registrar="godaddy"
                          onCopy={copyToClipboard}
                        />
                      </TabsContent>
                    </Tabs>

                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground">
                        {(result as any).dnsConfig.recordsByCategory?.web3?.description ||
                          "Ces enregistrements sont optionnels et permettent d'améliorer l'intégration Web3 de votre domaine."}
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="email">
                    <Tabs defaultValue="namecheap" className="w-full" onValueChange={setSelectedRegistrar}>
                      <TabsList className="grid grid-cols-3 mb-4">
                        <TabsTrigger value="namecheap">Namecheap</TabsTrigger>
                        <TabsTrigger value="cloudflare">Cloudflare</TabsTrigger>
                        <TabsTrigger value="godaddy">GoDaddy</TabsTrigger>
                      </TabsList>

                      <TabsContent value="namecheap">
                        <DnsRecordsTable
                          records={(result as any).dnsConfig.recordsByCategory?.email?.namecheap || []}
                          registrar="namecheap"
                          onCopy={copyToClipboard}
                        />

                        <div className="mt-4">
                          <h5 className="font-medium mb-2">Sécurité Email</h5>
                          <DnsRecordsTable
                            records={(result as any).dnsConfig.recordsByCategory?.emailSecurity?.namecheap || []}
                            registrar="namecheap"
                            onCopy={copyToClipboard}
                          />
                        </div>
                      </TabsContent>

                      <TabsContent value="cloudflare">
                        <DnsRecordsTable
                          records={(result as any).dnsConfig.recordsByCategory?.email?.cloudflare || []}
                          registrar="cloudflare"
                          onCopy={copyToClipboard}
                        />

                        <div className="mt-4">
                          <h5 className="font-medium mb-2">Sécurité Email</h5>
                          <DnsRecordsTable
                            records={(result as any).dnsConfig.recordsByCategory?.emailSecurity?.cloudflare || []}
                            registrar="cloudflare"
                            onCopy={copyToClipboard}
                          />
                        </div>
                      </TabsContent>

                      <TabsContent value="godaddy">
                        <DnsRecordsTable
                          records={(result as any).dnsConfig.recordsByCategory?.email?.godaddy || []}
                          registrar="godaddy"
                          onCopy={copyToClipboard}
                        />

                        <div className="mt-4">
                          <h5 className="font-medium mb-2">Sécurité Email</h5>
                          <DnsRecordsTable
                            records={(result as any).dnsConfig.recordsByCategory?.emailSecurity?.godaddy || []}
                            registrar="godaddy"
                            onCopy={copyToClipboard}
                          />
                        </div>
                      </TabsContent>
                    </Tabs>

                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground">
                        {(result as any).dnsConfig.recordsByCategory?.email?.description ||
                          "Ces enregistrements sont optionnels et permettent de configurer le service email pour votre domaine."}
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}

          {/* Vérification et dépannage */}
          {(result as any).dnsConfig && (
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="verification">
                <AccordionTrigger className="text-base font-medium">
                  <div className="flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    Vérification
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-2">
                  <div className="flex items-center gap-2 p-2 bg-black/30 rounded-md font-mono text-sm">
                    <code>{(result as any).dnsConfig.verification?.command}</code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 ml-auto"
                      onClick={() => copyToClipboard((result as any).dnsConfig.verification?.command)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">{(result as any).dnsConfig.verification?.notes}</p>
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
                    {(result as any).dnsConfig.troubleshooting?.map((item: string, index: number) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="web3services">
                <AccordionTrigger className="text-base font-medium">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Services Web3
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <Web3ServicesList web3Services={(result as any).web3Services} />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="additionalServices">
                <AccordionTrigger className="text-base font-medium">
                  <div className="flex items-center gap-2">
                    <Server className="h-4 w-4" />
                    Services additionnels
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    {(result as any).dnsConfig.additionalServices?.email && (
                      <div className="space-y-2">
                        <h5 className="font-medium flex items-center gap-2">
                          <Mail className="h-4 w-4 text-blue-400" />
                          Email
                        </h5>
                        <p className="text-sm text-muted-foreground">
                          {(result as any).dnsConfig.additionalServices.email.description}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {(result as any).dnsConfig.additionalServices.email.providers?.map(
                            (provider: any, index: number) => (
                              <a
                                key={index}
                                href={provider.setupUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 p-2 rounded-md bg-white/5 hover:bg-white/10 transition-colors"
                              >
                                <span>{provider.name}</span>
                                <span className="text-xs text-muted-foreground">{provider.notes}</span>
                                <ExternalLink className="h-4 w-4 ml-auto" />
                              </a>
                            ),
                          )}
                        </div>
                      </div>
                    )}

                    {(result as any).dnsConfig.additionalServices?.webAnalytics && (
                      <div className="space-y-2">
                        <h5 className="font-medium flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-green-400" />
                          Analytics
                        </h5>
                        <p className="text-sm text-muted-foreground">
                          {(result as any).dnsConfig.additionalServices.webAnalytics.description}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {(result as any).dnsConfig.additionalServices.webAnalytics.providers?.map(
                            (provider: any, index: number) => (
                              <a
                                key={index}
                                href={provider.setupUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 p-2 rounded-md bg-white/5 hover:bg-white/10 transition-colors"
                              >
                                <span>{provider.name}</span>
                                <span className="text-xs text-muted-foreground">{provider.notes}</span>
                                <ExternalLink className="h-4 w-4 ml-auto" />
                              </a>
                            ),
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}

          {/* Web3 Checks */}
          {(result as any).web3Checks && (
            <Card className="bg-black/40 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Database className="h-5 w-5 text-blue-400" />
                  Vérifications Web3
                </CardTitle>
                <CardDescription>État de la configuration Web3 pour votre application</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(result as any).web3Checks.summary && (
                    <div className="flex items-center justify-between">
                      <span>Prêt pour le Web3:</span>
                      <Badge
                        className={
                          (result as any).web3Checks.summary.readyForWeb3
                            ? "bg-green-500/20 text-green-500"
                            : "bg-yellow-500/20 text-yellow-500"
                        }
                      >
                        {(result as any).web3Checks.summary.readyForWeb3 ? "Oui" : "Configuration incomplète"}
                      </Badge>
                    </div>
                  )}

                  <Accordion type="multiple" className="w-full">
                    {(result as any).web3Checks.internetIdentity && (
                      <AccordionItem value="internetIdentity">
                        <AccordionTrigger className="text-base font-medium">Internet Identity</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span>Configuré:</span>
                              <Badge
                                className={
                                  (result as any).web3Checks.internetIdentity.configured
                                    ? "bg-green-500/20 text-green-500"
                                    : "bg-yellow-500/20 text-yellow-500"
                                }
                              >
                                {(result as any).web3Checks.internetIdentity.configured ? "Oui" : "Non"}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {(result as any).web3Checks.internetIdentity.notes}
                            </p>

                            {(result as any).web3Checks.internetIdentity.recommendations && (
                              <div className="mt-2">
                                <h6 className="text-sm font-medium">Recommandations:</h6>
                                <ul className="list-disc pl-5 space-y-1 text-xs text-muted-foreground">
                                  {(result as any).web3Checks.internetIdentity.recommendations.map(
                                    (rec: string, index: number) => (
                                      <li key={index}>{rec}</li>
                                    ),
                                  )}
                                </ul>
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )}

                    {(result as any).web3Checks.wallets && (
                      <AccordionItem value="wallets">
                        <AccordionTrigger className="text-base font-medium">Wallets</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span>Compatible:</span>
                              <Badge
                                className={
                                  (result as any).web3Checks.wallets.compatible
                                    ? "bg-green-500/20 text-green-500"
                                    : "bg-yellow-500/20 text-yellow-500"
                                }
                              >
                                {(result as any).web3Checks.wallets.compatible ? "Oui" : "Non"}
                              </Badge>
                            </div>

                            {(result as any).web3Checks.wallets.wallets && (
                              <div className="mt-2">
                                <h6 className="text-sm font-medium">Wallets recommandés:</h6>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1">
                                  {(result as any).web3Checks.wallets.wallets.map((wallet: any, index: number) => (
                                    <a
                                      key={index}
                                      href={wallet.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-2 p-2 rounded-md bg-white/5 hover:bg-white/10 transition-colors"
                                    >
                                      <span>{wallet.name}</span>
                                      <Badge className="ml-auto" variant="outline">
                                        {wallet.status}
                                      </Badge>
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )}
                  </Accordion>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Fichiers de configuration ICP */}
          {(result as any).configFiles && (
            <Card className="bg-black/40 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Code className="h-5 w-5 text-purple-400" />
                  {t("icp.configFiles.title")}
                </CardTitle>
                <CardDescription>{t("icp.configFiles.description")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <Accordion type="single" collapsible className="w-full">
                    {/* Fichier ic-domains */}
                    {(result as any).configFiles?.icDomains && (
                      <AccordionItem value="icDomains">
                        <AccordionTrigger className="text-base font-medium">
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-blue-400" />
                            .well-known/ic-domains
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-2">
                          <p className="text-sm text-muted-foreground mb-2">
                            {t("icp.configFiles.icDomains.description")}
                          </p>
                          <div className="relative">
                            <pre className="bg-black/30 p-3 rounded-md text-xs overflow-x-auto">
                              <code>{(result as any).configFiles.icDomains.content}</code>
                            </pre>
                            <div className="absolute top-2 right-2 flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => copyToClipboard((result as any).configFiles.icDomains.content)}
                                title={t("common.copy")}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() =>
                                  downloadFile((result as any).configFiles.icDomains.content, "ic-domains")
                                }
                                title={t("common.download")}
                              >
                                <Download className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            {t("icp.configFiles.path")}:{" "}
                            <code className="bg-black/20 px-1 py-0.5 rounded">
                              {(result as any).configFiles.icDomains.path}
                            </code>
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                    )}

                    {/* Fichier ic-assets */}
                    {(result as any).configFiles?.icAssets && (
                      <AccordionItem value="icAssets">
                        <AccordionTrigger className="text-base font-medium">
                          <div className="flex items-center gap-2">
                            <Database className="h-4 w-4 text-green-400" />
                            .ic-assets.json5
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-2">
                          <p className="text-sm text-muted-foreground mb-2">
                            {t("icp.configFiles.icAssets.description")}
                          </p>
                          <div className="relative">
                            <pre className="bg-black/30 p-3 rounded-md text-xs overflow-x-auto">
                              <code>{(result as any).configFiles.icAssets.content}</code>
                            </pre>
                            <div className="absolute top-2 right-2 flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => copyToClipboard((result as any).configFiles.icAssets.content)}
                                title={t("common.copy")}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() =>
                                  downloadFile((result as any).configFiles.icAssets.content, ".ic-assets.json5")
                                }
                                title={t("common.download")}
                              >
                                <Download className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            {t("icp.configFiles.path")}:{" "}
                            <code className="bg-black/20 px-1 py-0.5 rounded">
                              {(result as any).configFiles.icAssets.path}
                            </code>
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                    )}

                    {/* Script d'enregistrement */}
                    {(result as any).configFiles?.registerScript && (
                      <AccordionItem value="registerScript">
                        <AccordionTrigger className="text-base font-medium">
                          <div className="flex items-center gap-2">
                            <Server className="h-4 w-4 text-orange-400" />
                            {t("icp.configFiles.registerScript.title")}
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-2">
                          <p className="text-sm text-muted-foreground mb-2">
                            {t("icp.configFiles.registerScript.description")}
                          </p>
                          <div className="relative">
                            <pre className="bg-black/30 p-3 rounded-md text-xs overflow-x-auto">
                              <code>{(result as any).configFiles.registerScript.content}</code>
                            </pre>
                            <div className="absolute top-2 right-2 flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => copyToClipboard((result as any).configFiles.registerScript.content)}
                                title={t("common.copy")}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() =>
                                  downloadFile((result as any).configFiles.registerScript.content, "register-domain.sh")
                                }
                                title={t("common.download")}
                              >
                                <Download className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            {t("icp.configFiles.path")}:{" "}
                            <code className="bg-black/20 px-1 py-0.5 rounded">
                              {(result as any).configFiles.registerScript.path}
                            </code>
                          </p>
                          <div className="mt-3">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs"
                              onClick={() => copyToClipboard((result as any).configFiles.registerScript.content)}
                            >
                              <Copy className="h-3 w-3 mr-2" />
                              {t("common.copyScript")}
                            </Button>
                            <p className="text-xs text-muted-foreground mt-2">
                              {t("icp.configFiles.registerScript.note")}{" "}
                              <code className="bg-black/20 px-1 py-0.5 rounded">chmod +x register-domain.sh</code>
                            </p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )}

                    {/* Script de vérification de statut */}
                    {(result as any).configFiles?.checkStatusScript && (
                      <AccordionItem value="checkStatusScript">
                        <AccordionTrigger className="text-base font-medium">
                          <div className="flex items-center gap-2">
                            <RefreshCw className="h-4 w-4 text-blue-400" />
                            {t("icp.configFiles.checkStatusScript.title")}
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-2">
                          <p className="text-sm text-muted-foreground mb-2">
                            {t("icp.configFiles.checkStatusScript.description")}
                          </p>
                          <div className="relative">
                            <pre className="bg-black/30 p-3 rounded-md text-xs overflow-x-auto">
                              <code>{(result as any).configFiles.checkStatusScript.content}</code>
                            </pre>
                            <div className="absolute top-2 right-2 flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => copyToClipboard((result as any).configFiles.checkStatusScript.content)}
                                title={t("common.copy")}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() =>
                                  downloadFile((result as any).configFiles.checkStatusScript.content, "check-status.sh")
                                }
                                title={t("common.download")}
                              >
                                <Download className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            {t("icp.configFiles.path")}:{" "}
                            <code className="bg-black/20 px-1 py-0.5 rounded">
                              {(result as any).configFiles.checkStatusScript.path}
                            </code>
                          </p>
                          <div className="mt-3">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs"
                              onClick={() => copyToClipboard((result as any).configFiles.checkStatusScript.content)}
                            >
                              <Copy className="h-3 w-3 mr-2" />
                              {t("common.copyScript")}
                            </Button>
                            <p className="text-xs text-muted-foreground mt-2">
                              {t("icp.configFiles.checkStatusScript.note")}
                              <code className="bg-black/20 px-1 py-0.5 rounded">chmod +x check-status.sh</code>
                            </p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )}

                    {/* Instructions */}
                    {(result as any).configFiles?.instructions && (
                      <AccordionItem value="instructions">
                        <AccordionTrigger className="text-base font-medium">
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-pink-400" />
                            {t("icp.configFiles.instructions.title")}
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-2">
                          <p className="text-sm text-muted-foreground mb-2">
                            {t("icp.configFiles.instructions.description")}
                          </p>
                          <div className="relative">
                            <pre className="bg-black/30 p-3 rounded-md text-xs overflow-x-auto whitespace-pre-wrap">
                              <code>{(result as any).configFiles.instructions.content}</code>
                            </pre>
                            <div className="absolute top-2 right-2 flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => copyToClipboard((result as any).configFiles.instructions.content)}
                                title={t("common.copy")}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() =>
                                  downloadFile((result as any).configFiles.instructions.content, "icp-instructions.txt")
                                }
                                title={t("common.download")}
                              >
                                <Download className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            {t("icp.configFiles.path")}:{" "}
                            <code className="bg-black/20 px-1 py-0.5 rounded">
                              {(result as any).configFiles.instructions.path}
                            </code>
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                    )}
                  </Accordion>

                  <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-md">
                    <h4 className="text-sm font-medium text-blue-400 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      {t("icp.configFiles.steps.title")}
                    </h4>
                    <ol className="mt-2 text-sm space-y-2 pl-5 list-decimal">
                      <li>{t("icp.configFiles.steps.step1")}</li>
                      <li>{t("icp.configFiles.steps.step2")}</li>
                      <li>{t("icp.configFiles.steps.step3")}</li>
                      <li>{t("icp.configFiles.steps.step4")}</li>
                      <li>{t("icp.configFiles.steps.step5")}</li>
                    </ol>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => {
                        const allContent = Object.values((result as any).configFiles)
                          .map((file: any) => `# ${file.path}\n\n${file.content}\n\n`)
                          .join("---\n\n")
                        copyToClipboard(allContent)
                      }}
                    >
                      <Copy className="h-3 w-3 mr-2" />
                      {t("icp.configFiles.copyAll")}
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => {
                        // Télécharger chaque fichier individuellement
                        if ((result as any).configFiles?.icDomains) {
                          downloadFile((result as any).configFiles.icDomains.content, "ic-domains")
                        }
                        if ((result as any).configFiles?.icAssets) {
                          downloadFile((result as any).configFiles.icAssets.content, ".ic-assets.json5")
                        }
                        if ((result as any).configFiles?.registerScript) {
                          downloadFile((result as any).configFiles.registerScript.content, "register-domain.sh")
                        }
                        if ((result as any).configFiles?.checkStatusScript) {
                          downloadFile((result as any).configFiles.checkStatusScript.content, "check-status.sh")
                        }
                        if ((result as any).configFiles?.instructions) {
                          downloadFile((result as any).configFiles.instructions.content, "icp-instructions.txt")
                        }
                      }}
                    >
                      <Download className="h-3 w-3 mr-2" />
                      {t("icp.configFiles.downloadAll")}
                    </Button>

                    {(result as any).canisterId && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => {
                          const modifiedRegisterScript = (result as any).configFiles.registerScript.content
                            .replace("google.com", result.domain)
                            .replace(
                              "# Replace with your actual domain",
                              `# Domain: ${result.domain}\n# Canister ID: ${(result as any).canisterId}`,
                            )
                          copyToClipboard(modifiedRegisterScript)
                        }}
                      >
                        <Server className="h-3 w-3 mr-2" />
                        {t("icp.configFiles.generateCustomScript")}
                      </Button>
                    )}

                    {(result as any).canisterId && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => {
                          const modifiedRegisterScript = (result as any).configFiles.registerScript.content
                            .replace("google.com", result.domain)
                            .replace(
                              "# Replace with your actual domain",
                              `# Domain: ${result.domain}\n# Canister ID: ${(result as any).canisterId}`,
                            )
                          downloadFile(modifiedRegisterScript, `register-${result.domain.replace(/\./g, "-")}.sh`)
                        }}
                      >
                        <Download className="h-3 w-3 mr-2" />
                        {t("icp.configFiles.downloadCustomScript")}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Affichage pour les réponses standard */}
      {isStandardResponse && (
        <div className="space-y-6">
          {result.records && result.records.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold">Enregistrements DNS :</h4>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[500px]">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-2 px-4">Type</th>
                      <th className="text-left py-2 px-4">Nom</th>
                      <th className="text-left py-2 px-4">Valeur</th>
                      <th className="text-center py-2 px-4">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.records.map((record, index) => (
                      <tr key={index} className="border-b border-white/5">
                        <td className="py-2 px-4">{record.type}</td>
                        <td className="py-2 px-4">{record.name}</td>
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
                        <td className="py-2 px-4 text-center">
                          {record.status === "valid" && <CheckIcon className="h-5 w-5 text-green-500 mx-auto" />}
                          {record.status === "invalid" && <XIcon className="h-5 w-5 text-red-500 mx-auto" />}
                          {record.status === "pending" && (
                            <RefreshCw className="h-5 w-5 text-yellow-500 mx-auto animate-spin" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {result.nextSteps && result.nextSteps.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold">Prochaines étapes :</h4>
              <div className="space-y-2">
                {result.nextSteps.map((step, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-md bg-white/5">
                    {step.completed ? (
                      <CheckIcon className="h-5 w-5 text-green-500 mt-0.5" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border border-white/30 mt-0.5" />
                    )}
                    <div>
                      <p className="font-medium">{step.step}</p>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.errors && result.errors.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-red-400">Erreurs :</h4>
              <div className="space-y-2">
                {result.errors.map((error, index) => (
                  <Alert key={index} variant="destructive">
                    <AlertTitle>{error.code}</AlertTitle>
                    <AlertDescription>{error.message}</AlertDescription>
                  </Alert>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}


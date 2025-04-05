"use client"

import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowRight, RefreshCw, Globe, Database, Server, Mail } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import ConnectDomainResult from "./connect-domain-result"

// Types pour les réponses API
import type { ConnectDomainResponse } from "@/types/api-responses"

interface ConnectDomainFormProps {
  initialDomain?: string
}

export default function ConnectDomainForm({ initialDomain = "" }: ConnectDomainFormProps) {
  const { t } = useLanguage()
  const [connectType, setConnectType] = useState<"web2" | "web3">("web2")
  const [web3Type, setWeb3Type] = useState<"icp" | "unstoppable">("icp")
  const [registrar, setRegistrar] = useState<string>("")
  const [serviceType, setServiceType] = useState<"website" | "email" | "both">("website")
  const [hostingProvider, setHostingProvider] = useState<string>("")
  const [emailProvider, setEmailProvider] = useState<string>("")
  const [serverIp, setServerIp] = useState<string>("")
  const [subdomains, setSubdomains] = useState<string[]>([])

  // États pour les formulaires
  const [connectDomain, setConnectDomain] = useState<string>(initialDomain)
  const [canisterId, setCanisterId] = useState<string>("")

  // États pour les résultats API
  const [connectResult, setConnectResult] = useState<ConnectDomainResponse | null>(null)

  // États pour le chargement et les erreurs
  const [connectLoading, setConnectLoading] = useState<boolean>(false)
  const [connectError, setConnectError] = useState<string | null>(null)

  // Fonction pour connecter un domaine
  const connectDomainHandler = async (e: FormEvent) => {
    e.preventDefault()
    if (!connectDomain) return

    setConnectLoading(true)
    setConnectError(null)
    setConnectResult(null)

    try {
      let endpoint = ""
      let body: any = { domain: connectDomain }

      if (connectType === "web3") {
        if (web3Type === "icp") {
          endpoint = "https://recordss-api.vercel.app/api/icp-check"
          body = {
            domain: connectDomain,
            canisterId: canisterId,
          }
        } else if (web3Type === "unstoppable") {
          endpoint = "https://recordss-api.vercel.app/api/unstoppable-check"
          body = {
            domain: connectDomain,
          }
        }
      } else {
        // Web2 domain - use our new API
        endpoint = "/api/domain-configuration"
        body = {
          domain: connectDomain,
          serviceType,
          hostingProvider,
          emailProvider,
          serverIp,
          subdomains,
          registrar,
        }
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const data = await response.json()
      console.log("Connect Domain API Response:", data) // Log pour déboguer
      setConnectResult(data)
    } catch (error) {
      console.error("Error connecting domain:", error)
      setConnectError(error instanceof Error ? error.message : "An unknown error occurred")
    } finally {
      setConnectLoading(false)
    }
  }

  // Fonction pour gérer les sous-domaines
  const handleSubdomainChange = (subdomain: string, checked: boolean) => {
    if (checked) {
      setSubdomains([...subdomains, subdomain])
    } else {
      setSubdomains(subdomains.filter((s) => s !== subdomain))
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label>{t("home.tabs.connect.type")}</Label>
        <RadioGroup
          defaultValue="web2"
          className="grid grid-cols-2 gap-4"
          onValueChange={(value) => setConnectType(value as "web2" | "web3")}
          value={connectType}
        >
          <div className="flex items-center space-x-2 border border-white/10 rounded-lg p-4 cursor-pointer hover:bg-white/5 transition-colors">
            <RadioGroupItem value="web2" id="web2" />
            <Label htmlFor="web2" className="cursor-pointer flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span>{t("home.tabs.connect.web2")}</span>
            </Label>
          </div>
          <div className="flex items-center space-x-2 border border-white/10 rounded-lg p-4 cursor-pointer hover:bg-white/5 transition-colors">
            <RadioGroupItem value="web3" id="web3" />
            <Label htmlFor="web3" className="cursor-pointer flex items-center gap-2">
              <Database className="h-4 w-4" />
              <span>{t("home.tabs.connect.web3")}</span>
            </Label>
          </div>
        </RadioGroup>
      </div>

      {connectType === "web2" ? (
        <form className="space-y-6" onSubmit={connectDomainHandler}>
          <div className="space-y-2">
            <Label htmlFor="domain-connect">{t("home.tabs.connect.domain")}</Label>
            <Input
              id="domain-connect"
              placeholder={t("home.tabs.connect.placeholder")}
              className="glass-effect"
              value={connectDomain}
              onChange={(e) => setConnectDomain(e.target.value)}
              disabled={connectLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="domain-type">{t("home.test.registrar")}</Label>
            <Select onValueChange={setRegistrar}>
              <SelectTrigger id="domain-type" className="glass-effect">
                <SelectValue placeholder={t("home.test.registrar.placeholder")} />
              </SelectTrigger>
              <SelectContent className="glass-effect">
                <SelectItem value="ovh">OVH</SelectItem>
                <SelectItem value="gandi">Gandi</SelectItem>
                <SelectItem value="godaddy">GoDaddy</SelectItem>
                <SelectItem value="namecheap">Namecheap</SelectItem>
                <SelectItem value="cloudflare">Cloudflare</SelectItem>
                <SelectItem value="other">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="service-type">Type de service</Label>
            <RadioGroup
              defaultValue="website"
              className="grid grid-cols-3 gap-4"
              onValueChange={(value) => setServiceType(value as "website" | "email" | "both")}
              value={serviceType}
            >
              <div className="flex items-center space-x-2 border border-white/10 rounded-lg p-4 cursor-pointer hover:bg-white/5 transition-colors">
                <RadioGroupItem value="website" id="website" />
                <Label htmlFor="website" className="cursor-pointer flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span>Site web</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2 border border-white/10 rounded-lg p-4 cursor-pointer hover:bg-white/5 transition-colors">
                <RadioGroupItem value="email" id="email" />
                <Label htmlFor="email" className="cursor-pointer flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>Email</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2 border border-white/10 rounded-lg p-4 cursor-pointer hover:bg-white/5 transition-colors">
                <RadioGroupItem value="both" id="both" />
                <Label htmlFor="both" className="cursor-pointer flex items-center gap-2">
                  <Server className="h-4 w-4" />
                  <span>Les deux</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {(serviceType === "website" || serviceType === "both") && (
            <div className="space-y-2">
              <Label htmlFor="hosting-provider">H��bergeur Web</Label>
              <Select onValueChange={setHostingProvider}>
                <SelectTrigger id="hosting-provider" className="glass-effect">
                  <SelectValue placeholder="Sélectionnez votre hébergeur" />
                </SelectTrigger>
                <SelectContent className="glass-effect">
                  <SelectItem value="aws">Amazon Web Services (AWS)</SelectItem>
                  <SelectItem value="ovh">OVH</SelectItem>
                  <SelectItem value="digitalocean">DigitalOcean</SelectItem>
                  <SelectItem value="heroku">Heroku</SelectItem>
                  <SelectItem value="netlify">Netlify</SelectItem>
                  <SelectItem value="vercel">Vercel</SelectItem>
                  <SelectItem value="odoo">Odoo</SelectItem>
                  <SelectItem value="cpanel">cPanel (Shared Hosting)</SelectItem>
                  <SelectItem value="other">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {hostingProvider !== "netlify" &&
            hostingProvider !== "vercel" &&
            hostingProvider !== "heroku" &&
            hostingProvider !== "odoo" &&
            hostingProvider !== "" &&
            (serviceType === "website" || serviceType === "both") && (
              <div className="space-y-2">
                <Label htmlFor="server-ip">Adresse IP du serveur</Label>
                <Input
                  id="server-ip"
                  placeholder="192.0.2.1"
                  className="glass-effect"
                  value={serverIp}
                  onChange={(e) => setServerIp(e.target.value)}
                  disabled={connectLoading}
                />
                <p className="text-xs text-muted-foreground">
                  L'adresse IP de votre serveur web (laissez vide si vous ne la connaissez pas)
                </p>
              </div>
            )}

          {(serviceType === "email" || serviceType === "both") && (
            <div className="space-y-2">
              <Label htmlFor="email-provider">Fournisseur Email</Label>
              <Select onValueChange={setEmailProvider}>
                <SelectTrigger id="email-provider" className="glass-effect">
                  <SelectValue placeholder="Sélectionnez votre fournisseur email" />
                </SelectTrigger>
                <SelectContent className="glass-effect">
                  <SelectItem value="googleWorkspace">Google Workspace</SelectItem>
                  <SelectItem value="microsoft365">Microsoft 365</SelectItem>
                  <SelectItem value="zoho">Zoho Mail</SelectItem>
                  <SelectItem value="other">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label>Sous-domaines (optionnel)</Label>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center space-x-2 border border-white/10 rounded-lg p-4 cursor-pointer hover:bg-white/5 transition-colors">
                <input
                  type="checkbox"
                  id="blog"
                  className="rounded border-white/20 bg-transparent"
                  onChange={(e) => handleSubdomainChange("blog", e.target.checked)}
                  checked={subdomains.includes("blog")}
                />
                <Label htmlFor="blog" className="cursor-pointer">
                  blog.{connectDomain}
                </Label>
              </div>
              <div className="flex items-center space-x-2 border border-white/10 rounded-lg p-4 cursor-pointer hover:bg-white/5 transition-colors">
                <input
                  type="checkbox"
                  id="shop"
                  className="rounded border-white/20 bg-transparent"
                  onChange={(e) => handleSubdomainChange("shop", e.target.checked)}
                  checked={subdomains.includes("shop")}
                />
                <Label htmlFor="shop" className="cursor-pointer">
                  shop.{connectDomain}
                </Label>
              </div>
              <div className="flex items-center space-x-2 border border-white/10 rounded-lg p-4 cursor-pointer hover:bg-white/5 transition-colors">
                <input
                  type="checkbox"
                  id="app"
                  className="rounded border-white/20 bg-transparent"
                  onChange={(e) => handleSubdomainChange("app", e.target.checked)}
                  checked={subdomains.includes("app")}
                />
                <Label htmlFor="app" className="cursor-pointer">
                  app.{connectDomain}
                </Label>
              </div>
              <div className="flex items-center space-x-2 border border-white/10 rounded-lg p-4 cursor-pointer hover:bg-white/5 transition-colors">
                <input
                  type="checkbox"
                  id="docs"
                  className="rounded border-white/20 bg-transparent"
                  onChange={(e) => handleSubdomainChange("docs", e.target.checked)}
                  checked={subdomains.includes("docs")}
                />
                <Label htmlFor="docs" className="cursor-pointer">
                  docs.{connectDomain}
                </Label>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full gradient-bg btn-with-icon"
            disabled={connectLoading || !connectDomain}
          >
            {connectLoading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>{t("common.loading")}</span>
              </>
            ) : (
              <>
                {t("home.tabs.connect.button")}
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      ) : (
        <form className="space-y-6" onSubmit={connectDomainHandler}>
          <div className="space-y-4">
            <Label>Type de domaine Web3</Label>
            <RadioGroup
              defaultValue="icp"
              className="grid grid-cols-2 gap-4"
              onValueChange={(value) => setWeb3Type(value as "icp" | "unstoppable")}
              value={web3Type}
            >
              <div className="flex items-center space-x-2 border border-white/10 rounded-lg p-4 cursor-pointer hover:bg-white/5 transition-colors">
                <RadioGroupItem value="icp" id="icp" />
                <Label htmlFor="icp" className="cursor-pointer">
                  Internet Computer (ICP)
                </Label>
              </div>
              <div className="flex items-center space-x-2 border border-red-500/30 rounded-lg p-4 bg-red-500/10 opacity-70 cursor-not-allowed">
                <RadioGroupItem value="unstoppable" id="unstoppable" disabled />
                <Label htmlFor="unstoppable" className="cursor-not-allowed text-red-400 flex items-center gap-2">
                  Unstoppable Domains
                  <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded">Non disponible</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="web3-domain">{t("home.tabs.connect.domain")}</Label>
            <Input
              id="web3-domain"
              placeholder={web3Type === "icp" ? "exemple.ic" : "exemple.crypto"}
              className="glass-effect"
              value={connectDomain}
              onChange={(e) => setConnectDomain(e.target.value)}
              disabled={connectLoading}
            />
            <p className="text-xs text-muted-foreground">{t("home.tabs.connect.web3.domain.help")}</p>
          </div>

          {web3Type === "icp" && (
            <div className="space-y-2">
              <Label htmlFor="canister-id">{t("home.tabs.connect.canister")}</Label>
              <Input
                id="canister-id"
                placeholder={t("home.tabs.connect.canister.placeholder")}
                className="glass-effect"
                value={canisterId}
                onChange={(e) => setCanisterId(e.target.value)}
                disabled={connectLoading}
              />
              <p className="text-xs text-muted-foreground">{t("home.tabs.connect.canister.help")}</p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full gradient-bg btn-with-icon"
            disabled={connectLoading || !connectDomain || (web3Type === "icp" && !canisterId)}
          >
            {connectLoading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>{t("common.loading")}</span>
              </>
            ) : (
              <>
                {t("home.tabs.connect.web3.button")}
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      )}

      {/* Résultats de connexion */}
      {connectError && (
        <Alert variant="destructive" className="mt-6">
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{connectError}</AlertDescription>
        </Alert>
      )}

      {connectLoading && (
        <div className="mt-6 space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      )}

      {connectResult && <ConnectDomainResult result={connectResult} />}
    </div>
  )
}


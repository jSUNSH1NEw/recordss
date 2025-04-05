"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Link, Shield } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import ConnectDomainForm from "./domain-forms/connect-domain-form"
import { useMediaQuery } from "@/hooks/use-media-query"

// Import des autres composants
import AvailabilityForm from "./domain-forms/availability-form"
import EmailSecurityForm from "./domain-forms/email-security-form"

// Types pour les réponses API
interface DomainAvailabilityResponse {
  domain: string
  availability: {
    available: boolean
    domainName: string
    tld: string
    method: string
    dnsCheckResult?: {
      hasRecords: boolean
      hasWebRecords: boolean
      recordsFound: Record<string, any>
      icpCompatible: boolean
    }
    icpCompatible: boolean
    note?: string
  }
  pricing: {
    currency?: string
    registration?: string | Record<string, number>
    renewal?: string | Record<string, number>
    transfer?: Record<string, number>
    note?: string
  } | null
  purchaseLinks: Record<string, string>
  status: string
}

interface ConnectDomainResponse {
  success: boolean
  domain: string
  connectionType: string
  records?: Array<{
    type: string
    name: string
    value: string
    status: "valid" | "invalid" | "pending"
  }>
  nextSteps?: Array<{
    step: string
    description: string
    completed: boolean
  }>
  errors?: Array<{
    code: string
    message: string
  }>
}

// Mise à jour de l'interface EmailSecurityResponse pour correspondre à la structure réelle de l'API
interface EmailSecurityResponse {
  domain: string
  isSubdomain: boolean
  parentDomain: string | null
  timestamp: string
  hasMxRecords: boolean
  isUsingParentMx: boolean
  hasAddressRecords: boolean
  mxRecords: Array<{
    priority: number
    value: string
    type: string
  }>
  securityScore: {
    score: number
    total: number
    percentage: number
    rating: string
  }
  spf: {
    exists: boolean
    value: string
    analysis: {
      status: string
      message: string
      details: string[]
    }
  }
  dmarc: {
    exists: boolean
    value: string
    analysis: {
      status: string
      message: string
      details: string[]
    }
  }
  dkim: {
    found: boolean
    records: any[]
    analysis: {
      status: string
      message: string
    }
  }
  mtaSts: {
    exists: boolean
  }
  tlsRpt?: {
    exists: boolean
    value?: string
  }
  dnsConfig: {
    namecheap: {
      records: Array<{
        type: string
        host: string
        value: string
        ttl: string
        notes: string
      }>
      instructions: string[]
    }
    cloudflare: {
      records: Array<{
        type: string
        name: string
        content: string
        ttl: string
        notes: string
      }>
      instructions: string[]
    }
    godaddy: {
      records: Array<{
        type: string
        name: string
        value: string
        ttl: string
        notes: string
      }>
      instructions: string[]
    }
    verification: {
      command: string
      notes: string
    }
    troubleshooting: string[]
    resources: Array<{
      name: string
      url: string
    }>
  }
  status: string
}

export default function DomainForms() {
  const { t } = useLanguage()
  const [availabilityDomain, setAvailabilityDomain] = useState<string>("")
  const [activeTab, setActiveTab] = useState<string>("availability")
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Fonction pour gérer le changement d'onglet
  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  // Fonction pour gérer le domaine disponible
  const handleDomainAvailable = (domain: string) => {
    setAvailabilityDomain(domain)
    setActiveTab("connect")
  }

  return (
    <div className={`${isMobile ? "" : "multi-color-border rounded-xl overflow-hidden"}`}>
      <div className={`${isMobile ? "bg-transparent p-0" : "bg-black border-0 p-4 md:p-8"}`}>
        <Tabs defaultValue="availability" value={activeTab} onValueChange={handleTabChange} className="w-full">
          {isMobile ? (
            <div className="mb-12">
              <TabsList className="flex flex-col w-full gap-2 bg-transparent">
                <TabsTrigger
                  value="availability"
                  className="flex items-center gap-2 justify-start w-full bg-black/80 backdrop-blur-sm border border-gray-800 hover:bg-black/90 data-[state=active]:bg-black"
                >
                  <Search className="h-4 w-4" />
                  <span>{t("home.tabs.availability")}</span>
                </TabsTrigger>
                <TabsTrigger
                  value="connect"
                  className="flex items-center gap-2 justify-start w-full bg-black/80 backdrop-blur-sm border border-gray-800 hover:bg-black/90 data-[state=active]:bg-black"
                >
                  <Link className="h-4 w-4" />
                  <span>{t("home.tabs.connect")}</span>
                </TabsTrigger>
                <TabsTrigger
                  value="security"
                  className="flex items-center gap-2 justify-start w-full bg-black/80 backdrop-blur-sm border border-gray-800 hover:bg-black/90 data-[state=active]:bg-black"
                >
                  <Shield className="h-4 w-4" />
                  <span>{t("home.tabs.security")}</span>
                </TabsTrigger>
              </TabsList>
            </div>
          ) : (
            <TabsList className="grid grid-cols-3 mb-[55px]">
              <TabsTrigger value="availability" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                <span>{t("home.tabs.availability")}</span>
              </TabsTrigger>
              <TabsTrigger value="connect" className="flex items-center gap-2">
                <Link className="h-4 w-4" />
                <span>{t("home.tabs.connect")}</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>{t("home.tabs.security")}</span>
              </TabsTrigger>
            </TabsList>
          )}

          {/* Domain Availability Tab */}
          <TabsContent value="availability" className={isMobile ? "mt-0" : ""}>
            <div className={isMobile ? "bg-black/80 backdrop-blur-sm p-4 rounded-lg" : ""}>
              <AvailabilityForm onDomainAvailable={handleDomainAvailable} />
            </div>
          </TabsContent>

          {/* Connect Domain Tab */}
          <TabsContent value="connect" className={isMobile ? "mt-0" : ""}>
            <div className={isMobile ? "bg-black/80 backdrop-blur-sm p-4 rounded-lg" : ""}>
              <ConnectDomainForm initialDomain={availabilityDomain} />
            </div>
          </TabsContent>

          {/* Email Security Tab */}
          <TabsContent value="security" className={isMobile ? "mt-0" : ""}>
            <div className={isMobile ? "bg-black/80 backdrop-blur-sm p-4 rounded-lg" : ""}>
              <EmailSecurityForm />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}


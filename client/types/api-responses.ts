// Types pour les réponses API
export interface DomainAvailabilityResponse {
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

export interface ConnectDomainResponse {
  domain: string
  success?: boolean
  connectionType?: string
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
  // Champs spécifiques à ICP
  canisterId?: string
  isIcpDomain?: boolean
  domainAvailability?: any
  canisterInfo?: any
  dnsChecks?: any
  dnsConfig?: any
  web3Checks?: any
  web3Services?: any
  // Champs spécifiques à notre nouvelle API
  domainInfo?: {
    registered: boolean
    hasWebsite: boolean
    hasEmail: boolean
    hasSSL: boolean
    dnsRecords?: Record<string, any>
    summary: {
      status: string
      message: string
    }
  }
  domainAvailability?: {
    available: boolean
    registered: boolean
    message: string
    purchaseInfo: {
      available: boolean
      pricing: any
      purchaseLinks: Record<string, string>
    }
  }
  serviceType?: string
  hostingProvider?: string
  emailProvider?: string
  subdomains?: string[]
  odooEmailConfig?: any
}

export interface EmailSecurityResponse {
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


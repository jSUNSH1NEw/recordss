// DNS record types based on the DNS standards
export type DnsRecordType = "A" | "AAAA" | "CNAME" | "MX" | "NS" | "TXT" | "SOA" | "SPF" | "SRV"

// DNS record interfaces
export interface DnsRecord {
  ttl: number
}

export interface ARecord extends DnsRecord {
  type: "A"
  value: string // IPv4 address
}

export interface MxRecord extends DnsRecord {
  type: "MX"
  priority: number
  value: string // Mail server hostname
}

export interface NsRecord extends DnsRecord {
  type: "NS"
  value: string // Nameserver hostname
}

export interface TxtRecord extends DnsRecord {
  type: "TXT"
  value: string // Text value
}

export interface SoaRecord extends DnsRecord {
  type: "SOA"
  primary: string // Primary nameserver
  admin: string // Admin email
  serial: number // Serial number
  refresh: number // Refresh interval
  retry: number // Retry interval
  expire: number // Expire time
}

export interface DnsLookupResult {
  domain: string
  lookupType: DnsRecordType
  records: (ARecord | MxRecord | NsRecord | TxtRecord | SoaRecord | DnsRecord)[]
  status: "success" | "error"
  message?: string
}

// Validate domain name format
export function isValidDomain(domain: string): boolean {
  const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i
  return domainRegex.test(domain)
}

// Parse TTL value to seconds
export function parseTtl(ttlString: string): number {
  // Handle different TTL formats (e.g., "1h", "30m", "1d")
  if (/^\d+$/.test(ttlString)) {
    return Number.parseInt(ttlString, 10)
  }

  const ttlRegex = /^(\d+)([smhdw])$/i
  const match = ttlString.match(ttlRegex)

  if (!match) {
    return 3600 // Default to 1 hour if format is unknown
  }

  const value = Number.parseInt(match[1], 10)
  const unit = match[2].toLowerCase()

  switch (unit) {
    case "s":
      return value
    case "m":
      return value * 60
    case "h":
      return value * 3600
    case "d":
      return value * 86400
    case "w":
      return value * 604800
    default:
      return value
  }
}


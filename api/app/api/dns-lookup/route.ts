import { type NextRequest, NextResponse } from "next/server"

// Configure CORS to allow requests from your frontend
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // Allow all origins for testing
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

export async function POST(request: NextRequest) {
  try {
    // Parse the request body to get the domain
    const { domain, lookupType = "mx" } = await request.json()

    // Validate domain input
    if (!domain || typeof domain !== "string") {
      return NextResponse.json({ error: "Invalid domain provided" }, { status: 400, headers: corsHeaders })
    }

    // Sanitize domain input
    const sanitizedDomain = domain.trim().toLowerCase()

    // Perform DNS lookup based on the requested type
    const result = await performDnsLookup(sanitizedDomain, lookupType.toLowerCase())

    // Return the DNS lookup results
    return NextResponse.json(result, { headers: corsHeaders })
  } catch (error) {
    console.error("DNS lookup error:", error)

    // Return error response
    return NextResponse.json(
      { error: "Failed to perform DNS lookup", details: (error as Error).message },
      { status: 500, headers: corsHeaders },
    )
  }
}

async function performDnsLookup(domain: string, lookupType: string) {
  try {
    // Map lookupType to DNS record type
    let recordType = lookupType.toUpperCase()

    // Handle special cases
    if (lookupType === "spf") {
      recordType = "TXT" // SPF records are stored as TXT records
    } else if (lookupType === "dmarc") {
      domain = `_dmarc.${domain}` // DMARC records are at _dmarc.domain
      recordType = "TXT"
    } else if (lookupType === "dkim") {
      // For DKIM, we'll try common selectors
      const selectors = ["default", "google", "selector1", "selector2", "k1"]
      const dkimRecords = []

      for (const selector of selectors) {
        try {
          const selectorDomain = `${selector}._domainkey.${domain}`
          const dkimResult = await queryDns(selectorDomain, "TXT")

          if (dkimResult.Answer) {
            const dkimTexts = dkimResult.Answer.filter((record) => record.type === 16) // TXT record type
              .map((record) => record.data.replace(/"/g, ""))
              .filter((txt) => txt.toLowerCase().includes("v=dkim1"))

            for (const dkimText of dkimTexts) {
              dkimRecords.push({
                selector,
                value: dkimText,
                type: "DKIM",
              })
            }
          }
        } catch (error) {
          // Ignore errors for individual selectors
          console.log(`No DKIM record found for selector ${selector}`)
        }
      }

      return {
        domain,
        lookupType: "DKIM",
        records: dkimRecords,
        status: "success",
        message: dkimRecords.length === 0 ? "No DKIM records found with common selectors" : undefined,
      }
    }

    // Query DNS
    const dnsResult = await queryDns(domain, recordType)

    // Process the result based on the record type
    if (!dnsResult.Answer) {
      return {
        domain,
        lookupType: recordType,
        records: [],
        status: "success",
        message: `No ${recordType} records found`,
      }
    }

    // Process records based on type
    let records = []

    switch (lookupType) {
      case "a":
        records = dnsResult.Answer.filter((record) => record.type === 1) // A record type
          .map((record) => ({ value: record.data, type: "A" }))
        break

      case "aaaa":
        records = dnsResult.Answer.filter((record) => record.type === 28) // AAAA record type
          .map((record) => ({ value: record.data, type: "AAAA" }))
        break

      case "mx":
        records = dnsResult.Answer.filter((record) => record.type === 15) // MX record type
          .map((record) => {
            const [priority, exchange] = record.data.split(" ")
            return {
              priority: Number.parseInt(priority, 10),
              value: exchange.replace(/\.$/, ""),
              type: "MX",
            }
          })
        break

      case "ns":
        records = dnsResult.Answer.filter((record) => record.type === 2) // NS record type
          .map((record) => ({
            value: record.data.replace(/\.$/, ""),
            type: "NS",
          }))
        break

      case "txt":
        records = dnsResult.Answer.filter((record) => record.type === 16) // TXT record type
          .map((record) => ({
            value: record.data.replace(/"/g, ""),
            type: "TXT",
          }))
        break

      case "spf":
        records = dnsResult.Answer.filter((record) => record.type === 16) // TXT record type
          .map((record) => record.data.replace(/"/g, ""))
          .filter((txt) => txt.toLowerCase().startsWith("v=spf1"))
          .map((spf) => ({ value: spf, type: "SPF" }))
        break

      case "dmarc":
        records = dnsResult.Answer.filter((record) => record.type === 16) // TXT record type
          .map((record) => record.data.replace(/"/g, ""))
          .filter((txt) => txt.toLowerCase().startsWith("v=dmarc1"))
          .map((dmarc) => ({ value: dmarc, type: "DMARC" }))
        break

      case "soa":
        records = dnsResult.Answer.filter((record) => record.type === 6) // SOA record type
          .map((record) => {
            const parts = record.data.split(" ")
            return {
              type: "SOA",
              primary: parts[0].replace(/\.$/, ""),
              admin: parts[1].replace(/\.$/, ""),
              serial: Number.parseInt(parts[2], 10),
              refresh: Number.parseInt(parts[3], 10),
              retry: Number.parseInt(parts[4], 10),
              expire: Number.parseInt(parts[5], 10),
              ttl: Number.parseInt(parts[6], 10),
            }
          })
        break

      default:
        records = dnsResult.Answer.map((record) => ({
          type: recordType,
          value: record.data.replace(/\.$/, ""),
        }))
    }

    return {
      domain,
      lookupType: recordType,
      records,
      status: "success",
    }
  } catch (error) {
    console.error(`DNS lookup error for ${domain} (${lookupType}):`, error)
    return {
      domain,
      lookupType: lookupType.toUpperCase(),
      records: [],
      status: "error",
      message: (error as Error).message,
    }
  }
}

async function queryDns(domain: string, recordType: string) {
  // Try Google DNS API first
  try {
    const response = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=${recordType}`)

    if (!response.ok) {
      throw new Error(`Google DNS API error: ${response.status}`)
    }

    return await response.json()
  } catch (googleError) {
    // Fallback to Cloudflare DNS API
    try {
      const response = await fetch(
        `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=${recordType}`,
        {
          headers: {
            Accept: "application/dns-json",
          },
        },
      )

      if (!response.ok) {
        throw new Error(`Cloudflare DNS API error: ${response.status}`)
      }

      return await response.json()
    } catch (cloudflareError) {
      throw new Error(
        `DNS API errors: Google: ${(googleError as Error).message}, Cloudflare: ${(cloudflareError as Error).message}`,
      )
    }
  }
}


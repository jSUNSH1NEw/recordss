import { type NextRequest, NextResponse } from "next/server"

// Configure CORS to allow requests from your frontend
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
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

    // Generate mock data based on lookup type
    const mockData = generateMockData(sanitizedDomain, lookupType)

    // Return the mock DNS lookup results
    return NextResponse.json(mockData, { headers: corsHeaders })
  } catch (error) {
    console.error("DNS lookup error:", error)

    // Return error response
    return NextResponse.json(
      { error: "Failed to perform DNS lookup", details: (error as Error).message },
      { status: 500, headers: corsHeaders },
    )
  }
}

function generateMockData(domain: string, lookupType: string) {
  // Create different mock responses based on the lookup type
  switch (lookupType.toLowerCase()) {
    case "a":
      return {
        domain,
        lookupType: "A",
        records: [
          { value: "192.168.1.1", ttl: 3600 },
          { value: "192.168.1.2", ttl: 3600 },
        ],
        status: "success",
      }

    case "mx":
      return {
        domain,
        lookupType: "MX",
        records: [
          { priority: 10, value: `mail1.${domain}`, ttl: 3600 },
          { priority: 20, value: `mail2.${domain}`, ttl: 3600 },
        ],
        status: "success",
      }

    case "ns":
      return {
        domain,
        lookupType: "NS",
        records: [
          { value: `ns1.${domain}`, ttl: 86400 },
          { value: `ns2.${domain}`, ttl: 86400 },
        ],
        status: "success",
      }

    case "txt":
      return {
        domain,
        lookupType: "TXT",
        records: [
          { value: "v=spf1 include:_spf.google.com ~all", ttl: 3600 },
          { value: "google-site-verification=abcdefghijklmnopqrstuvwxyz", ttl: 3600 },
        ],
        status: "success",
      }

    case "soa":
      return {
        domain,
        lookupType: "SOA",
        records: [
          {
            primary: `ns1.${domain}`,
            admin: `admin.${domain}`,
            serial: 2023010101,
            refresh: 7200,
            retry: 3600,
            expire: 1209600,
            ttl: 86400,
          },
        ],
        status: "success",
      }

    case "spf":
      return {
        domain,
        lookupType: "SPF",
        records: [{ value: "v=spf1 include:_spf.google.com ~all", ttl: 3600 }],
        status: "success",
      }

    default:
      return {
        domain,
        lookupType: "UNKNOWN",
        records: [],
        status: "error",
        message: "Unsupported lookup type",
      }
  }
}


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
    // Parse the request body
    const { domain, tool = "all" } = await request.json()

    // Validate domain input
    if (!domain || typeof domain !== "string") {
      return NextResponse.json({ error: "Invalid domain provided" }, { status: 400, headers: corsHeaders })
    }

    // Sanitize domain input
    const sanitizedDomain = domain.trim().toLowerCase()

    // Use public DNS API to get comprehensive DNS information
    const result = await fetchDnsInformation(sanitizedDomain, tool)

    // Return the DNS information
    return NextResponse.json(result, { headers: corsHeaders })
  } catch (error) {
    console.error("DNS tools error:", error)

    // Return error response
    return NextResponse.json(
      { error: "Failed to fetch DNS information", details: (error as Error).message },
      { status: 500, headers: corsHeaders },
    )
  }
}

async function fetchDnsInformation(domain: string, tool: string) {
  // Use Google's public DNS API (this is not an official API but works for demonstration)
  try {
    const response = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=ANY`)

    if (!response.ok) {
      throw new Error(`Google DNS API error: ${response.status}`)
    }

    const data = await response.json()

    // Process and format the response
    return {
      domain,
      tool,
      timestamp: new Date().toISOString(),
      results: data,
      status: "success",
    }
  } catch (error) {
    // Fallback to another public DNS API if Google's fails
    try {
      const response = await fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=ANY`, {
        headers: {
          Accept: "application/dns-json",
        },
      })

      if (!response.ok) {
        throw new Error(`Cloudflare DNS API error: ${response.status}`)
      }

      const data = await response.json()

      return {
        domain,
        tool,
        timestamp: new Date().toISOString(),
        results: data,
        status: "success",
      }
    } catch (fallbackError) {
      throw new Error(`DNS API error: ${(error as Error).message}, Fallback error: ${(fallbackError as Error).message}`)
    }
  }
}


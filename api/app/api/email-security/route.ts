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
    // Parse the request body
    const { domain } = await request.json()

    // Validate domain input
    if (!domain || typeof domain !== "string") {
      return NextResponse.json({ error: "Invalid domain provided" }, { status: 400, headers: corsHeaders })
    }

    // Sanitize domain input
    const sanitizedDomain = domain.trim().toLowerCase()

    // Analyze email security records
    const result = await analyzeEmailSecurity(sanitizedDomain)

    // Return the analysis results
    return NextResponse.json(result, { headers: corsHeaders })
  } catch (error) {
    console.error("Email security analysis error:", error)

    // Return error response
    return NextResponse.json(
      { error: "Failed to analyze email security", details: (error as Error).message },
      { status: 500, headers: corsHeaders },
    )
  }
}

async function analyzeEmailSecurity(domain: string) {
  try {
    // Check if this is a subdomain
    const domainParts = domain.split(".")
    const isSubdomain = domainParts.length > 2
    let parentDomain = domain
    let isUsingParentMx = false

    if (isSubdomain) {
      // Extract the parent domain (e.g., example.com from sub.example.com)
      parentDomain = domainParts.slice(domainParts.length - 2).join(".")
    }

    // Check for MX records first to verify if domain has email servers
    let hasMxRecords = false
    let mxRecords = []
    try {
      const mxResult = await queryDns(domain, "MX")
      if (mxResult.Answer) {
        const mxEntries = mxResult.Answer.filter((record) => record.type === 15) // MX record type
        hasMxRecords = mxEntries.length > 0
        mxRecords = mxEntries.map((record) => {
          const [priority, exchange] = record.data.split(" ")
          return {
            priority: Number.parseInt(priority, 10),
            value: exchange.replace(/\.$/, ""),
            type: "MX",
          }
        })
      }

      // If no MX records found and this is a subdomain, check the parent domain
      if (!hasMxRecords && isSubdomain) {
        const parentMxResult = await queryDns(parentDomain, "MX")
        if (parentMxResult.Answer) {
          const parentMxEntries = parentMxResult.Answer.filter((record) => record.type === 15)
          if (parentMxEntries.length > 0) {
            isUsingParentMx = true
            hasMxRecords = true
            mxRecords = parentMxEntries.map((record) => {
              const [priority, exchange] = record.data.split(" ")
              return {
                priority: Number.parseInt(priority, 10),
                value: exchange.replace(/\.$/, ""),
                type: "MX",
                isFromParent: true,
              }
            })
          }
        }
      }
    } catch (error) {
      console.error(`Error checking MX records for ${domain}:`, error)
    }

    // Get SPF record
    let spfRecord = null
    try {
      const spfResult = await queryDns(domain, "TXT")

      if (spfResult.Answer) {
        const spfText = spfResult.Answer.filter((record) => record.type === 16) // TXT record type
          .map((record) => record.data.replace(/"/g, ""))
          .find((txt) => txt.toLowerCase().startsWith("v=spf1"))

        if (spfText) {
          spfRecord = {
            exists: true,
            value: spfText,
            analysis: analyzeSpf(spfText),
          }
        } else {
          spfRecord = {
            exists: false,
            analysis: {
              status: "warning",
              message: "No SPF record found",
            },
          }
        }
      } else {
        spfRecord = {
          exists: false,
          analysis: {
            status: "warning",
            message: "No SPF record found",
          },
        }
      }

      // If no SPF record found and this is a subdomain, check if it inherits from parent
      if (!spfRecord.exists && isSubdomain) {
        const parentSpfResult = await queryDns(parentDomain, "TXT")
        if (parentSpfResult.Answer) {
          const parentSpfText = parentSpfResult.Answer.filter((record) => record.type === 16)
            .map((record) => record.data.replace(/"/g, ""))
            .find((txt) => txt.toLowerCase().startsWith("v=spf1"))

          if (parentSpfText) {
            spfRecord = {
              exists: true,
              value: parentSpfText,
              isFromParent: true,
              analysis: {
                status: "info",
                message: `Using parent domain's SPF record`,
                details: analyzeSpf(parentSpfText).details,
              },
            }
          }
        }
      }
    } catch (error) {
      spfRecord = {
        exists: false,
        error: (error as Error).message,
        analysis: {
          status: "warning",
          message: "Error retrieving SPF record",
        },
      }
    }

    // Get DMARC record
    let dmarcRecord = null
    try {
      const dmarcResult = await queryDns(`_dmarc.${domain}`, "TXT")

      if (dmarcResult.Answer) {
        const dmarcText = dmarcResult.Answer.filter((record) => record.type === 16) // TXT record type
          .map((record) => record.data.replace(/"/g, ""))
          .find((txt) => txt.toLowerCase().startsWith("v=dmarc1"))

        if (dmarcText) {
          dmarcRecord = {
            exists: true,
            value: dmarcText,
            analysis: analyzeDmarc(dmarcText),
          }
        } else {
          dmarcRecord = {
            exists: false,
            analysis: {
              status: "warning",
              message: "No DMARC record found",
            },
          }
        }
      } else {
        dmarcRecord = {
          exists: false,
          analysis: {
            status: "warning",
            message: "No DMARC record found",
          },
        }
      }

      // If no DMARC record found and this is a subdomain, check the parent domain
      if (!dmarcRecord.exists && isSubdomain) {
        const parentDmarcResult = await queryDns(`_dmarc.${parentDomain}`, "TXT")
        if (parentDmarcResult.Answer) {
          const parentDmarcText = parentDmarcResult.Answer.filter((record) => record.type === 16)
            .map((record) => record.data.replace(/"/g, ""))
            .find((txt) => txt.toLowerCase().startsWith("v=dmarc1"))

          if (parentDmarcText) {
            // Check if the parent DMARC record applies to subdomains
            const subdomainPolicy = parentDmarcText.match(/sp=([^;\s]+)/)

            dmarcRecord = {
              exists: true,
              value: parentDmarcText,
              isFromParent: true,
              appliesTo: subdomainPolicy ? "Explicit subdomain policy" : "Inherited from parent",
              analysis: {
                status: "info",
                message: `Using parent domain's DMARC record`,
                details: analyzeDmarc(parentDmarcText).details,
              },
            }
          }
        }
      }
    } catch (error) {
      dmarcRecord = {
        exists: false,
        error: (error as Error).message,
        analysis: {
          status: "warning",
          message: "Error retrieving DMARC record",
        },
      }
    }

    // Try to find DKIM records with common selectors
    const selectors = ["default", "google", "selector1", "selector2", "k1"]
    const dkimRecords = []

    for (const selector of selectors) {
      try {
        const dkimResult = await queryDns(`${selector}._domainkey.${domain}`, "TXT")

        if (dkimResult.Answer) {
          const dkimTexts = dkimResult.Answer.filter((record) => record.type === 16) // TXT record type
            .map((record) => record.data.replace(/"/g, ""))
            .filter((txt) => txt.toLowerCase().includes("v=dkim1"))

          for (const dkimText of dkimTexts) {
            dkimRecords.push({
              selector,
              exists: true,
              value: dkimText,
            })
          }
        }
      } catch (error) {
        // Ignore errors for individual selectors
        console.log(`No DKIM record found for selector ${selector}`)
      }
    }

    // If no DKIM records found and this is a subdomain, check the parent domain
    if (dkimRecords.length === 0 && isSubdomain) {
      for (const selector of selectors) {
        try {
          const parentDkimResult = await queryDns(`${selector}._domainkey.${parentDomain}`, "TXT")

          if (parentDkimResult.Answer) {
            const parentDkimTexts = parentDkimResult.Answer.filter((record) => record.type === 16)
              .map((record) => record.data.replace(/"/g, ""))
              .filter((txt) => txt.toLowerCase().includes("v=dkim1"))

            for (const dkimText of parentDkimTexts) {
              dkimRecords.push({
                selector,
                exists: true,
                value: dkimText,
                isFromParent: true,
              })
            }
          }
        } catch (error) {
          // Ignore errors for individual selectors
          console.log(`No DKIM record found for selector ${selector} on parent domain`)
        }
      }
    }

    // Analyze MTA-STS and TLS-RPT
    let mtaSts = null
    try {
      const mtaStsResult = await queryDns(`_mta-sts.${domain}`, "TXT")

      if (mtaStsResult.Answer) {
        const mtaStsText = mtaStsResult.Answer.filter((record) => record.type === 16) // TXT record type
          .map((record) => record.data.replace(/"/g, ""))
          .find((txt) => txt.toLowerCase().startsWith("v=sts1"))

        if (mtaStsText) {
          mtaSts = {
            exists: true,
            value: mtaStsText,
          }
        } else {
          mtaSts = {
            exists: false,
          }
        }
      } else {
        mtaSts = {
          exists: false,
        }
      }

      // If no MTA-STS record found and this is a subdomain, check the parent domain
      if (!mtaSts.exists && isSubdomain) {
        const parentMtaStsResult = await queryDns(`_mta-sts.${parentDomain}`, "TXT")
        if (parentMtaStsResult.Answer) {
          const parentMtaStsText = parentMtaStsResult.Answer.filter((record) => record.type === 16)
            .map((record) => record.data.replace(/"/g, ""))
            .find((txt) => txt.toLowerCase().startsWith("v=sts1"))

          if (parentMtaStsText) {
            mtaSts = {
              exists: true,
              value: parentMtaStsText,
              isFromParent: true,
            }
          }
        }
      }
    } catch (error) {
      mtaSts = {
        exists: false,
        error: (error as Error).message,
      }
    }

    let tlsRpt = null
    try {
      const tlsRptResult = await queryDns(`_smtp._tls.${domain}`, "TXT")

      if (tlsRptResult.Answer) {
        const tlsRptText = tlsRptResult.Answer.filter((record) => record.type === 16) // TXT record type
          .map((record) => record.data.replace(/"/g, ""))
          .find((txt) => txt.toLowerCase().startsWith("v=tlsrpt"))

        if (tlsRptText) {
          tlsRpt = {
            exists: true,
            value: tlsRptText,
          }
        } else {
          tlsRpt = {
            exists: false,
          }
        }
      } else {
        tlsRpt = {
          exists: false,
        }
      }

      // If no TLS-RPT record found and this is a subdomain, check the parent domain
      if (!tlsRpt.exists && isSubdomain) {
        const parentTlsRptResult = await queryDns(`_smtp._tls.${parentDomain}`, "TXT")
        if (parentTlsRptResult.Answer) {
          const parentTlsRptText = parentTlsRptResult.Answer.filter((record) => record.type === 16)
            .map((record) => record.data.replace(/"/g, ""))
            .find((txt) => txt.toLowerCase().startsWith("v=tlsrpt"))

          if (parentTlsRptText) {
            tlsRpt = {
              exists: true,
              value: parentTlsRptText,
              isFromParent: true,
            }
          }
        }
      }
    } catch (error) {
      tlsRpt = {
        exists: false,
        error: (error as Error).message,
      }
    }

    // Check for A and AAAA records to determine if the domain is active
    let hasAddressRecords = false
    try {
      const aResult = await queryDns(domain, "A")
      if (aResult.Answer && aResult.Answer.length > 0) {
        hasAddressRecords = true
      } else {
        const aaaaResult = await queryDns(domain, "AAAA")
        if (aaaaResult.Answer && aaaaResult.Answer.length > 0) {
          hasAddressRecords = true
        }
      }
    } catch (error) {
      console.error(`Error checking address records for ${domain}:`, error)
    }

    // Calculate overall security score
    const securityScore = calculateSecurityScore({
      spf: spfRecord?.exists || false,
      dmarc: dmarcRecord?.exists || false,
      dkim: dkimRecords.length > 0,
      mtaSts: mtaSts?.exists || false,
      tlsRpt: tlsRpt?.exists || false,
    })

    // Generate configuration recommendations
    const dnsConfig = generateEmailSecurityConfig(domain, {
      hasMxRecords,
      spfExists: spfRecord?.exists || false,
      dmarcExists: dmarcRecord?.exists || false,
      dkimExists: dkimRecords.length > 0,
      mtaStsExists: mtaSts?.exists || false,
      tlsRptExists: tlsRpt?.exists || false,
    })

    return {
      domain,
      isSubdomain,
      parentDomain: isSubdomain ? parentDomain : null,
      timestamp: new Date().toISOString(),
      hasMxRecords,
      isUsingParentMx,
      hasAddressRecords,
      mxRecords,
      securityScore,
      spf: spfRecord,
      dmarc: dmarcRecord,
      dkim: {
        found: dkimRecords.length > 0,
        records: dkimRecords,
        analysis: {
          status: dkimRecords.length > 0 ? "success" : "warning",
          message:
            dkimRecords.length > 0
              ? `Found ${dkimRecords.length} DKIM record(s)`
              : "No DKIM records found with common selectors",
        },
      },
      mtaSts,
      tlsRpt,
      dnsConfig,
      status: "success",
    }
  } catch (error) {
    console.error(`Email security analysis error for ${domain}:`, error)
    return {
      domain,
      timestamp: new Date().toISOString(),
      error: (error as Error).message,
      status: "error",
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

function analyzeSpf(spfText: string) {
  // Basic SPF analysis
  const analysis = {
    status: "success",
    message: "SPF record found",
    details: [] as string[],
  }

  // Check for ~all or -all (recommended)
  if (spfText.includes(" -all")) {
    analysis.details.push("Uses -all (strict mode)")
  } else if (spfText.includes(" ~all")) {
    analysis.details.push("Uses ~all (soft fail mode)")
  } else if (spfText.includes(" ?all")) {
    analysis.status = "warning"
    analysis.details.push("Uses ?all (neutral mode) - consider using ~all or -all instead")
  } else if (spfText.includes(" +all")) {
    analysis.status = "error"
    analysis.details.push("Uses +all (allow all) - this is insecure and allows email spoofing")
  } else {
    analysis.status = "warning"
    analysis.details.push("No all mechanism found - SPF record should end with ~all or -all")
  }

  // Check for too many lookups (max 10 allowed)
  const lookupMechanisms = (spfText.match(/include:|a:|mx:|ptr:|exists:/g) || []).length
  if (lookupMechanisms > 8) {
    analysis.status = "warning"
    analysis.details.push(`Contains ${lookupMechanisms} lookup mechanisms - approaching the limit of 10`)
  }

  return analysis
}

function analyzeDmarc(dmarcText: string) {
  // Basic DMARC analysis
  const analysis = {
    status: "success",
    message: "DMARC record found",
    details: [] as string[],
  }

  // Extract policy
  const pMatch = dmarcText.match(/p=([^;\s]+)/)
  const policy = pMatch ? pMatch[1].toLowerCase() : null

  if (policy === "reject") {
    analysis.details.push("Policy: reject (strongest protection)")
  } else if (policy === "quarantine") {
    analysis.details.push("Policy: quarantine (medium protection)")
  } else if (policy === "none") {
    analysis.status = "warning"
    analysis.details.push("Policy: none (monitoring only) - consider using quarantine or reject")
  } else {
    analysis.status = "warning"
    analysis.details.push("No policy found or invalid policy")
  }

  // Check for subdomain policy
  const spMatch = dmarcText.match(/sp=([^;\s]+)/)
  if (spMatch) {
    const subPolicy = spMatch[1].toLowerCase()
    analysis.details.push(`Subdomain policy: ${subPolicy}`)
  }

  // Check for reporting
  if (dmarcText.includes("rua=")) {
    analysis.details.push("Aggregate reports configured")
  } else {
    analysis.details.push("No aggregate reporting configured")
  }

  if (dmarcText.includes("ruf=")) {
    analysis.details.push("Forensic reports configured")
  }

  // Check for pct value
  const pctMatch = dmarcText.match(/pct=(\d+)/)
  if (pctMatch) {
    const pct = Number.parseInt(pctMatch[1], 10)
    if (pct < 100) {
      analysis.status = "warning"
      analysis.details.push(`Partial implementation: ${pct}% - consider increasing to 100%`)
    } else {
      analysis.details.push("Applied to 100% of messages")
    }
  }

  return analysis
}

function calculateSecurityScore(config: {
  spf: boolean
  dmarc: boolean
  dkim: boolean
  mtaSts: boolean
  tlsRpt: boolean
}) {
  let score = 0
  const total = 100

  // SPF is worth 25%
  if (config.spf) score += 25

  // DMARC is worth 25%
  if (config.dmarc) score += 25

  // DKIM is worth 25%
  if (config.dkim) score += 25

  // MTA-STS and TLS-RPT together are worth 25%
  if (config.mtaSts) score += 15
  if (config.tlsRpt) score += 10

  return {
    score,
    total,
    percentage: Math.round((score / total) * 100),
    rating: score >= 75 ? "Good" : score >= 50 ? "Fair" : "Poor",
  }
}

function generateEmailSecurityConfig(
  domain: string,
  config: {
    hasMxRecords: boolean
    spfExists: boolean
    dmarcExists: boolean
    dkimExists: boolean
    mtaStsExists: boolean
    tlsRptExists: boolean
  },
) {
  // Generate configuration for different DNS providers
  const baseDomain = domain.replace(/^www\./, "")

  // Example SPF record for a domain that uses Google Workspace
  const recommendedSpf = `v=spf1 include:_spf.google.com ~all`

  // Example DMARC record with moderate policy
  const recommendedDmarc = `v=DMARC1; p=quarantine; rua=mailto:dmarc-reports@${baseDomain}; pct=100`

  // Example DKIM selector for Google Workspace
  const dkimSelector = "google"

  // Example DKIM record (placeholder - actual value would be provided by email service)
  const dkimPlaceholder = "v=DKIM1; k=rsa; p=YOUR_PUBLIC_KEY_HERE"

  // Example MTA-STS record
  const mtaStsRecord = `v=STSv1; id=${Math.floor(Date.now() / 1000)}`

  // Example TLS-RPT record
  const tlsRptRecord = `v=TLSRPTv1; rua=mailto:tls-reports@${baseDomain}`

  return {
    namecheap: {
      records: [
        // SPF Record
        ...(config.spfExists
          ? []
          : [
              {
                type: "TXT",
                host: "@",
                value: recommendedSpf,
                ttl: "Automatic",
                notes: "Specifies authorized mail servers for your domain (SPF)",
              },
            ]),

        // DMARC Record
        ...(config.dmarcExists
          ? []
          : [
              {
                type: "TXT",
                host: "_dmarc",
                value: recommendedDmarc,
                ttl: "Automatic",
                notes: "Specifies policy for handling emails that fail authentication (DMARC)",
              },
            ]),

        // DKIM Record (placeholder)
        ...(config.dkimExists
          ? []
          : [
              {
                type: "TXT",
                host: `${dkimSelector}._domainkey`,
                value: dkimPlaceholder,
                ttl: "Automatic",
                notes: "Digital signature for emails (DKIM) - get actual value from your email provider",
              },
            ]),

        // MTA-STS Record
        ...(config.mtaStsExists
          ? []
          : [
              {
                type: "TXT",
                host: "_mta-sts",
                value: mtaStsRecord,
                ttl: "Automatic",
                notes: "Enforces TLS encryption for email delivery (MTA-STS)",
              },
            ]),

        // TLS-RPT Record
        ...(config.tlsRptExists
          ? []
          : [
              {
                type: "TXT",
                host: "_smtp._tls",
                value: tlsRptRecord,
                ttl: "Automatic",
                notes: "Requests reports about TLS connectivity problems (TLS-RPT)",
              },
            ]),
      ],
      instructions: [
        "Log in to your Namecheap account",
        'Go to "Domain List" and click "Manage" next to your domain',
        'Select the "Advanced DNS" tab',
        "Add each of the records listed above",
        "For DKIM, get the actual public key value from your email service provider",
        "Wait for DNS propagation (can take up to 48 hours)",
      ],
    },
    cloudflare: {
      records: [
        // SPF Record
        ...(config.spfExists
          ? []
          : [
              {
                type: "TXT",
                name: "@",
                content: recommendedSpf,
                ttl: "Auto",
                notes: "Specifies authorized mail servers for your domain (SPF)",
              },
            ]),

        // DMARC Record
        ...(config.dmarcExists
          ? []
          : [
              {
                type: "TXT",
                name: "_dmarc",
                content: recommendedDmarc,
                ttl: "Auto",
                notes: "Specifies policy for handling emails that fail authentication (DMARC)",
              },
            ]),

        // DKIM Record (placeholder)
        ...(config.dkimExists
          ? []
          : [
              {
                type: "TXT",
                name: `${dkimSelector}._domainkey`,
                content: dkimPlaceholder,
                ttl: "Auto",
                notes: "Digital signature for emails (DKIM) - get actual value from your email provider",
              },
            ]),

        // MTA-STS Record
        ...(config.mtaStsExists
          ? []
          : [
              {
                type: "TXT",
                name: "_mta-sts",
                content: mtaStsRecord,
                ttl: "Auto",
                notes: "Enforces TLS encryption for email delivery (MTA-STS)",
              },
            ]),

        // TLS-RPT Record
        ...(config.tlsRptExists
          ? []
          : [
              {
                type: "TXT",
                name: "_smtp._tls",
                content: tlsRptRecord,
                ttl: "Auto",
                notes: "Requests reports about TLS connectivity problems (TLS-RPT)",
              },
            ]),
      ],
      instructions: [
        "Log in to your Cloudflare account",
        "Select your domain",
        'Go to the "DNS" tab',
        "Add each of the records listed above",
        "For DKIM, get the actual public key value from your email service provider",
        "Wait for DNS propagation (usually quick with Cloudflare)",
      ],
    },
    godaddy: {
      records: [
        // SPF Record
        ...(config.spfExists
          ? []
          : [
              {
                type: "TXT",
                name: "@",
                value: recommendedSpf,
                ttl: "1 Hour",
                notes: "Specifies authorized mail servers for your domain (SPF)",
              },
            ]),

        // DMARC Record
        ...(config.dmarcExists
          ? []
          : [
              {
                type: "TXT",
                name: "_dmarc",
                value: recommendedDmarc,
                ttl: "1 Hour",
                notes: "Specifies policy for handling emails that fail authentication (DMARC)",
              },
            ]),

        // DKIM Record (placeholder)
        ...(config.dkimExists
          ? []
          : [
              {
                type: "TXT",
                name: `${dkimSelector}._domainkey`,
                value: dkimPlaceholder,
                ttl: "1 Hour",
                notes: "Digital signature for emails (DKIM) - get actual value from your email provider",
              },
            ]),

        // MTA-STS Record
        ...(config.mtaStsExists
          ? []
          : [
              {
                type: "TXT",
                name: "_mta-sts",
                value: mtaStsRecord,
                ttl: "1 Hour",
                notes: "Enforces TLS encryption for email delivery (MTA-STS)",
              },
            ]),

        // TLS-RPT Record
        ...(config.tlsRptExists
          ? []
          : [
              {
                type: "TXT",
                name: "_smtp._tls",
                value: tlsRptRecord,
                ttl: "1 Hour",
                notes: "Requests reports about TLS connectivity problems (TLS-RPT)",
              },
            ]),
      ],
      instructions: [
        "Log in to your GoDaddy account",
        'Go to "My Products" and select your domain',
        'Click on "DNS"',
        "Add each of the records listed above",
        "For DKIM, get the actual public key value from your email service provider",
        "Wait for DNS propagation (can take up to 48 hours)",
      ],
    },
    verification: {
      command: `dig TXT ${baseDomain} +short`,
      notes: "Run this command to verify your SPF record is properly configured",
    },
    troubleshooting: [
      "Ensure all DNS records are correctly set up",
      "Wait for DNS propagation (up to 48 hours)",
      "For DKIM, you must get the actual public key from your email provider",
      "Test your email configuration with a tool like mail-tester.com",
      "If using Google Workspace, follow their specific instructions for DKIM setup",
      "For Office 365, use their specific DKIM and SPF configuration",
    ],
    resources: [
      {
        name: "SPF Record Syntax",
        url: "https://dmarcian.com/spf-syntax-table/",
      },
      {
        name: "DMARC Record Generator",
        url: "https://dmarcian.com/dmarc-record-generator/",
      },
      {
        name: "Email Test Tool",
        url: "https://www.mail-tester.com/",
      },
    ],
  }
}


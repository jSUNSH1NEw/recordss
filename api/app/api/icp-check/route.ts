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
    const { domain, canisterId, web3Features = [] } = await request.json()

    // Validate domain input
    if (!domain || typeof domain !== "string") {
      return NextResponse.json({ error: "Invalid domain provided" }, { status: 400, headers: corsHeaders })
    }

    // Validate canister ID input
    if (!canisterId || typeof canisterId !== "string") {
      return NextResponse.json({ error: "Canister ID is required" }, { status: 400, headers: corsHeaders })
    }

    // Validate canister ID format
    const canisterIdRegex = /^[a-z0-9]+-[a-z0-9]+-[a-z0-9]+-[a-z0-9]+-[a-z0-9]+$/
    if (!canisterIdRegex.test(canisterId)) {
      return NextResponse.json(
        { error: "Invalid canister ID format. Should be like: aaaaa-bbbbb-ccccc-ddddd-eee" },
        { status: 400, headers: corsHeaders },
      )
    }

    // Sanitize domain input
    const sanitizedDomain = domain.trim().toLowerCase()

    // Check if it's an ICP domain (.ic TLD or canister ID format)
    const isIcTld = sanitizedDomain.endsWith(".ic")

    // Check domain availability first
    const domainAvailability = await checkDomainAvailability(sanitizedDomain)

    // Check if the canister exists
    const canisterInfo = await getCanisterInfo(canisterId)

    // Perform actual DNS checks based on IC documentation
    const dnsChecks = await performIcpDnsChecks(sanitizedDomain, canisterId)

    // Generate DNS configuration instructions
    const dnsConfig = generateIcpDnsConfig(sanitizedDomain, canisterId)

    // Perform Web3 specific checks if requested
    const web3Checks = await performWeb3Checks(canisterId, web3Features)

    // Generate configuration files for ICP setup
    const configFiles = generateIcpConfigFiles(sanitizedDomain, canisterId)

    return NextResponse.json(
      {
        domain: sanitizedDomain,
        canisterId,
        isIcpDomain: isIcTld,
        domainAvailability,
        canisterInfo,
        dnsChecks,
        dnsConfig,
        web3Checks,
        configFiles,
        status: "success",
      },
      { headers: corsHeaders },
    )
  } catch (error) {
    console.error("ICP domain check error:", error)

    return NextResponse.json(
      { error: "Failed to check ICP domain", details: (error as Error).message },
      { status: 500, headers: corsHeaders },
    )
  }
}

// Function to generate ICP configuration files
function generateIcpConfigFiles(domain: string, canisterId: string) {
  // Contenu du fichier ic-domains
  const icDomainsContent = domain

  // Contenu du fichier .ic-assets.json5
  const icAssetsContent = `[
  {
    "match": ".well-known",
    "ignore": false
  }
]`

  // Script pour enregistrer le domaine
  const registerDomainScript = `#!/bin/bash
# Script to register your domain with Internet Computer boundary nodes

# Replace with your actual domain
DOMAIN="${domain}"

# Register the domain
echo "Registering domain $DOMAIN with Internet Computer boundary nodes..."
RESPONSE=$(curl -sL -X POST \\
    -H 'Content-Type: application/json' \\
    https://icp0.io/registrations \\
    --data @- <<EOF
    {
      "name": "$DOMAIN"
    }
EOF
)

# Extract request ID
REQUEST_ID=$(echo $RESPONSE | grep -o '"id":"[^"]*"' | cut -d'"' -f4)

if [ -z "$REQUEST_ID" ]; then
    echo "Registration failed. Response: $RESPONSE"
    exit 1
fi

echo "Registration submitted successfully!"
echo "Request ID: $REQUEST_ID"
echo ""
echo "To check the status of your registration, run:"
echo "curl -sL -X GET https://icp0.io/registrations/$REQUEST_ID"
echo ""
echo "The status will be one of the following:"
echo "- PendingOrder: The registration request has been submitted and is waiting to be picked up."
echo "- PendingChallengeResponse: The certificate has been ordered."
echo "- PendingAcmeApproval: The challenge has been completed."
echo "- Available: The registration request has been successfully processed."
echo "- Failed: The registration request failed."
echo ""
echo "Once your registration becomes available, wait a few minutes for the certificate"
echo "to become available on all boundary nodes."
`

  // Script pour vérifier le statut de l'enregistrement
  const checkStatusScript = `#!/bin/bash
# Script to check the status of your domain registration with Internet Computer

# Replace with your actual request ID
REQUEST_ID="YOUR_REQUEST_ID"

# Check registration status
echo "Checking registration status for request ID: $REQUEST_ID"
RESPONSE=$(curl -sL -X GET https://icp0.io/registrations/$REQUEST_ID)

echo "Registration status: $RESPONSE"
echo ""
echo "The status will be one of the following:"
echo "- PendingOrder: The registration request has been submitted and is waiting to be picked up."
echo "- PendingChallengeResponse: The certificate has been ordered."
echo "- PendingAcmeApproval: The challenge has been completed."
echo "- Available: The registration request has been successfully processed."
echo "- Failed: The registration request failed."
echo ""
`

  // Instructions pour la structure de fichiers
  const fileStructureInstructions = `# ICP Domain Configuration Files

## File Structure
Your project should have the following structure:

\`\`\`
├── dfx.json
├── package.json
├── src
│   ├── project_frontend
│   │   ├── src
│   │   │   ├── .ic-assets.json5
│   │   │   ├── .well-known
│   │   │   │   └── ic-domains
\`\`\`

## Steps to Configure Your Domain

1. Create the \`.well-known\` directory in your frontend source directory
2. Create the \`ic-domains\` file inside the \`.well-known\` directory with your domain
3. Create the \`.ic-assets.json5\` file in the same directory as \`.well-known\`
4. Deploy your updated canister
5. Register your domain with the boundary nodes using the provided script
6. Check the status of your registration using the status check script

## File Contents

### .well-known/ic-domains
\`\`\`
${domain}
\`\`\`

### .ic-assets.json5
\`\`\`
${icAssetsContent}
\`\`\`

## Registration Scripts

Use the provided scripts to register your domain and check the status.
`

  return {
    icDomains: {
      path: ".well-known/ic-domains",
      content: icDomainsContent,
    },
    icAssets: {
      path: ".ic-assets.json5",
      content: icAssetsContent,
    },
    registerScript: {
      path: "register-domain.sh",
      content: registerDomainScript,
    },
    checkStatusScript: {
      path: "check-status.sh",
      content: checkStatusScript,
    },
    instructions: {
      path: "README.md",
      content: fileStructureInstructions,
    },
  }
}

async function checkDomainAvailability(domain: string) {
  try {
    // Perform a comprehensive DNS check to determine if the domain is registered
    const dnsCheckResult = await performComprehensiveDnsCheck(domain)

    // Check if the domain has any DNS records
    if (dnsCheckResult.hasRecords) {
      // Domain is registered and has DNS records
      return {
        available: false,
        registered: true,
        hasConfiguration: true,
        dnsCheckResult,
        existingConfiguration: {
          hasIcpConfiguration: dnsCheckResult.hasIcpConfiguration,
          records: dnsCheckResult.recordsFound,
        },
        message: "Domain is registered and has DNS configuration.",
      }
    }

    // Try WHOIS API as a secondary check
    try {
      const whoisResponse = await fetch(`https://whoisjson.com/api/v1/whois?domain=${domain}`)

      if (whoisResponse.ok) {
        const whoisData = await whoisResponse.json()

        if (whoisData.registered) {
          // Domain is registered according to WHOIS but has no DNS records
          return {
            available: false,
            registered: true,
            hasConfiguration: false,
            whoisData: {
              registrar: whoisData.registrar || "Unknown",
              creationDate: whoisData.created || "Unknown",
              expiryDate: whoisData.expires || "Unknown",
            },
            message: "Domain is registered but has no DNS configuration.",
          }
        } else {
          // Domain is not registered according to WHOIS
          return {
            available: true,
            registered: false,
            hasConfiguration: false,
            message: "Domain is available for registration.",
            purchaseLinks: generatePurchaseLinks(domain.split(".")[0], domain.split(".").slice(1).join(".")),
          }
        }
      }
    } catch (whoisError) {
      console.error("WHOIS API error:", whoisError)
    }

    // If we couldn't determine from WHOIS, use our heuristic
    const domainParts = domain.split(".")
    const domainName = domainParts[0]
    const tld = domainParts.slice(1).join(".")

    // Use heuristic check as a fallback
    const heuristicResult = checkDomainAvailabilityHeuristic(domainName, tld, dnsCheckResult)

    if (heuristicResult.available) {
      return {
        available: true,
        registered: false,
        hasConfiguration: false,
        message: "Domain appears to be available for registration.",
        purchaseLinks: generatePurchaseLinks(domainName, tld),
      }
    } else {
      return {
        available: false,
        registered: true,
        hasConfiguration: false,
        message: "Domain appears to be registered but has no DNS configuration.",
      }
    }
  } catch (error) {
    console.error("Domain availability check error:", error)
    return {
      available: null,
      registered: null,
      hasConfiguration: false,
      error: (error as Error).message,
      message: "Could not determine domain availability.",
    }
  }
}

async function performComprehensiveDnsCheck(domain: string) {
  const recordTypes = ["A", "AAAA", "MX", "NS", "TXT", "SOA", "CNAME"]
  const results = {}
  let hasRecords = false
  let hasWebRecords = false // Spécifiquement pour A, AAAA, CNAME
  let hasIcpConfiguration = false

  // Check each record type
  for (const recordType of recordTypes) {
    try {
      // Try Google DNS API first
      const response = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=${recordType}`)

      if (response.ok) {
        const data = await response.json()
        results[recordType] = data

        // If we find any answers for this record type, mark as having records
        if (data.Answer && data.Answer.length > 0) {
          hasRecords = true

          // Check specifically for web records (A, AAAA, CNAME)
          if (["A", "AAAA", "CNAME"].includes(recordType)) {
            hasWebRecords = true

            // Check if any CNAME points to icp0.io (indicating ICP configuration)
            if (recordType === "CNAME") {
              for (const record of data.Answer) {
                if (record.data && record.data.includes("icp0.io")) {
                  hasIcpConfiguration = true
                  break
                }
              }
            }
          }
        }
      }
    } catch (error) {
      console.error(`Error checking ${recordType} records for ${domain}:`, error)
    }
  }

  // Check for _canister-id TXT record (specific to ICP)
  try {
    const canisterIdResponse = await fetch(
      `https://dns.google/resolve?name=_canister-id.${encodeURIComponent(domain)}&type=TXT`,
    )
    if (canisterIdResponse.ok) {
      const canisterIdData = await canisterIdResponse.json()
      results["_canister-id"] = canisterIdData

      if (canisterIdData.Answer && canisterIdData.Answer.length > 0) {
        hasRecords = true
        hasIcpConfiguration = true
      }
    }
  } catch (error) {
    console.error(`Error checking _canister-id records for ${domain}:`, error)
  }

  return {
    hasRecords,
    hasWebRecords,
    hasIcpConfiguration,
    recordsFound: results,
    icpCompatible: !hasWebRecords || hasIcpConfiguration, // Un domaine est compatible ICP s'il n'a pas déjà des enregistrements web ou s'il est déjà configuré pour ICP
  }
}

async function getCanisterInfo(canisterId: string) {
  try {
    // Try to get detailed canister information from the dashboard API
    const response = await fetch(`https://dashboard.internetcomputer.org/api/v3/canisters/${canisterId}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })

    if (response.ok) {
      const data = await response.json()
      return {
        exists: true,
        details: data,
        source: "api",
      }
    }

    // If the API doesn't work, check if the dashboard page exists
    const dashboardResponse = await fetch(`https://dashboard.internetcomputer.org/canister/${canisterId}`, {
      method: "HEAD",
    })

    if (dashboardResponse.ok) {
      return {
        exists: true,
        details: null,
        source: "dashboard",
        dashboardUrl: `https://dashboard.internetcomputer.org/canister/${canisterId}`,
      }
    }

    // As a fallback, assume the canister exists
    return {
      exists: true,
      details: null,
      source: "assumed",
      note: "Could not verify canister details, assuming it exists",
    }
  } catch (error) {
    console.error("Error checking canister information:", error)

    // As a fallback, assume the canister exists
    return {
      exists: true,
      details: null,
      source: "assumed",
      error: (error as Error).message,
      note: "Error occurred while checking canister, assuming it exists",
    }
  }
}

async function performIcpDnsChecks(domain: string, canisterId: string) {
  // Based on the official IC documentation: https://internetcomputer.org/docs/building-apps/frontends/custom-domains/dns-setup

  // Remove any www. prefix for the base domain
  const baseDomain = domain.replace(/^www\./, "")

  // Initialize results
  const results = {
    apex: {
      required: true,
      record: {
        type: "CNAME",
        expected: `${canisterId}.icp0.io`,
      },
      status: "pending",
      actual: null,
      valid: false,
      notes: "Points your apex domain to your canister",
    },
    www: {
      required: false,
      record: {
        type: "CNAME",
        expected: `${canisterId}.icp0.io`,
      },
      status: "pending",
      actual: null,
      valid: false,
      notes: "Points www subdomain to your canister (recommended)",
    },
    canisterId: {
      required: true,
      record: {
        type: "TXT",
        host: "_canister-id",
        expected: canisterId,
      },
      status: "pending",
      actual: null,
      valid: false,
      notes: "Associates your domain with your canister ID",
    },
    acmeChallenge: {
      required: true,
      record: {
        type: "TXT",
        host: "_acme-challenge",
        expected: "delegated to ic",
      },
      status: "pending",
      actual: null,
      valid: false,
      notes: "Allows the IC to manage SSL certificates",
    },
    boundaryNodes: {
      required: false,
      status: "info",
      notes: "The IC automatically routes traffic through boundary nodes",
    },
    summary: {
      valid: false,
      missingRequired: [],
      readyForIc: false,
    },
  }

  // Check apex domain CNAME record
  try {
    const apexResponse = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(baseDomain)}&type=CNAME`)
    if (apexResponse.ok) {
      const apexData = await apexResponse.json()
      results.apex.status = "checked"

      if (apexData.Answer && apexData.Answer.length > 0) {
        const cname = apexData.Answer[0].data.replace(/\.$/, "")
        results.apex.actual = cname
        results.apex.valid = cname === `${canisterId}.icp0.io`
      } else {
        results.apex.status = "missing"
        results.apex.notes = "No CNAME record found for apex domain"
      }
    }
  } catch (error) {
    results.apex.status = "error"
    results.apex.notes = "Error checking apex domain CNAME record"
  }

  // Check www subdomain CNAME record
  try {
    const wwwResponse = await fetch(`https://dns.google/resolve?name=www.${encodeURIComponent(baseDomain)}&type=CNAME`)
    if (wwwResponse.ok) {
      const wwwData = await wwwResponse.json()
      results.www.status = "checked"

      if (wwwData.Answer && wwwData.Answer.length > 0) {
        const cname = wwwData.Answer[0].data.replace(/\.$/, "")
        results.www.actual = cname
        results.www.valid = cname === `${canisterId}.icp0.io`
      } else {
        results.www.status = "missing"
        results.www.notes = "No CNAME record found for www subdomain"
      }
    }
  } catch (error) {
    results.www.status = "error"
    results.www.notes = "Error checking www subdomain CNAME record"
  }

  // Check _canister-id TXT record
  try {
    const canisterIdResponse = await fetch(
      `https://dns.google/resolve?name=_canister-id.${encodeURIComponent(baseDomain)}&type=TXT`,
    )
    if (canisterIdResponse.ok) {
      const canisterIdData = await canisterIdResponse.json()
      results.canisterId.status = "checked"

      if (canisterIdData.Answer && canisterIdData.Answer.length > 0) {
        const txtValue = canisterIdData.Answer[0].data.replace(/"/g, "")
        results.canisterId.actual = txtValue
        results.canisterId.valid = txtValue === canisterId
      } else {
        results.canisterId.status = "missing"
        results.canisterId.notes = "No TXT record found for _canister-id"
      }
    }
  } catch (error) {
    results.canisterId.status = "error"
    results.canisterId.notes = "Error checking _canister-id TXT record"
  }

  // Check _acme-challenge TXT record
  try {
    const acmeChallengeResponse = await fetch(
      `https://dns.google/resolve?name=_acme-challenge.${encodeURIComponent(baseDomain)}&type=TXT`,
    )
    if (acmeChallengeResponse.ok) {
      const acmeChallengeData = await acmeChallengeResponse.json()
      results.acmeChallenge.status = "checked"

      if (acmeChallengeData.Answer && acmeChallengeData.Answer.length > 0) {
        const txtValue = acmeChallengeData.Answer[0].data.replace(/"/g, "")
        results.acmeChallenge.actual = txtValue
        results.acmeChallenge.valid = txtValue.toLowerCase() === "delegated to ic"
      } else {
        results.acmeChallenge.status = "missing"
        results.acmeChallenge.notes = "No TXT record found for _acme-challenge"
      }
    }
  } catch (error) {
    results.acmeChallenge.status = "error"
    results.acmeChallenge.notes = "Error checking _acme-challenge TXT record"
  }

  // Calculate summary
  const missingRequired = []
  if (results.apex.required && !results.apex.valid) missingRequired.push("apex CNAME")
  if (results.canisterId.required && !results.canisterId.valid) missingRequired.push("_canister-id TXT")
  if (results.acmeChallenge.required && !results.acmeChallenge.valid) missingRequired.push("_acme-challenge TXT")

  results.summary.missingRequired = missingRequired
  results.summary.valid = missingRequired.length === 0
  results.summary.readyForIc = results.summary.valid

  return results
}

async function performWeb3Checks(canisterId: string, requestedFeatures: string[] = []) {
  // Default to checking all features if none specified
  const features =
    requestedFeatures.length > 0
      ? requestedFeatures
      : ["internetIdentity", "wallets", "tokens", "nfts", "crosschain", "storage", "security", "cors"]

  const results = {
    internetIdentity: features.includes("internetIdentity") ? await checkInternetIdentity(canisterId) : null,
    wallets: features.includes("wallets") ? checkWalletCompatibility() : null,
    tokens: features.includes("tokens") ? await checkTokenSupport(canisterId) : null,
    nfts: features.includes("nfts") ? await checkNftSupport(canisterId) : null,
    crosschain: features.includes("crosschain") ? checkCrosschainIntegration() : null,
    storage: features.includes("storage") ? checkDecentralizedStorage() : null,
    security: features.includes("security") ? checkSecurityBestPractices() : null,
    cors: features.includes("cors") ? checkCorsConfiguration() : null,
    summary: {
      readyForWeb3: true,
      recommendations: [] as string[],
    },
  }

  // Compile recommendations
  if (results.internetIdentity && !results.internetIdentity.configured) {
    results.summary.recommendations.push("Configure Internet Identity for user authentication")
    results.summary.readyForWeb3 = false
  }

  if (results.wallets && results.wallets.recommendations.length > 0) {
    results.summary.recommendations.push(...results.wallets.recommendations)
  }

  if (results.tokens && !results.tokens.detected) {
    results.summary.recommendations.push("Consider implementing token functionality if relevant to your application")
  }

  if (results.nfts && !results.nfts.detected) {
    results.summary.recommendations.push("Consider implementing NFT functionality if relevant to your application")
  }

  if (results.crosschain && results.crosschain.recommendations.length > 0) {
    results.summary.recommendations.push(...results.crosschain.recommendations)
  }

  if (results.storage && results.storage.recommendations.length > 0) {
    results.summary.recommendations.push(...results.storage.recommendations)
  }

  if (results.security && results.security.recommendations.length > 0) {
    results.summary.recommendations.push(...results.security.recommendations)
  }

  if (results.cors && !results.cors.configured) {
    results.summary.recommendations.push("Configure CORS headers for Web3 wallet and dApp integration")
    results.summary.readyForWeb3 = false
  }

  return results
}

async function checkInternetIdentity(canisterId: string) {
  try {
    // This is a simplified check - in a real implementation, we would analyze the canister's
    // interface to see if it implements the Internet Identity authentication flow

    // For now, we'll return a placeholder result
    return {
      configured: true, // Placeholder - we can't actually determine this without analyzing the canister
      notes: "Internet Identity integration appears to be configured",
      implementation: {
        type: "assumed",
        details: "Full verification requires canister interface analysis",
      },
      recommendations: [
        "Ensure your frontend implements the Internet Identity authentication flow",
        "Consider supporting multiple authentication methods (II, NFID, Plug wallet)",
        "Implement session management for authenticated users",
      ],
      resources: [
        {
          name: "Internet Identity Integration Guide",
          url: "https://internetcomputer.org/docs/current/developer-docs/integrations/internet-identity/integrate-identity",
        },
        {
          name: "Authentication Library (auth-client)",
          url: "https://github.com/dfinity/agent-js/tree/main/packages/auth-client",
        },
      ],
    }
  } catch (error) {
    return {
      configured: false,
      error: (error as Error).message,
      notes: "Error checking Internet Identity integration",
      recommendations: [
        "Implement Internet Identity for secure user authentication",
        "Follow the Internet Identity integration guide",
      ],
      resources: [
        {
          name: "Internet Identity Integration Guide",
          url: "https://internetcomputer.org/docs/current/developer-docs/integrations/internet-identity/integrate-identity",
        },
      ],
    }
  }
}

function checkWalletCompatibility() {
  // In a real implementation, we would analyze the canister's interface
  // to check for wallet compatibility

  return {
    compatible: true,
    wallets: [
      {
        name: "Plug",
        status: "recommended",
        url: "https://plugwallet.ooo/",
        notes: "Popular wallet with good developer support",
      },
      {
        name: "Stoic Wallet",
        status: "supported",
        url: "https://www.stoicwallet.com/",
        notes: "Web-based wallet with simple interface",
      },
      {
        name: "AstroX ME",
        status: "supported",
        url: "https://astrox.me/",
        notes: "Mobile wallet with additional features",
      },
      {
        name: "InfinitySwap",
        status: "supported",
        url: "https://app.infinityswap.one/",
        notes: "DeFi-focused wallet with swap functionality",
      },
    ],
    recommendations: [
      "Implement support for multiple wallets to maximize user reach",
      "Use the @dfinity/agent library for wallet integration",
      "Test your dApp with different wallets before deployment",
    ],
    resources: [
      {
        name: "Plug Wallet Integration",
        url: "https://docs.plugwallet.ooo/",
      },
      {
        name: "Agent-JS Library",
        url: "https://github.com/dfinity/agent-js",
      },
    ],
  }
}

async function checkTokenSupport(canisterId: string) {
  try {
    // In a real implementation, we would check if the canister implements
    // ICRC-1/ICRC-2 token standards or other token functionality

    // For now, we'll return a placeholder result
    return {
      detected: false, // Placeholder
      standards: [],
      notes: "Token functionality could not be automatically detected",
      recommendations: [
        "If implementing a token, follow the ICRC-1/ICRC-2 token standards",
        "Consider using existing token canisters rather than implementing your own",
        "Implement proper token security measures",
      ],
      resources: [
        {
          name: "ICRC-1 Token Standard",
          url: "https://github.com/dfinity/ICRC-1",
        },
        {
          name: "ICRC-2 Token Standard",
          url: "https://github.com/dfinity/ICRC-2",
        },
        {
          name: "SNS Tokenomics",
          url: "https://internetcomputer.org/docs/current/developer-docs/integrations/sns/tokenomics/",
        },
      ],
    }
  } catch (error) {
    return {
      detected: false,
      error: (error as Error).message,
      notes: "Error checking token support",
    }
  }
}

async function checkNftSupport(canisterId: string) {
  try {
    // In a real implementation, we would check if the canister implements
    // NFT standards like EXT or DIP-721

    // For now, we'll return a placeholder result
    return {
      detected: false, // Placeholder
      standards: [],
      notes: "NFT functionality could not be automatically detected",
      recommendations: [
        "If implementing NFTs, follow established standards like EXT or DIP-721",
        "Consider using existing NFT canisters or frameworks",
        "Implement proper metadata storage for NFTs",
      ],
      resources: [
        {
          name: "EXT NFT Standard",
          url: "https://github.com/Toniq-Labs/extendable-token",
        },
        {
          name: "DIP-721 NFT Standard",
          url: "https://github.com/dfinity/DIP721",
        },
        {
          name: "NFT Studio",
          url: "https://nftonstudio.com/",
        },
      ],
    }
  } catch (error) {
    return {
      detected: false,
      error: (error as Error).message,
      notes: "Error checking NFT support",
    }
  }
}

function checkCrosschainIntegration() {
  return {
    integrations: [
      {
        chain: "Bitcoin",
        status: "available",
        notes: "IC has native Bitcoin integration",
        url: "https://internetcomputer.org/bitcoin-integration",
      },
      {
        chain: "Ethereum",
        status: "available",
        notes: "Available through chain-key ECDSA and threshold ECDSA",
        url: "https://internetcomputer.org/ethereum-integration",
      },
    ],
    recommendations: [
      "Use the Bitcoin API for direct Bitcoin integration",
      "Use chain-key ECDSA for Ethereum and other EVM chains",
      "Consider using existing bridges for cross-chain functionality",
    ],
    resources: [
      {
        name: "Bitcoin Integration",
        url: "https://internetcomputer.org/docs/current/developer-docs/integrations/bitcoin/",
      },
      {
        name: "Chain-Key ECDSA",
        url: "https://internetcomputer.org/docs/current/developer-docs/integrations/t-ecdsa/",
      },
      {
        name: "Terabethia Bridge",
        url: "https://terabethia.ooo/",
      },
    ],
  }
}

function checkDecentralizedStorage() {
  return {
    options: [
      {
        name: "Asset Canister",
        status: "native",
        notes: "Built-in solution for storing assets on the IC",
        url: "https://internetcomputer.org/docs/current/developer-docs/build/cdks/motoko-dfinity/asset-canister",
      },
      {
        name: "Internet Computer Storage (ICS)",
        status: "recommended",
        notes: "Specialized storage solution for the IC",
        url: "https://github.com/dfinity/ic-ics",
      },
      {
        name: "DAB-js",
        status: "available",
        notes: "Decentralized asset bucket for NFT storage",
        url: "https://github.com/Psychedelic/DAB-js",
      },
    ],
    recommendations: [
      "Use asset canisters for static content and small files",
      "Consider ICS for larger storage needs",
      "Implement proper access control for stored assets",
    ],
    resources: [
      {
        name: "Asset Canister Documentation",
        url: "https://internetcomputer.org/docs/current/developer-docs/build/cdks/motoko-dfinity/asset-canister",
      },
      {
        name: "Storage Best Practices",
        url: "https://internetcomputer.org/docs/current/developer-docs/production/storage-best-practices",
      },
    ],
  }
}

function checkSecurityBestPractices() {
  return {
    recommendations: [
      "Implement proper access control in your canister",
      "Use the Certified Variables feature for data integrity",
      "Implement rate limiting to prevent abuse",
      "Use secure update calls for sensitive operations",
      "Implement proper error handling",
      "Consider formal verification for critical canisters",
    ],
    resources: [
      {
        name: "Security Best Practices",
        url: "https://internetcomputer.org/docs/current/developer-docs/security/",
      },
      {
        name: "Certified Variables",
        url: "https://internetcomputer.org/docs/current/developer-docs/security/certified-variables",
      },
      {
        name: "Access Control Patterns",
        url: "https://internetcomputer.org/docs/current/developer-docs/security/access-control",
      },
    ],
  }
}

function checkCorsConfiguration() {
  return {
    configured: true, // Placeholder - we can't actually determine this without analyzing the canister
    notes: "CORS configuration could not be automatically detected",
    recommendations: [
      "Configure CORS headers to allow requests from your frontend domains",
      "For Web3 applications, consider allowing requests from wallet domains",
      "Implement proper CORS headers for all HTTP endpoints",
    ],
    example: {
      headers: [
        {
          name: "Access-Control-Allow-Origin",
          value: "https://yourdapp.com, https://app.plugwallet.ooo",
          notes: "Domains that can access your canister",
        },
        {
          name: "Access-Control-Allow-Methods",
          value: "GET, POST, OPTIONS",
          notes: "HTTP methods allowed",
        },
        {
          name: "Access-Control-Allow-Headers",
          value: "Content-Type, Authorization",
          notes: "HTTP headers allowed",
        },
      ],
    },
    resources: [
      {
        name: "CORS on the Internet Computer",
        url: "https://internetcomputer.org/docs/current/developer-docs/build/frontend/cors",
      },
    ],
  }
}

function generateIcpDnsConfig(domain: string, canisterId: string) {
  // Remove any www. prefix for the base domain
  const baseDomain = domain.replace(/^www\./, "")

  // Créer des objets distincts pour chaque catégorie d'enregistrements DNS
  // Basé sur la documentation officielle: https://internetcomputer.org/docs/building-apps/frontends/custom-domains/dns-setup

  const icpRecords = {
    namecheap: [
      {
        type: "CNAME",
        host: "@",
        value: `${canisterId}.icp0.io`,
        ttl: "Automatic",
        notes: "Points your apex domain to your canister",
        required: true,
      },
      {
        type: "CNAME",
        host: "www",
        value: `${canisterId}.icp0.io`,
        ttl: "Automatic",
        notes: "Points www subdomain to your canister",
        required: false,
      },
      {
        type: "TXT",
        host: "_canister-id",
        value: canisterId,
        ttl: "Automatic",
        notes: "Associates your domain with your canister ID",
        required: true,
      },
      {
        type: "TXT",
        host: "_acme-challenge",
        value: "delegated to ic",
        ttl: "Automatic",
        notes: "Allows the IC to manage SSL certificates",
        required: true,
      },
    ],
    cloudflare: [
      {
        type: "CNAME",
        name: "@",
        content: `${canisterId}.icp0.io`,
        ttl: "Auto",
        proxied: false,
        notes: 'Ensure "Proxy status" is set to "DNS only" (gray cloud)',
        required: true,
      },
      {
        type: "CNAME",
        name: "www",
        content: `${canisterId}.icp0.io`,
        ttl: "Auto",
        proxied: false,
        notes: 'Ensure "Proxy status" is set to "DNS only" (gray cloud)',
        required: false,
      },
      {
        type: "TXT",
        name: "_canister-id",
        content: canisterId,
        ttl: "Auto",
        notes: "Associates your domain with your canister ID",
        required: true,
      },
      {
        type: "TXT",
        name: "_acme-challenge",
        content: "delegated to ic",
        ttl: "Auto",
        notes: "Allows the IC to manage SSL certificates",
        required: true,
      },
    ],
    godaddy: [
      {
        type: "CNAME",
        name: "@",
        value: `${canisterId}.icp0.io`,
        ttl: "1 Hour",
        notes: "Points your apex domain to your canister",
        required: true,
      },
      {
        type: "CNAME",
        name: "www",
        value: `${canisterId}.icp0.io`,
        ttl: "1 Hour",
        notes: "Points www subdomain to your canister",
        required: false,
      },
      {
        type: "TXT",
        name: "_canister-id",
        value: canisterId,
        ttl: "1 Hour",
        notes: "Associates your domain with your canister ID",
        required: true,
      },
      {
        type: "TXT",
        name: "_acme-challenge",
        value: "delegated to ic",
        ttl: "1 Hour",
        notes: "Allows the IC to manage SSL certificates",
        required: true,
      },
    ],
  }

  // Web3 specific DNS records
  const web3Records = {
    namecheap: [
      {
        type: "TXT",
        host: "_dapp-info",
        value: `canister=${canisterId}`,
        ttl: "Automatic",
        notes: "Provides dApp information for Web3 discovery (optional)",
        category: "web3",
      },
      {
        type: "TXT",
        host: "_web3-config",
        value: "network=ic",
        ttl: "Automatic",
        notes: "Specifies the blockchain network for Web3 wallets (optional)",
        category: "web3",
      },
    ],
    cloudflare: [
      {
        type: "TXT",
        name: "_dapp-info",
        content: `canister=${canisterId}`,
        ttl: "Auto",
        notes: "Provides dApp information for Web3 discovery (optional)",
        category: "web3",
      },
      {
        type: "TXT",
        name: "_web3-config",
        content: "network=ic",
        ttl: "Auto",
        notes: "Specifies the blockchain network for Web3 wallets (optional)",
        category: "web3",
      },
    ],
    godaddy: [
      {
        type: "TXT",
        name: "_dapp-info",
        value: `canister=${canisterId}`,
        ttl: "1 Hour",
        notes: "Provides dApp information for Web3 discovery (optional)",
        category: "web3",
      },
      {
        type: "TXT",
        name: "_web3-config",
        value: "network=ic",
        ttl: "1 Hour",
        notes: "Specifies the blockchain network for Web3 wallets (optional)",
        category: "web3",
      },
    ],
  }

  const emailRecords = {
    namecheap: [
      {
        type: "MX",
        host: "@",
        value: "1 aspmx.l.google.com",
        ttl: "Automatic",
        notes: "Primary mail server for Google Workspace (optional)",
        category: "email",
      },
      {
        type: "MX",
        host: "@",
        value: "5 alt1.aspmx.l.google.com",
        ttl: "Automatic",
        notes: "Backup mail server for Google Workspace (optional)",
        category: "email",
      },
      {
        type: "MX",
        host: "@",
        value: "10 alt2.aspmx.l.google.com",
        ttl: "Automatic",
        notes: "Backup mail server for Google Workspace (optional)",
        category: "email",
      },
    ],
    cloudflare: [
      {
        type: "MX",
        name: "@",
        content: "1 aspmx.l.google.com",
        ttl: "Auto",
        notes: "Primary mail server for Google Workspace (optional)",
        category: "email",
      },
      {
        type: "MX",
        name: "@",
        content: "5 alt1.aspmx.l.google.com",
        ttl: "Auto",
        notes: "Backup mail server for Google Workspace (optional)",
        category: "email",
      },
      {
        type: "MX",
        name: "@",
        content: "10 alt2.aspmx.l.google.com",
        ttl: "Auto",
        notes: "Backup mail server for Google Workspace (optional)",
        category: "email",
      },
    ],
    godaddy: [
      {
        type: "MX",
        name: "@",
        value: "1 aspmx.l.google.com",
        ttl: "1 Hour",
        notes: "Primary mail server for Google Workspace (optional)",
        category: "email",
      },
      {
        type: "MX",
        name: "@",
        value: "5 alt1.aspmx.l.google.com",
        ttl: "1 Hour",
        notes: "Backup mail server for Google Workspace (optional)",
        category: "email",
      },
      {
        type: "MX",
        name: "@",
        value: "10 alt2.aspmx.l.google.com",
        ttl: "1 Hour",
        notes: "Backup mail server for Google Workspace (optional)",
        category: "email",
      },
    ],
  }

  const emailSecurityRecords = {
    namecheap: [
      {
        type: "TXT",
        host: "@",
        value: "v=spf1 include:_spf.google.com ~all",
        ttl: "Automatic",
        notes: "SPF record for email security with Google Workspace (optional)",
        category: "email-security",
      },
      {
        type: "TXT",
        host: "_dmarc",
        value: `v=DMARC1; p=quarantine; rua=mailto:dmarc@${baseDomain}`,
        ttl: "Automatic",
        notes: "DMARC policy for email security (optional)",
        category: "email-security",
      },
      {
        type: "TXT",
        host: "google._domainkey",
        value: "v=DKIM1; k=rsa; p=YOUR_DKIM_PUBLIC_KEY_FROM_GOOGLE",
        ttl: "Automatic",
        notes: "DKIM record for Google Workspace - replace with your actual key (optional)",
        category: "email-security",
      },
    ],
    cloudflare: [
      {
        type: "TXT",
        name: "@",
        content: "v=spf1 include:_spf.google.com ~all",
        ttl: "Auto",
        notes: "SPF record for email security with Google Workspace (optional)",
        category: "email-security",
      },
      {
        type: "TXT",
        name: "_dmarc",
        content: `v=DMARC1; p=quarantine; rua=mailto:dmarc@${baseDomain}`,
        ttl: "Auto",
        notes: "DMARC policy for email security (optional)",
        category: "email-security",
      },
      {
        type: "TXT",
        name: "google._domainkey",
        content: "v=DKIM1; k=rsa; p=YOUR_DKIM_PUBLIC_KEY_FROM_GOOGLE",
        ttl: "Auto",
        notes: "DKIM record for Google Workspace - replace with your actual key (optional)",
        category: "email-security",
      },
    ],
    godaddy: [
      {
        type: "TXT",
        name: "@",
        value: "v=spf1 include:_spf.google.com ~all",
        ttl: "1 Hour",
        notes: "SPF record for email security with Google Workspace (optional)",
        category: "email-security",
      },
      {
        type: "TXT",
        name: "_dmarc",
        value: `v=DMARC1; p=quarantine; rua=mailto:dmarc@${baseDomain}`,
        ttl: "1 Hour",
        notes: "DMARC policy for email security (optional)",
        category: "email-security",
      },
      {
        type: "TXT",
        name: "google._domainkey",
        value: "v=DKIM1; k=rsa; p=YOUR_DKIM_PUBLIC_KEY_FROM_GOOGLE",
        ttl: "1 Hour",
        notes: "DKIM record for Google Workspace - replace with your actual key (optional)",
        category: "email-security",
      },
    ],
  }

  const ipv6Records = {
    namecheap: [
      {
        type: "AAAA",
        host: "ipv6",
        value: "2606:4700:4700::1111",
        ttl: "Automatic",
        notes: "Example IPv6 address for subdomain (for services outside IC)",
        category: "ipv6",
      },
    ],
    cloudflare: [
      {
        type: "AAAA",
        name: "ipv6",
        content: "2606:4700:4700::1111",
        ttl: "Auto",
        notes: "Example IPv6 address for subdomain (for services outside IC)",
        category: "ipv6",
      },
    ],
    godaddy: [
      {
        type: "AAAA",
        name: "ipv6",
        value: "2606:4700:4700::1111",
        ttl: "1 Hour",
        notes: "Example IPv6 address for subdomain (for services outside IC)",
        category: "ipv6",
      },
    ],
  }

  const verificationRecords = {
    namecheap: [
      {
        type: "TXT",
        host: "@",
        value: "google-site-verification=YOUR_VERIFICATION_CODE",
        ttl: "Automatic",
        notes: "For Google Search Console verification (replace with your code)",
        category: "verification",
      },
      {
        type: "TXT",
        host: "@",
        value: "facebook-domain-verification=YOUR_VERIFICATION_CODE",
        ttl: "Automatic",
        notes: "For Facebook Business verification (replace with your code)",
        category: "verification",
      },
    ],
    cloudflare: [
      {
        type: "TXT",
        name: "@",
        content: "google-site-verification=YOUR_VERIFICATION_CODE",
        ttl: "Auto",
        notes: "For Google Search Console verification (replace with your code)",
        category: "verification",
      },
      {
        type: "TXT",
        name: "@",
        content: "facebook-domain-verification=YOUR_VERIFICATION_CODE",
        ttl: "Auto",
        notes: "For Facebook Business verification (replace with your code)",
        category: "verification",
      },
    ],
    godaddy: [
      {
        type: "TXT",
        name: "@",
        value: "google-site-verification=YOUR_VERIFICATION_CODE",
        ttl: "1 Hour",
        notes: "For Google Search Console verification (replace with your code)",
        category: "verification",
      },
      {
        type: "TXT",
        name: "@",
        content: "facebook-domain-verification=YOUR_VERIFICATION_CODE",
        ttl: "1 Hour",
        notes: "For Facebook Business verification (replace with your code)",
        category: "verification",
      },
    ],
  }

  const serviceRecords = {
    namecheap: [
      {
        type: "CNAME",
        host: "calendar",
        value: "ghs.googlehosted.com",
        ttl: "Automatic",
        notes: "For Google Workspace Calendar (optional)",
        category: "services",
      },
      {
        type: "CNAME",
        host: "drive",
        value: "ghs.googlehosted.com",
        ttl: "Automatic",
        notes: "For Google Workspace Drive (optional)",
        category: "services",
      },
      {
        type: "CNAME",
        host: "mail",
        value: "ghs.googlehosted.com",
        ttl: "Automatic",
        notes: "For Google Workspace Mail (optional)",
        category: "services",
      },
    ],
    cloudflare: [
      {
        type: "CNAME",
        name: "calendar",
        content: "ghs.googlehosted.com",
        ttl: "Auto",
        notes: "For Google Workspace Calendar (optional)",
        category: "services",
      },
      {
        type: "CNAME",
        name: "drive",
        content: "ghs.googlehosted.com",
        ttl: "Auto",
        notes: "For Google Workspace Drive (optional)",
        category: "services",
      },
      {
        type: "CNAME",
        name: "mail",
        content: "ghs.googlehosted.com",
        ttl: "Auto",
        notes: "For Google Workspace Mail (optional)",
        category: "services",
      },
    ],
    godaddy: [
      {
        type: "CNAME",
        name: "calendar",
        value: "ghs.googlehosted.com",
        ttl: "1 Hour",
        notes: "For Google Workspace Calendar (optional)",
        category: "services",
      },
      {
        type: "CNAME",
        name: "drive",
        value: "ghs.googlehosted.com",
        ttl: "1 Hour",
        notes: "For Google Workspace Drive (optional)",
        category: "services",
      },
      {
        type: "CNAME",
        name: "mail",
        value: "ghs.googlehosted.com",
        ttl: "1 Hour",
        notes: "For Google Workspace Mail (optional)",
        category: "services",
      },
    ],
  }

  const instructions = {
    namecheap: [
      "Log in to your Namecheap account",
      'Go to "Domain List" and click "Manage" next to your domain',
      'Select the "Advanced DNS" tab',
      "Add each of the records listed above",
      "Required records: Only the ICP records (CNAME for @ and www, _canister-id, _acme-challenge)",
      "Optional records: Email, security, and other records are only needed if you're using those services",
      "Wait for DNS propagation (can take up to 48 hours)",
    ],
    cloudflare: [
      "Log in to your Cloudflare account",
      "Select your domain",
      'Go to the "DNS" tab',
      "Add each of the records listed above",
      'Ensure "Proxy status" is set to "DNS only" (gray cloud) for CNAME records',
      "Required records: Only the ICP records (CNAME for @ and www, _canister-id, _acme-challenge)",
      "Optional records: Email, security, and other records are only needed if you're using those services",
      "Wait for DNS propagation (usually quick with Cloudflare)",
    ],
    godaddy: [
      "Log in to your GoDaddy account",
      'Go to "My Products" and select your domain',
      'Click on "DNS"',
      "Add each of the records listed above",
      "Required records: Only the ICP records (CNAME for @ and www, _canister-id, _acme-challenge)",
      "Optional records: Email, security, and other records are only needed if you're using those services",
      "Wait for DNS propagation (can take up to 48 hours)",
    ],
  }

  const verification = {
    command: `dfx canister --network ic call rwlgt-iiaaa-aaaaa-aaaaa-cai validate_domain '("${baseDomain}")'`,
    notes: "Run this command to verify your domain is properly configured",
  }

  const troubleshooting = [
    "Ensure all DNS records are correctly set up",
    "Wait for DNS propagation (up to 48 hours)",
    "Verify your canister ID is correct",
    "Check that your canister is deployed and running on the IC mainnet",
    "Run the verification command to check domain validation status",
    "If using Cloudflare, ensure Proxy is disabled (gray cloud) for CNAME records",
    "Some DNS providers don't support CNAME at the apex domain - consider using a different provider",
  ]

  const additionalServices = {
    email: {
      description: "Email server configuration allows you to receive emails at your domain",
      providers: [
        {
          name: "Google Workspace",
          setupUrl: "https://workspace.google.com/",
          notes: "Paid service with professional email, calendar, and collaboration tools",
        },
        {
          name: "Microsoft 365",
          setupUrl: "https://www.microsoft.com/microsoft-365",
          notes: "Business email with Outlook and Office applications",
        },
        {
          name: "Zoho Mail",
          setupUrl: "https://www.zoho.com/mail/",
          notes: "Free tier available for up to 5 users/5GB per user",
        },
      ],
    },
    webAnalytics: {
      description: "Web analytics tools to track visitors to your IC canister",
      providers: [
        {
          name: "Google Analytics",
          setupUrl: "https://analytics.google.com/",
          notes: "Add Google's tracking code to your canister's HTML",
        },
        {
          name: "Plausible Analytics",
          setupUrl: "https://plausible.io/",
          notes: "Privacy-focused analytics with no cookies required",
        },
      ],
    },
    security: {
      description: "Additional security recommendations",
      recommendations: [
        "Implement a Content Security Policy (CSP) in your canister's HTTP responses",
        "Add DNSSEC to your domain registrar for additional DNS security",
        "Consider using a firewall service like Cloudflare (but configure correctly for IC)",
      ],
    },
  }

  // Web3 specific services and recommendations
  const web3Services = {
    wallets: {
      description: "Wallet integration for your Web3 dApp",
      providers: [
        {
          name: "Plug Wallet",
          setupUrl: "https://docs.plugwallet.ooo/",
          notes: "Popular wallet for Internet Computer dApps",
        },
        {
          name: "Stoic Wallet",
          setupUrl: "https://www.stoicwallet.com/",
          notes: "Web-based wallet with simple interface",
        },
        {
          name: "AstroX ME",
          setupUrl: "https://astrox.me/",
          notes: "Mobile wallet with additional features",
        },
      ],
    },
    identity: {
      description: "Authentication solutions for your Web3 dApp",
      providers: [
        {
          name: "Internet Identity",
          setupUrl: "https://identity.ic0.app/",
          notes: "DFINITY's official authentication solution",
        },
        {
          name: "NFID",
          setupUrl: "https://nfid.one/",
          notes: "NFT-based identity solution",
        },
      ],
    },
    tokens: {
      description: "Token standards and implementations",
      standards: [
        {
          name: "ICRC-1",
          url: "https://github.com/dfinity/ICRC-1",
          notes: "Standard fungible token interface for the Internet Computer",
        },
        {
          name: "ICRC-2",
          url: "https://github.com/dfinity/ICRC-2",
          notes: "Extends ICRC-1 with approve/transferFrom functionality",
        },
      ],
    },
    nfts: {
      description: "NFT standards and implementations",
      standards: [
        {
          name: "EXT",
          url: "https://github.com/Toniq-Labs/extendable-token",
          notes: "Extensible token standard for NFTs",
        },
        {
          name: "DIP-721",
          url: "https://github.com/dfinity/DIP721",
          notes: "ERC-721 inspired NFT standard for the Internet Computer",
        },
      ],
    },
  }

  // Combiner tous les enregistrements pour chaque fournisseur DNS
  const allRecordsNamecheap = [
    ...icpRecords.namecheap,
    ...web3Records.namecheap,
    ...emailRecords.namecheap,
    ...emailSecurityRecords.namecheap,
    ...ipv6Records.namecheap,
    ...verificationRecords.namecheap,
    ...serviceRecords.namecheap,
  ]

  const allRecordsCloudflare = [
    ...icpRecords.cloudflare,
    ...web3Records.cloudflare,
    ...emailRecords.cloudflare,
    ...emailSecurityRecords.cloudflare,
    ...ipv6Records.cloudflare,
    ...verificationRecords.cloudflare,
    ...serviceRecords.cloudflare,
  ]

  const allRecordsGodaddy = [
    ...icpRecords.godaddy,
    ...web3Records.godaddy,
    ...emailRecords.godaddy,
    ...emailSecurityRecords.godaddy,
    ...ipv6Records.godaddy,
    ...verificationRecords.godaddy,
    ...serviceRecords.godaddy,
  ]

  // Retourner la configuration structurée
  return {
    // Configuration par fournisseur DNS (pour la compatibilité avec le code existant)
    namecheap: {
      records: allRecordsNamecheap,
      instructions: instructions.namecheap,
    },
    cloudflare: {
      records: allRecordsCloudflare,
      instructions: instructions.cloudflare,
    },
    godaddy: {
      records: allRecordsGodaddy,
      instructions: instructions.godaddy,
    },

    // Nouvelle structure organisée par catégorie
    recordsByCategory: {
      icp: {
        namecheap: icpRecords.namecheap,
        cloudflare: icpRecords.cloudflare,
        godaddy: icpRecords.godaddy,
        description: "Required records for Internet Computer integration",
      },
      web3: {
        namecheap: web3Records.namecheap,
        cloudflare: web3Records.cloudflare,
        godaddy: web3Records.godaddy,
        description: "Optional records for Web3 functionality",
      },
      email: {
        namecheap: emailRecords.namecheap,
        cloudflare: emailRecords.cloudflare,
        godaddy: emailRecords.godaddy,
        description: "Optional records for email server configuration",
      },
      emailSecurity: {
        namecheap: emailSecurityRecords.namecheap,
        cloudflare: emailSecurityRecords.cloudflare,
        godaddy: emailSecurityRecords.godaddy,
        description: "Optional records for email security (SPF, DKIM, DMARC)",
      },
      ipv6: {
        namecheap: ipv6Records.namecheap,
        cloudflare: ipv6Records.cloudflare,
        godaddy: ipv6Records.godaddy,
        description: "Optional IPv6 address records",
      },
      verification: {
        namecheap: verificationRecords.namecheap,
        cloudflare: verificationRecords.cloudflare,
        godaddy: verificationRecords.godaddy,
        description: "Optional domain verification records for various services",
      },
      services: {
        namecheap: serviceRecords.namecheap,
        cloudflare: serviceRecords.cloudflare,
        godaddy: serviceRecords.godaddy,
        description: "Optional records for additional services",
      },
    },

    // Informations supplémentaires
    instructions: {
      namecheap: instructions.namecheap,
      cloudflare: instructions.cloudflare,
      godaddy: instructions.godaddy,
    },
    verification,
    troubleshooting,
    additionalServices,
    web3Services,

    // Informations spécifiques à l'Internet Computer
    icSpecific: {
      boundaryNodes: {
        description: "The Internet Computer uses boundary nodes to handle incoming requests",
        notes: "You don't need to configure these - they're managed automatically by the IC network",
      },
      certificateProvisioning: {
        description: "SSL certificates are automatically provisioned by the IC",
        notes: "The _acme-challenge record allows the IC to verify domain ownership and issue certificates",
      },
      assetCanisterSupport: {
        description: "Your canister must support the HTTP Gateway protocol",
        notes: "Most asset canisters and frontend frameworks for IC support this automatically",
      },
      web3Features: {
        description: "Web3 features specific to the Internet Computer",
        features: [
          {
            name: "Internet Identity",
            description: "Anonymous blockchain authentication",
            url: "https://internetcomputer.org/internet-identity",
          },
          {
            name: "Chain Key Signatures",
            description: "Threshold ECDSA signatures for cross-chain integration",
            url: "https://internetcomputer.org/docs/current/developer-docs/integrations/t-ecdsa/",
          },
          {
            name: "Bitcoin Integration",
            description: "Native Bitcoin integration",
            url: "https://internetcomputer.org/bitcoin-integration",
          },
          {
            name: "Ethereum Integration",
            description: "Integration with Ethereum and EVM chains",
            url: "https://internetcomputer.org/ethereum-integration",
          },
        ],
      },
    },
  }
}

function generatePurchaseLinks(domainName: string, tld: string) {
  const domain = `${domainName}.${tld}`

  return {
    namecheap: `https://www.namecheap.com/domains/registration/results/?domain=${domain}`,
    godaddy: `https://www.godaddy.com/domainsearch/find?domainToCheck=${domain}`,
    porkbun: `https://porkbun.com/checkout/search?q=${domain}`,
    dynadot: `https://www.dynadot.com/domain/search?domain=${domain}`,
    gandi: `https://www.gandi.net/en/domain/suggest?search=${domain}`,
    cloudflare: `https://dash.cloudflare.com/?to=/:account/domains/register/${domain}`,
    google: `https://domains.google.com/registrar/search?searchTerm=${domain}`,
    hover: `https://www.hover.com/domains/results?q=${domain}`,
  }
}

function checkDomainAvailabilityHeuristic(domainName: string, tld: string, dnsCheckResult: any) {
  // Popular domains that are definitely taken
  const popularDomains = [
    "google",
    "facebook",
    "amazon",
    "apple",
    "microsoft",
    "twitter",
    "instagram",
    // ... (liste existante)
  ]

  if (popularDomains.includes(domainName.toLowerCase())) {
    return {
      available: false,
      method: "known-domain",
      note: "This is a well-known brand or service and is not available.",
    }
  }

  // Si c'est un mot du dictionnaire dans un TLD populaire, il est probablement pris
  if (["com", "net", "org"].includes(tld.toLowerCase()) && isCommonWord(domainName)) {
    return {
      available: false,
      method: "dictionary-word",
      note: "Single-word dictionary domains in popular TLDs are typically already registered or premium.",
    }
  }

  // Pour les noms de domaine courts dans les TLDs populaires, ils sont probablement pris ou premium
  if (["com", "net", "org", "io", "co", "app"].includes(tld.toLowerCase()) && domainName.length <= 4) {
    return {
      available: false,
      method: "short-domain",
      note: "Short domain names in popular TLDs are typically already registered or premium.",
    }
  }

  // Si nous sommes arrivés jusqu'ici et notre vérification DNS n'a trouvé aucun enregistrement,
  // le domaine pourrait être disponible
  return {
    available: true,
    method: "heuristic",
    note: "Domain may be available, but please verify with a registrar for final confirmation.",
  }
}

// Simple check if a name might be a common English word
function isCommonWord(word: string) {
  // This is a very simplified check - would be more robust in production
  const commonWords = [
    "about",
    "above",
    "across",
    "act",
    "active",
    "activity",
    "add",
    "afraid",
    // ... (liste existante)
  ]

  return commonWords.includes(word.toLowerCase())
}


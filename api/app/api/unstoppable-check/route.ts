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
    const { domain, web3Features = [] } = await request.json()

    // Validate domain input
    if (!domain || typeof domain !== "string") {
      return NextResponse.json({ error: "Invalid domain provided" }, { status: 400, headers: corsHeaders })
    }

    // Sanitize domain input
    const sanitizedDomain = domain.trim().toLowerCase()

    // Check if it's an Unstoppable domain (.crypto, .nft, .wallet, .blockchain, .x, .dao, .888, .zil, etc.)
    const unstoppableTlds = [".crypto", ".nft", ".wallet", ".blockchain", ".x", ".dao", ".888", ".zil"]
    const isUnstoppableDomain = unstoppableTlds.some((tld) => sanitizedDomain.endsWith(tld))

    // Check domain availability
    const domainAvailability = await checkDomainAvailability(sanitizedDomain)

    // Generate DNS configuration instructions
    const dnsConfig = generateUnstoppableDnsConfig(sanitizedDomain)

    // Perform Web3 specific checks if requested
    const web3Checks = await performWeb3Checks(sanitizedDomain, web3Features)

    return NextResponse.json(
      {
        domain: sanitizedDomain,
        isUnstoppableDomain,
        domainAvailability,
        dnsConfig,
        web3Checks,
        status: "success",
      },
      { headers: corsHeaders },
    )
  } catch (error) {
    console.error("Unstoppable domain check error:", error)

    return NextResponse.json(
      { error: "Failed to check Unstoppable domain", details: (error as Error).message },
      { status: 500, headers: corsHeaders },
    )
  }
}

async function checkDomainAvailability(domain: string) {
  try {
    // For now, we'll just check if the domain has a valid Unstoppable TLD
    const unstoppableTlds = [".crypto", ".nft", ".wallet", ".blockchain", ".x", ".dao", ".888", ".zil"]
    const isUnstoppableTld = unstoppableTlds.some((tld) => domain.endsWith(tld))

    if (!isUnstoppableTld) {
      return {
        available: false,
        registered: false,
        hasConfiguration: false,
        message: "This is not a valid Unstoppable Domains TLD. Valid TLDs include: .crypto, .nft, .wallet, etc.",
      }
    }

    // In a real implementation, we would query the Unstoppable Domains API
    // For now, we'll simulate a response
    const domainWithoutTld = domain.split(".")[0]

    // Simple heuristic - domains with less than 5 characters are likely taken
    const likelyRegistered = domainWithoutTld.length < 5

    if (likelyRegistered) {
      return {
        available: false,
        registered: true,
        hasConfiguration: true,
        message: "This domain appears to be registered with Unstoppable Domains.",
        purchaseLinks: {
          unstoppable: `https://unstoppabledomains.com/search?searchTerm=${domain}`,
        },
      }
    } else {
      return {
        available: true,
        registered: false,
        hasConfiguration: false,
        message: "This domain may be available for registration with Unstoppable Domains.",
        purchaseLinks: {
          unstoppable: `https://unstoppabledomains.com/search?searchTerm=${domain}`,
        },
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

function generateUnstoppableDnsConfig(domain: string) {
  // Create configuration objects for Unstoppable Domains
  return {
    namecheap: {
      records: [
        {
          type: "TXT",
          host: "@",
          value: "Managed by Unstoppable Domains",
          ttl: "Automatic",
          notes: "Indicates this domain is managed by Unstoppable Domains",
        },
      ],
      instructions: [
        "Unstoppable Domains are managed on the blockchain, not through traditional DNS.",
        "To use your Unstoppable Domain, you need to:",
        "1. Install a browser extension like Unstoppable Extension or Brave Browser",
        "2. Connect your domain to your Web3 website or IPFS content",
        "3. Configure your crypto addresses for receiving payments",
      ],
    },
    cloudflare: {
      records: [
        {
          type: "TXT",
          name: "@",
          content: "Managed by Unstoppable Domains",
          ttl: "Auto",
          notes: "Indicates this domain is managed by Unstoppable Domains",
        },
      ],
      instructions: [
        "Unstoppable Domains are managed on the blockchain, not through traditional DNS.",
        "To use your Unstoppable Domain, you need to:",
        "1. Install a browser extension like Unstoppable Extension or Brave Browser",
        "2. Connect your domain to your Web3 website or IPFS content",
        "3. Configure your crypto addresses for receiving payments",
      ],
    },
    godaddy: {
      records: [
        {
          type: "TXT",
          name: "@",
          value: "Managed by Unstoppable Domains",
          ttl: "1 Hour",
          notes: "Indicates this domain is managed by Unstoppable Domains",
        },
      ],
      instructions: [
        "Unstoppable Domains are managed on the blockchain, not through traditional DNS.",
        "To use your Unstoppable Domain, you need to:",
        "1. Install a browser extension like Unstoppable Extension or Brave Browser",
        "2. Connect your domain to your Web3 website or IPFS content",
        "3. Configure your crypto addresses for receiving payments",
      ],
    },
    verification: {
      command: `curl -X GET "https://unstoppabledomains.com/api/v1/resellers/domains/${domain}"`,
      notes: "Check if your domain is properly registered with Unstoppable Domains",
    },
    troubleshooting: [
      "Ensure your domain is properly registered with Unstoppable Domains",
      "Make sure you're using a compatible browser or extension",
      "Check that your crypto addresses are correctly configured",
      "Verify your IPFS content is properly linked to your domain",
    ],
    resources: [
      {
        name: "Unstoppable Domains Documentation",
        url: "https://docs.unstoppabledomains.com/",
      },
      {
        name: "Unstoppable Domains Browser Extension",
        url: "https://unstoppabledomains.com/extension",
      },
      {
        name: "IPFS Configuration Guide",
        url: "https://docs.unstoppabledomains.com/manage-domains/manage-domain-names/point-domain-to-ipfs/",
      },
    ],
    web3Services: {
      wallets: {
        description: "Compatible wallets for your Unstoppable Domain",
        providers: [
          {
            name: "MetaMask",
            setupUrl: "https://metamask.io/",
            notes: "Popular Ethereum wallet",
          },
          {
            name: "Trust Wallet",
            setupUrl: "https://trustwallet.com/",
            notes: "Multi-chain wallet with Unstoppable Domains support",
          },
          {
            name: "Coinbase Wallet",
            setupUrl: "https://www.coinbase.com/wallet",
            notes: "User-friendly wallet with Unstoppable Domains support",
          },
        ],
      },
      ipfs: {
        description: "IPFS hosting providers for your Web3 website",
        providers: [
          {
            name: "Pinata",
            setupUrl: "https://pinata.cloud/",
            notes: "Easy-to-use IPFS pinning service",
          },
          {
            name: "Fleek",
            setupUrl: "https://fleek.co/",
            notes: "IPFS hosting with CI/CD integration",
          },
          {
            name: "Infura IPFS",
            setupUrl: "https://infura.io/product/ipfs",
            notes: "Enterprise-grade IPFS infrastructure",
          },
        ],
      },
    },
  }
}

async function performWeb3Checks(domain: string, requestedFeatures: string[] = []) {
  // Default to checking all features if none specified
  const features =
    requestedFeatures.length > 0 ? requestedFeatures : ["wallets", "ipfs", "dapps", "payments", "security"]

  const results = {
    wallets: features.includes("wallets") ? checkWalletCompatibility() : null,
    ipfs: features.includes("ipfs") ? checkIpfsConfiguration() : null,
    dapps: features.includes("dapps") ? checkDappCompatibility() : null,
    payments: features.includes("payments") ? checkPaymentConfiguration() : null,
    security: features.includes("security") ? checkSecurityBestPractices() : null,
    summary: {
      readyForWeb3: true,
      recommendations: [] as string[],
    },
  }

  // Compile recommendations
  if (results.wallets && results.wallets.recommendations.length > 0) {
    results.summary.recommendations.push(...results.wallets.recommendations)
  }

  if (results.ipfs && !results.ipfs.configured) {
    results.summary.recommendations.push("Configure IPFS content for your Unstoppable Domain")
    results.summary.readyForWeb3 = false
  }

  if (results.dapps && results.dapps.recommendations.length > 0) {
    results.summary.recommendations.push(...results.dapps.recommendations)
  }

  if (results.payments && !results.payments.configured) {
    results.summary.recommendations.push("Configure cryptocurrency payment addresses for your domain")
    results.summary.readyForWeb3 = false
  }

  if (results.security && results.security.recommendations.length > 0) {
    results.summary.recommendations.push(...results.security.recommendations)
  }

  return results
}

function checkWalletCompatibility() {
  return {
    compatible: true,
    wallets: [
      {
        name: "MetaMask",
        status: "recommended",
        url: "https://metamask.io/",
        notes: "Popular Ethereum wallet",
      },
      {
        name: "Trust Wallet",
        status: "supported",
        url: "https://trustwallet.com/",
        notes: "Multi-chain wallet with Unstoppable Domains support",
      },
      {
        name: "Coinbase Wallet",
        status: "supported",
        url: "https://www.coinbase.com/wallet",
        notes: "User-friendly wallet with Unstoppable Domains support",
      },
    ],
    recommendations: [
      "Install a compatible wallet like MetaMask, Trust Wallet, or Coinbase Wallet",
      "Ensure your wallet is configured to resolve Unstoppable Domains",
    ],
    resources: [
      {
        name: "Unstoppable Domains Wallet Integration",
        url: "https://docs.unstoppabledomains.com/send-and-receive-crypto-payments/crypto-payments",
      },
    ],
  }
}

function checkIpfsConfiguration() {
  return {
    configured: false, // Placeholder - we can't actually determine this without querying the blockchain
    notes: "IPFS configuration could not be automatically detected",
    recommendations: [
      "Upload your website content to IPFS using Pinata, Fleek, or another IPFS provider",
      "Link your IPFS content hash to your Unstoppable Domain",
      "Test your website using a compatible browser or extension",
    ],
    resources: [
      {
        name: "IPFS Configuration Guide",
        url: "https://docs.unstoppabledomains.com/manage-domains/manage-domain-names/point-domain-to-ipfs/",
      },
    ],
  }
}

function checkDappCompatibility() {
  return {
    compatible: true,
    dapps: [
      {
        name: "Brave Browser",
        status: "recommended",
        url: "https://brave.com/",
        notes: "Natively supports Unstoppable Domains",
      },
      {
        name: "Opera Browser",
        status: "supported",
        url: "https://www.opera.com/",
        notes: "Supports Unstoppable Domains",
      },
    ],
    recommendations: [
      "Use a compatible browser like Brave or Opera",
      "Alternatively, install the Unstoppable Domains browser extension",
    ],
    resources: [
      {
        name: "Compatible Browsers",
        url: "https://docs.unstoppabledomains.com/browser-resolution/browser-resolution-overview",
      },
    ],
  }
}

function checkPaymentConfiguration() {
  return {
    configured: false, // Placeholder - we can't actually determine this without querying the blockchain
    notes: "Payment configuration could not be automatically detected",
    recommendations: [
      "Configure cryptocurrency addresses for your domain",
      "Set up addresses for multiple cryptocurrencies to maximize payment options",
      "Test receiving payments to ensure proper configuration",
    ],
    resources: [
      {
        name: "Crypto Payments Guide",
        url: "https://docs.unstoppabledomains.com/send-and-receive-crypto-payments/crypto-payments",
      },
    ],
  }
}

function checkSecurityBestPractices() {
  return {
    recommendations: [
      "Use a hardware wallet for enhanced security",
      "Enable two-factor authentication for your Unstoppable Domains account",
      "Keep your recovery phrase in a secure location",
      "Regularly check your domain configuration for unauthorized changes",
    ],
    resources: [
      {
        name: "Security Best Practices",
        url: "https://docs.unstoppabledomains.com/manage-domains/domain-management-overview",
      },
    ],
  }
}


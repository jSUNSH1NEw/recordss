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

// Modifier la fonction POST pour traiter les nouvelles options Web2
export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const { domain, serviceType, hostingProvider, emailProvider, serverIp, subdomains } = await request.json()
    // Validate domain input
    if (!domain || typeof domain !== "string") {
      return NextResponse.json({ error: "Invalid domain provided" }, { status: 400, headers: corsHeaders })
    }

    // Sanitize domain input
    const sanitizedDomain = domain.trim().toLowerCase()

    // Check domain availability and DNS configuration
    const domainInfo = await checkDomainInfo(sanitizedDomain)

    // Check domain availability for purchase
    const domainAvailability = await checkDomainAvailability(sanitizedDomain)

    // Check if the domain exists and has existing configurations
    const domainStatus = {
      available: !domainInfo.registered,
      registered: domainInfo.registered,
      message: domainInfo.registered
        ? "Domain is already registered"
        : "Domain appears to be available for registration",
      purchaseInfo: domainAvailability,
    }

    // If domain is registered, check for existing configurations
    if (domainInfo.registered) {
      domainStatus.hasConfiguration = domainInfo.hasWebsite || domainInfo.hasEmail
      domainStatus.existingConfiguration = {
        hasWebsite: domainInfo.hasWebsite,
        hasEmail: domainInfo.hasEmail,
        hasSSL: domainInfo.hasSSL,
        records: domainInfo.dnsRecords || {},
      }


    

    // Generate DNS configuration instructions based on the provided options
    const dnsConfig = generateStandardDnsConfig(sanitizedDomain)

    // Create a customized response based on the user's selections
    const customizedConfig = customizeDnsConfig(dnsConfig, {
      domain: sanitizedDomain,
      serviceType: serviceType || "website",
      hostingProvider: hostingProvider || "other",
      emailProvider: emailProvider || "other",
      serverIp: serverIp || "",
      subdomains: subdomains || [],
    })

    // Generate Odoo email alias configuration if Odoo is selected
    let odooEmailConfig = null
    if ((serviceType === "email" || serviceType === "both") && hostingProvider === "odoo") {
      odooEmailConfig = generateOdooEmailConfig(sanitizedDomain)
    }

    return NextResponse.json(
      {
        domain: sanitizedDomain,
        domainInfo,
        domainAvailability: domainStatus,
        dnsConfig: customizedConfig,
        odooEmailConfig,
        status: "success",
        serviceType,
        hostingProvider,
        emailProvider,
        subdomains,
      },
      { headers: corsHeaders },
    )
  } catch (error) {
    console.error("Domain configuration check error:", error)

    return NextResponse.json(
      { error: "Failed to check domain configuration", details: (error as Error).message },
      { status: 500, headers: corsHeaders },
    )
  }
}

// Fonction pour vérifier la disponibilité du domaine pour l'achat
async function checkDomainAvailability(domain: string) {
  try {
    // Extraire le nom de domaine et le TLD
    const parts = domain.split(".")
    if (parts.length < 2) {
      return {
        error: "Invalid domain format",
        message: "Domain must include a TLD (e.g., example.com)",
      }
    }

    const domainName = parts[0]
    const tld = parts.slice(1).join(".")

    // Vérifier la disponibilité du domaine
    const response = await fetch("/api/domain-availability", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ domain }),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()

    // Générer des liens d'achat
    const purchaseLinks = {
      namecheap: `https://www.namecheap.com/domains/registration/results/?domain=${domain}`,
      godaddy: `https://www.godaddy.com/domainsearch/find?domainToCheck=${domain}`,
      porkbun: `https://porkbun.com/checkout/search?q=${domain}`,
      cloudflare: `https://dash.cloudflare.com/?to=/:account/domains/register/${domain}`,
    }

    return {
      available: data.availability?.available || false,
      pricing: data.pricing || null,
      purchaseLinks,
    }
  } catch (error) {
    console.error("Domain availability check error:", error)
    return {
      error: (error as Error).message,
      message: "Could not determine domain availability",
    }
  }
}

// Fonction pour générer la configuration d'alias email Odoo
function generateOdooEmailConfig(domain: string) {
  return {
    aliasSetup: {
      title: "Configuration des alias email dans Odoo",
      description: "Les alias email permettent de recevoir des emails dans Odoo et de les traiter automatiquement.",
      steps: [
        {
          title: "Configurer le serveur de messagerie entrant",
          instructions: [
            "1. Allez dans Paramètres > Général > Email > Serveurs de messagerie entrants",
            "2. Cliquez sur 'Créer'",
            "3. Remplissez les informations suivantes:",
            "   - Nom: Serveur entrant pour " + domain,
            "   - Type de serveur: IMAP ou POP",
            "   - Serveur: mail.votreserveur.com (remplacez par votre serveur IMAP/POP)",
            "   - Port: 993 (IMAP) ou 995 (POP)",
            "   - SSL/TLS: Activé",
            "   - Utilisateur: votre_email@" + domain,
            "   - Mot de passe: votre mot de passe",
            "4. Cliquez sur 'Tester et confirmer'",
          ],
        },
        {
          title: "Créer un alias email",
          instructions: [
            "1. Allez dans Paramètres > Technique > Email > Alias",
            "2. Cliquez sur 'Créer'",
            "3. Remplissez les informations suivantes:",
            "   - Alias: nom_alias (ex: support, info, contact)",
            "   - Nom complet: nom_alias@" + domain,
            "   - Modèle de destination: Choisissez le modèle approprié (ex: CRM Lead, Ticket d'assistance)",
            "   - Valeurs par défaut: Configurez les valeurs par défaut pour les enregistrements créés",
            "   - Sécurité: Choisissez qui peut envoyer des emails à cet alias",
            "4. Cliquez sur 'Enregistrer'",
          ],
        },
        {
          title: "Configurer les enregistrements DNS",
          instructions: [
            "Assurez-vous que les enregistrements MX pointent vers les serveurs de messagerie appropriés:",
            "- MX: @ 10 mx1.mail.odoo.com",
            "- MX: @ 20 mx2.mail.odoo.com",
            '- SPF: @ TXT "v=spf1 include:_spf.odoo.com ~all"',
            '- DKIM: odoo._domainkey TXT "v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCXiTZ5bUJv2GfQSxEFQQvVOq9xJXPTu5UMZDmKVmNJ0LYpDnN+YrG9Z9dUseUkLhRLvLLpuRjEWXQJCJQGtQd9TGJ2jWQlnOgQ9ePfFZ9gKdOgr7OnzUYx9xjfC/jIvQWJ8Uc9EQJQKiQDtFS1+OKfpU4nmG7aUJEF6Jamj5ZfwIDAQAB"',
          ],
        },
      ],
      examples: [
        {
          title: "Exemple d'alias pour le service client",
          description: "Créez un alias support@" + domain + " qui crée automatiquement des tickets d'assistance",
          configuration: {
            alias: "support",
            model: "helpdesk.ticket",
            defaultValues: {
              team_id: "Service client",
              priority: "2",
            },
          },
        },
        {
          title: "Exemple d'alias pour les prospects",
          description: "Créez un alias info@" + domain + " qui crée automatiquement des prospects CRM",
          configuration: {
            alias: "info",
            model: "crm.lead",
            defaultValues: {
              type: "opportunity",
              team_id: "Ventes",
            },
          },
        },
      ],
      catchAllAlias: {
        title: "Configuration d'un alias catch-all",
        description:
          "Un alias catch-all capture tous les emails envoyés à des adresses non reconnues sur votre domaine",
        instructions: [
          "1. Allez dans Paramètres > Technique > Email > Alias",
          "2. Créez un nouvel alias avec le champ 'Alias' vide",
          "3. Définissez le modèle de destination et les valeurs par défaut",
          "4. Activez l'option 'Catch-All'",
        ],
      },
    },
    serverSetup: {
      title: "Configuration des serveurs de messagerie dans Odoo",
      inbound: {
        title: "Serveur de messagerie entrant",
        description: "Configuration pour recevoir des emails dans Odoo",
        instructions: [
          "1. Allez dans Paramètres > Général > Email > Serveurs de messagerie entrants",
          "2. Cliquez sur 'Créer'",
          "3. Configurez les paramètres de connexion IMAP/POP",
          "4. Activez 'Créer un nouvel enregistrement' pour les modèles appropriés",
          "5. Configurez la fréquence de récupération des emails",
        ],
        options: [
          {
            name: "Créer un nouvel enregistrement",
            description: "Crée automatiquement des enregistrements à partir des emails entrants",
          },
          {
            name: "Mettre à jour l'enregistrement existant",
            description: "Met à jour les enregistrements existants avec les informations des emails",
          },
          {
            name: "Ne pas mettre à jour l'enregistrement",
            description: "Attache simplement l'email à l'enregistrement existant sans le mettre à jour",
          },
        ],
      },
      outbound: {
        title: "Serveur de messagerie sortant",
        description: "Configuration pour envoyer des emails depuis Odoo",
        instructions: [
          "1. Allez dans Paramètres > Général > Email > Serveurs de messagerie sortants",
          "2. Cliquez sur 'Créer'",
          "3. Configurez les paramètres SMTP",
          "4. Testez la connexion",
          "5. Définissez ce serveur comme serveur par défaut si nécessaire",
        ],
      },
    },
    resources: [
      {
        title: "Documentation Odoo sur la communication par email",
        url: "https://www.odoo.com/documentation/18.0/applications/general/email_communication.html",
      },
      {
        title: "Configuration des serveurs de messagerie entrants",
        url: "https://www.odoo.com/documentation/18.0/applications/general/email_communication/email_servers_inbound.html",
      },
      {
        title: "Configuration des serveurs de messagerie sortants",
        url: "https://www.odoo.com/documentation/18.0/applications/general/email_communication/email_servers_outbound.html",
      },
    ],
  }
}

// Autres fonctions existantes...
async function checkDomainInfo(domain: string) {
  try {
    // Check if the domain has DNS records
    const dnsCheckResult = await performDnsCheck(domain)

    // Check if the domain has a website
    const hasWebsite = await checkWebsiteAvailability(domain)

    // Check if the domain has email configuration
    const hasEmail = dnsCheckResult.hasMxRecords

    // Check if the domain has SSL
    const hasSSL = await checkSSL(domain)

    return {
      registered: dnsCheckResult.hasRecords,
      hasWebsite,
      hasEmail,
      hasSSL,
      dnsRecords: dnsCheckResult.records,
      summary: {
        status: dnsCheckResult.hasRecords ? "active" : "available",
        message: dnsCheckResult.hasRecords
          ? "Domain is registered and has DNS configuration"
          : "Domain appears to be available for registration",
      },
    }
  } catch (error) {
    console.error("Domain info check error:", error)
    return {
      error: (error as Error).message,
      summary: {
        status: "error",
        message: "Could not determine domain status",
      },
    }
  }
}

async function performDnsCheck(domain: string) {
  // Check for common DNS record types
  const recordTypes = ["A", "AAAA", "MX", "NS", "TXT", "SOA", "CNAME"]
  const records = {}
  let hasRecords = false
  let hasMxRecords = false

  // Check each record type
  for (const recordType of recordTypes) {
    try {
      const response = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=${recordType}`)

      if (response.ok) {
        const data = await response.json()
        records[recordType] = data

        // If we find any answers for this record type, mark as having records
        if (data.Answer && data.Answer.length > 0) {
          hasRecords = true

          // Check specifically for MX records
          if (recordType === "MX") {
            hasMxRecords = true
          }
        }
      }
    } catch (error) {
      console.error(`Error checking ${recordType} records for ${domain}:`, error)
    }
  }

  return {
    hasRecords,
    hasMxRecords,
    records,
  }
}

async function checkWebsiteAvailability(domain: string) {
  try {
    // Try to fetch the website with HTTPS
    const httpsResponse = await fetch(`https://${domain}`, {
      method: "HEAD",
      redirect: "follow",
    }).catch(() => null)

    if (httpsResponse && httpsResponse.ok) {
      return true
    }

    // If HTTPS fails, try HTTP
    const httpResponse = await fetch(`http://${domain}`, {
      method: "HEAD",
      redirect: "follow",
    }).catch(() => null)

    return httpResponse && httpResponse.ok
  } catch (error) {
    console.error("Error checking website availability:", error)
    return false
  }
}

async function checkSSL(domain: string) {
  try {
    // Try to fetch the website with HTTPS
    const response = await fetch(`https://${domain}`, {
      method: "HEAD",
      redirect: "follow",
    }).catch(() => null)

    return response && response.ok
  } catch (error) {
    console.error("Error checking SSL:", error)
    return false
  }
}

// Modifier la fonction generateStandardDnsConfig pour inclure des instructions spécifiques par hébergeur
function generateStandardDnsConfig(domain: string) {
  // Create configuration objects for standard DNS providers
  return {
    namecheap: {
      records: [
        {
          type: "A",
          host: "@",
          value: "192.0.2.1", // Example IP - replace with actual web server IP
          ttl: "Automatic",
          notes: "Points your domain to your web server",
        },
        {
          type: "CNAME",
          host: "www",
          value: "@",
          ttl: "Automatic",
          notes: "Points www subdomain to your main domain",
        },
        {
          type: "MX",
          host: "@",
          value: "10 mail.example.com", // Example mail server - replace with actual mail server
          ttl: "Automatic",
          notes: "Configures email for your domain",
        },
        {
          type: "TXT",
          host: "@",
          value: "v=spf1 include:_spf.example.com ~all", // Example SPF record
          ttl: "Automatic",
          notes: "SPF record for email security",
        },
      ],
      instructions: [
        "Log in to your Namecheap account",
        'Go to "Domain List" and click "Manage" next to your domain',
        'Select the "Advanced DNS" tab',
        "Add each of the records listed above",
        "Replace example values with your actual web server IP and mail server",
        "Wait for DNS propagation (can take up to 48 hours)",
      ],
    },
    cloudflare: {
      records: [
        {
          type: "A",
          name: "@",
          content: "192.0.2.1", // Example IP - replace with actual web server IP
          ttl: "Auto",
          proxied: true,
          notes: "Points your domain to your web server",
        },
        {
          type: "CNAME",
          name: "www",
          content: "@",
          ttl: "Auto",
          proxied: true,
          notes: "Points www subdomain to your main domain",
        },
        {
          type: "MX",
          name: "@",
          content: "10 mail.example.com", // Example mail server - replace with actual mail server
          ttl: "Auto",
          notes: "Configures email for your domain",
        },
        {
          type: "TXT",
          name: "@",
          content: "v=spf1 include:_spf.example.com ~all", // Example SPF record
          ttl: "Auto",
          notes: "SPF record for email security",
        },
      ],
      instructions: [
        "Log in to your Cloudflare account",
        "Select your domain",
        'Go to the "DNS" tab',
        "Add each of the records listed above",
        "Replace example values with your actual web server IP and mail server",
        "Cloudflare provides additional security and performance benefits",
      ],
    },
    godaddy: {
      records: [
        {
          type: "A",
          name: "@",
          value: "192.0.2.1", // Example IP - replace with actual web server IP
          ttl: "1 Hour",
          notes: "Points your domain to your web server",
        },
        {
          type: "CNAME",
          name: "www",
          value: "@",
          ttl: "1 Hour",
          notes: "Points www subdomain to your main domain",
        },
        {
          type: "MX",
          name: "@",
          value: "10 mail.example.com", // Example mail server - replace with actual mail server
          ttl: "1 Hour",
          notes: "Configures email for your domain",
        },
        {
          type: "TXT",
          name: "@",
          value: "v=spf1 include:_spf.example.com ~all", // Example SPF record
          ttl: "1 Hour",
          notes: "SPF record for email security",
        },
      ],
      instructions: [
        "Log in to your GoDaddy account",
        'Go to "My Products" and select your domain',
        'Click on "DNS"',
        "Add each of the records listed above",
        "Replace example values with your actual web server IP and mail server",
        "Wait for DNS propagation (up to 48 hours)",
      ],
    },
    verification: {
      command: `dig ${domain} +noall +answer`,
      notes: "Run this command to verify your DNS configuration",
    },
    troubleshooting: [
      "Ensure all DNS records are correctly set up",
      "Wait for DNS propagation (up to 48 hours)",
      "Verify your web server is properly configured",
      "Check that your SSL certificate is valid if using HTTPS",
      "Test your email configuration",
    ],
    resources: [
      {
        name: "DNS Basics Guide",
        url: "https://www.cloudflare.com/learning/dns/what-is-dns/",
      },
      {
        name: "Web Hosting Guide",
        url: "https://www.hostinger.com/tutorials/website-hosting/",
      },
      {
        name: "Email Configuration Guide",
        url: "https://support.google.com/a/answer/140034",
      },
    ],
    // Ajout d'informations sur les hébergeurs courants
    hostingProviders: {
      aws: {
        name: "Amazon Web Services (AWS)",
        instructions: [
          "Log in to your AWS Management Console",
          "Navigate to EC2 or Elastic Beanstalk where your application is hosted",
          "Find your instance's public IP address or load balancer URL",
          "Use this IP address or URL for your A record or CNAME record",
          "For Route 53 users: Create a hosted zone for your domain and AWS will provide nameservers to use at your registrar",
        ],
        ipLocation: "EC2 Dashboard > Instances > Select your instance > Details tab > Public IPv4 address",
        docsUrl: "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-to-ec2-instance.html",
      },
      ovh: {
        name: "OVH",
        instructions: [
          "Log in to your OVH Control Panel",
          "Go to 'Web Cloud' > 'Hosting' and select your hosting plan",
          "Find your server's IP address in the 'General Information' section",
          "For shared hosting: Use the provided 'Target' for your DNS records",
          "For VPS/dedicated servers: Use the server's IP address for your A record",
        ],
        ipLocation: "OVH Control Panel > Web Cloud > Hosting > Your hosting plan > General Information",
        docsUrl: "https://docs.ovh.com/gb/en/domains/web_hosting_general_information_about_dns_servers/",
      },
      digitalocean: {
        name: "DigitalOcean",
        instructions: [
          "Log in to your DigitalOcean account",
          "Go to 'Droplets' and select your server",
          "Find your droplet's IP address in the main information panel",
          "Use this IP address for your A record",
          "For managed apps: Use the provided URL for a CNAME record",
        ],
        ipLocation: "DigitalOcean Dashboard > Droplets > Select your droplet > IP Address field",
        docsUrl:
          "https://www.digitalocean.com/community/tutorials/how-to-point-to-digitalocean-nameservers-from-common-domain-registrars",
      },
      heroku: {
        name: "Heroku",
        instructions: [
          "Log in to your Heroku Dashboard",
          "Select your application",
          "Go to 'Settings' tab",
          "Add your domain in the 'Domains' section",
          "Heroku will provide you with a DNS target for your CNAME record",
          "Note: For apex domains (example.com), use Heroku's DNS service or your registrar's ALIAS/ANAME record",
        ],
        ipLocation: "Heroku doesn't use direct IP addresses. Use the provided DNS target for CNAME records.",
        docsUrl: "https://devcenter.heroku.com/articles/custom-domains",
      },
      netlify: {
        name: "Netlify",
        instructions: [
          "Log in to your Netlify account",
          "Select your site",
          "Go to 'Domain settings' or 'Domain management'",
          "Click 'Add custom domain'",
          "Netlify will provide DNS instructions specific to your site",
          "For apex domains, Netlify provides special DNS records to use",
        ],
        ipLocation: "Netlify doesn't use direct IP addresses. Use their provided DNS settings.",
        docsUrl: "https://docs.netlify.com/domains-https/custom-domains/",
      },
      vercel: {
        name: "Vercel",
        instructions: [
          "Log in to your Vercel dashboard",
          "Select your project",
          "Go to 'Settings' > 'Domains'",
          "Add your domain",
          "Vercel will provide specific DNS records to add at your registrar",
          "For apex domains, use the provided A records",
        ],
        ipLocation: "Vercel doesn't use direct IP addresses. Use their provided DNS settings.",
        docsUrl: "https://vercel.com/docs/concepts/projects/domains",
      },
      odoo: {
        name: "Odoo",
        instructions: [
          "Log in to your Odoo account",
          "Go to 'Settings' > 'General Settings' > 'Website'",
          "Click on 'Configure Domain Names'",
          "Add your domain name and save",
          "Odoo will provide you with specific DNS records to add at your domain registrar",
          "You'll need to add a CNAME record pointing to your Odoo instance",
          "For apex domains, you may need to use your registrar's ALIAS/ANAME record or redirect service",
          "If using OVH or another provider with Odoo, you'll need to configure both services",
        ],
        ipLocation: "Odoo doesn't use direct IP addresses. Use the CNAME target provided in your Odoo dashboard.",
        docsUrl:
          "https://www.odoo.com/documentation/18.0/applications/websites/website/configuration/domain_names.html",
        additionalInstructions: [
          "If you're using OVH with Odoo:",
          "1. Set up your domain in OVH first",
          "2. Configure the DNS zone in OVH to point to Odoo",
          "3. Add a CNAME record for 'www' pointing to your Odoo subdomain",
          "4. For the apex domain, use OVH's redirection service to point to your www subdomain",
          "5. Verify the configuration in your Odoo dashboard",
        ],
        emailConfiguration: {
          inbound: [
            "To receive emails in Odoo, you need to configure incoming mail servers:",
            "1. Go to Settings > General Settings > Email > Incoming Email Servers",
            "2. Add a new server with your email provider's IMAP/POP details",
            "3. Configure proper authentication (username/password)",
            "4. Set up mail aliases if needed (Settings > Technical > Email > Aliases)",
          ],
          outbound: [
            "To send emails from Odoo, you need to configure outgoing mail servers:",
            "1. Go to Settings > General Settings > Email > Outgoing Email Servers",
            "2. Add a new server with your email provider's SMTP details",
            "3. Configure proper authentication (username/password or API key)",
            "4. Test the configuration by sending a test email",
          ],
          dnsRecords: [
            "For proper email delivery, you need these DNS records:",
            "- MX records pointing to your email provider's mail servers",
            "- SPF record (TXT) to authorize Odoo to send emails on behalf of your domain",
            "- DKIM record (TXT) if you want to use DKIM signing for better deliverability",
            "- DMARC record (TXT) to specify email authentication policy",
          ],
        },
      },
      cpanel: {
        name: "cPanel (Shared Hosting)",
        instructions: [
          "Log in to your cPanel account",
          "Look for 'Shared IP Address' on the main dashboard or under 'General Information'",
          "Alternatively, check your welcome email from your hosting provider",
          "Use this IP address for your A record",
          "For email, use the mail server information provided by your host",
        ],
        ipLocation: "cPanel Dashboard > Main page > Shared IP Address",
        docsUrl: "https://docs.cpanel.net/cpanel/domains/domains-home/",
      },
    },
    // Ajout d'informations sur les services d'email courants
    emailServices: {
      googleWorkspace: {
        name: "Google Workspace (formerly G Suite)",
        instructions: [
          "Sign up for Google Workspace",
          "Add your domain during the setup process",
          "Google will provide specific MX records to add to your DNS",
          "Typical Google MX records include multiple servers with different priorities",
          "Also add the required TXT records for SPF and DKIM verification",
        ],
        mxRecords: [
          { priority: "1", value: "aspmx.l.google.com" },
          { priority: "5", value: "alt1.aspmx.l.google.com" },
          { priority: "5", value: "alt2.aspmx.l.google.com" },
          { priority: "10", value: "alt3.aspmx.l.google.com" },
          { priority: "10", value: "alt4.aspmx.l.google.com" },
        ],
        docsUrl: "https://support.google.com/a/answer/140034",
      },
      microsoft365: {
        name: "Microsoft 365",
        instructions: [
          "Sign up for Microsoft 365",
          "Add your domain during the setup process",
          "Microsoft will provide specific MX records to add to your DNS",
          "Add the required TXT records for SPF and DKIM verification",
          "Microsoft also requires specific CNAME records for service verification",
        ],
        mxRecords: [{ priority: "0", value: "your-domain-com.mail.protection.outlook.com" }],
        docsUrl: "https://docs.microsoft.com/en-us/microsoft-365/admin/setup/add-domain",
      },
      zoho: {
        name: "Zoho Mail",
        instructions: [
          "Sign up for Zoho Mail",
          "Add your domain during the setup process",
          "Zoho will provide specific MX records to add to your DNS",
          "Add the required TXT records for SPF and DKIM verification",
          "Verify domain ownership with a TXT or CNAME record",
        ],
        mxRecords: [
          { priority: "10", value: "mx.zoho.com" },
          { priority: "20", value: "mx2.zoho.com" },
          { priority: "50", value: "mx3.zoho.com" },
        ],
        docsUrl: "https://www.zoho.com/mail/help/adminconsole/domain-verification.html",
      },
    },
    // Ajout d'informations sur les services de sous-domaines courants
    subdomainServices: {
      blog: {
        name: "Blog Subdomain",
        description: "Configure a blog.yourdomain.com subdomain",
        options: [
          {
            name: "WordPress",
            instructions: "Create a CNAME record pointing blog.yourdomain.com to your WordPress hosting",
            record: { type: "CNAME", host: "blog", value: "your-wordpress-url.com" },
          },
          {
            name: "Ghost",
            instructions: "Create a CNAME record pointing blog.yourdomain.com to your Ghost hosting",
            record: { type: "CNAME", host: "blog", value: "your-ghost-url.com" },
          },
        ],
      },
      shop: {
        name: "Shop/Store Subdomain",
        description: "Configure a shop.yourdomain.com or store.yourdomain.com subdomain",
        options: [
          {
            name: "Shopify",
            instructions: "Create a CNAME record pointing shop.yourdomain.com to your Shopify store",
            record: { type: "CNAME", host: "shop", value: "shops.myshopify.com" },
          },
          {
            name: "WooCommerce",
            instructions: "Create a CNAME record pointing shop.yourdomain.com to your WooCommerce hosting",
            record: { type: "CNAME", host: "shop", value: "your-woocommerce-url.com" },
          },
        ],
      },
      app: {
        name: "App Subdomain",
        description: "Configure an app.yourdomain.com subdomain for web applications",
        options: [
          {
            name: "Custom Application",
            instructions: "Create a CNAME record pointing app.yourdomain.com to your application hosting",
            record: { type: "CNAME", host: "app", value: "your-app-url.herokuapp.com" },
          },
        ],
      },
      docs: {
        name: "Documentation Subdomain",
        description: "Configure a docs.yourdomain.com subdomain for documentation",
        options: [
          {
            name: "GitBook",
            instructions: "Create a CNAME record pointing docs.yourdomain.com to your GitBook site",
            record: { type: "CNAME", host: "docs", value: "your-gitbook-url.gitbook.io" },
          },
          {
            name: "ReadTheDocs",
            instructions: "Create a CNAME record pointing docs.yourdomain.com to ReadTheDocs",
            record: { type: "CNAME", host: "docs", value: "your-docs.readthedocs.io" },
          },
        ],
      },
    },
    additionalServices: {
      webHosting: {
        description: "Web hosting providers for your website",
        providers: [
          {
            name: "Netlify",
            setupUrl: "https://www.netlify.com/",
            notes: "Great for static sites and JAMstack applications",
          },
          {
            name: "Vercel",
            setupUrl: "https://vercel.com/",
            notes: "Optimized for Next.js and React applications",
          },
          {
            name: "DigitalOcean",
            setupUrl: "https://www.digitalocean.com/",
            notes: "Cloud VPS hosting with more control",
          },
        ],
      },
      email: {
        description: "Email providers for your domain",
        providers: [
          {
            name: "Google Workspace",
            setupUrl: "https://workspace.google.com/",
            notes: "Professional email with Gmail interface",
          },
          {
            name: "Microsoft 365",
            setupUrl: "https://www.microsoft.com/microsoft-365",
            notes: "Email with Outlook and Office applications",
          },
          {
            name: "Zoho Mail",
            setupUrl: "https://www.zoho.com/mail/",
            notes: "Free tier available for up to 5 users",
          },
        ],
      },
      ssl: {
        description: "SSL certificate providers",
        providers: [
          {
            name: "Let's Encrypt",
            setupUrl: "https://letsencrypt.org/",
            notes: "Free SSL certificates with automatic renewal",
          },
          {
            name: "Cloudflare",
            setupUrl: "https://www.cloudflare.com/ssl/",
            notes: "Free SSL with Cloudflare's CDN",
          },
          {
            name: "SSL.com",
            setupUrl: "https://www.ssl.com/",
            notes: "Paid SSL certificates with extended validation",
          },
        ],
      },
    },
  }
}

// Ajouter une fonction pour personnaliser la configuration DNS en fonction des options de l'utilisateur
function customizeDnsConfig(baseConfig, options) {
  const { domain, serviceType, hostingProvider, emailProvider, serverIp, subdomains } = options
  const customConfig = JSON.parse(JSON.stringify(baseConfig))

  // Customize records based on service type and hosting provider
  for (const provider of Object.keys(customConfig)) {
    if (
      provider !== "verification" &&
      provider !== "troubleshooting" &&
      provider !== "resources" &&
      provider !== "hostingProviders" &&
      provider !== "emailServices" &&
      provider !== "subdomainServices" &&
      provider !== "additionalServices"
    ) {
      // Clear existing records to start fresh
      customConfig[provider].records = []

      // Add website records if needed
      if (serviceType === "website" || serviceType === "both") {
        // Add A record for the main domain
        if (hostingProvider === "odoo") {
          // Odoo specific records
          customConfig[provider].records.push({
            type: "CNAME",
            host: provider === "namecheap" ? "www" : "www",
            name: provider === "cloudflare" ? "www" : "www",
            value: `${domain}.odoo.com`,
            content: `${domain}.odoo.com`, // For Cloudflare
            ttl: provider === "godaddy" ? "1 Hour" : "Automatic",
            notes: "Points www subdomain to your Odoo instance",
          })

          // For apex domains with Odoo, recommend using ALIAS/ANAME if available
          customConfig[provider].records.push({
            type: provider === "cloudflare" ? "CNAME" : "ALIAS",
            host: provider === "namecheap" ? "@" : "@",
            name: provider === "cloudflare" ? "@" : "@",
            value: `${domain}.odoo.com`,
            content: `${domain}.odoo.com`, // For Cloudflare
            ttl: provider === "godaddy" ? "1 Hour" : "Automatic",
            notes:
              "Points your apex domain to Odoo (Note: Not all DNS providers support ALIAS records, you may need to use a URL redirect)",
          })

          // Add email-specific records if email is configured
          if (serviceType === "email" || serviceType === "both") {
            // Add MX records for Odoo email
            customConfig[provider].records.push({
              type: "MX",
              host: provider === "namecheap" ? "@" : "@",
              name: provider === "cloudflare" ? "@" : "@",
              value: "10 mx1.mail.odoo.com",
              content: "10 mx1.mail.odoo.com", // For Cloudflare
              ttl: provider === "godaddy" ? "1 Hour" : "Automatic",
              notes: "Primary Odoo mail server (if using Odoo for email)",
              category: "email",
            })

            customConfig[provider].records.push({
              type: "MX",
              host: provider === "namecheap" ? "@" : "@",
              name: provider === "cloudflare" ? "@" : "@",
              value: "20 mx2.mail.odoo.com",
              content: "20 mx2.mail.odoo.com", // For Cloudflare
              ttl: provider === "godaddy" ? "1 Hour" : "Automatic",
              notes: "Secondary Odoo mail server (if using Odoo for email)",
              category: "email",
            })

            // Add SPF record for Odoo
            customConfig[provider].records.push({
              type: "TXT",
              host: provider === "namecheap" ? "@" : "@",
              name: provider === "cloudflare" ? "@" : "@",
              value: "v=spf1 include:_spf.odoo.com ~all",
              content: "v=spf1 include:_spf.odoo.com ~all", // For Cloudflare
              ttl: provider === "godaddy" ? "1 Hour" : "Automatic",
              notes: "SPF record for Odoo email (allows Odoo to send emails on behalf of your domain)",
              category: "email-security",
            })

            // Add DKIM record for Odoo
            customConfig[provider].records.push({
              type: "TXT",
              host: provider === "namecheap" ? "odoo._domainkey" : "odoo._domainkey",
              name: provider === "cloudflare" ? "odoo._domainkey" : "odoo._domainkey",
              value:
                "v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCXiTZ5bUJv2GfQSxEFQQvVOq9xJXPTu5UMZDmKVmNJ0LYpDnN+YrG9Z9dUseUkLhRLvLLpuRjEWXQJCJQGtQd9TGJ2jWQlnOgQ9ePfFZ9gKdOgr7OnzUYx9xjfC/jIvQWJ8Uc9EQJQKiQDtFS1+OKfpU4nmG7aUJEF6Jamj5ZfwIDAQAB",
              content:
                "v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCXiTZ5bUJv2GfQSxEFQQvVOq9xJXPTu5UMZDmKVmNJ0LYpDnN+YrG9Z9dUseUkLhRLvLLpuRjEWXQJCJQGtQd9TGJ2jWQlnOgQ9ePfFZ9gKdOgr7OnzUYx9xjfC/jIvQWJ8Uc9EQJQKiQDtFS1+OKfpU4nmG7aUJEF6Jamj5ZfwIDAQAB", // For Cloudflare
              ttl: provider === "godaddy" ? "1 Hour" : "Automatic",
              notes: "DKIM record for Odoo email (improves email deliverability)",
              category: "email-security",
            })

            // Add DMARC record
            customConfig[provider].records.push({
              type: "TXT",
              host: provider === "namecheap" ? "_dmarc" : "_dmarc",
              name: provider === "cloudflare" ? "_dmarc" : "_dmarc",
              value: "v=DMARC1; p=none; rua=mailto:dmarc-reports@${domain}",
              content: "v=DMARC1; p=none; rua=mailto:dmarc-reports@${domain}", // For Cloudflare
              ttl: provider === "godaddy" ? "1 Hour" : "Automatic",
              notes: "DMARC record for email authentication policy",
              category: "email-security",
            })
          }
        } else if (hostingProvider !== "netlify" && hostingProvider !== "vercel" && hostingProvider !== "heroku") {
          // Use the provided server IP for A record
          customConfig[provider].records.push({
            type: "A",
            host: provider === "namecheap" ? "@" : "@",
            name: provider === "cloudflare" ? "@" : "@",
            value: serverIp || "192.0.2.1", // Use provided IP or example
            content: serverIp || "192.0.2.1", // For Cloudflare
            ttl: provider === "godaddy" ? "1 Hour" : "Automatic",
            notes: "Points your domain to your web server",
          })

          // Add CNAME for www subdomain
          customConfig[provider].records.push({
            type: "CNAME",
            host: provider === "namecheap" ? "www" : "www",
            name: provider === "cloudflare" ? "www" : "www",
            value: "@",
            content: "@", // For Cloudflare
            ttl: provider === "godaddy" ? "1 Hour" : "Automatic",
            notes: "Points www subdomain to your main domain",
          })
        } else if (hostingProvider === "netlify") {
          // Netlify specific records
          customConfig[provider].records.push({
            type: "CNAME",
            host: provider === "namecheap" ? "www" : "www",
            name: provider === "cloudflare" ? "www" : "www",
            value: "your-site-name.netlify.app",
            content: "your-site-name.netlify.app", // For Cloudflare
            ttl: provider === "godaddy" ? "1 Hour" : "Automatic",
            notes: "Points www subdomain to your Netlify site",
          })

          customConfig[provider].records.push({
            type: "A",
            host: provider === "namecheap" ? "@" : "@",
            name: provider === "cloudflare" ? "@" : "@",
            value: "75.2.60.5", // Netlify's load balancer IP
            content: "75.2.60.5", // For Cloudflare
            ttl: provider === "godaddy" ? "1 Hour" : "Automatic",
            notes: "Points your apex domain to Netlify",
          })
        } else if (hostingProvider === "vercel") {
          // Vercel specific records
          customConfig[provider].records.push({
            type: "A",
            host: provider === "namecheap" ? "@" : "@",
            name: provider === "cloudflare" ? "@" : "@",
            value: "76.76.21.21", // Vercel's load balancer IP
            content: "76.76.21.21", // For Cloudflare
            ttl: provider === "godaddy" ? "1 Hour" : "Automatic",
            notes: "Points your apex domain to Vercel",
          })

          customConfig[provider].records.push({
            type: "CNAME",
            host: provider === "namecheap" ? "www" : "www",
            name: provider === "cloudflare" ? "www" : "www",
            value: "cname.vercel-dns.com",
            content: "cname.vercel-dns.com", // For Cloudflare
            ttl: provider === "godaddy" ? "1 Hour" : "Automatic",
            notes: "Points www subdomain to Vercel",
          })
        } else if (hostingProvider === "heroku") {
          // Heroku specific records
          customConfig[provider].records.push({
            type: "CNAME",
            host: provider === "namecheap" ? "www" : "www",
            name: provider === "cloudflare" ? "www" : "www",
            value: "your-app-name.herokuapp.com",
            content: "your-app-name.herokuapp.com", // For Cloudflare
            ttl: provider === "godaddy" ? "1 Hour" : "Automatic",
            notes: "Points www subdomain to your Heroku app",
          })

          // For apex domains with Heroku, recommend using ALIAS/ANAME if available
          customConfig[provider].records.push({
            type: provider === "cloudflare" ? "CNAME" : "ALIAS",
            host: provider === "namecheap" ? "@" : "@",
            name: provider === "cloudflare" ? "@" : "@",
            value: "your-app-name.herokuapp.com",
            content: "your-app-name.herokuapp.com", // For Cloudflare
            ttl: provider === "godaddy" ? "1 Hour" : "Automatic",
            notes: "Points your apex domain to Heroku (Note: Not all DNS providers support ALIAS records)",
          })
        }
      }

      // Add email records if needed
      if (serviceType === "email" || serviceType === "both") {
        if (emailProvider === "googleWorkspace") {
          // Google Workspace MX records
          customConfig[provider].records.push({
            type: "MX",
            host: provider === "namecheap" ? "@" : "@",
            name: provider === "cloudflare" ? "@" : "@",
            value: "1 aspmx.l.google.com",
            content: "1 aspmx.l.google.com", // For Cloudflare
            ttl: provider === "godaddy" ? "1 Hour" : "Automatic",
            notes: "Primary Google Workspace mail server",
            category: "email",
          })

          // Add additional Google MX records
          const googleMxRecords = [
            { priority: "5", server: "alt1.aspmx.l.google.com" },
            { priority: "5", server: "alt2.aspmx.l.google.com" },
            { priority: "10", server: "alt3.aspmx.l.google.com" },
            { priority: "10", server: "alt4.aspmx.l.google.com" },
          ]

          googleMxRecords.forEach((record) => {
            customConfig[provider].records.push({
              type: "MX",
              host: provider === "namecheap" ? "@" : "@",
              name: provider === "cloudflare" ? "@" : "@",
              value: `${record.priority} ${record.server}`,
              content: `${record.priority} ${record.server}`, // For Cloudflare
              ttl: provider === "godaddy" ? "1 Hour" : "Automatic",
              notes: `Google Workspace mail server (priority ${record.priority})`,
              category: "email",
            })
          })

          // Add SPF record for Google
          customConfig[provider].records.push({
            type: "TXT",
            host: provider === "namecheap" ? "@" : "@",
            name: provider === "cloudflare" ? "@" : "@",
            value: "v=spf1 include:_spf.google.com ~all",
            content: "v=spf1 include:_spf.google.com ~all", // For Cloudflare
            ttl: provider === "godaddy" ? "1 Hour" : "Automatic",
            notes: "SPF record for Google Workspace",
            category: "email-security",
          })
        } else if (emailProvider === "microsoft365") {
          // Microsoft 365 MX record
          customConfig[provider].records.push({
            type: "MX",
            host: provider === "namecheap" ? "@" : "@",
            name: provider === "cloudflare" ? "@" : "@",
            value: `0 ${domain.replace(/\./g, "-")}.mail.protection.outlook.com`,
            content: `0 ${domain.replace(/\./g, "-")}.mail.protection.outlook.com`, // For Cloudflare
            ttl: provider === "godaddy" ? "1 Hour" : "Automatic",
            notes: "Microsoft 365 mail server",
            category: "email",
          })

          // Add SPF record for Microsoft
          customConfig[provider].records.push({
            type: "TXT",
            host: provider === "namecheap" ? "@" : "@",
            name: provider === "cloudflare" ? "@" : "@",
            value: "v=spf1 include:spf.protection.outlook.com -all",
            content: "v=spf1 include:spf.protection.outlook.com -all", // For Cloudflare
            ttl: provider === "godaddy" ? "1 Hour" : "Automatic",
            notes: "SPF record for Microsoft 365",
            category: "email-security",
          })
        } else if (emailProvider === "zoho") {
          // Zoho Mail MX records
          const zohoMxRecords = [
            { priority: "10", server: "mx.zoho.com" },
            { priority: "20", server: "mx2.zoho.com" },
            { priority: "50", server: "mx3.zoho.com" },
          ]

          zohoMxRecords.forEach((record) => {
            customConfig[provider].records.push({
              type: "MX",
              host: provider === "namecheap" ? "@" : "@",
              name: provider === "cloudflare" ? "@" : "@",
              value: `${record.priority} ${record.server}`,
              content: `${record.priority} ${record.server}`, // For Cloudflare
              ttl: provider === "godaddy" ? "1 Hour" : "Automatic",
              notes: `Zoho mail server (priority ${record.priority})`,
              category: "email",
            })
          })

          // Add SPF record for Zoho
          customConfig[provider].records.push({
            type: "TXT",
            host: provider === "namecheap" ? "@" : "@",
            name: provider === "cloudflare" ? "@" : "@",
            value: "v=spf1 include:zoho.com ~all",
            content: "v=spf1 include:zoho.com ~all", // For Cloudflare
            ttl: provider === "godaddy" ? "1 Hour" : "Automatic",
            notes: "SPF record for Zoho Mail",
            category: "email-security",
          })
        } else {
          // Generic email configuration
          customConfig[provider].records.push({
            type: "MX",
            host: provider === "namecheap" ? "@" : "@",
            name: provider === "cloudflare" ? "@" : "@",
            value: "10 mail.example.com",
            content: "10 mail.example.com", // For Cloudflare
            ttl: provider === "godaddy" ? "1 Hour" : "Automatic",
            notes: "Replace with your actual mail server",
            category: "email",
          })

          // Generic SPF record
          customConfig[provider].records.push({
            type: "TXT",
            host: provider === "namecheap" ? "@" : "@",
            name: provider === "cloudflare" ? "@" : "@",
            value: "v=spf1 include:_spf.example.com ~all",
            content: "v=spf1 include:_spf.example.com ~all", // For Cloudflare
            ttl: provider === "godaddy" ? "1 Hour" : "Automatic",
            notes: "Replace with your actual SPF record",
            category: "email-security",
          })
        }
      }

      // Add subdomain records if requested
      if (subdomains && subdomains.length > 0) {
        subdomains.forEach((subdomain) => {
          if (subdomain === "blog") {
            customConfig[provider].records.push({
              type: "CNAME",
              host: provider === "namecheap" ? "blog" : "blog",
              name: provider === "cloudflare" ? "blog" : "blog",
              value: "your-blog-platform.com",
              content: "your-blog-platform.com", // For Cloudflare
              ttl: provider === "godaddy" ? "1 Hour" : "Automatic",
              notes: "Points blog subdomain to your blog platform (replace with actual URL)",
              category: "subdomains",
            })
          } else if (subdomain === "shop") {
            customConfig[provider].records.push({
              type: "CNAME",
              host: provider === "namecheap" ? "shop" : "shop",
              name: provider === "cloudflare" ? "shop" : "shop",
              value: "your-ecommerce-platform.com",
              content: "your-ecommerce-platform.com", // For Cloudflare
              ttl: provider === "godaddy" ? "1 Hour" : "Automatic",
              notes: "Points shop subdomain to your e-commerce platform (replace with actual URL)",
              category: "subdomains",
            })
          } else if (subdomain === "app") {
            customConfig[provider].records.push({
              type: "CNAME",
              host: provider === "namecheap" ? "app" : "app",
              name: provider === "cloudflare" ? "app" : "app",
              value: "your-app-platform.com",
              content: "your-app-platform.com", // For Cloudflare
              ttl: provider === "godaddy" ? "1 Hour" : "Automatic",
              notes: "Points app subdomain to your application platform (replace with actual URL)",
              category: "subdomains",
            })
          } else if (subdomain === "docs") {
            customConfig[provider].records.push({
              type: "CNAME",
              host: provider === "namecheap" ? "docs" : "docs",
              name: provider === "cloudflare" ? "docs" : "docs",
              value: "your-docs-platform.com",
              content: "your-docs-platform.com", // For Cloudflare
              ttl: provider === "godaddy" ? "1 Hour" : "Automatic",
              notes: "Points docs subdomain to your documentation platform (replace with actual URL)",
              category: "subdomains",
            })
          }
        })
      }

      // Update instructions based on selected options
      customConfig[provider].instructions = generateInstructions(provider, {
        domain,
        serviceType,
        hostingProvider,
        emailProvider,
        subdomains,
      })
    }
  }

  // Add specific hosting provider information
  if (hostingProvider && customConfig.hostingProviders && customConfig.hostingProviders[hostingProvider]) {
    customConfig.selectedHostingProvider = customConfig.hostingProviders[hostingProvider]
  }

  // Add specific email provider information
  if (emailProvider && customConfig.emailServices && customConfig.emailServices[emailProvider]) {
    customConfig.selectedEmailProvider = customConfig.emailServices[emailProvider]
  }

  return customConfig
}

// Generate provider-specific instructions based on user selections
function generateInstructions(provider, options) {
  const { domain, serviceType, hostingProvider, emailProvider, subdomains } = options
  const instructions = []

  // Basic login instructions
  if (provider === "namecheap") {
    instructions.push("Log in to your Namecheap account")
    instructions.push('Go to "Domain List" and click "Manage" next to your domain')
    instructions.push('Select the "Advanced DNS" tab')
  } else if (provider === "cloudflare") {
    instructions.push("Log in to your Cloudflare account")
    instructions.push("Select your domain")
    instructions.push('Go to the "DNS" tab')
  } else if (provider === "godaddy") {
    instructions.push("Log in to your GoDaddy account")
    instructions.push('Go to "My Products" and select your domain')
    instructions.push('Click on "DNS"')
  }

  // Service-specific instructions
  if (serviceType === "website" || serviceType === "both") {
    if (hostingProvider === "odoo") {
      instructions.push("Add the CNAME record pointing to your Odoo instance (e.g., yourdomain.odoo.com)")
      instructions.push("For the apex domain, use an ALIAS/ANAME record if your provider supports it")
      instructions.push("Otherwise, set up a URL redirect from the apex domain to the www subdomain")
      instructions.push("In your Odoo dashboard, go to Settings > General Settings > Website")
      instructions.push("Click on 'Configure Domain Names' and add your domain")

      if (serviceType === "email" || serviceType === "both") {
        instructions.push("For email configuration with Odoo:")
        instructions.push("1. Add the MX records pointing to Odoo's mail servers")
        instructions.push("2. Add the SPF, DKIM, and DMARC records for email authentication")
        instructions.push("3. In Odoo, go to Settings > General Settings > Email")
        instructions.push("4. Configure both Incoming and Outgoing Email Servers")
        instructions.push("5. Set up mail aliases if needed (Settings > Technical > Email > Aliases)")
      }

      // Add OVH-specific instructions if needed
      instructions.push("If you're using OVH with Odoo:")
      instructions.push("1. Set up your domain in OVH first")
      instructions.push("2. Configure the DNS zone in OVH to point to Odoo")
      instructions.push("3. Add a CNAME record for 'www' pointing to your Odoo subdomain")
      instructions.push("4. For the apex domain, use OVH's redirection service to point to your www subdomain")
      instructions.push("5. If using email, configure OVH's MX records to work with Odoo's email servers")
    } else if (hostingProvider === "netlify") {
      instructions.push("Add the A record pointing to Netlify's IP address (75.2.60.5)")
      instructions.push("Add the CNAME record for www pointing to your Netlify site")
      instructions.push("In your Netlify dashboard, add your custom domain in Site settings > Domain management")
    } else if (hostingProvider === "vercel") {
      instructions.push("Add the A record pointing to Vercel's IP address (76.76.21.21)")
      instructions.push("Add the CNAME record for www pointing to cname.vercel-dns.com")
      instructions.push("In your Vercel dashboard, add your custom domain in Project settings > Domains")
    } else if (hostingProvider === "heroku") {
      instructions.push("Add the CNAME record for www pointing to your Heroku app")
      instructions.push("For the apex domain, use an ALIAS/ANAME record if your provider supports it")
      instructions.push("In your Heroku dashboard, add your custom domain in App settings > Domains")
    } else {
      instructions.push("Add the A record pointing to your web server's IP address")
      instructions.push("Add the CNAME record for www pointing to your main domain")
    }
  }

  if (serviceType === "email" || serviceType === "both") {
    if (emailProvider === "googleWorkspace") {
      instructions.push("Add all the MX records for Google Workspace mail servers")
      instructions.push("Add the SPF record (TXT) for email authentication")
      instructions.push("In Google Workspace Admin Console, verify your domain ownership")
    } else if (emailProvider === "microsoft365") {
      instructions.push("Add the MX record for Microsoft 365 mail server")
      instructions.push("Add the SPF record (TXT) for email authentication")
      instructions.push("In Microsoft 365 Admin Center, complete the domain verification process")
    } else if (emailProvider === "zoho") {
      instructions.push("Add all the MX records for Zoho mail servers")
      instructions.push("Add the SPF record (TXT) for email authentication")
      instructions.push("In Zoho Mail Admin Console, verify your domain ownership")
    } else {
      instructions.push("Add the MX record for your mail server")
      instructions.push("Add the SPF record (TXT) for email authentication")
    }
  }

  if (subdomains && subdomains.length > 0) {
    instructions.push("Add CNAME records for each of your subdomains")
    instructions.push("Configure your subdomain services to accept traffic from these subdomains")
  }

  instructions.push("Wait for DNS propagation (can take up to 48 hours)")

  return instructions
}


"use client"

import type React from "react"

import { useState } from "react"
import { Loader2, AlertTriangle, CheckCircle, Info } from "lucide-react"

export default function Home() {
  const [domain, setDomain] = useState("google.com")
  const [lookupType, setLookupType] = useState("mx")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [testType, setTestType] = useState<"dns" | "security" | "web3" | "availability">("availability")
  const [canisterId, setCanisterId] = useState<string>("")
  const [activeDnsProvider, setActiveDnsProvider] = useState<"namecheap" | "cloudflare" | "godaddy">("namecheap")
  const [canisterIdError, setCanisterIdError] = useState<string | null>(null)
  const [showEmailSecuritySuggestion, setShowEmailSecuritySuggestion] = useState<boolean>(false)
  const [web3DomainType, setWeb3DomainType] = useState<"icp" | "unstoppable" | "web2">("web2")
  // Ajouter des états pour les options Web2
  const [web2ServiceType, setWeb2ServiceType] = useState<"website" | "email" | "both">("website")
  const [web2HostingProvider, setWeb2HostingProvider] = useState<string>("other")
  const [web2EmailProvider, setWeb2EmailProvider] = useState<string>("other")
  const [web2ServerIp, setWeb2ServerIp] = useState<string>("")
  const [web2Subdomains, setWeb2Subdomains] = useState<string[]>([])
  const [showWeb2Options, setShowWeb2Options] = useState<boolean>(false)

  // Remplacer les simples setTestType par cette fonction
  const handleTestTypeChange = (type: "dns" | "security" | "web3" | "availability") => {
    if (type !== testType) {
      setResult(null) // Réinitialiser les résultats lors du changement de type
      setError(null)
      setShowEmailSecuritySuggestion(false)
    }
    setTestType(type)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setCanisterIdError(null)
    setShowEmailSecuritySuggestion(false)

    try {
      // Determine which API endpoint to call based on test type
      let endpoint = "/api/dns-lookup"
      let requestBody = { domain, lookupType }

      switch (testType) {
        case "dns":
          endpoint = "/api/dns-lookup"
          requestBody = { domain, lookupType }
          break
        case "security":
          endpoint = "/api/email-security"
          requestBody = { domain }
          break
        case "web3":
          // Choose endpoint based on web3 domain type
          if (web3DomainType === "web2") {
            endpoint = "/api/domain-configuration"
            requestBody = {
              domain,
              serviceType: web2ServiceType,
              hostingProvider: web2HostingProvider,
              emailProvider: web2EmailProvider,
              serverIp: web2ServerIp,
              subdomains: web2Subdomains,
            }
              console.log("Sending request to:", endpoint)
            console.log("Request body:", JSON.stringify(requestBody))

          } else {
            endpoint = web3DomainType === "icp" ? "/api/icp-check" : "/api/unstoppable-check"

            // Validate canister ID is provided for ICP
            if (web3DomainType === "icp") {
              if (!canisterId.trim()) {
                setCanisterIdError("Canister ID is required for ICP check")
                setLoading(false)
                return
              }

              //Validate canister ID format
              const canisterIdRegex = /^[a-z0-9]+-[a-z0-9]+-[a-z0-9]+-[a-z0-9]+-[a-z0-9]+$/
              if (!canisterIdRegex.test(canisterId)) {
                setCanisterIdError("Invalid canister ID format. Should be like: aaaaa-bbbbb-ccccc-ddddd-eee")
                setLoading(false)
                return
              }
            }

            // Get selected Web3 features
            const web3Features = Array.from(document.querySelectorAll('input[name="web3-features"]:checked')).map(
              (el) => (el as HTMLInputElement).value,
            )

            requestBody = web3DomainType === "icp" ? { domain, canisterId, web3Features } : { domain, web3Features }
          }
          break
        case "availability":
          endpoint = "/api/domain-availability"
          requestBody = { domain }
          break
      }

      // Make API request to our endpoint
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      
      
    

      // Handle any errors in the response data
      if (data.error) {
        setError(data.error)
        console.error("API returned an error:", data.error)
      } else {
        setResult(data)

        // Check if we should suggest email security check
        if (testType === "dns" && lookupType === "mx" && data.records && data.records.length > 0) {
          setShowEmailSecuritySuggestion(true)
        }
      }
    } catch (err) {
      setError(`Error: ${(err as Error).message}. Some features may still work.`)
      console.error("Error testing API:", err)
    } finally {
      setLoading(false)
    }
  }

  const checkEmailSecurity = () => {
    handleTestTypeChange("security")
    handleSubmit(new Event("submit") as any)
  }

  const checkWeb3FromAvailability = () => {
    if (result && result.domain) {
      handleTestTypeChange("web3")
      // If the canister ID is empty and we're checking ICP, suggest to fill it
      if (web3DomainType === "icp" && !canisterId) {
        setCanisterIdError("Please enter a canister ID to continue with ICP check")
      } else {
        handleSubmit(new Event("submit") as any)
      }
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-3xl p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">RECORDSS.AI API</h1>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Test API</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="domain" className="block text-sm font-medium text-gray-700 mb-1">
                Domain Name
              </label>
              <input
                type="text"
                id="domain"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="example.com"
                required
              />
            </div>

            {testType === "web3" && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Domain Type</label>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center">
                    <input
                      id="icp-domain"
                      name="web3-domain-type"
                      type="radio"
                      checked={web3DomainType === "icp"}
                      onChange={() => setWeb3DomainType("icp")}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <label htmlFor="icp-domain" className="ml-2 block text-sm text-gray-700">
                      Internet Computer (ICP)
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="unstoppable-domain"
                      name="web3-domain-type"
                      type="radio"
                      checked={web3DomainType === "unstoppable"}
                      onChange={() => setWeb3DomainType("unstoppable")}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <label htmlFor="unstoppable-domain" className="ml-2 block text-sm text-gray-700">
                      Unstoppable Domains
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="web2-domain"
                      name="web3-domain-type"
                      type="radio"
                      checked={web3DomainType === "web2"}
                      onChange={() => setWeb3DomainType("web2")}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <label htmlFor="web2-domain" className="ml-2 block text-sm text-gray-700">
                      Standard Web2 Domain
                    </label>
                  </div>
                </div>
              </div>
            )}

            {testType === "web3" && web3DomainType === "web2" && (
              <div className="space-y-4 mt-4 p-4 bg-gray-50 rounded-md">
                <h3 className="font-medium text-gray-800">Standard Web2 Domain Configuration</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What services do you want to set up?
                  </label>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center">
                      <input
                        id="website-service"
                        name="web2-service-type"
                        type="radio"
                        checked={web2ServiceType === "website"}
                        onChange={() => setWeb2ServiceType("website")}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      />
                      <label htmlFor="website-service" className="ml-2 block text-sm text-gray-700">
                        Website Only
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="email-service"
                        name="web2-service-type"
                        type="radio"
                        checked={web2ServiceType === "email"}
                        onChange={() => setWeb2ServiceType("email")}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      />
                      <label htmlFor="email-service" className="ml-2 block text-sm text-gray-700">
                        Email Only
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="both-services"
                        name="web2-service-type"
                        type="radio"
                        checked={web2ServiceType === "both"}
                        onChange={() => setWeb2ServiceType("both")}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      />
                      <label htmlFor="both-services" className="ml-2 block text-sm text-gray-700">
                        Both Website & Email
                      </label>
                    </div>
                  </div>
                </div>

                {(web2ServiceType === "website" || web2ServiceType === "both") && (
                  <div>
                    <label htmlFor="web2-hosting" className="block text-sm font-medium text-gray-700 mb-1">
                      Where is your website hosted?
                    </label>
                    <select
                      id="web2-hosting"
                      value={web2HostingProvider}
                      onChange={(e) => setWeb2HostingProvider(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="other">Select your hosting provider</option>
                      <option value="aws">Amazon Web Services (AWS)</option>
                      <option value="ovh">OVH</option>
                      <option value="digitalocean">DigitalOcean</option>
                      <option value="heroku">Heroku</option>
                      <option value="netlify">Netlify</option>
                      <option value="vercel">Vercel</option>
                      <option value="odoo">Odoo</option>
                      <option value="cpanel">cPanel (Shared Hosting)</option>
                      <option value="other">Other Provider</option>
                    </select>

                    {web2HostingProvider === "odoo" && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-md">
                        <h4 className="text-sm font-medium text-blue-800">Odoo Configuration Information</h4>
                        <p className="mt-1 text-xs text-gray-700">
                          Odoo requires specific DNS configuration to work properly. You'll need to:
                        </p>
                        <ul className="mt-1 text-xs text-gray-700 list-disc pl-5 space-y-1">
                          <li>Set up a CNAME record pointing to your Odoo instance (yourdomain.odoo.com)</li>
                          <li>If using email with Odoo, you'll need additional MX records</li>
                          <li>For OVH users: You'll need to configure both OVH and Odoo settings</li>
                        </ul>

                        {(web2ServiceType === "email" || web2ServiceType === "both") && (
                          <div className="mt-2">
                            <h5 className="text-xs font-medium text-blue-800">Email Configuration with Odoo</h5>
                            <p className="mt-1 text-xs text-gray-700">
                              For email integration with Odoo, you'll need to configure:
                            </p>
                            <ul className="mt-1 text-xs text-gray-700 list-disc pl-5 space-y-1">
                              <li>
                                Incoming mail servers in Odoo (Settings &gt; General Settings &gt; Email &gt; Incoming
                                Email Servers)
                              </li>
                              <li>
                                Outgoing mail servers in Odoo (Settings &gt; General Settings &gt; Email &gt; Outgoing
                                Email Servers)
                              </li>
                              <li>Proper MX records in your DNS configuration</li>
                              <li>SPF and DKIM records for email authentication</li>
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    {web2HostingProvider !== "netlify" &&
                      web2HostingProvider !== "vercel" &&
                      web2HostingProvider !== "heroku" &&
                      web2HostingProvider !== "other" && (
                        <div className="mt-3">
                          <label htmlFor="server-ip" className="block text-sm font-medium text-gray-700 mb-1">
                            Server IP Address
                          </label>
                          <input
                            type="text"
                            id="server-ip"
                            placeholder="e.g. 192.168.1.1"
                            value={web2ServerIp}
                            onChange={(e) => setWeb2ServerIp(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          />
                          <div className="mt-1 text-xs text-gray-500">
                            {web2HostingProvider === "aws" && (
                              <p>
                                <strong>AWS:</strong> Find your IP in EC2 Dashboard &gt; Instances &gt; Select your
                                instance &gt; Details tab &gt; Public IPv4 address
                              </p>
                            )}
                            {web2HostingProvider === "ovh" && (
                              <p>
                                <strong>OVH:</strong> Find your IP in OVH Control Panel &gt; Web Cloud &gt; Hosting &gt;
                                Your hosting plan &gt; General Information
                              </p>
                            )}
                            {web2HostingProvider === "digitalocean" && (
                              <p>
                                <strong>DigitalOcean:</strong> Find your IP in DigitalOcean Dashboard &gt; Droplets &gt;
                                Select your droplet &gt; IP Address field
                              </p>
                            )}
                            {web2HostingProvider === "cpanel" && (
                              <p>
                                <strong>cPanel:</strong> Find your IP in cPanel Dashboard &gt; Main page &gt; Shared IP
                                Address or in your welcome email
                              </p>
                            )}
                            {web2HostingProvider === "odoo" && (
                              <p>
                                <strong>Odoo:</strong> You don't need to enter an IP address. Odoo uses CNAME records
                                that will be configured automatically.
                              </p>
                            )}
                            {web2HostingProvider === "other" && (
                              <p>
                                <strong>Other providers:</strong> Contact your hosting provider or check your hosting
                                dashboard for your server's IP address.
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                )}

                {(web2ServiceType === "email" || web2ServiceType === "both") && (
                  <div>
                    <label htmlFor="web2-email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Service Provider
                    </label>
                    <select
                      id="web2-email"
                      value={web2EmailProvider}
                      onChange={(e) => setWeb2EmailProvider(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="other">Select your email provider</option>
                      <option value="googleWorkspace">Google Workspace (formerly G Suite)</option>
                      <option value="microsoft365">Microsoft 365</option>
                      <option value="zoho">Zoho Mail</option>
                      <option value="other">Other Provider</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Do you need subdomains? (Optional)
                  </label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    <div className="flex items-center">
                      <input
                        id="blog-subdomain"
                        name="web2-subdomains"
                        type="checkbox"
                        value="blog"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setWeb2Subdomains([...web2Subdomains, "blog"])
                          } else {
                            setWeb2Subdomains(web2Subdomains.filter((sd) => sd !== "blog"))
                          }
                        }}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor="blog-subdomain" className="ml-2 block text-sm text-gray-700">
                        Blog (blog.domain.com)
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="shop-subdomain"
                        name="web2-subdomains"
                        type="checkbox"
                        value="shop"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setWeb2Subdomains([...web2Subdomains, "shop"])
                          } else {
                            setWeb2Subdomains(web2Subdomains.filter((sd) => sd !== "shop"))
                          }
                        }}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor="shop-subdomain" className="ml-2 block text-sm text-gray-700">
                        Shop (shop.domain.com)
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="app-subdomain"
                        name="web2-subdomains"
                        type="checkbox"
                        value="app"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setWeb2Subdomains([...web2Subdomains, "app"])
                          } else {
                            setWeb2Subdomains(web2Subdomains.filter((sd) => sd !== "app"))
                          }
                        }}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor="app-subdomain" className="ml-2 block text-sm text-gray-700">
                        App (app.domain.com)
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="docs-subdomain"
                        name="web2-subdomains"
                        type="checkbox"
                        value="docs"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setWeb2Subdomains([...web2Subdomains, "docs"])
                          } else {
                            setWeb2Subdomains(web2Subdomains.filter((sd) => sd !== "docs"))
                          }
                        }}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor="docs-subdomain" className="ml-2 block text-sm text-gray-700">
                        Docs (docs.domain.com)
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {testType === "web3" && web3DomainType === "icp" && (
              <div>
                <label htmlFor="canisterId" className="block text-sm font-medium text-gray-700 mb-1">
                  Canister ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="canisterId"
                  placeholder="aaaaa-bbbbb-ccccc-ddddd-eee"
                  value={canisterId}
                  onChange={(e) => setCanisterId(e.target.value)}
                  className={`w-full px-3 py-2 border ${canisterIdError ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500  rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                  required
                />
                {canisterIdError && <p className="mt-1 text-xs text-red-500">{canisterIdError}</p>}
                <p className="mt-1 text-xs text-gray-500">
                  Enter your canister ID to get specific configuration instructions
                </p>
              </div>
            )}

            {testType === "web3" && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Web3 Features to Check (Optional)
                </label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <div className="flex items-center">
                    <input
                      id="check-ii"
                      name="web3-features"
                      type="checkbox"
                      value="internetIdentity"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="check-ii" className="ml-2 block text-sm text-gray-700">
                      Internet Identity
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="check-wallets"
                      name="web3-features"
                      type="checkbox"
                      value="wallets"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="check-wallets" className="ml-2 block text-sm text-gray-700">
                      Wallet Support
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="check-tokens"
                      name="web3-features"
                      type="checkbox"
                      value="tokens"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="check-tokens" className="ml-2 block text-sm text-gray-700">
                      Token Standards
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="check-nfts"
                      name="web3-features"
                      type="checkbox"
                      value="nfts"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="check-nfts" className="ml-2 block text-sm text-gray-700">
                      NFT Support
                    </label>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="flex items-center">
                <input
                  id="domain-availability"
                  name="test-type"
                  type="radio"
                  checked={testType === "availability"}
                  onChange={() => handleTestTypeChange("availability")}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <label htmlFor="domain-availability" className="ml-2 block text-sm text-gray-700">
                  Domain Availability
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="web3-connect"
                  name="test-type"
                  type="radio"
                  checked={testType === "web3"}
                  onChange={() => handleTestTypeChange("web3")}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <label htmlFor="web3-connect" className="ml-2 block text-sm text-gray-700">
                  Connect Domain
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="security-analysis"
                  name="test-type"
                  type="radio"
                  checked={testType === "security"}
                  onChange={() => handleTestTypeChange("security")}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <label htmlFor="security-analysis" className="ml-2 block text-sm text-gray-700">
                  Email Security
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="dns-lookup"
                  name="test-type"
                  type="radio"
                  checked={testType === "dns"}
                  onChange={() => handleTestTypeChange("dns")}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <label htmlFor="dns-lookup" className="ml-2 block text-sm text-gray-700">
                  DNS Lookup
                </label>
              </div>
            </div>

            {testType === "dns" && (
              <div>
                <label htmlFor="lookupType" className="block text-sm font-medium text-gray-700 mb-1">
                  Lookup Type
                </label>
                <select
                  id="lookupType"
                  value={lookupType}
                  onChange={(e) => setLookupType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="a">A Record</option>
                  <option value="aaaa">AAAA Record</option>
                  <option value="mx">MX Record</option>
                  <option value="ns">NS Record</option>
                  <option value="txt">TXT Record</option>
                  <option value="soa">SOA Record</option>
                  <option value="spf">SPF Record</option>
                  <option value="dmarc">DMARC Record</option>
                  <option value="dkim">DKIM Record</option>
                </select>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    {testType === "availability" ? "Checking Availability..." : "Performing Lookup..."}
                  </>
                ) : testType === "availability" ? (
                  "Check Availability"
                ) : (
                  "Lookup Domain"
                )}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              <p className="font-medium">Error:</p>
              <p>{error}</p>
            </div>
          )}

          {showEmailSecuritySuggestion && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded flex items-start">
              <Info className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Email server detected!</p>
                <p className="text-sm">
                  This domain has MX records, indicating it&apos;s configured for email. Would you like to check its
                  email security configuration?
                </p>
                <button
                  onClick={checkEmailSecurity}
                  className="mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                >
                  Check Email Security
                </button>
              </div>
            </div>
          )}

          {result && testType === "availability" && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">
                {result.availability?.available
                  ? "Domain Available!"
                  : result.availability?.available === false
                    ? "Domain Not Available"
                    : "Domain Availability Check"}
              </h3>

              {result.availability?.available && (
                <div className="bg-green-100 p-4 rounded-md mb-4">
                  <p className="text-green-800 font-medium">{result.domain} appears to be available for registration</p>
                  <p className="text-sm text-green-700 mt-1">Method: {result.availability.method}</p>
                  {result.availability.note && (
                    <p className="text-sm text-green-700 mt-1">{result.availability.note}</p>
                  )}

                  {result.pricing && (
                    <div className="mt-2">
                      <p className="font-medium">Estimated Prices:</p>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <div>Namecheap: ${result.pricing.registration.namecheap}</div>
                        <div>GoDaddy: ${result.pricing.registration.godaddy}</div>
                        <div>Porkbun: ${result.pricing.registration.porkbun}</div>
                        <div>Dynadot: ${result.pricing.registration.dynadot}</div>
                      </div>
                    </div>
                  )}

                  {result.purchaseLinks && (
                    <div className="mt-3">
                      <p className="font-medium">Register at:</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <a
                          href={result.purchaseLinks.namecheap}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
                        >
                          Namecheap
                        </a>
                        <a
                          href={result.purchaseLinks.godaddy}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                        >
                          GoDaddy
                        </a>
                        <a
                          href={result.purchaseLinks.porkbun}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-pink-600 text-white rounded hover:bg-pink-700 text-sm"
                        >
                          Porkbun
                        </a>
                        <a
                          href={result.purchaseLinks.cloudflare}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-orange-600 text-white rounded hover:bg-orange-700 text-sm"
                        >
                          Cloudflare
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {result.availability?.available === false && (
                <div className="bg-red-100 p-4 rounded-md mb-4">
                  <p className="text-red-800 font-medium">{result.domain} is already registered</p>
                  <p className="text-sm text-red-700 mt-1">Method: {result.availability.method}</p>
                  {result.availability.note && <p className="text-sm text-red-700 mt-1">{result.availability.note}</p>}

                  {result.availability.dnsCheckResult && (
                    <div className="mt-2">
                      <p className="font-medium">DNS Check Results:</p>
                      <p className="text-sm">
                        Records found for:{" "}
                        {Object.entries(result.availability.dnsCheckResult.recordsFound)
                          .filter(([_, value]) => value.Answer?.length > 0)
                          .map(([type]) => type)
                          .join(", ")}
                      </p>
                    </div>
                  )}

                  {result.availability?.whoisData && (
                    <div className="mt-2">
                      <p className="font-medium">Registration Details:</p>
                      <div className="grid grid-cols-1 gap-1 mt-1">
                        <div>Registrar: {result.availability.whoisData.registrar}</div>
                        <div>Created: {result.availability.whoisData.creationDate}</div>
                        <div>Expires: {result.availability.whoisData.expiryDate}</div>
                      </div>
                    </div>
                  )}

                  {result.availability.dnsCheckResult && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-md">
                      <p className="font-medium text-blue-800">DNS Records for Internet Computer:</p>
                      <div className="mt-1 text-sm">
                        {Object.entries(result.availability.dnsCheckResult.recordsFound)
                          .filter(
                            ([type, value]) =>
                              ["A", "AAAA", "CNAME"].includes(type) && (value as any).Answer?.length > 0,
                          )
                          .map(([type, value]) => (
                            <div key={type} className="mb-1">
                              <span className="font-medium">{type} Records:</span>
                              {(value as any).Answer.map((record: any, i: number) => (
                                <span key={i} className="ml-1">
                                  {record.data}
                                  {i < (value as any).Answer.length - 1 ? ", " : ""}
                                </span>
                              ))}
                            </div>
                          ))}

                        {!Object.entries(result.availability.dnsCheckResult.recordsFound).some(
                          ([type, value]) => ["A", "AAAA", "CNAME"].includes(type) && (value as any).Answer?.length > 0,
                        ) && (
                          <p>
                            No A, AAAA, or CNAME records found. This domain is ready for Internet Computer
                            configuration.
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {result.availability?.available === null && (
                <div className="bg-yellow-100 p-4 rounded-md mb-4">
                  <p className="text-yellow-800 font-medium">Unable to determine availability for {result.domain}</p>
                  {result.availability.error && (
                    <p className="text-sm text-yellow-700 mt-1">Error: {result.availability.error}</p>
                  )}
                  {result.availability.note && (
                    <p className="text-sm text-yellow-700 mt-1">{result.availability.note}</p>
                  )}
                </div>
              )}

              <div className="mt-4">
                <button
                  onClick={checkWeb3FromAvailability}
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Continue to Connect Domain
                </button>
                <p className="text-sm text-gray-500 mt-1">Configure this domain for web or Web3</p>
              </div>
            </div>
          )}

          {result && testType === "security" && result.dnsConfig && result.securityScore && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Email Security Configuration</h3>

              <div className="bg-blue-50 p-4 rounded-md mb-4">
                {result.hasMxRecords ? (
                  <div className="bg-green-100 p-3 rounded-md mb-3 border border-green-300">
                    <p className="text-green-800 font-medium flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Email servers detected
                    </p>
                    <p className="text-sm text-green-700 mt-1">
                      This domain has {result.mxRecords?.length || 0} MX records configured.
                      {result.isUsingParentMx && (
                        <span className="block mt-1">
                          Using parent domain&apos;s ({result.parentDomain}) MX records.
                        </span>
                      )}
                    </p>
                  </div>
                ) : result.isSubdomain ? (
                  <div className="bg-yellow-100 p-3 rounded-md mb-3 border border-yellow-300">
                    <p className="text-yellow-800 font-medium flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2" />
                      No direct email servers detected
                    </p>
                    <p className="text-sm text-yellow-700 mt-1">
                      This is a subdomain of {result.parentDomain}. Subdomains typically inherit email settings from
                      their parent domain or use separate configurations.
                      {result.hasAddressRecords && (
                        <span className="block mt-1">
                          This subdomain has web hosting (A/AAAA records) but no specific email configuration.
                        </span>
                      )}
                    </p>
                  </div>
                ) : (
                  <div className="bg-yellow-100 p-3 rounded-md mb-3 border border-yellow-300">
                    <p className="text-yellow-800 font-medium flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2" />
                      No email servers detected
                    </p>
                    <p className="text-sm text-yellow-700 mt-1">
                      This domain doesn&apos;t have MX records. Email security is only relevant if you plan to use this
                      domain for email.
                    </p>
                  </div>
                )}

                {result.securityScore && (
                  <div className="mb-4">
                    <h4 className="font-medium text-blue-800 mb-2">
                      Email Security Score: {result.securityScore.rating}
                    </h4>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div
                        className={`h-4 rounded-full ${
                          result.securityScore.percentage >= 75
                            ? "bg-green-500"
                            : result.securityScore.percentage >= 50
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                        style={{ width: `${result.securityScore.percentage}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Score: {result.securityScore.score}/{result.securityScore.total} (
                      {result.securityScore.percentage}
                      %)
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className={`p-3 rounded-md ${result.spf?.exists ? "bg-green-100" : "bg-yellow-100"}`}>
                    <h5 className="font-medium flex items-center">
                      {result.spf?.exists ? (
                        <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 mr-1 text-yellow-600" />
                      )}
                      SPF Record
                    </h5>
                    {result.spf?.exists ? (
                      <>
                        <p className="text-sm mt-1 break-words">{result.spf.value}</p>
                        {result.spf.isFromParent && (
                          <p className="text-xs mt-1 text-green-600">Using parent domain&apos;s SPF record</p>
                        )}
                      </>
                    ) : (
                      <p className="text-sm mt-1">No SPF record found. This is recommended for email security.</p>
                    )}
                  </div>

                  <div className={`p-3 rounded-md ${result.dmarc?.exists ? "bg-green-100" : "bg-yellow-100"}`}>
                    <h5 className="font-medium flex items-center">
                      {result.dmarc?.exists ? (
                        <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 mr-1 text-yellow-600" />
                      )}
                      DMARC Record
                    </h5>
                    {result.dmarc?.exists ? (
                      <>
                        <p className="text-sm mt-1 break-words">{result.dmarc.value}</p>
                        {result.dmarc.isFromParent && (
                          <p className="text-xs mt-1 text-green-600">
                            {result.dmarc.appliesTo || "Using parent domain's DMARC record"}
                          </p>
                        )}
                      </>
                    ) : (
                      <p className="text-sm mt-1">No DMARC record found. This is recommended for email security.</p>
                    )}
                  </div>

                  <div className={`p-3 rounded-md ${result.dkim?.found ? "bg-green-100" : "bg-yellow-100"}`}>
                    <h5 className="font-medium flex items-center">
                      {result.dkim?.found ? (
                        <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 mr-1 text-yellow-600" />
                      )}
                      DKIM Records
                    </h5>
                    {result.dkim?.found ? (
                      <>
                        <p className="text-sm mt-1">Found {result.dkim.records.length} DKIM record(s)</p>
                        {result.dkim.records.some((record) => record.isFromParent) && (
                          <p className="text-xs mt-1 text-green-600">Using parent domain&apos;s DKIM record(s)</p>
                        )}
                      </>
                    ) : (
                      <p className="text-sm mt-1">
                        No DKIM records found with common selectors. This is recommended for email security.
                      </p>
                    )}
                  </div>

                  <div className={`p-3 rounded-md ${result.mtaSts?.exists ? "bg-green-100" : "bg-gray-100"}`}>
                    <h5 className="font-medium flex items-center">
                      {result.mtaSts?.exists ? (
                        <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
                      ) : (
                        <Info className="h-4 w-4 mr-1 text-gray-600" />
                      )}
                      MTA-STS
                    </h5>
                    {result.mtaSts?.exists ? (
                      <>
                        <p className="text-sm mt-1 break-words">{result.mtaSts.value}</p>
                        {result.mtaSts.isFromParent && (
                          <p className="text-xs mt-1 text-green-600">Using parent domain&apos;s MTA-STS record</p>
                        )}
                      </>
                    ) : (
                      <p className="text-sm mt-1">
                        No MTA-STS record found. This is optional but recommended for enhanced security.
                      </p>
                    )}
                  </div>
                </div>

                <p className="text-blue-800 font-medium mb-2">Recommended DNS Configuration for {result.domain}</p>

                <div className="mt-3">
                  <div className="flex border-b border-gray-200">
                    <button
                      onClick={() => setActiveDnsProvider("namecheap")}
                      className={`px-4 py-2 font-medium text-sm ${
                        activeDnsProvider === "namecheap"
                          ? "border-b-2 border-blue-500 text-blue-600"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Namecheap
                    </button>
                    <button
                      onClick={() => setActiveDnsProvider("cloudflare")}
                      className={`px-4 py-2 font-medium text-sm ${
                        activeDnsProvider === "cloudflare"
                          ? "border-b-2 border-blue-500 text-blue-600"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Cloudflare
                    </button>
                    <button
                      onClick={() => setActiveDnsProvider("godaddy")}
                      className={`px-4 py-2 font-medium text-sm ${
                        activeDnsProvider === "godaddy"
                          ? "border-b-2 border-blue-500 text-blue-600"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      GoDaddy
                    </button>
                  </div>

                  <div className="mt-4">
                    {result.dnsConfig[activeDnsProvider].records.length > 0 ? (
                      <>
                        <h4 className="font-medium text-sm text-gray-700 mb-2">DNS Records to Add:</h4>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Type
                                </th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  {activeDnsProvider === "namecheap"
                                    ? "Host"
                                    : activeDnsProvider === "cloudflare"
                                      ? "Name"
                                      : "Host"}
                                </th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  {activeDnsProvider === "cloudflare" ? "Content" : "Value"}
                                </th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  TTL
                                </th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Notes
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {result.dnsConfig[activeDnsProvider].records.map((record, index) => (
                                <tr key={index}>
                                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{record.type}</td>
                                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                    {activeDnsProvider === "namecheap"
                                      ? record.host
                                      : activeDnsProvider === "cloudflare"
                                        ? record.name
                                        : record.name}
                                  </td>
                                  <td className="px-3 py-2 text-sm text-gray-900 break-all">
                                    {activeDnsProvider === "cloudflare" ? record.content : record.value}
                                  </td>
                                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{record.ttl}</td>
                                  <td className="px-3 py-2 text-sm text-gray-900">{record.notes}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </>
                    ) : (
                      <div className="bg-green-100 p-3 rounded-md">
                        <p className="text-green-800 font-medium">
                          All recommended email security records are already configured!
                        </p>
                      </div>
                    )}

                    <h4 className="font-medium text-sm text-gray-700 mt-4 mb-2">Instructions:</h4>
                    <ol className="list-decimal pl-5 space-y-1 text-sm text-gray-700">
                      {result.dnsConfig[activeDnsProvider].instructions.map((instruction, index) => (
                        <li key={index}>{instruction}</li>
                      ))}
                    </ol>

                    <h4 className="font-medium text-sm text-gray-700 mt-4 mb-2">Verification:</h4>
                    <div className="bg-gray-100 p-2 rounded text-sm font-mono">
                      {result.dnsConfig.verification.command}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{result.dnsConfig.verification.notes}</p>

                    <h4 className="font-medium text-sm text-gray-700 mt-4 mb-2">Troubleshooting:</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                      {result.dnsConfig.troubleshooting.map((tip, index) => (
                        <li key={index}>{tip}</li>
                      ))}
                    </ul>

                    {result.dnsConfig.resources && (
                      <>
                        <h4 className="font-medium text-sm text-gray-700 mt-4 mb-2">Resources:</h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                          {result.dnsConfig.resources.map((resource, index) => (
                            <li key={index}>
                              <a
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                {resource.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {result && testType === "web3" && result.dnsConfig && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">
                {web3DomainType === "icp"
                  ? "ICP Domain Configuration"
                  : web3DomainType === "unstoppable"
                    ? "Unstoppable Domain Configuration"
                    : "Standard Domain Configuration"}
              </h3>

              <div className="bg-blue-50 p-4 rounded-md mb-4">
                {/* Affichage des informations de disponibilité du domaine */}
                {result.domainAvailability && (
                  <div
                    className={`p-3 rounded-md mb-3 ${
                      result.domainAvailability.available
                        ? "bg-green-100 border border-green-300"
                        : result.domainAvailability.registered
                          ? "bg-yellow-100 border border-yellow-300"
                          : "bg-blue-100 border border-blue-300"
                    }`}
                  >
                    <p
                      className={`font-medium ${
                        result.domainAvailability.available
                          ? "text-green-800"
                          : result.domainAvailability.registered
                            ? "text-yellow-800"
                            : "text-blue-800"
                      }`}
                    >
                      {result.domainAvailability.message}
                    </p>

                    {result.domainAvailability.available && result.domainAvailability.purchaseLinks ? (
                      <div className="mt-3">
                        <p className="font-medium text-green-800">Register this domain:</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <a
                            href={result.domainAvailability.purchaseLinks.namecheap}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
                          >
                            Namecheap
                          </a>
                          <a
                            href={result.domainAvailability.purchaseLinks.godaddy}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                          >
                            GoDaddy
                          </a>
                          <a
                            href={result.domainAvailability.purchaseLinks.porkbun}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 bg-pink-600 text-white rounded hover:bg-pink-700 text-sm"
                          >
                            Porkbun
                          </a>
                          <a
                            href={result.domainAvailability.purchaseLinks.cloudflare}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 bg-orange-600 text-white rounded hover:bg-orange-700 text-sm"
                          >
                            Cloudflare
                          </a>
                        </div>
                        <p className="text-sm text-green-700 mt-2">
                          After registering the domain, return here to configure it for the Internet Computer.
                        </p>
                      </div>
                    ) : null}

                    {result.domainAvailability.registered &&
                    result.domainAvailability.hasConfiguration &&
                    result.domainAvailability.existingConfiguration ? (
                      <div className="mt-2">
                        <p className="font-medium text-yellow-800">Existing Configuration:</p>
                        {result.domainAvailability.existingConfiguration.hasIcpConfiguration ? (
                          <p className="text-sm text-yellow-700">
                            This domain already has Internet Computer configuration. The recommendations below will help
                            you verify and complete the setup.
                          </p>
                        ) : (
                          <p className="text-sm text-yellow-700">
                            This domain has DNS records but is not configured for the Internet Computer yet. Follow the
                            recommendations below to set it up.
                          </p>
                        )}

                        {/* Afficher les enregistrements DNS existants */}
                        <div className="mt-2 p-2 bg-white rounded-md">
                          <p className="text-sm font-medium">Existing DNS Records:</p>
                          <div className="text-xs text-gray-700 mt-1">
                            {Object.entries(result.domainAvailability.existingConfiguration.records)
                              .filter(([_, value]) => (value as any).Answer?.length > 0)
                              .map(([type, value]) => (
                                <div key={type} className="mb-1">
                                  <span className="font-medium">{type} Records:</span>
                                  {(value as any).Answer.map((record: any, i: number) => (
                                    <span key={i} className="ml-1">
                                      {record.data}
                                      {i < (value as any).Answer.length - 1 ? ", " : ""}
                                    </span>
                                  ))}
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    ) : null}

                    {result.domainAvailability.whoisData ? (
                      <div className="mt-2">
                        <p className="font-medium text-yellow-800">Registration Details:</p>
                        <div className="grid grid-cols-1 gap-1 mt-1 text-sm text-yellow-700">
                          <div>Registrar: {result.domainAvailability.whoisData.registrar}</div>
                          <div>Created: {result.domainAvailability.whoisData.creationDate}</div>
                          <div>Expires: {result.domainAvailability.whoisData.expiryDate}</div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                )}

                {result.canisterInfo && (
                  <div
                    className={`p-3 rounded-md mb-3 ${result.canisterInfo.exists ? "bg-green-100 border border-green-300" : "bg-yellow-100 border border-yellow-300"}`}
                  >
                    <p className={`font-medium ${result.canisterInfo.exists ? "text-green-800" : "text-yellow-800"}`}>
                      {result.canisterInfo.exists
                        ? "Canister ID verified successfully!"
                        : "Warning: Canister ID may not exist or is not accessible"}
                    </p>
                    <p className="text-sm text-green-700 mt-1">
                      {result.canisterInfo.exists
                        ? "The canister ID exists on the Internet Computer network."
                        : "The canister ID provided could not be verified."}
                    </p>
                  </div>
                )}

                <p className="text-blue-800 font-medium mb-2">
                  {web3DomainType === "web2"
                    ? `DNS Configuration for ${result.domain}`
                    : `DNS Configuration for ${result.domain} with Canister ID: ${result.canisterId}`}
                </p>

                {/* Le reste du code existant pour l'affichage des configurations DNS */}
                <div className="mt-3">
                  <div className="flex border-b border-gray-200">
                    <button
                      onClick={() => setActiveDnsProvider("namecheap")}
                      className={`px-4 py-2 font-medium text-sm ${
                        activeDnsProvider === "namecheap"
                          ? "border-b-2 border-blue-500 text-blue-600"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Namecheap
                    </button>
                    <button
                      onClick={() => setActiveDnsProvider("cloudflare")}
                      className={`px-4 py-2 font-medium text-sm ${
                        activeDnsProvider === "cloudflare"
                          ? "border-b-2 border-blue-500 text-blue-600"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Cloudflare
                    </button>
                    <button
                      onClick={() => setActiveDnsProvider("godaddy")}
                      className={`px-4 py-2 font-medium text-sm ${
                        activeDnsProvider === "godaddy"
                          ? "border-b-2 border-blue-500 text-blue-600"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      GoDaddy
                    </button>
                  </div>

                  <div className="mt-4">
                    <h4 className="font-medium text-sm text-gray-700 mb-2">
                      {web3DomainType === "web2"
                        ? "Required DNS Records for Your Domain:"
                        : "Required DNS Records for Internet Computer:"}
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Type
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {activeDnsProvider === "namecheap"
                                ? "Host"
                                : activeDnsProvider === "cloudflare"
                                  ? "Name"
                                  : "Host"}
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {activeDnsProvider === "cloudflare" ? "Content" : "Value"}
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              TTL
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Notes
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {result.dnsConfig[activeDnsProvider].records
                            .filter((record) => !record.category)
                            .map((record, index) => (
                              <tr key={index}>
                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{record.type}</td>
                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                  {activeDnsProvider === "namecheap"
                                    ? record.host || record.name
                                    : activeDnsProvider === "cloudflare"
                                      ? record.name || record.host
                                      : record.name || record.host}
                                </td>
                                <td className="px-3 py-2 text-sm text-gray-900 break-all">
                                  {activeDnsProvider === "cloudflare"
                                    ? record.content || record.value
                                    : record.value || record.content}
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{record.ttl}</td>
                                <td className="px-3 py-2 text-sm text-gray-900">{record.notes}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Optional Email Server Records */}
                    <h4 className="font-medium text-sm text-gray-700 mt-6 mb-2">Optional Email Server Records:</h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Type
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {activeDnsProvider === "namecheap"
                                ? "Host"
                                : activeDnsProvider === "cloudflare"
                                  ? "Name"
                                  : "Host"}
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {activeDnsProvider === "cloudflare" ? "Content" : "Value"}
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Notes
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {result.dnsConfig[activeDnsProvider].records
                            .filter((record) => record.category === "email")
                            .map((record, index) => (
                              <tr key={`email-${index}`}>
                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{record.type}</td>
                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                  {activeDnsProvider === "namecheap"
                                    ? record.host || record.name
                                    : activeDnsProvider === "cloudflare"
                                      ? record.name || record.host
                                      : record.name || record.host}
                                </td>
                                <td className="px-3 py-2 text-sm text-gray-900 break-all">
                                  {activeDnsProvider === "cloudflare"
                                    ? record.content || record.value
                                    : record.value || record.content}
                                </td>
                                <td className="px-3 py-2 text-sm text-gray-900">{record.notes}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Email Security Records */}
                    <h4 className="font-medium text-sm text-gray-700 mt-6 mb-2">Email Security Records:</h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Type
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {activeDnsProvider === "namecheap"
                                ? "Host"
                                : activeDnsProvider === "cloudflare"
                                  ? "Name"
                                  : "Host"}
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {activeDnsProvider === "cloudflare" ? "Content" : "Value"}
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Notes
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {result.dnsConfig[activeDnsProvider].records
                            .filter((record) => record.category === "email-security")
                            .map((record, index) => (
                              <tr key={`security-${index}`}>
                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{record.type}</td>
                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                  {activeDnsProvider === "namecheap"
                                    ? record.host || record.name
                                    : activeDnsProvider === "cloudflare"
                                      ? record.name || record.host
                                      : record.name || record.host}
                                </td>
                                <td className="px-3 py-2 text-sm text-gray-900 break-all">
                                  {activeDnsProvider === "cloudflare"
                                    ? record.content || record.value
                                    : record.value || record.content}
                                </td>
                                <td className="px-3 py-2 text-sm text-gray-900">{record.notes}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Domain Verification Records */}
                    <h4 className="font-medium text-sm text-gray-700 mt-6 mb-2">Domain Verification Records:</h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Type
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {activeDnsProvider === "namecheap"
                                ? "Host"
                                : activeDnsProvider === "cloudflare"
                                  ? "Name"
                                  : "Host"}
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {activeDnsProvider === "cloudflare" ? "Content" : "Value"}
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Notes
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {result.dnsConfig[activeDnsProvider].records
                            .filter((record) => record.category === "verification")
                            .map((record, index) => (
                              <tr key={`verification-${index}`}>
                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{record.type}</td>
                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                  {activeDnsProvider === "namecheap"
                                    ? record.host || record.name
                                    : activeDnsProvider === "cloudflare"
                                      ? record.name || record.host
                                      : record.name || record.host}
                                </td>
                                <td className="px-3 py-2 text-sm text-gray-900 break-all">
                                  {activeDnsProvider === "cloudflare"
                                    ? record.content || record.value
                                    : record.value || record.content}
                                </td>
                                <td className="px-3 py-2 text-sm text-gray-900">{record.notes}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Additional Services Records */}
                    <h4 className="font-medium text-sm text-gray-700 mt-6 mb-2">Additional Services Records:</h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Type
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {activeDnsProvider === "namecheap"
                                ? "Host"
                                : activeDnsProvider === "cloudflare"
                                  ? "Name"
                                  : "Host"}
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {activeDnsProvider === "cloudflare" ? "Content" : "Value"}
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Notes
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {result.dnsConfig[activeDnsProvider].records
                            .filter((record) => record.category === "services")
                            .map((record, index) => (
                              <tr key={`service-${index}`}>
                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{record.type}</td>
                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                  {activeDnsProvider === "namecheap"
                                    ? record.host || record.name
                                    : activeDnsProvider === "cloudflare"
                                      ? record.name || record.host
                                      : record.name || record.host}
                                </td>
                                <td className="px-3 py-2 text-sm text-gray-900 break-all">
                                  {activeDnsProvider === "cloudflare"
                                    ? record.content || record.value
                                    : record.value || record.content}
                                </td>
                                <td className="px-3 py-2 text-sm text-gray-900">{record.notes}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>

                    {/* IPv6 Records */}
                    <h4 className="font-medium text-sm text-gray-700 mt-6 mb-2">IPv6 Records:</h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Type
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {activeDnsProvider === "namecheap"
                                ? "Host"
                                : activeDnsProvider === "cloudflare"
                                  ? "Name"
                                  : "Host"}
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {activeDnsProvider === "cloudflare" ? "Content" : "Value"}
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Notes
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {result.dnsConfig[activeDnsProvider].records
                            .filter((record) => record.category === "ipv6")
                            .map((record, index) => (
                              <tr key={`ipv6-${index}`}>
                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{record.type}</td>
                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                  {activeDnsProvider === "namecheap"
                                    ? record.host || record.name
                                    : activeDnsProvider === "cloudflare"
                                      ? record.name || record.host
                                      : record.name || record.host}
                                </td>
                                <td className="px-3 py-2 text-sm text-gray-900 break-all">
                                  {activeDnsProvider === "cloudflare"
                                    ? record.content || record.value
                                    : record.value || record.content}
                                </td>
                                <td className="px-3 py-2 text-sm text-gray-900">{record.notes}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Additional Services Information */}
                    {result.dnsConfig.additionalServices && (
                      <div className="mt-6">
                        <h4 className="font-medium text-sm text-gray-700 mb-3">Additional Services Information:</h4>

                        {/* Email Services */}
                        {result.dnsConfig.additionalServices.email && (
                          <div className="bg-blue-50 p-3 rounded-md mb-3">
                            <h5 className="font-medium text-blue-700">
                              {result.dnsConfig.additionalServices.email.description}
                            </h5>
                            <p className="text-sm text-gray-700 mt-1">Recommended providers:</p>
                            <ul className="list-disc pl-5 text-sm text-gray-700 mt-1">
                              {result.dnsConfig.additionalServices.email.providers.map((provider, index) => (
                                <li key={index}>
                                  <a
                                    href={provider.setupUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                  >
                                    {provider.name}
                                  </a>
                                  {provider.notes && <span className="text-gray-600"> - {provider.notes}</span>}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Web Analytics */}
                        {result.dnsConfig.additionalServices.webAnalytics && (
                          <div className="bg-green-50 p-3 rounded-md mb-3">
                            <h5 className="font-medium text-green-700">
                              {result.dnsConfig.additionalServices.webAnalytics.description}
                            </h5>
                            <p className="text-sm text-gray-700 mt-1">Recommended providers:</p>
                            <ul className="list-disc pl-5 text-sm text-gray-700 mt-1">
                              {result.dnsConfig.additionalServices.webAnalytics.providers.map((provider, index) => (
                                <li key={index}>
                                  <a
                                    href={provider.setupUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                  >
                                    {provider.name}
                                  </a>
                                  {provider.notes && <span className="text-gray-600"> - {provider.notes}</span>}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Security Recommendations */}
                        {result.dnsConfig.additionalServices.security && (
                          <div className="bg-yellow-50 p-3 rounded-md mb-3">
                            <h5 className="font-medium text-yellow-700">
                              {result.dnsConfig.additionalServices.security.description}
                            </h5>
                            <ul className="list-disc pl-5 text-sm text-gray-700 mt-1">
                              {result.dnsConfig.additionalServices.security.recommendations.map((rec, index) => (
                                <li key={index}>{rec}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    <h4 className="font-medium text-sm text-gray-700 mt-6 mb-2">Instructions:</h4>
                    <ol className="list-decimal pl-5 space-y-1 text-sm text-gray-700">
                      {result.dnsConfig[activeDnsProvider].instructions.map((instruction, index) => (
                        <li key={index}>{instruction}</li>
                      ))}
                    </ol>

                    <h4 className="font-medium text-sm text-gray-700 mt-4 mb-2">Verification:</h4>
                    <div className="bg-gray-100 p-2 rounded text-sm font-mono">
                      {result.dnsConfig.verification.command}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{result.dnsConfig.verification.notes}</p>

                    <h4 className="font-medium text-sm text-gray-700 mt-4 mb-2">Troubleshooting:</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                      {result.dnsConfig.troubleshooting.map((tip, index) => (
                        <li key={index}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Web3 Features Check Results */}
          {result && testType === "web3" && result.web3Checks && (
            <div className="mt-6">
              <h4 className="font-medium text-lg text-gray-800 mb-3">Web3 Features Analysis</h4>

              {result.web3Checks.summary && (
                <div
                  className={`p-4 rounded-md mb-4 ${result.web3Checks.summary.readyForWeb3 ? "bg-green-50" : "bg-yellow-50"}`}
                >
                  <p className="font-medium">
                    {result.web3Checks.summary.readyForWeb3
                      ? "Your canister appears ready for Web3 integration!"
                      : "Your canister may need additional configuration for optimal Web3 integration"}
                  </p>

                  {result.web3Checks.summary.recommendations &&
                    result.web3Checks.summary.recommendations.length > 0 && (
                      <div className="mt-2">
                        <p className="font-medium">Recommendations:</p>
                        <ul className="list-disc pl-5 text-sm">
                          {result.web3Checks.summary.recommendations.map((rec, i) => (
                            <li key={i}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Internet Identity */}
                {result.web3Checks.internetIdentity && (
                  <div className="border rounded-md p-4">
                    <h5 className="font-medium text-gray-800 mb-2">Internet Identity</h5>
                    <p className={result.web3Checks.internetIdentity.configured ? "text-green-600" : "text-yellow-600"}>
                      {result.web3Checks.internetIdentity.notes}
                    </p>

                    {result.web3Checks.internetIdentity.recommendations && (
                      <div className="mt-2">
                        <p className="text-sm font-medium">Recommendations:</p>
                        <ul className="list-disc pl-5 text-xs text-gray-600">
                          {result.web3Checks.internetIdentity.recommendations.map((rec, i) => (
                            <li key={i}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {result.web3Checks.internetIdentity.resources && (
                      <div className="mt-2">
                        <p className="text-sm font-medium">Resources:</p>
                        <ul className="list-disc pl-5 text-xs">
                          {result.web3Checks.internetIdentity.resources.map((res, i) => (
                            <li key={i}>
                              <a
                                href={res.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                {res.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Wallet Compatibility */}
                {result.web3Checks.wallets && (
                  <div className="border rounded-md p-4">
                    <h5 className="font-medium text-gray-800 mb-2">Wallet Compatibility</h5>

                    {result.web3Checks.wallets.wallets && (
                      <div className="mt-2">
                        <p className="text-sm font-medium">Supported Wallets:</p>
                        <ul className="list-disc pl-5 text-xs text-gray-600">
                          {result.web3Checks.wallets.wallets.map((wallet, i) => (
                            <li key={i}>
                              <a
                                href={wallet.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                {wallet.name}
                              </a>
                              {wallet.notes && <span className="text-gray-500"> - {wallet.notes}</span>}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {result.web3Checks.wallets.recommendations && (
                      <div className="mt-2">
                        <p className="text-sm font-medium">Recommendations:</p>
                        <ul className="list-disc pl-5 text-xs text-gray-600">
                          {result.web3Checks.wallets.recommendations.map((rec, i) => (
                            <li key={i}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {result.web3Checks.wallets.resources && (
                      <div className="mt-2">
                        <p className="text-sm font-medium">Resources:</p>
                        <ul className="list-disc pl-5 text-xs">
                          {result.web3Checks.wallets.resources.map((res, i) => (
                            <li key={i}>
                              <a
                                href={res.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                {res.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Token Support */}
                {result.web3Checks.tokens && (
                  <div className="border rounded-md p-4">
                    <h5 className="font-medium text-gray-800 mb-2">Token Support</h5>
                    <p className={result.web3Checks.tokens.detected ? "text-green-600" : "text-yellow-600"}>
                      {result.web3Checks.tokens.notes}
                    </p>

                    {result.web3Checks.tokens.recommendations && (
                      <div className="mt-2">
                        <p className="text-sm font-medium">Recommendations:</p>
                        <ul className="list-disc pl-5 text-xs text-gray-600">
                          {result.web3Checks.tokens.recommendations.map((rec, i) => (
                            <li key={i}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {result.web3Checks.tokens.resources && (
                      <div className="mt-2">
                        <p className="text-sm font-medium">Resources:</p>
                        <ul className="list-disc pl-5 text-xs">
                          {result.web3Checks.tokens.resources.map((res, i) => (
                            <li key={i}>
                              <a
                                href={res.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                {res.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* NFT Support */}
                {result.web3Checks.nfts && (
                  <div className="border rounded-md p-4">
                    <h5 className="font-medium text-gray-800 mb-2">NFT Support</h5>
                    <p className={result.web3Checks.nfts.detected ? "text-green-600" : "text-yellow-600"}>
                      {result.web3Checks.nfts.notes}
                    </p>

                    {result.web3Checks.nfts.recommendations && (
                      <div className="mt-2">
                        <p className="text-sm font-medium">Recommendations:</p>
                        <ul className="list-disc pl-5 text-xs text-gray-600">
                          {result.web3Checks.nfts.recommendations.map((rec, i) => (
                            <li key={i}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {result.web3Checks.nfts.resources && (
                      <div className="mt-2">
                        <p className="text-sm font-medium">Resources:</p>
                        <ul className="list-disc pl-5 text-xs">
                          {result.web3Checks.nfts.resources.map((res, i) => (
                            <li key={i}>
                              <a
                                href={res.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                {res.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Cross-chain Integration */}
                {result.web3Checks.crosschain && (
                  <div className="border rounded-md p-4">
                    <h5 className="font-medium text-gray-800 mb-2">Cross-chain Integration</h5>

                    {result.web3Checks.crosschain.integrations && (
                      <div className="mt-2">
                        <p className="text-sm font-medium">Available Integrations:</p>
                        <ul className="list-disc pl-5 text-xs text-gray-600">
                          {result.web3Checks.crosschain.integrations.map((integration, i) => (
                            <li key={i}>
                              <span className="font-medium">{integration.chain}</span>: {integration.notes}
                              {integration.url && (
                                <a
                                  href={integration.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline ml-1"
                                >
                                  Learn more
                                </a>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {result.web3Checks.crosschain.recommendations && (
                      <div className="mt-2">
                        <p className="text-sm font-medium">Recommendations:</p>
                        <ul className="list-disc pl-5 text-xs text-gray-600">
                          {result.web3Checks.crosschain.recommendations.map((rec, i) => (
                            <li key={i}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Security Best Practices */}
                {result.web3Checks.security && (
                  <div className="border rounded-md p-4">
                    <h5 className="font-medium text-gray-800 mb-2">Security Best Practices</h5>

                    {result.web3Checks.security.recommendations && (
                      <div className="mt-2">
                        <p className="text-sm font-medium">Recommendations:</p>
                        <ul className="list-disc pl-5 text-xs text-gray-600">
                          {result.web3Checks.security.recommendations.map((rec, i) => (
                            <li key={i}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {result && testType === "web3" && web3DomainType === "icp" && result.configFiles && (
            <div className="mt-6">
              <h4 className="font-medium text-lg text-gray-800 mb-3">ICP Configuration Files</h4>
              <p className="text-sm text-gray-600 mb-4">
                These files are needed to configure your domain with Internet Computer. Download them and add them to
                your project.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(result.configFiles).map(([key, file]: [string, any]) => (
                  <div key={key} className="border rounded-md p-4">
                    <h5 className="font-medium text-gray-800 mb-2">{file.path}</h5>
                    <p className="text-xs text-gray-500 mb-2">
                      {key === "icDomains" && "Contains your domain name for ICP configuration"}
                      {key === "icAssets" && "Configuration to include .well-known directory in your build"}
                      {key === "registerScript" && "Script to register your domain with boundary nodes"}
                      {key === "checkStatusScript" && "Script to check registration status"}
                      {key === "instructions" && "Instructions for setting up your domain with ICP"}
                    </p>
                    <div className="bg-gray-100 p-2 rounded-md mb-2 overflow-auto max-h-40">
                      <pre className="text-xs">{file.content}</pre>
                    </div>
                    <button
                      onClick={() => {
                        const blob = new Blob([file.content], { type: "text/plain" })
                        const url = URL.createObjectURL(blob)
                        const a = document.createElement("a")
                        a.href = url
                        a.download = file.path.split("/").pop()
                        document.body.appendChild(a)
                        a.click()
                        document.body.removeChild(a)
                        URL.revokeObjectURL(url)
                      }}
                      className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
                    >
                      Download File
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Affichage des informations d'achat de domaine */}
          {result && testType === "web3" && result.domainAvailability && result.domainAvailability.purchaseInfo && (
            <div className="mt-6">
              <h4 className="font-medium text-lg text-gray-800 mb-3">Domain Purchase Information</h4>

              {result.domainAvailability.purchaseInfo.available ? (
                <div className="bg-green-100 p-4 rounded-md mb-4">
                  <p className="text-green-800 font-medium">{result.domain} is available for registration!</p>

                  {result.domainAvailability.purchaseInfo.pricing && (
                    <div className="mt-2">
                      <p className="font-medium">Estimated Prices:</p>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <div>Namecheap: ${result.domainAvailability.purchaseInfo.pricing.registration.namecheap}</div>
                        <div>GoDaddy: ${result.domainAvailability.purchaseInfo.pricing.registration.godaddy}</div>
                        <div>Porkbun: ${result.domainAvailability.purchaseInfo.pricing.registration.porkbun}</div>
                        <div>Dynadot: ${result.domainAvailability.purchaseInfo.pricing.registration.dynadot}</div>
                      </div>
                    </div>
                  )}

                  <div className="mt-3">
                    <p className="font-medium">Register at:</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <a
                        href={result.domainAvailability.purchaseInfo.purchaseLinks.namecheap}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
                      >
                        Namecheap
                      </a>
                      <a
                        href={result.domainAvailability.purchaseInfo.purchaseLinks.godaddy}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                      >
                        GoDaddy
                      </a>
                      <a
                        href={result.domainAvailability.purchaseInfo.purchaseLinks.porkbun}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-pink-600 text-white rounded hover:bg-pink-700 text-sm"
                      >
                        Porkbun
                      </a>
                      <a
                        href={result.domainAvailability.purchaseInfo.purchaseLinks.cloudflare}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-orange-600 text-white rounded hover:bg-orange-700 text-sm"
                      >
                        Cloudflare
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-100 p-4 rounded-md mb-4">
                  <p className="text-yellow-800 font-medium">{result.domain} is not available for registration.</p>
                  <p className="text-sm text-yellow-700 mt-1">
                    You'll need to use the existing domain configuration or choose a different domain.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Affichage de la configuration d'alias email Odoo */}
          {result && testType === "web3" && result.odooEmailConfig && (
            <div className="mt-6">
              <h4 className="font-medium text-lg text-gray-800 mb-3">{result.odooEmailConfig.aliasSetup.title}</h4>
              <p className="text-sm text-gray-600 mb-4">{result.odooEmailConfig.aliasSetup.description}</p>

              <div className="space-y-4">
                {result.odooEmailConfig.aliasSetup.steps.map((step, index) => (
                  <div key={index} className="bg-blue-50 p-4 rounded-md">
                    <h5 className="font-medium text-blue-800 mb-2">{step.title}</h5>
                    <ol className="list-decimal pl-5 space-y-1 text-sm text-gray-700">
                      {step.instructions.map((instruction, i) => (
                        <li key={i}>{instruction}</li>
                      ))}
                    </ol>
                  </div>
                ))}

                <div className="bg-green-50 p-4 rounded-md">
                  <h5 className="font-medium text-green-800 mb-2">
                    {result.odooEmailConfig.aliasSetup.examples[0].title}
                  </h5>
                  <p className="text-sm text-gray-700 mb-2">
                    {result.odooEmailConfig.aliasSetup.examples[0].description}
                  </p>
                  <div className="bg-white p-3 rounded-md">
                    <p className="text-sm font-medium">Configuration:</p>
                    <ul className="list-disc pl-5 text-sm text-gray-700">
                      <li>Alias: {result.odooEmailConfig.aliasSetup.examples[0].configuration.alias}</li>
                      <li>Model: {result.odooEmailConfig.aliasSetup.examples[0].configuration.model}</li>
                      <li>
                        Default Values:
                        <ul className="list-disc pl-5 text-xs text-gray-600">
                          {Object.entries(
                            result.odooEmailConfig.aliasSetup.examples[0].configuration.defaultValues,
                          ).map(([key, value]) => (
                            <li key={key}>
                              {key}: {value}
                            </li>
                          ))}
                        </ul>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-md">
                  <h5 className="font-medium text-green-800 mb-2">
                    {result.odooEmailConfig.aliasSetup.examples[1].title}
                  </h5>
                  <p className="text-sm text-gray-700 mb-2">
                    {result.odooEmailConfig.aliasSetup.examples[1].description}
                  </p>
                  <div className="bg-white p-3 rounded-md">
                    <p className="text-sm font-medium">Configuration:</p>
                    <ul className="list-disc pl-5 text-sm text-gray-700">
                      <li>Alias: {result.odooEmailConfig.aliasSetup.examples[1].configuration.alias}</li>
                      <li>Model: {result.odooEmailConfig.aliasSetup.examples[1].configuration.model}</li>
                      <li>
                        Default Values:
                        <ul className="list-disc pl-5 text-xs text-gray-600">
                          {Object.entries(
                            result.odooEmailConfig.aliasSetup.examples[1].configuration.defaultValues,
                          ).map(([key, value]) => (
                            <li key={key}>
                              {key}: {value}
                            </li>
                          ))}
                        </ul>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-md">
                  <h5 className="font-medium text-yellow-800 mb-2">
                    {result.odooEmailConfig.aliasSetup.catchAllAlias.title}
                  </h5>
                  <p className="text-sm text-gray-700 mb-2">
                    {result.odooEmailConfig.aliasSetup.catchAllAlias.description}
                  </p>
                  <ol className="list-decimal pl-5 space-y-1 text-sm text-gray-700">
                    {result.odooEmailConfig.aliasSetup.catchAllAlias.instructions.map((instruction, i) => (
                      <li key={i}>{instruction}</li>
                    ))}
                  </ol>
                </div>
              </div>

              <h4 className="font-medium text-lg text-gray-800 mt-6 mb-3">
                {result.odooEmailConfig.serverSetup.title}
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-md">
                  <h5 className="font-medium text-blue-800 mb-2">{result.odooEmailConfig.serverSetup.inbound.title}</h5>
                  <p className="text-sm text-gray-700 mb-2">{result.odooEmailConfig.serverSetup.inbound.description}</p>
                  <ol className="list-decimal pl-5 space-y-1 text-sm text-gray-700 mb-3">
                    {result.odooEmailConfig.serverSetup.inbound.instructions.map((instruction, i) => (
                      <li key={i}>{instruction}</li>
                    ))}
                  </ol>
                  <div className="bg-white p-3 rounded-md">
                    <p className="text-sm font-medium">Options:</p>
                    <ul className="list-disc pl-5 text-sm text-gray-700">
                      {result.odooEmailConfig.serverSetup.inbound.options.map((option, i) => (
                        <li key={i}>
                          <span className="font-medium">{option.name}:</span> {option.description}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-md">
                  <h5 className="font-medium text-blue-800 mb-2">
                    {result.odooEmailConfig.serverSetup.outbound.title}
                  </h5>
                  <p className="text-sm text-gray-700 mb-2">
                    {result.odooEmailConfig.serverSetup.outbound.description}
                  </p>
                  <ol className="list-decimal pl-5 space-y-1 text-sm text-gray-700">
                    {result.odooEmailConfig.serverSetup.outbound.instructions.map((instruction, i) => (
                      <li key={i}>{instruction}</li>
                    ))}
                  </ol>
                </div>
              </div>

              <div className="mt-4">
                <h5 className="font-medium text-gray-800 mb-2">Resources</h5>
                <ul className="list-disc pl-5 text-sm text-blue-600">
                  {result.odooEmailConfig.resources.map((resource, i) => (
                    <li key={i}>
                      <a href={resource.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {resource.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">API Response:</h3>
            <div className="bg-gray-100 p-4 rounded-md overflow-auto max-h-96">
              <pre className="text-sm whitespace-pre-wrap break-words">
                {result ? JSON.stringify(result, null, 2) : "No results yet"}
              </pre>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">API Documentation</h2>

            <div className="space-y-4">
              <div className="bg-gray-100 p-4 rounded-md">
                <h3 className="font-medium mb-2">Domain Availability Check Endpoint:</h3>
                <code className="bg-gray-200 px-2 py-1 rounded">/api/domain-availability</code>

                <h3 className="font-medium mt-4 mb-2">Method:</h3>
                <code className="bg-gray-200 px-2 py-1 rounded">POST</code>

                <h3 className="font-medium mt-4 mb-2">Request Body:</h3>
                <pre className="bg-gray-200 p-2 rounded overflow-x-auto">
                  {`{
"domain": "example.com"
}`}
                </pre>

                <p className="mt-2">
                  This endpoint checks domain availability and provides pricing information and purchase links.
                </p>
              </div>

              <div className="bg-gray-100 p-4 rounded-md">
                <h3 className="font-medium mb-2">Web3 Connect Endpoints:</h3>

                <h4 className="font-medium mt-3 mb-1">ICP Check:</h4>
                <code className="bg-gray-200 px-2 py-1 rounded">/api/icp-check</code>

                <h3 className="font-medium mt-4 mb-2">Method:</h3>
                <code className="bg-gray-200 px-2 py-1 rounded">POST</code>

                <h3 className="font-medium mt-4 mb-2">Request Body:</h3>
                <pre className="bg-gray-200 p-2 rounded overflow-x-auto">
                  {`{
"domain": "example.ic",
"canisterId": "aaaaa-bbbbb-ccccc-ddddd-eee" // Required
}`}
                </pre>

                <h4 className="font-medium mt-3 mb-1">Unstoppable Domains Check:</h4>
                <code className="bg-gray-200 px-2 py-1 rounded">/api/unstoppable-check</code>

                <h3 className="font-medium mt-4 mb-2">Method:</h3>
                <code className="bg-gray-200 px-2 py-1 rounded">POST</code>

                <h3 className="font-medium mt-4 mb-2">Request Body:</h3>
                <pre className="bg-gray-200 p-2 rounded overflow-x-auto">
                  {`{
"domain": "example.crypto"
}`}
                </pre>
              </div>

              <div className="bg-gray-100 p-4 rounded-md">
                <h3 className="font-medium mb-2">Email Security Analysis Endpoint:</h3>
                <code className="bg-gray-200 px-2 py-1 rounded">/api/email-security</code>

                <h3 className="font-medium mt-4 mb-2">Method:</h3>
                <code className="bg-gray-200 px-2 py-1 rounded">POST</code>

                <h3 className="font-medium mt-4 mb-2">Request Body:</h3>
                <pre className="bg-gray-200 p-2 rounded overflow-x-auto">
                  {`{
"domain": "example.com"
}`}
                </pre>
              </div>

              <div className="bg-gray-100 p-4 rounded-md">
                <h3 className="font-medium mb-2">DNS Lookup Endpoint:</h3>
                <code className="bg-gray-200 px-2 py-1 rounded">/api/dns-lookup</code>

                <h3 className="font-medium mt-4 mb-2">Method:</h3>
                <code className="bg-gray-200 px-2 py-1 rounded">POST</code>

                <h3 className="font-medium mt-4 mb-2">Request Body:</h3>
                <pre className="bg-gray-200 p-2 rounded overflow-x-auto">
                  {`{
"domain": "example.com",
"lookupType": "mx" // Options: "a", "aaaa", "mx", "ns", "txt", "soa", "spf", "dmarc", "dkim"
}`}
                </pre>
              </div>
              <div className="bg-gray-100 p-4 rounded-md">
                <h3 className="font-medium mb-2">Web2 Domain Configuration Endpoint:</h3>
                <code className="bg-gray-200 px-2 py-1 rounded">/api/domain-configuration</code>

                <h3 className="font-medium mt-4 mb-2">Method:</h3>
                <code className="bg-gray-200 px-2 py-1 rounded">POST</code>

                <h3 className="font-medium mt-4 mb-2">Request Body:</h3>
                <pre className="bg-gray-200 p-2 rounded overflow-x-auto">
                  {`{
  "domain": "example.com",
  "serviceType": "website", // Options: "website", "email", "both"
  "hostingProvider": "aws", // Options: "aws", "ovh", "digitalocean", "heroku", "netlify", "vercel", "odoo", "cpanel", "other"
  "emailProvider": "googleWorkspace", // Options: "googleWorkspace", "microsoft365", "zoho", "other"
  "serverIp": "192.168.1.1", // Optional, required for some hosting providers
  "subdomains": ["blog", "shop"] // Optional, array of desired subdomains
}`}
                </pre>

                <p className="mt-2">
                  This endpoint provides DNS configuration instructions for standard Web2 domains based on your selected
                  hosting and email providers. It returns detailed DNS records and setup instructions customized for
                  your specific configuration.
                </p>
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-600 mt-8">
            <p>
              Note: This API uses public DNS APIs and domain registrar information. Pricing is estimated and may vary.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}


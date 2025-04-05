"use client"

import { ExternalLink } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface Web3Service {
  name: string
  description: string
  url?: string
  providers?: Array<{
    name: string
    setupUrl: string
    notes: string
  }>
  standards?: Array<{
    name: string
    url: string
    notes: string
  }>
  features?: Array<{
    name: string
    description: string
    url: string
  }>
}

interface Web3ServicesListProps {
  web3Services: {
    wallets?: Web3Service
    identity?: Web3Service
    tokens?: Web3Service
    nfts?: Web3Service
  }
}

export default function Web3ServicesList({ web3Services }: Web3ServicesListProps) {
  const { t } = useLanguage()

  if (!web3Services) {
    return <div className="text-center p-4 text-muted-foreground">{t("web3.services.noInfo")}</div>
  }

  return (
    <div className="space-y-4">
      {web3Services.wallets && (
        <div className="space-y-2">
          <h5 className="font-medium">{t("web3.services.wallets.title")}</h5>
          <p className="text-sm text-muted-foreground">{web3Services.wallets.description}</p>

          {web3Services.wallets.providers && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1">
              {web3Services.wallets.providers.map((provider, index) => (
                <a
                  key={index}
                  href={provider.setupUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 rounded-md bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <span>{provider.name}</span>
                  <span className="text-xs text-muted-foreground">{provider.notes}</span>
                  <ExternalLink className="h-4 w-4 ml-auto" />
                </a>
              ))}
            </div>
          )}
        </div>
      )}

      {web3Services.identity && (
        <div className="space-y-2">
          <h5 className="font-medium">{t("web3.services.identity.title")}</h5>
          <p className="text-sm text-muted-foreground">{web3Services.identity.description}</p>

          {web3Services.identity.providers && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1">
              {web3Services.identity.providers.map((provider, index) => (
                <a
                  key={index}
                  href={provider.setupUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 rounded-md bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <span>{provider.name}</span>
                  <span className="text-xs text-muted-foreground">{provider.notes}</span>
                  <ExternalLink className="h-4 w-4 ml-auto" />
                </a>
              ))}
            </div>
          )}
        </div>
      )}

      {web3Services.tokens && (
        <div className="space-y-2">
          <h5 className="font-medium">{t("web3.services.tokens.title")}</h5>
          <p className="text-sm text-muted-foreground">{web3Services.tokens.description}</p>

          {web3Services.tokens.standards && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1">
              {web3Services.tokens.standards.map((standard, index) => (
                <a
                  key={index}
                  href={standard.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 rounded-md bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <span>{standard.name}</span>
                  <span className="text-xs text-muted-foreground">{standard.notes}</span>
                  <ExternalLink className="h-4 w-4 ml-auto" />
                </a>
              ))}
            </div>
          )}
        </div>
      )}

      {web3Services.nfts && (
        <div className="space-y-2">
          <h5 className="font-medium">{t("web3.services.nfts.title")}</h5>
          <p className="text-sm text-muted-foreground">{web3Services.nfts.description}</p>

          {web3Services.nfts.standards && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1">
              {web3Services.nfts.standards.map((standard, index) => (
                <a
                  key={index}
                  href={standard.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 rounded-md bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <span>{standard.name}</span>
                  <span className="text-xs text-muted-foreground">{standard.notes}</span>
                  <ExternalLink className="h-4 w-4 ml-auto" />
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}


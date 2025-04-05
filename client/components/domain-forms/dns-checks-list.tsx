"use client"

import { Badge } from "@/components/ui/badge"
import { CheckIcon, XIcon, AlertCircle } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface DnsCheck {
  required: boolean
  record?: {
    type: string
    host?: string
    expected: string
  }
  status: string
  actual: string | null
  valid: boolean
  notes: string
}

interface DnsChecks {
  apex: DnsCheck
  www: DnsCheck
  canisterId: DnsCheck
  acmeChallenge: DnsCheck
  boundaryNodes: {
    required: boolean
    status: string
    notes: string
  }
  summary: {
    valid: boolean
    missingRequired: string[]
    readyForIc: boolean
  }
}

interface DnsChecksListProps {
  dnsChecks: DnsChecks
}

export default function DnsChecksList({ dnsChecks }: DnsChecksListProps) {
  const { t } = useLanguage()

  const getStatusIcon = (status: string, valid: boolean) => {
    if (status === "missing") {
      return <XIcon className="h-4 w-4 text-red-500" />
    } else if (status === "valid" || valid) {
      return <CheckIcon className="h-4 w-4 text-green-500" />
    } else if (status === "info") {
      return <AlertCircle className="h-4 w-4 text-blue-400" />
    } else {
      return <XIcon className="h-4 w-4 text-yellow-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "valid":
        return <Badge className="bg-green-500/20 text-green-500">{t("dns.status.valid")}</Badge>
      case "missing":
        return <Badge className="bg-red-500/20 text-red-500">{t("dns.status.missing")}</Badge>
      case "info":
        return <Badge className="bg-blue-500/20 text-blue-400">{t("dns.status.info")}</Badge>
      default:
        return <Badge className="bg-yellow-500/20 text-yellow-500">{status}</Badge>
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span>{t("dns.checks.validConfig")}:</span>
        <Badge className={dnsChecks.summary.valid ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"}>
          {dnsChecks.summary.valid ? t("common.yes") : t("common.no")}
        </Badge>
      </div>

      <div className="flex items-center justify-between">
        <span>{t("dns.checks.readyForIc")}:</span>
        <Badge
          className={
            dnsChecks.summary.readyForIc ? "bg-green-500/20 text-green-500" : "bg-yellow-500/20 text-yellow-500"
          }
        >
          {dnsChecks.summary.readyForIc ? t("common.yes") : t("common.no")}
        </Badge>
      </div>

      {dnsChecks.summary.missingRequired && dnsChecks.summary.missingRequired.length > 0 && (
        <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20">
          <h5 className="text-sm font-medium text-red-400 mb-1">{t("dns.checks.missingRequired")}:</h5>
          <ul className="list-disc pl-5 space-y-1 text-xs text-red-300">
            {dnsChecks.summary.missingRequired.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-start gap-3 p-3 rounded-md bg-white/5">
          {getStatusIcon(dnsChecks.apex.status, dnsChecks.apex.valid)}
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="font-medium">{t("dns.checks.apexDomain")}</p>
              {getStatusBadge(dnsChecks.apex.status)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {dnsChecks.apex.record?.type} {dnsChecks.apex.record?.expected}
            </p>
            <p className="text-xs text-muted-foreground">{dnsChecks.apex.notes}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 rounded-md bg-white/5">
          {getStatusIcon(dnsChecks.www.status, dnsChecks.www.valid)}
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="font-medium">{t("dns.checks.wwwSubdomain")}</p>
              {getStatusBadge(dnsChecks.www.status)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {dnsChecks.www.record?.type} {dnsChecks.www.record?.expected}
            </p>
            <p className="text-xs text-muted-foreground">{dnsChecks.www.notes}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 rounded-md bg-white/5">
          {getStatusIcon(dnsChecks.canisterId.status, dnsChecks.canisterId.valid)}
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="font-medium">{t("dns.checks.canisterIdRecord")}</p>
              {getStatusBadge(dnsChecks.canisterId.status)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {dnsChecks.canisterId.record?.type} {dnsChecks.canisterId.record?.host}{" "}
              {dnsChecks.canisterId.record?.expected}
            </p>
            <p className="text-xs text-muted-foreground">{dnsChecks.canisterId.notes}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 rounded-md bg-white/5">
          {getStatusIcon(dnsChecks.acmeChallenge.status, dnsChecks.acmeChallenge.valid)}
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="font-medium">{t("dns.checks.acmeChallengeRecord")}</p>
              {getStatusBadge(dnsChecks.acmeChallenge.status)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {dnsChecks.acmeChallenge.record?.type} {dnsChecks.acmeChallenge.record?.host}{" "}
              {dnsChecks.acmeChallenge.record?.expected}
            </p>
            <p className="text-xs text-muted-foreground">{dnsChecks.acmeChallenge.notes}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 rounded-md bg-white/5">
          {getStatusIcon(dnsChecks.boundaryNodes.status, true)}
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="font-medium">{t("dns.checks.boundaryNodes")}</p>
              {getStatusBadge(dnsChecks.boundaryNodes.status)}
            </div>
            <p className="text-xs text-muted-foreground">{dnsChecks.boundaryNodes.notes}</p>
          </div>
        </div>
      </div>
    </div>
  )
}


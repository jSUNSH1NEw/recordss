"use client"

import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/contexts/language-context"

interface DnsRecord {
  type: string
  host?: string
  name?: string
  value?: string
  content?: string
  ttl: string
  notes: string
  required?: boolean
  category?: string
  proxied?: boolean
}

interface DnsRecordsTableProps {
  records: DnsRecord[]
  registrar: string
  onCopy: (text: string) => void
}

export default function DnsRecordsTable({ records, registrar, onCopy }: DnsRecordsTableProps) {
  const { t } = useLanguage()

  if (!records || records.length === 0) {
    return <div className="text-center p-4 text-muted-foreground">{t("dns.records.noRecords")}</div>
  }

  // Déterminer les noms de colonnes en fonction du registrar
  const getHostColumnName = () => {
    switch (registrar) {
      case "namecheap":
        return t("dns.records.columns.host")
      case "cloudflare":
      case "godaddy":
      default:
        return t("dns.records.columns.name")
    }
  }

  const getValueColumnName = () => {
    switch (registrar) {
      case "cloudflare":
        return t("dns.records.columns.content")
      case "namecheap":
      case "godaddy":
      default:
        return t("dns.records.columns.value")
    }
  }

  // Obtenir la valeur de l'hôte/nom en fonction du registrar
  const getHostValue = (record: DnsRecord) => {
    return record.host || record.name || ""
  }

  // Obtenir la valeur du contenu en fonction du registrar
  const getContentValue = (record: DnsRecord) => {
    return record.value || record.content || ""
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[500px]">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left py-2 px-4">{t("dns.records.columns.type")}</th>
            <th className="text-left py-2 px-4">{getHostColumnName()}</th>
            <th className="text-left py-2 px-4">{getValueColumnName()}</th>
            <th className="text-left py-2 px-4">{t("dns.records.columns.ttl")}</th>
            <th className="text-left py-2 px-4">{t("dns.records.columns.notes")}</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record, index) => (
            <tr key={index} className="border-b border-white/5">
              <td className="py-2 px-4">{record.type}</td>
              <td className="py-2 px-4 font-mono text-xs">{getHostValue(record)}</td>
              <td className="py-2 px-4 font-mono text-xs">
                <div className="flex items-center gap-2">
                  <span className="truncate max-w-[200px]">{getContentValue(record)}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => onCopy(getContentValue(record))}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </td>
              <td className="py-2 px-4">{record.ttl}</td>
              <td className="py-2 px-4 text-xs text-muted-foreground">
                <div className="flex flex-col gap-1">
                  <span>{record.notes}</span>
                  {record.required !== undefined && (
                    <Badge
                      className={record.required ? "bg-blue-500/20 text-blue-400" : "bg-gray-500/20 text-gray-400"}
                    >
                      {record.required ? t("dns.records.required") : t("dns.records.optional")}
                    </Badge>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}


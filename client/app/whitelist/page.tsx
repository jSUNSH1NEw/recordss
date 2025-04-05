"use client"

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useState, type FormEvent } from "react"
import { RefreshCw } from "lucide-react"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

export default function WhitelistPage() {
  const { t } = useLanguage()

  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: "default" | "destructive" | "success"
    title: string
    message: string
  } | null>(null)

  const handleSubmitEmail = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      // Simuler un délai d'envoi
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Envoyer l'email via mailto
      const subject = encodeURIComponent("Inscription à la whitelist RECORDSS.AI")
      const body = encodeURIComponent(
        `Bonjour,\n\nJe souhaite m'inscrire à la whitelist de RECORDSS.AI avec l'adresse email: ${email}\n\nMerci.`,
      )
      window.location.href = `mailto:weertz.joffrey@protonmail.ch?subject=${subject}&body=${body}`

      // Afficher un message de succès
      setSubmitStatus({
        type: "success",
        title: "Demande envoyée",
        message:
          "Merci pour votre inscription ! Votre client email va s'ouvrir. Veuillez envoyer l'email pour finaliser votre inscription.",
      })

      // Réinitialiser le formulaire
      setEmail("")
    } catch (error) {
      console.error("Error:", error)
      setSubmitStatus({
        type: "destructive",
        title: "Erreur",
        message: "Une erreur s'est produite. Veuillez réessayer.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-16">
        <section className="section">
          <div className="container-custom max-w-4xl section-content">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-reveal">
                <span className="gradient-text">{t("whitelist.title")}</span>
              </h1>
            </div>

            {/* Formulaire d'inscription à la whitelist */}
            <div className="multi-color-border rounded-xl overflow-hidden mb-12">
              <div className="bg-black p-8 rounded-xl">
                <div className="flex flex-col items-center gap-6">
                  <p className="text-lg text-muted-foreground text-center max-w-2xl">{t("whitelist.join.desc")}</p>
                  <div className="w-full max-w-md mt-4">
                    <form className="space-y-4" onSubmit={handleSubmitEmail}>
                      <div className="space-y-2">
                        <Label htmlFor="email">{t("whitelist.join.email")}</Label>
                        <div className="flex gap-2">
                          <Input
                            id="email"
                            type="email"
                            placeholder={t("whitelist.join.email.placeholder")}
                            className="glass-effect flex-1"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isSubmitting}
                          />
                          <Button type="submit" className="gradient-bg button-hover" disabled={isSubmitting}>
                            {isSubmitting ? <RefreshCw className="h-4 w-4 animate-spin" /> : t("whitelist.join.cta")}
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">{t("whitelist.join.privacy")}</p>
                      </div>
                      {submitStatus && (
                        <Alert variant={submitStatus.type}>
                          <AlertTitle>{submitStatus.title}</AlertTitle>
                          <AlertDescription>{submitStatus.message}</AlertDescription>
                        </Alert>
                      )}
                    </form>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-fancy animate-card mb-8">
              <CardHeader>
                <CardTitle className="text-reveal gradient-text">{t("whitelist.web3.title")}</CardTitle>
                <CardDescription className="text-reveal">{t("whitelist.web3.desc")}</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("whitelist.platform")}</TableHead>
                      <TableHead>{t("whitelist.compatibility")}</TableHead>
                      <TableHead>{t("whitelist.notes")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="table-row-animate">
                      <TableCell>ICP Dfinity Name Service</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-500 text-xs font-medium">
                          {t("whitelist.compatibility.full")}
                        </span>
                      </TableCell>
                      <TableCell>Support prioritaire</TableCell>
                    </TableRow>
                    <TableRow className="table-row-animate">
                      <TableCell>Ethereum Name Service (ENS)</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-500 text-xs font-medium">
                          {t("whitelist.compatibility.full")}
                        </span>
                      </TableCell>
                      <TableCell>Support complet</TableCell>
                    </TableRow>
                    <TableRow className="table-row-animate">
                      <TableCell>Unstoppable Domains</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-500 text-xs font-medium">
                          {t("whitelist.compatibility.full")}
                        </span>
                      </TableCell>
                      <TableCell>Support complet</TableCell>
                    </TableRow>
                    <TableRow className="table-row-animate">
                      <TableCell>Handshake</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-500 text-xs font-medium">
                          {t("whitelist.compatibility.partial")}
                        </span>
                      </TableCell>
                      <TableCell>Support en développement</TableCell>
                    </TableRow>
                    <TableRow className="table-row-animate">
                      <TableCell>Solana Name Service</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-500 text-xs font-medium">
                          {t("whitelist.compatibility.partial")}
                        </span>
                      </TableCell>
                      <TableCell>Support en développement</TableCell>
                    </TableRow>
                    <TableRow className="table-row-animate">
                      <TableCell>Polkadot Name System</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 rounded-full bg-red-500/20 text-red-500 text-xs font-medium">
                          {t("whitelist.compatibility.planned")}
                        </span>
                      </TableCell>
                      <TableCell>Support prévu Q3 2025</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </div>

            <div className="card-fancy animate-card mb-8">
              <CardHeader>
                <CardTitle className="text-reveal gradient-text">{t("whitelist.web2.title")}</CardTitle>
                <CardDescription className="text-reveal">{t("whitelist.web2.desc")}</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("whitelist.registrar")}</TableHead>
                      <TableHead>{t("whitelist.compatibility")}</TableHead>
                      <TableHead>{t("whitelist.notes")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="table-row-animate">
                      <TableCell>OVH</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-500 text-xs font-medium">
                          {t("whitelist.compatibility.full")}
                        </span>
                      </TableCell>
                      <TableCell>Support API complet</TableCell>
                    </TableRow>
                    <TableRow className="table-row-animate">
                      <TableCell>Gandi</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-500 text-xs font-medium">
                          {t("whitelist.compatibility.full")}
                        </span>
                      </TableCell>
                      <TableCell>Support API complet</TableCell>
                    </TableRow>
                    <TableRow className="table-row-animate">
                      <TableCell>Namecheap</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-500 text-xs font-medium">
                          {t("whitelist.compatibility.partial")}
                        </span>
                      </TableCell>
                      <TableCell>Limitations API</TableCell>
                    </TableRow>
                    <TableRow className="table-row-animate">
                      <TableCell>GoDaddy</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-500 text-xs font-medium">
                          {t("whitelist.compatibility.full")}
                        </span>
                      </TableCell>
                      <TableCell>Support API complet</TableCell>
                    </TableRow>
                    <TableRow className="table-row-animate">
                      <TableCell>Cloudflare</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-500 text-xs font-medium">
                          {t("whitelist.compatibility.full")}
                        </span>
                      </TableCell>
                      <TableCell>Support API avancé</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </div>

            <div className="card-fancy animate-card">
              <CardHeader>
                <CardTitle className="text-reveal gradient-text">{t("whitelist.hosting.title")}</CardTitle>
                <CardDescription className="text-reveal">{t("whitelist.hosting.desc")}</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("whitelist.platform")}</TableHead>
                      <TableHead>{t("whitelist.compatibility")}</TableHead>
                      <TableHead>{t("whitelist.notes")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="table-row-animate">
                      <TableCell>Vercel</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-500 text-xs font-medium">
                          {t("whitelist.compatibility.full")}
                        </span>
                      </TableCell>
                      <TableCell>Intégration automatique</TableCell>
                    </TableRow>
                    <TableRow className="table-row-animate">
                      <TableCell>Netlify</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-500 text-xs font-medium">
                          {t("whitelist.compatibility.full")}
                        </span>
                      </TableCell>
                      <TableCell>Intégration automatique</TableCell>
                    </TableRow>
                    <TableRow className="table-row-animate">
                      <TableCell>GitHub Pages</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-500 text-xs font-medium">
                          {t("whitelist.compatibility.full")}
                        </span>
                      </TableCell>
                      <TableCell>Intégration automatique</TableCell>
                    </TableRow>
                    <TableRow className="table-row-animate">
                      <TableCell>AWS</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-500 text-xs font-medium">
                          {t("whitelist.compatibility.full")}
                        </span>
                      </TableCell>
                      <TableCell>Support S3, CloudFront, Route53</TableCell>
                    </TableRow>
                    <TableRow className="table-row-animate">
                      <TableCell>IPFS/Filecoin</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-500 text-xs font-medium">
                          {t("whitelist.compatibility.full")}
                        </span>
                      </TableCell>
                      <TableCell>Support décentralisé complet</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </div>

            <div className="mt-12 text-center">
              <p className="text-muted-foreground mb-6">{t("whitelist.contact.text")}</p>
              <Button size="lg" className="gradient-bg button-hover">
                {t("whitelist.contact.cta")}
                <ArrowRight className="ml-6 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}


"use client"

import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowRight, CheckCircle, Database, Globe, Link2, Code, Server } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import DomainForms from "@/components/domain-forms"
import UseCaseModal from "@/components/use-case-modal"

export default function Home() {
  const { t } = useLanguage()
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <section className="section hero-section bg-gradient-to-b from-background to-background/50">
          <div className="container-custom grid md:grid-cols-2 gap-12 items-center section-content">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-reveal">
                <span className="gradient-text">{t("home.hero.title")}</span>
              </h1>
              <p className="text-xl md:text-2xl text-foreground/80 text-reveal">{t("home.hero.subtitle")}</p>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-reveal">
                  <CheckCircle className="text-purple-500 h-5 w-5" />
                  <span>{t("home.hero.feature1")}</span>
                </li>
                <li className="flex items-center gap-2 text-reveal">
                  <CheckCircle className="text-pink-500 h-5 w-5" />
                  <span>{t("home.hero.feature2")}</span>
                </li>
                <li className="flex items-center gap-2 text-reveal">
                  <CheckCircle className="text-orange-500 h-5 w-5" />
                  <span>{t("home.hero.feature3")}</span>
                </li>
              </ul>
              <Button size="lg" className="gradient-bg btn-with-icon" onClick={() => router.push("/whitelist")}>
                {t("home.hero.cta")}
                <ArrowRight className="h-4 w-4" />
              </Button>
              <div className="mt-6">
                <p className="text-sm text-muted-foreground mb-3">{t("home.hero.social")}</p>
                <div className="flex items-center gap-4">
                  <a
                    href="https://discord.gg/mkVRnjeFbw"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon-link"
                    aria-label="Discord"
                  >
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center transition-all duration-300 hover-effect hover:bg-gradient-to-r from-indigo-600 to-purple-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-discord"
                      >
                        <circle cx="9" cy="12" r="1" />
                        <circle cx="15" cy="12" r="1" />
                        <path d="M7.5 7.5c3.5-1 5.5-1 9 0" />
                        <path d="M7 16.5c3.5 1 6.5 1 10 0" />
                        <path d="M15.5 17c0 1 1.5 3 2 3 1.5 0 2.833-1.667 3.5-3 .667-1.667.5-5.833-1.5-11.5-1.457-1.015-3-1.34-4.5-1.5l-1 2.5" />
                        <path d="M8.5 17c0 1-1.356 3-1.832 3-1.429 0-2.698-1.667-3.333-3-.635-1.667-.48-5.833 1.428-11.5C6.151 4.485 7.545 4.16 9 4l1 2.5" />
                      </svg>
                    </div>
                  </a>
                  <a
                    href="https://www.linkedin.com/feed/update/urn:li:activity:7309909161683607552/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon-link"
                    aria-label="LinkedIn"
                  >
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center transition-all duration-300 hover-effect hover:bg-gradient-to-r from-blue-600 to-blue-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-linkedin"
                      >
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                        <rect width="4" height="12" x="2" y="9" />
                        <circle cx="4" cy="4" r="2" />
                      </svg>
                    </div>
                  </a>
                  <a
                    href="https://t.me/+ee79AJNug69mNGU8"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon-link"
                    aria-label="Telegram"
                  >
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center transition-all duration-300 hover-effect hover:bg-gradient-to-r from-blue-500 to-cyan-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-send"
                      >
                        <path d="m22 2-7 20-4-9-9-4Z" />
                        <path d="M22 2 11 13" />
                      </svg>
                    </div>
                  </a>
                </div>
              </div>
            </div>
            <div className="relative parallax" data-speed="0.2">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-lg blur opacity-30 animate-pulse-slow"></div>
              <div className="relative glass-effect p-6 rounded-lg">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-500"></div>
                      <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="text-xs text-muted-foreground">recordss-agent.terminal</div>
                  </div>
                  <div className="terminal">
                    <p className="text-white terminal-line" style={{ animationDelay: "0.1s" }}>
                      $ recordss myapp.eth myapp.com
                    </p>
                    <p className="text-muted-foreground terminal-line" style={{ animationDelay: "0.5s" }}>
                      Vérification de la configuration présente ou de la disponibilité...
                    </p>
                    <p className="text-green-300 terminal-line" style={{ animationDelay: "1s" }}>
                      ✓ Domaine disponible!
                    </p>
                    <p className="text-white terminal-line" style={{ animationDelay: "1.5s" }}>
                      $ recordss purchase myapp.eth myapp.com
                    </p>
                    <p className="text-muted-foreground terminal-line" style={{ animationDelay: "2s" }}>
                      Achat des domaine en cours...
                    </p>
                    <p className="text-green-300 terminal-line" style={{ animationDelay: "2.5s" }}>
                      ✓ Domaine acheté avec succès
                    </p>
                    <p className="text-white terminal-line" style={{ animationDelay: "3s" }}>
                      $ recordss configure --app myapp.eth myapp.com
                    </p>
                    <p className="text-muted-foreground terminal-line" style={{ animationDelay: "3.5s" }}>
                      Configuration des enregistrements DNS...
                    </p>
                    <p className="text-green-300 terminal-line" style={{ animationDelay: "4s" }}>
                      ✓ Configuration entre myapp.eth et myapp.com terminée
                    </p>
                    <p className="text-white terminal-line" style={{ animationDelay: "4.5s" }}>
                      $ recordss security-audit
                    </p>
                    <p className="text-green-300 terminal-line" style={{ animationDelay: "5s" }}>
                      ✓ Configuration des DNS de type web & mail sécurisée avec succés
                    </p>
                    <p className="cursor-blink terminal-line" style={{ animationDelay: "5.5s" }}>
                      _
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tableaux de vulnérabilités et incidents */}
        <section className="section bg-secondary/20">
          <div className="container-custom section-content">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Configurations vulnérables */}
              <div className="card-fancy animate-card">
                <CardContent className="p-6">
                  <h2 className="text-xl md:text-2xl font-bold mb-4">{t("home.tables.vulnerabilities")}</h2>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{t("home.tables.company")}</TableHead>
                          <TableHead>{t("home.tables.problems")}</TableHead>
                          <TableHead>{t("home.tables.risk")}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow className="table-row-animate">
                          <TableCell>.cn</TableCell>
                          <TableCell>Configuration partielle</TableCell>
                          <TableCell>
                            <span className="px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-500 text-xs font-medium">
                              {t("home.tables.high")}
                            </span>
                          </TableCell>
                        </TableRow>
                        <TableRow className="table-row-animate">
                          <TableCell>.fr</TableCell>
                          <TableCell>Sous domaine vulnerable à l'usurpation</TableCell>
                          <TableCell>
                            <span className="px-2 py-1 rounded-full bg-red-500/20 text-red-500 text-xs font-medium">
                              {t("home.tables.critical")}
                            </span>
                          </TableCell>
                        </TableRow>
                        <TableRow className="table-row-animate">
                          <TableCell>.be</TableCell>
                          <TableCell>Sous domaine vulnerable à l'usurpation</TableCell>
                          <TableCell>
                            <span className="px-2 py-1 rounded-full bg-red-500/20 text-red-500 text-xs font-medium">
                              {t("home.tables.critical")}
                            </span>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </div>

              {/* Incidents Majeurs */}
              <div className="card-fancy animate-card">
                <CardContent className="p-6 hover:text-white">
                  <h2 className="text-xl md:text-2xl font-bold mb-4">{t("home.tables.incidents")}</h2>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{t("home.tables.company")}</TableHead>
                          <TableHead>{t("home.tables.incident")}</TableHead>
                          <TableHead>{t("home.tables.date")}</TableHead>
                          <TableHead>{t("home.tables.impact")}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow className="table-row-animate">
                          <TableCell>Facebook.com</TableCell>
                          <TableCell>Phishing massif</TableCell>
                          <TableCell>Oct 2023</TableCell>
                          <TableCell>$4.2M</TableCell>
                        </TableRow>
                        <TableRow className="table-row-animate">
                          <TableCell>Microsoft.com</TableCell>
                          <TableCell>Usurpation d'identité</TableCell>
                          <TableCell>Août 2023</TableCell>
                          <TableCell>$2.1M</TableCell>
                        </TableRow>
                        <TableRow className="table-row-animate">
                          <TableCell>Amazon.com</TableCell>
                          <TableCell>Campagne frauduleuse</TableCell>
                          <TableCell>Mars 2023</TableCell>
                          <TableCell>$3.8M</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </div>
            </div>
          </div>
        </section>

        {/* Cas d'utilisation */}
        <section className="section">
          <div className="container-custom section-content">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-reveal">{t("home.usecases.title")}</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-reveal">
                {t("home.usecases.subtitle")}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 card-group">
              <div className="card-fancy p-6 space-y-4 animate-card">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4">
                  <Globe className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold">{t("home.usecases.individuals.title")}</h3>
                <p className="text-muted-foreground">{t("home.usecases.individuals.desc")}</p>
                <div className="pt-4">
                  <UseCaseModal type="individuals">
                    <Button className="px-0 text-white gradient-bg btn-with-icon">
                      {t("home.usecases.learnmore")}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </UseCaseModal>
                </div>
              </div>

              <div className="card-fancy p-6 space-y-4 animate-card">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center mb-4">
                  <Server className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold">{t("home.usecases.companies.title")}</h3>
                <p className="text-muted-foreground">{t("home.usecases.companies.desc")}</p>
                <div className="pt-4">
                  <UseCaseModal type="companies">
                    <Button className="px-0 text-white gradient-bg  btn-with-icon">
                      {t("home.usecases.learnmore")}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </UseCaseModal>
                </div>
              </div>

              <div className="card-fancy p-6 space-y-4 animate-card">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center mb-4">
                  <Code className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold">{t("home.usecases.web3devs.title")}</h3>
                <p className="text-muted-foreground">{t("home.usecases.web3devs.desc")}</p>
                <div className="pt-4">
                  <UseCaseModal type="web3devs">
                    <Button className="px-0 text-white gradient-bg  btn-with-icon">
                      {t("home.usecases.learnmore")}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </UseCaseModal>
                </div>
              </div>

              <div className="card-fancy p-6 space-y-4 animate-card">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-yellow-500 to-green-500 flex items-center justify-center mb-4">
                  <Database className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold">{t("home.usecases.agencies.title")}</h3>
                <p className="text-muted-foreground">{t("home.usecases.agencies.desc")}</p>
                <div className="pt-4">
                  <UseCaseModal type="agencies">
                    <Button className="px-0 text-white gradient-bg   btn-with-icon">
                      {t("home.usecases.learnmore")}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </UseCaseModal>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Fonctionnalités clés */}
        <section className="section bg-secondary/20">
          <div className="container-custom section-content">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-reveal">
                <span className="gradient-text">{t("home.features.title")}</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-reveal">
                {t("home.features.subtitle")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="col-span-1 md:col-span-3 multi-color-border rounded-xl overflow-hidden">
                <div className="bg-black p-8 rounded-xl">
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="w-full md:w-1/3 flex justify-center">
                      <div className="relative w-64 h-64">
                        <div className="absolute inset-0 bg-black/40 rounded-full"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="relative p-4 animate-float">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 rounded-full blur-md"></div>
                            <img
                              src="https://i.ibb.co/JRrzFBcd/Group-2159.png"
                              alt="RECORDSS.AI Logo"
                              className="h-40 w-40 object-contain relative z-10"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-full md:w-2/3">
                      <h3 className="text-2xl md:text-3xl font-bold mb-4 gradient-text">Agent AI pour DNS</h3>
                      <p className="text-lg text-muted-foreground mb-6">
                        Notre agent AI automatise entièrement la configuration et la sécurisation de vos domaines,
                        éliminant les erreurs humaines et réduisant le temps de déploiement.
                      </p>
                      <ul className="space-y-3">
                        <li className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="text-purple-500 h-4 w-4" />
                          </div>
                          <span>Configuration automatisée par intelligence artificielle</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-pink-500/20 flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="text-pink-500 h-4 w-4" />
                          </div>
                          <span>Détection et correction des vulnérabilités en temps réel</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="text-orange-500 h-4 w-4" />
                          </div>
                          <span>Synchronisation Web2/Web3 sans intervention manuelle</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-1 multi-color-border rounded-xl overflow-hidden">
                <div className="bg-black p-8 rounded-xl h-full">
                  <div className="flex flex-col h-full">
                    <div className="mb-6">
                      <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4 hover:scale-110 transition-transform duration-300">
                        <Database className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold">{t("home.features.dns.title")}</h3>
                    </div>
                    <p className="text-muted-foreground flex-grow">
                      Notre agent AI configure automatiquement tous vos enregistrements DNS avec une précision technique
                      parfaite.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-span-1 multi-color-border rounded-xl overflow-hidden">
                <div className="bg-black p-8 rounded-xl h-full">
                  <div className="flex flex-col h-full">
                    <div className="mb-6">
                      <div className="h-16 w-16 rounded-full bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center mb-4 hover:scale-110 transition-transform duration-300">
                        <Link2 className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold">{t("home.features.integration.title")}</h3>
                    </div>
                    <p className="text-muted-foreground flex-grow">
                      Synchronisation intelligente entre domaines traditionnels et blockchain sans aucune connaissance
                      technique requise.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-span-1 multi-color-border rounded-xl overflow-hidden">
                <div className="bg-black p-8 rounded-xl h-full">
                  <div className="flex flex-col h-full">
                    <div className="mb-6">
                      <div className="h-16 w-16 rounded-full bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center mb-4 hover:scale-110 transition-transform duration-300">
                        <Code className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold">{t("home.features.api.title")}</h3>
                    </div>
                    <p className="text-muted-foreground flex-grow">
                      API complète permettant d'intégrer notre agent AI directement dans vos workflows de développement.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Formulaires avec onglets */}
        <section className="section" id="test-forms">
          <div className="container-custom max-w-3xl section-content">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-reveal">
                <span className="gradient-text">{t("home.test.title")}</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-reveal">{t("home.test.subtitle")}</p>
            </div>

            {/* Utilisation du composant DomainForms */}
            <DomainForms />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}


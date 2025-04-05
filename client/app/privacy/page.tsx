"use client"

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { Shield, Lock, Eye, Server, Globe, Bell, FileText, Mail } from "lucide-react"

export default function PrivacyPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-16">
        <section className="section">
          <div className="container-custom max-w-4xl section-content">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-reveal">{t("privacy.title")}</h1>
              <p className="text-xl text-muted-foreground text-reveal">{t("privacy.lastupdate")}</p>
            </div>

            <Card className="glass-effect animate-card mb-8">
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-start gap-4 mb-6">
                  <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto md:mx-0 md:mt-1 flex-shrink-0">
                    <Shield className="h-5 w-5 text-purple-500" />
                  </div>
                  <div className="text-center md:text-left">
                    <h2 className="text-2xl font-bold mb-2 text-reveal">{t("privacy.intro.title")}</h2>
                    <div className="prose prose-invert max-w-none">
                      <p className="text-reveal">{t("privacy.intro.content1")}</p>
                      <p className="text-reveal">{t("privacy.intro.content2")}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect animate-card mb-8">
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-start gap-4 mb-6">
                  <div className="h-10 w-10 rounded-full bg-pink-500/20 flex items-center justify-center mx-auto md:mx-0 md:mt-1 flex-shrink-0">
                    <Eye className="h-5 w-5 text-pink-500" />
                  </div>
                  <div className="text-center md:text-left">
                    <h2 className="text-2xl font-bold mb-2 text-reveal">{t("privacy.collect.title")}</h2>

                    <h3 className="text-xl font-semibold mt-4 mb-2">{t("privacy.collect.auth.title")}</h3>
                    <p className="mb-2">{t("privacy.collect.auth.desc")}</p>
                    <ul className="list-disc pl-5 space-y-1 mb-4 text-left">
                      <li>{t("privacy.collect.auth.email")}</li>
                      <li>{t("privacy.collect.auth.id")}</li>
                      <li>{t("privacy.collect.auth.timestamps")}</li>
                    </ul>
                    <p className="mb-4">{t("privacy.collect.auth.security")}</p>

                    <h3 className="text-xl font-semibold mt-4 mb-2">{t("privacy.collect.dns.title")}</h3>
                    <p className="mb-2">{t("privacy.collect.dns.desc")}</p>
                    <ul className="list-disc pl-5 space-y-1 mb-4 text-left">
                      <li>{t("privacy.collect.dns.domains")}</li>
                      <li>{t("privacy.collect.dns.settings")}</li>
                    </ul>

                    <h3 className="text-xl font-semibold mt-4 mb-2">{t("privacy.collect.technical.title")}</h3>
                    <p className="mb-2">{t("privacy.collect.technical.desc")}</p>
                    <p className="mb-4">{t("privacy.collect.technical.ip")}</p>

                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 flex flex-col md:flex-row items-start gap-3">
                      <div className="text-blue-400 mx-auto md:mx-0 md:mt-1">💡</div>
                      <p className="text-blue-400 text-center md:text-left">{t("privacy.collect.technical.note")}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect animate-card mb-8">
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-start gap-4 mb-6">
                  <div className="h-10 w-10 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto md:mx-0 md:mt-1 flex-shrink-0">
                    <Server className="h-5 w-5 text-orange-500" />
                  </div>
                  <div className="text-center md:text-left">
                    <h2 className="text-2xl font-bold mb-2 text-reveal">{t("privacy.why.title")}</h2>
                    <p className="mb-4">{t("privacy.why.desc")}</p>

                    <ul className="space-y-3 mb-6 text-left">
                      <li className="flex items-start gap-2">
                        <div className="text-green-500 mt-1">✔</div>
                        <span>{t("privacy.why.reason1")}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="text-green-500 mt-1">✔</div>
                        <span>{t("privacy.why.reason2")}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="text-green-500 mt-1">✔</div>
                        <span>{t("privacy.why.reason3")}</span>
                      </li>
                    </ul>

                    <h3 className="text-xl font-semibold mt-6 mb-2">{t("privacy.protection.title")}</h3>
                    <ul className="space-y-3 text-left">
                      <li className="flex items-start gap-2">
                        <div className="text-green-500 mt-1">✔</div>
                        <span>{t("privacy.protection.method1")}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="text-green-500 mt-1">✔</div>
                        <span>{t("privacy.protection.method2")}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect animate-card mb-8">
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-start gap-4 mb-6">
                  <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center mx-auto md:mx-0 md:mt-1 flex-shrink-0">
                    <Lock className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="text-center md:text-left">
                    <h2 className="text-2xl font-bold mb-2 text-reveal">{t("privacy.storage.title")}</h2>

                    <h3 className="text-xl font-semibold mt-4 mb-2">{t("privacy.storage.security.title")}</h3>
                    <div className="flex items-start gap-2 mb-4">
                      <div className="text-blue-400 mt-1">📌</div>
                      <p>{t("privacy.storage.security.desc")}</p>
                    </div>

                    <h3 className="text-xl font-semibold mt-4 mb-2">{t("privacy.storage.sharing.title")}</h3>
                    <p className="mb-2">{t("privacy.storage.sharing.desc")}</p>
                    <ul className="list-disc pl-5 space-y-1 mb-4 text-left">
                      <li>{t("privacy.storage.sharing.case1")}</li>
                      <li>{t("privacy.storage.sharing.case2")}</li>
                      <li>{t("privacy.storage.sharing.case3")}</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect animate-card mb-8">
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-start gap-4 mb-6">
                  <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto md:mx-0 md:mt-1 flex-shrink-0">
                    <Globe className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="text-center md:text-left">
                    <h2 className="text-2xl font-bold mb-2 text-reveal">{t("privacy.standard.title")}</h2>
                    <p className="mb-4">{t("privacy.standard.desc")}</p>

                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 flex flex-col md:flex-row items-start gap-3 mb-4">
                      <div className="text-blue-400 mx-auto md:mx-0 md:mt-1">💡</div>
                      <div className="text-center md:text-left">
                        <p className="text-blue-400 font-medium">{t("privacy.standard.example.title")}</p>
                        <ul className="list-disc pl-5 space-y-1 text-blue-400 mt-2 text-left">
                          <li>{t("privacy.standard.example.eu")}</li>
                          <li>{t("privacy.standard.example.noneu")}</li>
                        </ul>
                      </div>
                    </div>

                    <p>{t("privacy.standard.our_approach")}</p>
                    <p className="mt-2">{t("privacy.standard.global")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect animate-card mb-8">
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-start gap-4 mb-6">
                  <div className="h-10 w-10 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto md:mx-0 md:mt-1 flex-shrink-0">
                    <Bell className="h-5 w-5 text-yellow-500" />
                  </div>
                  <div className="text-center md:text-left">
                    <h2 className="text-2xl font-bold mb-2 text-reveal">{t("privacy.changes.title")}</h2>
                    <p className="mb-4">{t("privacy.changes.desc")}</p>

                    <div className="flex items-start gap-2 mb-4">
                      <div className="text-blue-400 mt-1">📌</div>
                      <p>{t("privacy.changes.notification")}</p>
                    </div>

                    <p>{t("privacy.changes.trust")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect animate-card">
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-start gap-4 mb-6">
                  <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto md:mx-0 md:mt-1 flex-shrink-0">
                    <FileText className="h-5 w-5 text-purple-500" />
                  </div>
                  <div className="text-center md:text-left">
                    <h2 className="text-2xl font-bold mb-2 text-reveal">{t("privacy.rights.title")}</h2>
                    <p className="mb-4">{t("privacy.rights.desc")}</p>

                    <ul className="space-y-3 mb-6 text-left">
                      <li className="flex items-start gap-2">
                        <div className="text-green-500 mt-1">✅</div>
                        <span>{t("privacy.rights.access")}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="text-green-500 mt-1">✅</div>
                        <span>{t("privacy.rights.delete")}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="text-green-500 mt-1">✅</div>
                        <span>{t("privacy.rights.limit")}</span>
                      </li>
                    </ul>

                    <div className="flex items-center gap-2 mt-4 justify-center md:justify-start">
                      <Mail className="h-5 w-5 text-blue-400" />
                      <p>{t("privacy.rights.contact")}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}


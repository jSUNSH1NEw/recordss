"use client"

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { CheckCircle, ArrowRight, Shield, Lock } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function OffresPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-16">
        <section className="section">
          <div className="container-custom section-content">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-reveal">
                <span className="gradient-text">{t("offers.title")}</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-reveal">{t("offers.subtitle")}</p>
            </div>

            {/* Sécurité DNS renforcée */}
            <div className="multi-color-border rounded-xl overflow-hidden mb-16">
              <div className="bg-black p-8 rounded-xl">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="w-full md:w-1/3 flex justify-center">
                    <div className="relative w-48 h-48">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-full blur-xl opacity-20 animate-pulse-slow"></div>
                      <div className="absolute inset-4 bg-black rounded-full"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Shield className="h-20 w-20 text-white opacity-80" />
                      </div>
                    </div>
                  </div>
                  <div className="w-full md:w-2/3">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4 gradient-text">{t("offers.security.title")}</h2>
                    <p className="text-lg text-muted-foreground mb-6">{t("offers.security.desc")}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-3">
                        <div className="h-6 w-6 rounded-full bg-purple-500/20 flex items-center justify-center mt-0.5">
                          <Lock className="h-4 w-4 text-purple-500" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{t("offers.security.feature1")}</h3>
                          <p className="text-sm text-muted-foreground">{t("offers.security.feature1.desc")}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="h-6 w-6 rounded-full bg-pink-500/20 flex items-center justify-center mt-0.5">
                          <Lock className="h-4 w-4 text-pink-500" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{t("offers.security.feature2")}</h3>
                          <p className="text-sm text-muted-foreground">{t("offers.security.feature2.desc")}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="h-6 w-6 rounded-full bg-orange-500/20 flex items-center justify-center mt-0.5">
                          <Lock className="h-4 w-4 text-orange-500" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{t("offers.security.feature3")}</h3>
                          <p className="text-sm text-muted-foreground">{t("offers.security.feature3.desc")}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="h-6 w-6 rounded-full bg-yellow-500/20 flex items-center justify-center mt-0.5">
                          <Lock className="h-4 w-4 text-yellow-500" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{t("offers.security.feature4")}</h3>
                          <p className="text-sm text-muted-foreground">{t("offers.security.feature4.desc")}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Nouveau design pour les offres - complètement revu */}
            <div className="space-y-8 mb-20">
              {/* Free Plan */}
              <div className="relative overflow-hidden rounded-xl">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl blur-lg opacity-70"></div>
                <div className="card-fancy relative z-10">
                  <div className="flex flex-col md:flex-row">
                    <div className="p-8 md:w-1/3 flex flex-col justify-center items-center md:items-start border-b md:border-b-0 md:border-r border-white/10">
                      <h3 className="text-3xl font-bold mb-2">{t("offers.free.title")}</h3>
                      <p className="text-lg text-muted-foreground mb-2">{t("offers.free.subtitle")}</p>
                      <div className="text-5xl font-bold mt-4 mb-6">{t("offers.free.price")}</div>
                      <div className="h-12"></div>
                    </div>
                    <div className="p-8 md:w-2/3">
                      <div className="space-y-4">
                        <div className="flex items-start gap-4">
                          <CheckCircle className="h-6 w-6 text-purple-500 flex-shrink-0 mt-1" />
                          <div>
                            <p className="text-xl font-medium">{t("offers.free.feature1")}</p>
                            <p className="text-muted-foreground">{t("offers.free.feature1.desc")}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <CheckCircle className="h-6 w-6 text-purple-500 flex-shrink-0 mt-1" />
                          <div>
                            <p className="text-xl font-medium">{t("offers.free.feature2")}</p>
                            <p className="text-muted-foreground">{t("offers.free.feature2.desc")}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <CheckCircle className="h-6 w-6 text-purple-500 flex-shrink-0 mt-1" />
                          <div>
                            <p className="text-xl font-medium">{t("offers.free.feature3")}</p>
                            <p className="text-muted-foreground">{t("offers.free.feature3.desc")}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Essential Plan */}
              <div className="relative overflow-hidden rounded-xl">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600/20 to-orange-600/20 rounded-xl blur-lg opacity-70"></div>
                <div className="absolute top-6 md:left-8 left-1/2 md:transform-none transform -translate-x-1/2 md:translate-x-0 z-20">
                  <div className="bg-gradient-to-r from-pink-600 to-orange-600 px-4 py-1 rounded-full text-sm font-bold shadow-lg whitespace-nowrap">
                    {t("offers.pro.popular")}
                  </div>
                </div>
                <div className="card-fancy relative z-10 transform scale-[1.02] shadow-xl">
                  <div className="flex flex-col md:flex-row">
                    <div className="p-8 md:w-1/3 flex flex-col justify-center items-center md:items-start border-b md:border-b-0 md:border-r border-white/10">
                      <h3 className="text-3xl font-bold mb-2">{t("offers.pro.title")}</h3>
                      <div className="text-5xl font-bold mt-4 mb-2">
                        {t("offers.pro.price")}
                        <span className="text-xl font-normal">{t("offers.pro.period")}</span>
                      </div>
                      <Button className="w-full md:w-auto px-8 py-6 text-lg gradient-bg">{t("offers.pro.cta")}</Button>
                    </div>
                    <div className="p-8 md:w-2/3">
                      <div className="space-y-4">
                        <div className="flex items-start gap-4">
                          <CheckCircle className="h-6 w-6 text-pink-500 flex-shrink-0 mt-1" />
                          <div>
                            <p className="text-xl font-medium">{t("offers.pro.feature1")}</p>
                            <p className="text-muted-foreground">{t("offers.pro.feature1.desc")}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <CheckCircle className="h-6 w-6 text-pink-500 flex-shrink-0 mt-1" />
                          <div>
                            <p className="text-xl font-medium">{t("offers.pro.feature2")}</p>
                            <p className="text-muted-foreground">{t("offers.pro.feature2.desc")}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <CheckCircle className="h-6 w-6 text-pink-500 flex-shrink-0 mt-1" />
                          <div>
                            <p className="text-xl font-medium">{t("offers.pro.feature3")}</p>
                            <p className="text-muted-foreground">{t("offers.pro.feature3.desc")}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <CheckCircle className="h-6 w-6 text-pink-500 flex-shrink-0 mt-1" />
                          <div>
                            <p className="text-xl font-medium">{t("offers.pro.feature4")}</p>
                            <p className="text-muted-foreground">{t("offers.pro.feature4.desc")}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* PRO Plan */}
              <div className="relative overflow-hidden rounded-xl">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-xl blur-lg opacity-70"></div>
                <div className="absolute top-6 md:left-8 left-1/2 md:transform-none transform -translate-x-1/2 md:translate-x-0 z-20">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-1 rounded-full text-sm font-bold shadow-lg whitespace-nowrap">
                    {t("offers.enterprise.subtitle")}
                  </div>
                </div>
                <div className="card-fancy relative z-10">
                  <div className="flex flex-col md:flex-row">
                    <div className="p-8 md:w-1/3 flex flex-col justify-center items-center md:items-start border-b md:border-b-0 md:border-r border-white/10">
                      <h3 className="text-3xl font-bold mb-2">{t("offers.enterprise.title")}</h3>
                      <div className="text-5xl font-bold mt-4 mb-2">{t("offers.enterprise.price")}</div>
                      <Button className="w-full md:w-auto px-8 py-6 text-lg gradient-bg">
                        {t("offers.enterprise.cta")}
                      </Button>
                    </div>
                    <div className="p-8 md:w-2/3">
                      <div className="space-y-4">
                        <div className="flex items-start gap-4">
                          <CheckCircle className="h-6 w-6 text-blue-500 flex-shrink-0 mt-1" />
                          <div>
                            <p className="text-xl font-medium">{t("offers.enterprise.feature1")}</p>
                            <p className="text-muted-foreground">{t("offers.enterprise.feature1.desc")}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <CheckCircle className="h-6 w-6 text-blue-500 flex-shrink-0 mt-1" />
                          <div>
                            <p className="text-xl font-medium">{t("offers.enterprise.feature2")}</p>
                            <p className="text-muted-foreground">{t("offers.enterprise.feature2.desc")}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <CheckCircle className="h-6 w-6 text-blue-500 flex-shrink-0 mt-1" />
                          <div>
                            <p className="text-xl font-medium">{t("offers.enterprise.feature3")}</p>
                            <p className="text-muted-foreground">{t("offers.enterprise.feature3.desc")}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <CheckCircle className="h-6 w-6 text-blue-500 flex-shrink-0 mt-1" />
                          <div>
                            <p className="text-xl font-medium">{t("offers.enterprise.feature4")}</p>
                            <p className="text-muted-foreground">{t("offers.enterprise.feature4.desc")}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Funds Community Plan */}
              <div className="relative overflow-hidden rounded-xl">
                <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-teal-600/20 rounded-xl blur-lg opacity-70"></div>
                <div className="absolute top-6 md:left-8 left-1/2 md:transform-none transform -translate-x-1/2 md:translate-x-0 z-20">
                  <div className="bg-gradient-to-r from-green-600 to-teal-600 px-4 py-1 rounded-full text-sm font-bold shadow-lg whitespace-nowrap">
                    {t("offers.community.subtitle.badge")}
                  </div>
                </div>
                <div className="card-fancy relative z-10">
                  <div className="flex flex-col md:flex-row">
                    <div className="p-8 md:w-1/3 flex flex-col justify-center items-center md:items-start border-b md:border-b-0 md:border-r border-white/10">
                      <h3 className="text-2xl font-bold mb-2">{t("offers.community.title")}</h3>

                      <div className="text-5xl font-bold mt-4 mb-2">
                        {t("offers.community.price")}
                        <span className="text-xl font-normal">{t("offers.community.price.period")}</span>
                      </div>
                      <Button className="w-full md:w-auto px-8 py-6 text-lg gradient-bg">
                        {t("offers.community.cta")}
                      </Button>
                    </div>
                    <div className="p-8 md:w-2/3">
                      <div className="space-y-4">
                        <div className="flex items-start gap-4">
                          <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                          <div>
                            <p className="text-xl font-medium">{t("offers.community.feature1")}</p>
                            <p className="text-muted-foreground">{t("offers.community.feature1.desc")}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                          <div>
                            <p className="text-xl font-medium">{t("offers.community.feature2")}</p>
                            <p className="text-muted-foreground">{t("offers.community.feature2.desc")}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                          <div>
                            <p className="text-xl font-medium">{t("offers.community.feature3")}</p>
                            <p className="text-muted-foreground">{t("offers.community.feature3.desc")}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                          <div>
                            <p className="text-xl font-medium">{t("offers.community.feature4")}</p>
                            <p className="text-muted-foreground">{t("offers.community.feature4.desc")}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-20">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4 text-reveal">
                  <span className="gradient-text">{t("offers.comparison.title")}</span>
                </h2>
              </div>

              <div className="card-fancy p-6">
                <div className="overflow-x-auto" style={{ WebkitOverflowScrolling: "touch" }}>
                  <table className="w-full min-w-[640px]">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-4 px-4">{t("offers.comparison.feature")}</th>
                        <th className="text-center py-4 px-4">{t("offers.free.title")}</th>
                        <th className="text-center py-4 px-4">{t("offers.pro.title")}</th>
                        <th className="text-center py-4 px-4">{t("offers.enterprise.title")}</th>
                        <th className="text-center py-4 px-4">{t("offers.community.title")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-white/5">
                        <td className="py-3 px-4">DNS management AI agent</td>
                        <td className="text-center py-3 px-4">❌</td>
                        <td className="text-center py-3 px-4">✅ Automated</td>
                        <td className="text-center py-3 px-4">✅ Custom</td>
                        <td className="text-center py-3 px-4">✅ Custom</td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="py-3 px-4">{t("offers.comparison.domains")}</td>
                        <td className="text-center py-3 px-4">1</td>
                        <td className="text-center py-3 px-4">10</td>
                        <td className="text-center py-3 px-4">Unlimited</td>
                        <td className="text-center py-3 px-4">20</td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="py-3 px-4">Custom dashboard</td>
                        <td className="text-center py-3 px-4">❌</td>
                        <td className="text-center py-3 px-4">✅</td>
                        <td className="text-center py-3 px-4">✅</td>
                        <td className="text-center py-3 px-4">✅</td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="py-3 px-4">Advanced data loss protection</td>
                        <td className="text-center py-3 px-4">❌</td>
                        <td className="text-center py-3 px-4">✅</td>
                        <td className="text-center py-3 px-4">✅</td>
                        <td className="text-center py-3 px-4">✅</td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="py-3 px-4">Assisted integrations</td>
                        <td className="text-center py-3 px-4">❌</td>
                        <td className="text-center py-3 px-4">❌</td>
                        <td className="text-center py-3 px-4">✅</td>
                        <td className="text-center py-3 px-4">✅</td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="py-3 px-4">{t("offers.comparison.api")}</td>
                        <td className="text-center py-3 px-4">Limited to 3 requests</td>
                        <td className="text-center py-3 px-4">Limited to 10 requests</td>
                        <td className="text-center py-3 px-4">Unlimited</td>
                        <td className="text-center py-3 px-4">Limited</td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="py-3 px-4">{t("offers.comparison.support")}</td>
                        <td className="text-center py-3 px-4">Community</td>
                        <td className="text-center py-3 px-4">Email & cal.com</td>
                        <td className="text-center py-3 px-4">24/7 dedicated</td>
                        <td className="text-center py-3 px-4">24/7 dedicated</td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="py-3 px-4">Price</td>
                        <td className="text-center py-3 px-4">$0</td>
                        <td className="text-center py-3 px-4">$19/month</td>
                        <td className="text-center py-3 px-4">Custom quote</td>
                        <td className="text-center py-3 px-4">100€ ICP</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4">Exclusive benefits</td>
                        <td className="text-center py-3 px-4">❌</td>
                        <td className="text-center py-3 px-4">❌</td>
                        <td className="text-center py-3 px-4">❌</td>
                        <td className="text-center py-3 px-4">✅ (See details below)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-12 text-center">
                <p className="text-muted-foreground mb-6">{t("offers.contact.text")}</p>
                <Button size="lg" className="bg-gray-600/50 hover:bg-gray-600/70 cursor-not-allowed" disabled>
                  {t("offers.contact.cta")}
                  <ArrowRight className="ml-6 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}


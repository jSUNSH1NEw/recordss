"use client"

import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const { t } = useLanguage()

  return (
    <footer className="footer-slant">
      <div className="footer-content py-8 backdrop-blur-sm">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-muted-foreground">
                © {currentYear} RECORDSS.IA - {t("footer.copyright")}
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              <Link href="/offres" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t("footer.offers")}
              </Link>
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t("footer.privacy")}
              </Link>
              <Link href="/whitelist" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t("footer.whitelist")}
              </Link>
              <div className="flex items-center gap-4">
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-footer-icon"
                  aria-label="LinkedIn"
                >
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:bg-gradient-to-r from-blue-500 to-indigo-500 hover:shadow-glow">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
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
                  href="https://discord.gg/mkVRnjeFbw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-footer-icon"
                  aria-label="Discord"
                >
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-glow">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}


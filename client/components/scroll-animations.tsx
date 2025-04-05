"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

export default function ScrollAnimations() {
  const animationsApplied = useRef(false)

  useEffect(() => {
    if (animationsApplied.current) return

    // Register ScrollTrigger plugin
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger)

      // Fade in animations for sections
      const sections = document.querySelectorAll(".section")
      sections.forEach((section) => {
        gsap.fromTo(
          section.querySelector(".section-content"),
          {
            y: 50,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          },
        )
      })

      // Stagger animations for cards
      const cardGroups = document.querySelectorAll(".card-group")
      cardGroups.forEach((group) => {
        const cards = group.querySelectorAll(".animate-card")
        gsap.fromTo(
          cards,
          {
            y: 30,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            stagger: 0.1,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: group,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          },
        )
      })

      // Parallax effect for hero section
      const heroElements = document.querySelectorAll(".parallax")
      heroElements.forEach((element) => {
        gsap.to(element, {
          y: (i, el) => -Number.parseFloat(el.getAttribute("data-speed") || "0") * 100,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero-section",
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        })
      })

      // Text reveal animations
      const textReveal = document.querySelectorAll(".text-reveal")
      textReveal.forEach((text) => {
        gsap.fromTo(
          text,
          {
            y: 20,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: text,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          },
        )
      })

      // Table row animations
      const tableRows = document.querySelectorAll(".table-row-animate")
      tableRows.forEach((row, index) => {
        gsap.fromTo(
          row,
          {
            x: -20,
            opacity: 0,
          },
          {
            x: 0,
            opacity: 1,
            duration: 0.4,
            delay: index * 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: row,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          },
        )
      })

      animationsApplied.current = true
    }
  }, [])

  return null
}


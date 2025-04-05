"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const cursorDotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!cursorRef.current || !cursorDotRef.current) return

    const cursor = cursorRef.current
    const cursorDot = cursorDotRef.current

    // Initial setup
    gsap.set(cursor, { xPercent: -50, yPercent: -50 })
    gsap.set(cursorDot, { xPercent: -50, yPercent: -50 })

    // Variables for mouse position
    let mouseX = 0
    let mouseY = 0
    let prevMouseX = 0
    let prevMouseY = 0

    // Variables for cursor position
    let cursorX = 0
    let cursorY = 0
    let cursorDotX = 0
    let cursorDotY = 0

    // Speed factor for cursor lag effect
    const cursorSpeed = 0.2
    const cursorDotSpeed = 0.5

    // Animation function
    const animate = () => {
      // Calculate cursor position with lag effect
      cursorX += (mouseX - cursorX) * cursorSpeed
      cursorY += (mouseY - cursorY) * cursorSpeed

      // Calculate dot position with less lag
      cursorDotX += (mouseX - cursorDotX) * cursorDotSpeed
      cursorDotY += (mouseY - cursorDotY) * cursorDotSpeed

      // Apply positions
      gsap.set(cursor, { x: cursorX, y: cursorY })
      gsap.set(cursorDot, { x: cursorDotX, y: cursorDotY })

      // Calculate velocity for cursor size effect
      const deltaX = mouseX - prevMouseX
      const deltaY = mouseY - prevMouseY
      const velocity = Math.sqrt(deltaX * deltaX + deltaY * deltaY) * 0.1

      // Apply size effect based on velocity
      gsap.to(cursor, {
        width: 32 + velocity * 20,
        height: 32 + velocity * 20,
        opacity: 0.6 - velocity * 0.1,
        duration: 0.2,
      })

      prevMouseX = mouseX
      prevMouseY = mouseY

      requestAnimationFrame(animate)
    }

    // Start animation
    animate()

    // Mouse move event
    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    // Mouse enter/leave events for hover effects
    const onMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a") ||
        target.classList.contains("hoverable")
      ) {
        gsap.to(cursor, {
          width: 64,
          height: 64,
          opacity: 0.4,
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          border: "1px solid rgba(255, 255, 255, 0.6)",
          duration: 0.3,
          ease: "power2.out",
        })
        gsap.to(cursorDot, {
          width: 8,
          height: 8,
          duration: 0.3,
          ease: "power2.out",
        })
      }
    }

    const onMouseLeave = () => {
      gsap.to(cursor, {
        width: 32,
        height: 32,
        opacity: 0.6,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        duration: 0.3,
        ease: "power2.out",
      })
      gsap.to(cursorDot, {
        width: 6,
        height: 6,
        duration: 0.3,
        ease: "power2.out",
      })
    }

    // Add event listeners
    window.addEventListener("mousemove", onMouseMove)
    document.addEventListener("mouseover", onMouseEnter)
    document.addEventListener("mouseout", onMouseLeave)

    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      document.removeEventListener("mouseover", onMouseEnter)
      document.removeEventListener("mouseout", onMouseLeave)
    }
  }, [])

  return (
    <>
      <div
        ref={cursorRef}
        className="cursor hidden md:block fixed top-0 left-0 rounded-full pointer-events-none z-[100] mix-blend-difference bg-white/10 border border-white/30 w-8 h-8"
      />
      <div
        ref={cursorDotRef}
          className="cursor-dot hidden md:block fixed top-0 left-0 rounded-full pointer-events-none z-[100] bg-white w-1.5 h-1.5"
      />
    </>
  )
}


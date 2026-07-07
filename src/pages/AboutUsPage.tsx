import { useState, useEffect } from "react"
import { NavigationBarFull } from "../mycomponents/NavBar"
import { AboutUsCard } from "../mycomponents/AboutUsCard"
import { Footer } from "../mycomponents/Footer"

export const AboutUsPage = () => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <div className="min-h-screen bg-[oklch(21%_0.006_285.885)] flex flex-col">
      <NavigationBarFull />
      <div
        className="flex-1"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(40px)",
          transition: "opacity 500ms ease, transform 500ms ease",
        }}
      >
        <AboutUsCard />
      </div>
      <Footer />
    </div>
  )
}
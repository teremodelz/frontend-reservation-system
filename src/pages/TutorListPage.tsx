import { useEffect, useState } from "react"
import {NavigationBarFull} from "../mycomponents/NavBar"
import {WelcomeTablesTutorPage} from "../mycomponents/TutorsIntroduction"
import {TutorGrid} from "../mycomponents/TutorGrid"
import { Footer } from "../mycomponents/Footer"

export const TutorListPage = () => {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        const id = requestAnimationFrame(() => setMounted(true))
        return () => cancelAnimationFrame(id)
    }, [])

    return (
        <div className="min-h-screen bg-[oklch(21%_0.006_285.885)]">
            <NavigationBarFull />
            <div
                style={{
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? "translateY(0)" : "translateY(40px)",
                    transition: "opacity 500ms ease, transform 500ms ease",
                }}
            >
                <WelcomeTablesTutorPage />
                <TutorGrid />
            </div>
            <Footer />
        </div>
    )
}      
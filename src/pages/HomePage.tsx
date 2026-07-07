import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { NavigationBarFull } from "../mycomponents/NavBar"
import { Footer } from "../mycomponents/Footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { isLoggedIn } from "../api/tokenService"

const STEPS = [
  { num: '1', label: 'Znajdź korepetytora', desc: 'Przejrzyj dostępnych nauczycieli i wybierz odpowiednią osobę.' },
  { num: '2', label: 'Zarezerwuj lekcję', desc: 'Wybierz termin z kalendarza dostępności i potwierdź rezerwację.' },
  { num: '3', label: 'Ucz się', desc: 'Dołącz do lekcji i zacznij robić postępy.' },
]

export function HomePage() {
  const navigate = useNavigate()
  const logged = isLoggedIn()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <div className="min-h-screen bg-[oklch(21%_0.006_285.885)] text-foreground">
      <NavigationBarFull />

      {/* Hero */}
      <section
        className="flex flex-col items-center justify-center text-center px-6 pt-24 pb-20"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(32px)',
          transition: 'opacity 600ms ease, transform 600ms ease',
        }}
      >
        
        <h1 className="max-w-3xl text-5xl font-bold leading-tight tracking-tight text-white sm:text-6xl">
          Znajdź korepetytora,{' '}
          <span className="text-primary text-red-400">który Ci pomoże</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-muted-foreground">
          Sprawdzeni nauczycieli, elastyczne terminy, konkretne skupienie na twojej nauce.
        </p>
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <Button size="lg" className="px-8 text-base" onClick={() => navigate('/tutors')}>
            Szukaj korepetytora
          </Button>
          {!logged && (
            <Button size="lg" variant="outline" className="px-8 text-base" onClick={() => navigate('/register')}>
              Dołącz za darmo
            </Button>
          )}
          {logged && (
            <Button size="lg" variant="outline" className="px-8 text-base" onClick={() => navigate('/dashboard')}>
              Mój panel
            </Button>
          )}
        </div>
      </section>


      {/* How it works */}
      <section className="py-20 px-6 bg-zinc-900/30 border-y border-border">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-3xl font-bold text-white mb-12">Jak to działa?</h2>
          <div className="flex flex-col gap-6">
            {STEPS.map(step => (
              <div key={step.num} className="flex gap-5 items-start bg-white-400">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-black font-bold text-lg">
                  {step.num}
                </div>
                <div>
                  <p className="font-semibold text-white">{step.label}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA bottom */}
      <section className="py-20 px-6 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Gotowy, żeby zacząć?</h2>
        <p className="text-muted-foreground mb-8">Dołącz do setek uczniów, którzy już korzystają z platformy.</p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Button size="lg" className="px-10 text-base" onClick={() => navigate('/tutors')}>
            Przeglądaj korepetytorów
          </Button>
          {!logged && (
            <Button size="lg" variant="outline" className="px-10 text-base" onClick={() => navigate('/register')}>
              Zarejestruj się
            </Button>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}

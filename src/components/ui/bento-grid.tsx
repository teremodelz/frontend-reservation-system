import { ReactNode } from "react"
import { ArrowRight as ArrowRightIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface BentoGridProps {
  children: ReactNode
  className?: string
}

interface BentoCardProps {
  name: string
  className?: string
  background?: ReactNode
  Icon?: React.ElementType
  description: string
  href?: string
  cta?: string
  onClick?: () => void
}

export function BentoGrid({ children, className }: BentoGridProps) {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[12rem] grid-cols-3 gap-4",
        className
      )}
    >
      {children}
    </div>
  )
}

export function BentoCard({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
  onClick,
}: BentoCardProps) {
  return (
    <div
      key={name}
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-xl",
        "bg-zinc-900 border border-border",
        "[box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
        "transform-gpu transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl",
        className
      )}
    >
      {/* Background */}
      <div className="absolute inset-0">{background}</div>

      {/* Gradient overlay at bottom */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent z-10" />

      {/* Content */}
      <div className="relative z-20 flex flex-col gap-1 p-6 mt-auto pb-12">
        {Icon && (
          <Icon className="h-10 w-10 text-primary mb-2 transition-all duration-300 ease-in-out group-hover:scale-75" />
        )}
        <h3 className="text-xl font-semibold text-white">{name}</h3>
        <p className="text-sm text-zinc-400 max-w-lg">{description}</p>
      </div>

      {/* CTA */}
      {cta && (
        <div
          className={cn(
            "pointer-events-none absolute bottom-0 flex w-full translate-y-10 transform-gpu flex-row items-center p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 z-20"
          )}
        >
          <Button
            variant="ghost"
            size="sm"
            className="pointer-events-auto text-white hover:text-white hover:bg-white/10"
            onClick={onClick}
          >
            {cta}
            <ArrowRightIcon className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Clickable overlay */}
      {onClick && (
        <div
          className="absolute inset-0 z-30 cursor-pointer"
          onClick={onClick}
        />
      )}
    </div>
  )
}

import { cn } from "@/lib/utils"

/**
 * FinanzBG brand mark.
 * An upward "shield + rising bars" mark — trust (shield) + growth/savings (bars).
 * Pure geometric SVG, scales crisply at any size.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={cn("h-8 w-8", className)}
      role="img"
      aria-label="FinanzBG"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20 2.5 34.5 7.2v11.3c0 9.2-5.9 15.9-14.5 19-8.6-3.1-14.5-9.8-14.5-19V7.2L20 2.5Z"
        className="fill-primary"
      />
      <rect x="13" y="21" width="3.6" height="7" rx="1" className="fill-primary-foreground/85" />
      <rect x="18.2" y="17" width="3.6" height="11" rx="1" className="fill-primary-foreground/85" />
      <rect x="23.4" y="13" width="3.6" height="15" rx="1" className="fill-success" />
    </svg>
  )
}

export function Logo({
  className,
  textClassName,
  showText = true,
}: {
  className?: string
  textClassName?: string
  showText?: boolean
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark />
      {showText ? (
        <span className={cn("font-sans text-lg font-bold tracking-tight text-foreground", textClassName)}>
          Finanz<span className="text-primary">BG</span>
        </span>
      ) : null}
    </span>
  )
}
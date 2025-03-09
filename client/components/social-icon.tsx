import Link from "next/link"
import type { LucideIcon } from "lucide-react"

interface SocialIconProps {
  href: string
  icon: LucideIcon
  label: string
}

export function SocialIcon({ href, icon: Icon, label }: SocialIconProps) {
  return (
    <Link
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-full bg-slate-100 p-2 text-slate-600 transition-colors hover:bg-primary hover:text-primary-foreground"
    >
      <Icon className="h-5 w-5" />
    </Link>
  )
}


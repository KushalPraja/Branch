import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

interface LinkCardProps {
  href: string
  title: string
  description?: string
  className?: string
}

export function LinkCard({ href, title, description, className }: LinkCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-primary hover:shadow-md",
        className,
      )}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="space-y-1">
        <h2 className="font-medium text-slate-900 group-hover:text-primary">{title}</h2>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      <ExternalLink className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
    </Link>
  )
}


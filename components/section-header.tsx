import Link from 'next/link'

export function SectionHeader({
  title,
  href,
}: {
  title: string
  href?: string
}) {
  return (
    <div className="mb-3 flex items-end justify-between">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      {href && (
        <Link
          href={href}
          className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Show all
        </Link>
      )}
    </div>
  )
}

import Image from "next/image"

// Square organisation logo shown beside an Education/Experience entry, with an
// icon fallback when no logo has been uploaded.
export function EntryLogo({
  src,
  alt,
  fallbackIcon: Icon,
}: {
  src?: string | null
  alt: string
  fallbackIcon: React.ComponentType<{ className?: string }>
}) {
  return (
    <div className="relative h-14 w-14 sm:h-16 sm:w-16 shrink-0 overflow-hidden rounded-lg bg-primary-light ring-1 ring-primary/15 flex items-center justify-center">
      {src ? (
        <Image src={src} alt={alt} fill className="object-contain p-1.5 bg-white" />
      ) : (
        <Icon className="h-7 w-7 text-primary" />
      )}
    </div>
  )
}

// Organisation name, linked to its website when one is set.
export function EntryOrgLink({ name, url, className }: { name: string; url?: string | null; className?: string }) {
  if (!url) return <span className={className}>{name}</span>
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${className ?? ""} hover:underline underline-offset-4`}
    >
      {name}
    </a>
  )
}

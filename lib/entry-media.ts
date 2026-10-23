// Photos, certificates and links attached to an Education or Experience entry
// (stored in the `media` JSONB column), shown LinkedIn-style under the entry.

export type EntryMediaType = "photo" | "certificate" | "link"

export interface EntryMediaItem {
  type: EntryMediaType
  title: string
  url: string
  thumbnail?: string
  description?: string
}

export const ENTRY_MEDIA_TYPE_LABELS: Record<EntryMediaType, string> = {
  photo: "Photo",
  certificate: "Certificate / Training",
  link: "Link",
}

export const ENTRY_MEDIA_BUCKET = "entry-media"

export function parseEntryMedia(value: unknown): EntryMediaItem[] {
  if (!Array.isArray(value)) return []
  return value.filter(
    (item): item is EntryMediaItem =>
      !!item && typeof item === "object" && typeof (item as any).url === "string" && (item as any).url !== "",
  )
}

// The image to show for a media tile: uploaded photos/certificates are images
// themselves; links use their optional thumbnail.
export function entryMediaPreview(item: EntryMediaItem) {
  return item.type === "link" ? item.thumbnail || null : item.thumbnail || item.url
}

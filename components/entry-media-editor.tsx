"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { ArrowDown, ArrowUp, Plus, Trash2, Upload } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import {
  ENTRY_MEDIA_BUCKET,
  ENTRY_MEDIA_TYPE_LABELS,
  type EntryMediaItem,
  type EntryMediaType,
  entryMediaPreview,
} from "@/lib/entry-media"

export async function uploadEntryMedia(file: File, prefix: string) {
  const supabase = createClient()
  const fileExt = file.name.split(".").pop()
  const filePath = `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`
  const { error } = await supabase.storage.from(ENTRY_MEDIA_BUCKET).upload(filePath, file)
  if (error) throw error
  return supabase.storage.from(ENTRY_MEDIA_BUCKET).getPublicUrl(filePath).data.publicUrl
}

// Logo upload + website URL fields shared by the Education and Experience forms.
export function EntryLogoField({
  logoUrl,
  onLogoChange,
  websiteUrl,
  websiteLabel,
}: {
  logoUrl: string
  onLogoChange: (url: string) => void
  websiteUrl?: string | null
  websiteLabel: string
}) {
  const [uploading, setUploading] = useState(false)
  const { toast } = useToast()

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      onLogoChange(await uploadEntryMedia(file, "logo"))
    } catch (err: any) {
      toast({ title: "Error", description: "Failed to upload logo. " + err.message, variant: "destructive" })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="logo">Logo</Label>
        <div className="flex items-center gap-3">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border bg-gray-50">
            {logoUrl && <Image src={logoUrl} alt="Logo preview" fill className="object-contain p-1" />}
          </div>
          <Input id="logo" type="file" accept="image/*" onChange={handleUpload} disabled={uploading} />
          {logoUrl && (
            <Button type="button" variant="ghost" size="sm" onClick={() => onLogoChange("")}>
              Remove
            </Button>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{uploading ? "Uploading..." : "Square image works best."}</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="website_url">{websiteLabel}</Label>
        <Input id="website_url" name="website_url" type="url" defaultValue={websiteUrl ?? ""} placeholder="https://..." />
      </div>
    </div>
  )
}

// Editable list of photos, certificates/training and links for an entry.
export function EntryMediaEditor({
  value,
  onChange,
  hint,
}: {
  value: EntryMediaItem[]
  onChange: (items: EntryMediaItem[]) => void
  hint: string
}) {
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null)
  const { toast } = useToast()

  const update = (index: number, patch: Partial<EntryMediaItem>) =>
    onChange(value.map((item, i) => (i === index ? { ...item, ...patch } : item)))

  const move = (index: number, delta: number) => {
    const target = index + delta
    if (target < 0 || target >= value.length) return
    const next = [...value]
    ;[next[index], next[target]] = [next[target], next[index]]
    onChange(next)
  }

  const handleFile = async (index: number, field: "url" | "thumbnail", e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingIndex(index)
    try {
      update(index, { [field]: await uploadEntryMedia(file, "media") })
    } catch (err: any) {
      toast({ title: "Error", description: "Failed to upload file. " + err.message, variant: "destructive" })
    } finally {
      setUploadingIndex(null)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <Label>Media &amp; Links</Label>
          <p className="text-xs text-muted-foreground mt-1">{hint}</p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onChange([...value, { type: "photo", title: "", url: "" }])}
        >
          <Plus className="h-4 w-4 mr-1" /> Add item
        </Button>
      </div>

      {value.length === 0 && (
        <p className="text-sm text-muted-foreground rounded-lg border border-dashed p-4 text-center">No media yet.</p>
      )}

      {value.map((item, index) => {
        const preview = item.url ? entryMediaPreview(item) : null
        return (
          <div key={index} className="rounded-lg border p-4 space-y-3 bg-gray-50/50">
            <div className="flex gap-3">
              <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-md border bg-white">
                {preview && !/\.pdf($|\?)/i.test(preview) && (
                  <Image src={preview} alt="" fill className="object-cover" />
                )}
              </div>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Type</Label>
                  <select
                    value={item.type}
                    onChange={(e) => update(index, { type: e.target.value as EntryMediaType })}
                    className="h-9 w-full rounded-md border border-input bg-white px-3 text-sm"
                  >
                    {Object.entries(ENTRY_MEDIA_TYPE_LABELS).map(([type, label]) => (
                      <option key={type} value={type}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Title</Label>
                  <Input
                    value={item.title}
                    onChange={(e) => update(index, { title: e.target.value })}
                    placeholder="e.g., Campus, CCNA Certificate, Company website"
                    required
                  />
                </div>
              </div>
            </div>

            {item.type === "link" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Link URL</Label>
                  <Input
                    type="url"
                    value={item.url}
                    onChange={(e) => update(index, { url: e.target.value })}
                    placeholder="https://..."
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Thumbnail (optional)</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFile(index, "thumbnail", e)}
                    disabled={uploadingIndex === index}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <Label className="text-xs">
                  {item.type === "certificate" ? "Certificate image or PDF" : "Photo"}
                  {item.url ? " (uploaded, choose a file to replace)" : ""}
                </Label>
                <Input
                  type="file"
                  accept={item.type === "certificate" ? "image/*,application/pdf" : "image/*"}
                  onChange={(e) => handleFile(index, "url", e)}
                  disabled={uploadingIndex === index}
                />
              </div>
            )}

            <div className="space-y-1">
              <Label className="text-xs">Caption (optional)</Label>
              <Input
                value={item.description ?? ""}
                onChange={(e) => update(index, { description: e.target.value })}
                placeholder="Short caption"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {uploadingIndex === index ? (
                  <span className="inline-flex items-center gap-1">
                    <Upload className="h-3 w-3" /> Uploading...
                  </span>
                ) : !item.url ? (
                  "Not saved on the site until a file or URL is added."
                ) : null}
              </span>
              <div className="flex gap-1">
                <Button type="button" variant="ghost" size="sm" onClick={() => move(index, -1)} disabled={index === 0}>
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => move(index, 1)}
                  disabled={index === value.length - 1}
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-destructive"
                  onClick={() => onChange(value.filter((_, i) => i !== index))}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

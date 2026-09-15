"use client"

import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DownloadCVButtonProps {
  cvUrl?: string | null
}

export function DownloadCVButton({ cvUrl }: DownloadCVButtonProps) {
  // Fall back to the bundled static CV if the admin hasn't uploaded one yet.
  const href = cvUrl || "/Mohammad_Golam_Sarowar_CV.pdf"

  const handleDownloadCV = () => {
    const link = document.createElement("a")
    link.href = href
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.open(href, "_blank")
  }

  return (
    <Button
      size="lg"
      variant="outline"
      className="border-2 border-primary text-primary hover:bg-primary-light w-full sm:w-auto px-6 py-2.5 sm:px-8 sm:py-3 text-sm sm:text-base bg-transparent"
      onClick={handleDownloadCV}
    >
      <Download className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
      Download CV
    </Button>
  )
}

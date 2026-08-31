"use client"

import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DownloadCVButton() {
  const handleDownloadCV = () => {
    const link = document.createElement("a")
    link.href = "/Mohammad_Golam_Sarowar_CV.pdf"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.open("/Mohammad_Golam_Sarowar_CV.pdf", "_blank")
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

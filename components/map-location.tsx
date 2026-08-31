"use client"

import { Card, CardContent } from "@/components/ui/card"

interface MapLocationProps {
  latitude?: number
  longitude?: number
  locationName?: string
}

export function MapLocation({
  latitude = 23.8259,
  longitude = 90.4249,
  locationName = "Khilkhet, Dhaka, Bangladesh",
}: MapLocationProps) {
  // Generate Google Maps embed URL with specific coordinates
  const mapUrl = `https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3689.5!2d${longitude}!3d${latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjLCsDI4JzE1LjciTiA5McKwNDcnMTguNSJF!5e0!3m2!1sen!2sbd!4v1234567890123!5m2!1sen!2sbd`

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="relative w-full h-[450px]">
          <iframe
            src={mapUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Location Map"
            className="absolute inset-0"
          />
        </div>
      </CardContent>
    </Card>
  )
}

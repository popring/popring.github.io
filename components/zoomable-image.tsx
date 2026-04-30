'use client'

/* eslint-disable @next/next/no-img-element -- MDX images are remote and dimensionless; react-medium-image-zoom expects a native img. */
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

export function ZoomableImage({ src, alt }: { src: string; alt: string }) {
  return (
    <Zoom wrapElement="span">
      <img src={src} alt={alt} loading="lazy" className="rounded-lg" />
    </Zoom>
  )
}

'use client'

import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

export function ZoomableImage({ src, alt }: { src: string; alt: string }) {
  return (
    <Zoom wrapElement="span">
      {/* biome-ignore lint/performance/noImgElement: MDX images are remote and dimensionless; react-medium-image-zoom expects a native img. */}
      <img src={src} alt={alt} loading="lazy" decoding="async" className="rounded-lg" />
    </Zoom>
  )
}

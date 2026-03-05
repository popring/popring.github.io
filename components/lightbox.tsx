'use client'

import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'

export function Lightbox({ src, alt }: { src: string; alt: string }) {
  const [open, setOpen] = useState(false)

  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, close])

  return (
    <>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="rounded-lg cursor-zoom-in"
        onClick={() => setOpen(true)}
      />
      {open && createPortal(
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 cursor-zoom-out"
          onClick={close}
        >
          <img
            src={src}
            alt={alt}
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>,
        document.body
      )}
    </>
  )
}

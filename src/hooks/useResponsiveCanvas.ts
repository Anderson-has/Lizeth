/**
 * Hook para manejar canvas responsivo
 * Se adapta automáticamente al tamaño del contenedor
 */
import { useState, useEffect, useCallback, useRef } from 'react'

export function useResponsiveCanvas() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const updateDimensions = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const container = canvas.parentElement
    if (!container) return

    const rect = container.getBoundingClientRect()
    const width = Math.floor(rect.width)
    const height = Math.floor(rect.height)

    // Asegurar dimensiones mínimas
    const minWidth = 300
    const minHeight = 200

    const finalWidth = Math.max(width, minWidth)
    const finalHeight = Math.max(height, minHeight)

    setDimensions({ width: finalWidth, height: finalHeight })
  }, [])

  useEffect(() => {
    updateDimensions()

    // Escuchar cambios de tamaño
    const resizeObserver = new ResizeObserver(updateDimensions)
    const container = canvasRef.current?.parentElement
    if (container) {
      resizeObserver.observe(container)
    }

    return () => {
      resizeObserver.disconnect()
    }
  }, [updateDimensions])

  return { canvasRef, dimensions, updateDimensions }
}

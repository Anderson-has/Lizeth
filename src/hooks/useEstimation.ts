/**
 * Hook para manejar la estimación de c
 * Permite múltiples clics y reposicionamiento
 */
import { useState, useCallback } from 'react'

export function useEstimation() {
  const [userEstimateC, setUserEstimateC] = useState<number | null>(null)
  const [isEstimating, setIsEstimating] = useState(false)
  const [hasVerified, setHasVerified] = useState(false)
  const [attempts, setAttempts] = useState(0)

  const startEstimation = useCallback((c: number) => {
    setUserEstimateC(c)
    setIsEstimating(true)
    setHasVerified(false)
    setAttempts(prev => prev + 1)
  }, [])

  const updateEstimation = useCallback((c: number) => {
    if (!isEstimating) return
    setUserEstimateC(c)
  }, [isEstimating])

  const verifyEstimation = useCallback(() => {
    if (userEstimateC === null) return false
    setHasVerified(true)
    setIsEstimating(false)
    return true
  }, [userEstimateC])

  const resetEstimation = useCallback(() => {
    setUserEstimateC(null)
    setIsEstimating(false)
    setHasVerified(false)
  }, [])

  return {
    userEstimateC,
    isEstimating,
    hasVerified,
    attempts,
    startEstimation,
    updateEstimation,
    verifyEstimation,
    resetEstimation
  }
}

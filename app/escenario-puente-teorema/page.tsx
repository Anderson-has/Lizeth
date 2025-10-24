"use client"

import { PTFCDemo } from "./PTFCDemo"

export default function EscenarioPuenteTeorema() {
  const handleBack = () => {
    // Navegar de vuelta al inicio
    window.location.href = '/'
  }

  return <PTFCDemo onBack={handleBack} />
}

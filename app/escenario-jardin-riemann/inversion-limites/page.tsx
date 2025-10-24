'use client'

import React from 'react'
import InversionLimitesDemo from '../InversionLimitesDemo'

export default function InversionLimitesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Propiedad de Inversión de Límites
          </h1>
          <p className="text-gray-600">
            Explora cómo cambiar los límites de integración invierte el signo del resultado
          </p>
        </div>
        
        <InversionLimitesDemo />
      </div>
    </div>
  )
}

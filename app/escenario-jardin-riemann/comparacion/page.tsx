'use client'

import React from 'react'
import ComparacionDemo from '../ComparacionDemo'

export default function ComparacionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Propiedad de Comparación
          </h1>
          <p className="text-gray-600">
            Compara dos funciones y sus integrales para verificar la propiedad de comparación
          </p>
        </div>
        
        <ComparacionDemo />
      </div>
    </div>
  )
}

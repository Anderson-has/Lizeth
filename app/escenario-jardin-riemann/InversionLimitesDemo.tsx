'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'
import { useInversionLimitesState } from '@/src/hooks/useInversionLimitesState'

const InversionLimitesDemo: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { 
    escenarioRef, 
    isInitialized, 
    inicializarEscenario, 
    actualizarLimites, 
    actualizarFuncion 
  } = useInversionLimitesState()
  
  // Estado de UI
  const [limiteA, setLimiteA] = useState(0)
  const [limiteB, setLimiteB] = useState(2)
  const [funcion, setFuncion] = useState("x")
  const [funcionesDisponibles, setFuncionesDisponibles] = useState<string[]>([])

  // Inicializar escenario
  useEffect(() => {
    try {
      inicializarEscenario()
      
      if (escenarioRef.current && canvasRef.current) {
        // Configurar canvas
        escenarioRef.current.configurarCanvas(canvasRef.current, document.getElementById('calculos-inversion'))
        
        // Obtener funciones disponibles
        const datos = escenarioRef.current.obtenerDatos()
        if (datos?.funcionesDisponibles) {
          setFuncionesDisponibles(datos.funcionesDisponibles)
        }
      }
    } catch (error) {
      console.error('Error al inicializar inversión de límites:', error)
    }
  }, [inicializarEscenario])

  // Actualizar cuando cambian los valores
  useEffect(() => {
    if (escenarioRef.current && isInitialized) {
      actualizarLimites(limiteA, limiteB)
      actualizarFuncion(funcion)
    }
  }, [limiteA, limiteB, funcion, actualizarLimites, actualizarFuncion, isInitialized])

  // Manejo de eventos de UI
  const handleLimiteAChange = useCallback((value: number) => {
    setLimiteA(value)
  }, [])

  const handleLimiteBChange = useCallback((value: number) => {
    setLimiteB(value)
  }, [])

  const handleFuncionChange = useCallback((value: string) => {
    setFuncion(value)
  }, [])

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6">
      {/* Controles */}
      <div className="lg:w-1/3 space-y-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Controles</h3>
          
          {/* Límite A */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Límite A: {limiteA.toFixed(1)}
            </label>
            <input
              type="range"
              min="-5"
              max="5"
              step="0.1"
              value={limiteA}
              onChange={(e) => handleLimiteAChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          
          {/* Límite B */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Límite B: {limiteB.toFixed(1)}
            </label>
            <input
              type="range"
              min="-5"
              max="5"
              step="0.1"
              value={limiteB}
              onChange={(e) => handleLimiteBChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          
          {/* Función */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Función
            </label>
            <select
              value={funcion}
              onChange={(e) => handleFuncionChange(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {funcionesDisponibles.map((func) => (
                <option key={func} value={func}>
                  {func}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Información */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">Propiedad de Inversión</h4>
          <p className="text-sm text-blue-700">
            ∫[a→b] f(x)dx = -∫[b→a] f(x)dx
          </p>
          <p className="text-xs text-blue-600 mt-2">
            Al intercambiar los límites, el resultado cambia de signo.
          </p>
        </div>
      </div>
      
      {/* Visualización */}
      <div className="lg:w-2/3">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Visualización</h3>
          <canvas
            ref={canvasRef}
            width={800}
            height={400}
            className="border border-gray-200 rounded-lg bg-white cursor-crosshair"
            onMouseMove={(e) => {
              if (escenarioRef.current && canvasRef.current) {
                // Obtener el transformador del gestor de visualización
                const transformador = escenarioRef.current.gestorVisualizacion?.transformador
                if (transformador) {
                  escenarioRef.current.manejarHover(e, canvasRef.current, transformador)
                }
              }
            }}
            onMouseLeave={() => {
              if (escenarioRef.current) {
                escenarioRef.current.limpiarHover()
              }
            }}
          />
        </div>
        
        {/* Cálculos */}
        <div id="calculos-inversion" className="mt-4"></div>
      </div>
    </div>
  )
}

export default InversionLimitesDemo

'use client'

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Sparkles, Wand2, Divide } from 'lucide-react'
import { EscenarioFactory } from '@/src/escenarios/EscenarioFactory.js'
import { useAditividadState } from '@/src/hooks/useAditividadState'

interface AditividadDemoProps {
  onBack: () => void
}

type FunctionKey = 'x' | 'x²' | 'x³' | 'sin(x)' | 'cos(x)' | '√x' | 'eˣ'

export function AditividadDemo({ onBack }: AditividadDemoProps) {
  // ✅ ESTADOS PARA LOS CONTROLES
  const [funcionSeleccionada, setFuncionSeleccionada] = useState<FunctionKey>('x²')
  const [limiteA, setLimiteA] = useState(0)
  const [limiteB, setLimiteB] = useState(2)
  const [limiteC, setLimiteC] = useState(4)
  
  // ✅ REFERENCIAS
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerTooltipRef = useRef<HTMLDivElement>(null)
  const escenarioFactory = useRef<any>(null)
  const escenarioAditividad = useRef<any>(null)
  
  // ✅ HOOK PERSONALIZADO PARA SINCRONIZACIÓN
  const { estado, configuracion, actualizarEstado, actualizarConfiguracion, sincronizarConReact } = useAditividadState()
  
  // ✅ CONFIGURACIÓN DE RENDIMIENTO (SIMPLIFICADA)
  // Removidas variables que causaban bucles infinitos
  
  // Funciones matemáticas disponibles
  const funciones = {
    'x': { nombre: 'x', color: '#3b82f6' },
    'x²': { nombre: 'x²', color: '#10b981' },
    'x³': { nombre: 'x³', color: '#8b5cf6' },
    'sin(x)': { nombre: 'sin(x)', color: '#f59e0b' },
    'cos(x)': { nombre: 'cos(x)', color: '#ef4444' },
    '√x': { nombre: '√x', color: '#06b6d4' },
    'eˣ': { nombre: 'eˣ', color: '#84cc16' }
  }
  
  // Validación de límites
  const limitesValidos = useMemo(() => {
    return limiteA < limiteB && limiteB < limiteC
  }, [limiteA, limiteB, limiteC])
  
  // ✅ INICIALIZACIÓN CON PATRÓN HÍBRIDO
  useEffect(() => {
    if (canvasRef.current && !escenarioAditividad.current) {
      try {
        // ✅ CREAR INSTANCIAS DE CLASES OOP USANDO FACTORY
        escenarioFactory.current = new EscenarioFactory()
        escenarioAditividad.current = escenarioFactory.current.crearEscenario('propiedades-aditividad')
        
        // ✅ CONFIGURAR CANVAS PARA REACT
        console.log('AditividadDemo - Canvas element:', canvasRef.current)
        console.log('AditividadDemo - Canvas size:', canvasRef.current?.width, 'x', canvasRef.current?.height)
        console.log('AditividadDemo - Canvas context:', canvasRef.current?.getContext('2d'))
        
        // @ts-ignore
        escenarioAditividad.current.configurarCanvas(canvasRef.current, containerTooltipRef.current)
        
        // ✅ SINCRONIZAR CON REACT
        sincronizarConReact()
        
        console.log('Escenario de aditividad inicializado con patrón híbrido')
        
        // ✅ VERIFICAR VISIBILIDAD DEL CANVAS
        setTimeout(() => {
          console.log('AditividadDemo - Verificando visibilidad del canvas...')
          console.log('Canvas element:', canvasRef.current)
          console.log('Canvas visible:', canvasRef.current?.offsetWidth, 'x', canvasRef.current?.offsetHeight)
          console.log('Canvas style:', canvasRef.current?.style.display)
          console.log('Canvas computed style:', window.getComputedStyle(canvasRef.current || document.body))
        }, 200)
        
                // ✅ NO RENDERIZAR INMEDIATAMENTE - Los datos se generarán automáticamente
                console.log('Escenario inicializado, los datos se generarán automáticamente...')
      } catch (error) {
        console.error('Error al inicializar aditividad:', error)
      }
    }
  }, [sincronizarConReact])
  
  // ✅ ACTUALIZAR ESCENARIO CON PATRÓN HÍBRIDO SIMPLIFICADO
  useEffect(() => {
    if (escenarioAditividad.current && limitesValidos) {
      // ✅ ACTUALIZAR ESTADO EN LAS CLASES OOP
      escenarioAditividad.current.actualizarFuncion(funcionSeleccionada)
      escenarioAditividad.current.actualizarLimites(limiteA, limiteB, limiteC)
      
      // ✅ RENDERIZAR SIMPLE
      escenarioAditividad.current.renderizar()
    }
  }, [funcionSeleccionada, limiteA, limiteB, limiteC, limitesValidos])
  
  // Renderizar cálculos
  useEffect(() => {
    if (escenarioAditividad.current && limitesValidos) {
      const containerCalculos = document.getElementById('calculos-aditividad')
      if (containerCalculos) {
        escenarioAditividad.current.renderizarCalculos(containerCalculos)
      }
    }
  }, [funcionSeleccionada, limiteA, limiteB, limiteC, limitesValidos])
  
  // ✅ MANEJO DE EVENTOS DE MOUSE SIMPLIFICADO
  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas || !escenarioAditividad.current) return
    
    // ✅ ACTUALIZAR POSICIÓN DEL MOUSE EN LAS CLASES OOP
    escenarioAditividad.current.manejarHover(event, canvas, escenarioAditividad.current.transformador)
  }, [])
  
  const handleMouseLeave = useCallback(() => {
    if (escenarioAditividad.current) {
      // ✅ LIMPIAR HOVER EN LAS CLASES OOP
      escenarioAditividad.current.limpiarHover()
    }
  }, [])
  
  // ✅ LIMPIAR AL DESMONTAR
  useEffect(() => {
    return () => {
      if (escenarioAditividad.current) {
        escenarioAditividad.current.limpiar()
      }
    }
  }, [])
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-[90vw] w-full mx-4 max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-green-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                onClick={onBack}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2 text-green-700 border-green-300 hover:bg-green-50"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver al inicio</span>
              </Button>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-6 h-6 text-green-600" />
                <h1 className="text-2xl font-bold text-green-800">Propiedad Mágica - Aditividad</h1>
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
              <Wand2 className="w-4 h-4 mr-1" />
              Aditividad
            </Badge>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Panel de controles */}
          <div className="lg:col-span-1 space-y-6">
            {/* Controles de función */}
            <Card className="bg-white/70 backdrop-blur-sm border-green-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-green-800 flex items-center">
                  <Divide className="w-5 h-5 mr-2" />
                  Función f(x)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seleccionar función:
                  </label>
                  <select
                    value={funcionSeleccionada}
                    onChange={(e) => setFuncionSeleccionada(e.target.value as FunctionKey)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    {Object.entries(funciones).map(([key, func]) => (
                      <option key={key} value={key}>
                        {func.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-sm text-green-700">
                    <span className="font-medium">Función seleccionada:</span> {funciones[funcionSeleccionada].nombre}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Controles de límites */}
            <Card className="bg-white/70 backdrop-blur-sm border-blue-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-blue-800">
                  Límites de Integración
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Límite a:
                    </label>
                    <input
                      type="number"
                      value={limiteA}
                      onChange={(e) => setLimiteA(Number(e.target.value))}
                      step="0.1"
                      min="-10"
                      max="10"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Límite c:
                    </label>
                    <input
                      type="number"
                      value={limiteC}
                      onChange={(e) => setLimiteC(Number(e.target.value))}
                      step="0.1"
                      min="-10"
                      max="10"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Punto intermedio b: {limiteB.toFixed(1)}
                  </label>
                  <input
                    type="range"
                    value={limiteB}
                    onChange={(e) => setLimiteB(Number(e.target.value))}
                    min={limiteA + 0.1}
                    max={limiteC - 0.1}
                    step="0.1"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{limiteA.toFixed(1)}</span>
                    <span>{limiteC.toFixed(1)}</span>
                  </div>
                </div>
                
                {!limitesValidos && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center">
                      <div className="text-red-500 mr-2">⚠️</div>
                      <div className="text-sm text-red-700">
                        Los límites deben cumplir: a &lt; b &lt; c
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Información de la propiedad */}
            <Card className="bg-white/70 backdrop-blur-sm border-purple-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-purple-800">
                  Propiedad de Aditividad
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-700 space-y-2">
                  <p className="font-medium">Fórmula:</p>
                  <div className="bg-gray-100 p-3 rounded font-mono text-center">
                    ∫[a,c] f(x) dx = ∫[a,b] f(x) dx + ∫[b,c] f(x) dx
                  </div>
                  <p className="text-xs text-gray-600">
                    La integral sobre un intervalo completo es igual a la suma de las integrales sobre sus subintervalos.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Gráfico y cálculos */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gráfico */}
            <Card className="bg-white/70 backdrop-blur-sm border-green-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-green-800">
                  Visualización de la Propiedad
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <canvas
                    ref={canvasRef}
                    width={800}
                    height={400}
                    className="border border-gray-200 rounded-lg bg-white cursor-default"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                  />
                  <div
                    ref={containerTooltipRef}
                    className="absolute pointer-events-none z-50"
                    style={{ display: 'none' }}
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* Cálculos */}
            <Card className="bg-white/70 backdrop-blur-sm border-blue-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-blue-800">
                  Cálculos y Verificación
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div id="calculos-aditividad" className="space-y-4">
                  {!limitesValidos && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center">
                        <div className="text-red-500 mr-3">⚠️</div>
                        <div>
                          <h3 className="text-sm font-medium text-red-800">Error de Validación</h3>
                          <p className="text-sm text-red-700 mt-1">
                            Los límites deben cumplir: a &lt; b &lt; c
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}

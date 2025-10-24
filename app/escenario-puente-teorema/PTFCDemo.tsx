'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, CheckCircle2, XCircle, Calculator, TrendingUp, Play, Pause, RotateCcw } from 'lucide-react'
import { usePTFCState } from '@/src/hooks/usePTFCState'

interface PTFCDemoProps {
  onBack: () => void
}

export function PTFCDemo({ onBack }: PTFCDemoProps) {
  // ✅ REFERENCIAS DE CANVAS
  const canvasPuenteRef = useRef<HTMLCanvasElement>(null)
  const canvasCartesianoRef = useRef<HTMLCanvasElement>(null)
  const containerTooltipRef = useRef<HTMLDivElement>(null)
  const containerCalculosRef = useRef<HTMLDivElement>(null)
  
  // ✅ HOOK DE SINCRONIZACIÓN
  const {
    estado,
    configuracion,
    calculos,
    logros,
    tiempo,
    funciones,
    actualizarFuncion,
    actualizarLimites,
    actualizarPosicionX,
    actualizarAnimacion,
    manejarHover,
    desactivarHover,
    renderizar,
    renderizarCalculos,
    reiniciar,
    limpiar,
    configurarCanvas,
    obtenerEscenario
  } = usePTFCState()
  
  // ✅ ESTADO LOCAL DE UI
  const [funcionSeleccionada, setFuncionSeleccionada] = useState('cuadratica')
  const [limiteA, setLimiteA] = useState(0)
  const [limiteB, setLimiteB] = useState(4)
  const [posicionX, setPosicionX] = useState(2)
  const [animacionActiva, setAnimacionActiva] = useState(false)
  const [velocidadAnimacion, setVelocidadAnimacion] = useState(1)
  const [tabActivo, setTabActivo] = useState('visualizacion')
  
  // ✅ INICIALIZAR CANVAS
  useEffect(() => {
    if (canvasPuenteRef.current && canvasCartesianoRef.current) {
      console.log('🎨 Configurando canvas PTFC...')
      console.log('🌉 Canvas Puente:', canvasPuenteRef.current)
      console.log('📈 Canvas Cartesiano:', canvasCartesianoRef.current)
      console.log('🔧 Container Tooltip:', containerTooltipRef.current)
      
      configurarCanvas(
        canvasPuenteRef.current,
        canvasCartesianoRef.current,
        containerTooltipRef.current ?? undefined
      )
      
      console.log('✅ Canvas PTFC configurado')
    } else {
      console.warn('⚠️ Canvas PTFC no disponible aún')
    }
  }, [configurarCanvas])
  
  // ✅ SINCRONIZAR CON ESTADO OOP
  useEffect(() => {
    if (estado) {
      setLimiteA(estado.obtenerLimites().a)
      setLimiteB(estado.obtenerLimites().b)
      setPosicionX(estado.obtenerPosicionX())
      setAnimacionActiva(estado.obtenerEstadoAnimacion().activa)
    }
  }, [estado])
  
  // ✅ RENDERIZAR CÁLCULOS
  useEffect(() => {
    if (containerCalculosRef.current) {
      renderizarCalculos(containerCalculosRef.current)
    }
  }, [calculos, logros, tiempo, renderizarCalculos])
  
  // ✅ MANEJAR CAMBIO DE FUNCIÓN
  const handleFuncionChange = useCallback((funcion: string) => {
    setFuncionSeleccionada(funcion)
    actualizarFuncion(funcion)
  }, [actualizarFuncion])
  
  // ✅ MANEJAR CAMBIO DE LÍMITES
  const handleLimitesChange = useCallback((a: number, b: number) => {
    setLimiteA(a)
    setLimiteB(b)
    actualizarLimites(a, b)
  }, [actualizarLimites])
  
  // ✅ MANEJAR CAMBIO DE POSICIÓN X
  const handlePosicionXChange = useCallback((x: number) => {
    setPosicionX(x)
    // ✅ ACTUALIZACIÓN INMEDIATA SIN DEBOUNCING
    actualizarPosicionX(x)
  }, [actualizarPosicionX])
  
  // ✅ MANEJAR ANIMACIÓN
  const handleAnimacionToggle = useCallback(() => {
    const nuevaActiva = !animacionActiva
    setAnimacionActiva(nuevaActiva)
    actualizarAnimacion(nuevaActiva, velocidadAnimacion)
  }, [animacionActiva, velocidadAnimacion, actualizarAnimacion])
  
  // ✅ MANEJAR HOVER EN CANVAS CARTESIANO
  const handleMouseMoveCartesiano = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    manejarHover(event, canvasCartesianoRef.current!, 'cartesiano')
  }, [manejarHover])
  
  // ✅ MANEJAR HOVER EN CANVAS PUENTE
  const handleMouseMovePuente = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    manejarHover(event, canvasPuenteRef.current!, 'puente')
  }, [manejarHover])
  
  // ✅ MANEJAR MOUSE LEAVE
  const handleMouseLeave = useCallback(() => {
    desactivarHover()
  }, [desactivarHover])
  
  // ✅ REINICIAR
  const handleReiniciar = useCallback(() => {
    reiniciar()
    setPosicionX(limiteA)
    setAnimacionActiva(false)
  }, [reiniciar, limiteA])
  
  // ✅ LIMPIAR AL DESMONTAR
  useEffect(() => {
    return () => {
      limpiar()
    }
  }, [limpiar])
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Button
              onClick={onBack}
              variant="ghost"
              size="sm"
              className="flex items-center space-x-2 text-blue-700 hover:bg-blue-50"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver</span>
            </Button>
            <h1 className="text-4xl font-bold text-blue-900 mt-2">
              ✨ Puente Mágico
            </h1>
            <p className="text-gray-600 mt-2">
              Primer Teorema Fundamental del Cálculo
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              <Calculator className="w-4 h-4 mr-1" />
              PTFC
            </Badge>
            {tiempo && (
              <div className="text-sm text-gray-600">
                Tiempo: {Math.floor(tiempo.sesion / 1000)}s
              </div>
            )}
          </div>
        </div>

        <Tabs value={tabActivo} onValueChange={setTabActivo}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="visualizacion">Visualizaciones</TabsTrigger>
            <TabsTrigger value="teoria">Teoría</TabsTrigger>
            <TabsTrigger value="ejemplos">Ejemplos</TabsTrigger>
          </TabsList>

          <TabsContent value="visualizacion" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Panel de controles */}
              <div className="space-y-6">
                {/* Controles de función */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-purple-800 flex items-center">
                      ✨ Función Mágica
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Seleccionar función:
                      </label>
                      <select
                        value={funcionSeleccionada}
                        onChange={(e) => handleFuncionChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        {funciones && Object.entries(funciones).map(([key, func]: [string, any]) => (
                          <option key={key} value={key}>
                            {func.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    {funciones && funciones[funcionSeleccionada] && (
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <div className="text-sm text-purple-700">
                          <span className="font-medium">Función:</span> {funciones[funcionSeleccionada].formula}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Controles de límites */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-blue-800">
                      Límites de Integración
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Límite a: {limiteA.toFixed(1)}
                        </label>
                        <Slider
                          value={[limiteA]}
                          onValueChange={(value) => handleLimitesChange(value[0], limiteB)}
                          min={-5}
                          max={5}
                          step={0.1}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Límite b: {limiteB.toFixed(1)}
                        </label>
                        <Slider
                          value={[limiteB]}
                          onValueChange={(value) => handleLimitesChange(limiteA, value[0])}
                          min={-5}
                          max={5}
                          step={0.1}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Controles de posición */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-green-800">
                      Posición Actual
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Posición x: {posicionX.toFixed(2)}
                      </label>
                      <Slider
                        value={[posicionX]}
                        onValueChange={(value) => handlePosicionXChange(value[0])}
                        min={limiteA}
                        max={limiteB}
                        step={0.001}
                        className="w-full"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Controles de animación */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-orange-800">
                      Animación
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <Button
                        onClick={handleAnimacionToggle}
                        variant={animacionActiva ? "destructive" : "default"}
                        size="sm"
                      >
                        {animacionActiva ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                        {animacionActiva ? 'Pausar' : 'Iniciar'}
                      </Button>
                      
                      <Button
                        onClick={handleReiniciar}
                        variant="outline"
                        size="sm"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reiniciar
                      </Button>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Velocidad: {velocidadAnimacion.toFixed(1)}x
                      </label>
                      <Slider
                        value={[velocidadAnimacion]}
                        onValueChange={(value) => setVelocidadAnimacion(value[0])}
                        min={0.1}
                        max={3}
                        step={0.1}
                        className="w-full"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Gráficas */}
              <div className="space-y-6">
                {/* Gráfica del Puente Mágico */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-purple-800">
                      🌉 El Puente del Hada Matemática
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <canvas
                        ref={canvasPuenteRef}
                        width={800}
                        height={400}
                        className="border border-gray-200 rounded-lg bg-white cursor-default w-full"
                        onMouseMove={handleMouseMovePuente}
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

                {/* Gráfica Cartesiana */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-blue-800">
                      📊 Visualización Interactiva del Teorema
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <canvas
                        ref={canvasCartesianoRef}
                        width={800}
                        height={400}
                        className="border border-gray-200 rounded-lg bg-white cursor-crosshair w-full"
                        onMouseMove={handleMouseMoveCartesiano}
                        onMouseLeave={handleMouseLeave}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Cálculos y resultados */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-green-800">
                  📈 Cálculos y Verificación
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div ref={containerCalculosRef} className="space-y-4">
                  {calculos && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-sm text-blue-600 font-medium">f(x)</div>
                        <div className="text-lg font-bold text-blue-800">
                          {calculos.valorFuncion?.toFixed(4) || '0.0000'}
                        </div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-sm text-green-600 font-medium">F(x)</div>
                        <div className="text-lg font-bold text-green-800">
                          {calculos.integralAcumulada?.toFixed(4) || '0.0000'}
                        </div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-sm text-purple-600 font-medium">F'(x)</div>
                        <div className="text-lg font-bold text-purple-800">
                          {calculos.derivadaIntegral?.toFixed(4) || '0.0000'}
                        </div>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <div className="text-sm text-orange-600 font-medium">Diferencia</div>
                        <div className="text-lg font-bold text-orange-800">
                          {calculos.diferenciaVerificacion?.toFixed(6) || '0.000000'}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {calculos && (
                    <div className="text-center">
                      <Badge 
                        variant={calculos.verificacionExitosa ? "default" : "destructive"}
                        className="text-lg px-4 py-2"
                      >
                        {calculos.verificacionExitosa ? (
                          <>
                            <CheckCircle2 className="w-5 h-5 mr-2" />
                            ✅ Teorema Verificado
                          </>
                        ) : (
                          <>
                            <XCircle className="w-5 h-5 mr-2" />
                            ❌ Teorema No Verificado
                          </>
                        )}
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Logros */}
            {logros && logros.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-yellow-800">
                    🏆 Logros Desbloqueados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {logros.map((logro, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                        <span className="text-2xl">{logro.icono}</span>
                        <div>
                          <div className="font-medium text-yellow-800">{logro.nombre}</div>
                          <div className="text-sm text-yellow-600">{logro.descripcion}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="teoria" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-blue-900">
                  📚 Teoría del Primer Teorema Fundamental del Cálculo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="prose max-w-none">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    ¿Qué establece el teorema?
                  </h3>
                  <p className="text-gray-700 mb-4">
                    El Primer Teorema Fundamental del Cálculo establece que si f(t) es una función continua 
                    en el intervalo [a,b], y definimos:
                  </p>
                  
                  <div className="bg-gray-100 p-4 rounded-lg text-center my-6">
                    <div className="text-2xl font-bold text-blue-800">
                      F(x) = ∫[a,x] f(t)dt
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4">
                    Entonces F(x) es diferenciable en (a,b) y:
                  </p>
                  
                  <div className="bg-gray-100 p-4 rounded-lg text-center my-6">
                    <div className="text-2xl font-bold text-green-800">
                      F'(x) = f(x)
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 mt-8">
                    Interpretación Geométrica
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li><strong>F(x):</strong> Representa el área acumulada bajo la curva desde 'a' hasta 'x'</li>
                    <li><strong>F'(x):</strong> Es la pendiente de F(x) en el punto x</li>
                    <li><strong>f(x):</strong> Es la altura de la función en x</li>
                    <li><strong>Conexión:</strong> La pendiente del área = altura de la función</li>
                  </ul>
                  
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 mt-8">
                    Metáfora del Puente Mágico
                  </h3>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                      <li><strong>f(x):</strong> Altura del puente en cada punto</li>
                      <li><strong>F(x):</strong> Área total de madera usada hasta x</li>
                      <li><strong>F'(x):</strong> Velocidad de construcción en x</li>
                      <li><strong>Magia:</strong> Velocidad = Altura del puente</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ejemplos" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-green-900">
                  🔬 Ejemplos Prácticos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                      Ejemplo 1: Función Lineal
                    </h3>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-gray-700 mb-2"><strong>Función:</strong> f(x) = 2x</p>
                      <p className="text-gray-700 mb-2"><strong>Integral:</strong> F(x) = x²</p>
                      <p className="text-gray-700 mb-2"><strong>Verificación:</strong> F'(x) = 2x = f(x) ✅</p>
                      <p className="text-gray-700"><strong>Interpretación:</strong> Construcción lineal del puente</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                      Ejemplo 2: Función Cuadrática
                    </h3>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-gray-700 mb-2"><strong>Función:</strong> f(x) = 3x²</p>
                      <p className="text-gray-700 mb-2"><strong>Integral:</strong> F(x) = x³</p>
                      <p className="text-gray-700 mb-2"><strong>Verificación:</strong> F'(x) = 3x² = f(x) ✅</p>
                      <p className="text-gray-700"><strong>Interpretación:</strong> Construcción acelerada del puente</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                      Ejemplo 3: Función Trigonométrica
                    </h3>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <p className="text-gray-700 mb-2"><strong>Función:</strong> f(x) = cos(x)</p>
                      <p className="text-gray-700 mb-2"><strong>Integral:</strong> F(x) = sin(x)</p>
                      <p className="text-gray-700 mb-2"><strong>Verificación:</strong> F'(x) = cos(x) = f(x) ✅</p>
                      <p className="text-gray-700"><strong>Interpretación:</strong> Construcción ondulante del puente</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

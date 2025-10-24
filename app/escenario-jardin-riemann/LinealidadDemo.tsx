"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"

// Importar las clases OOP
import { EscenarioFactory } from "@/src/escenarios/EscenarioFactory"
import { EstadoLinealidad } from "@/src/entidades/EstadoLinealidad"
import { ConfiguracionLinealidad } from "@/src/entidades/ConfiguracionLinealidad"
import { CalculadoraLinealidad } from "@/src/servicios/CalculadoraLinealidad"
import { VerificadorLinealidad } from "@/src/servicios/VerificadorLinealidad"
import { GestorVisualizacionLinealidad } from "@/src/servicios/GestorVisualizacionLinealidad"
import { RenderizadorGraficoLinealidad } from "@/src/presentacion/RenderizadorGraficoLinealidad"
import { RenderizadorCalculosLinealidad } from "@/src/presentacion/RenderizadorCalculosLinealidad"
import { TransformadorCoordenadas } from "@/src/servicios/TransformadorCoordenadas"

interface LinealidadDemoProps {
  onBack: () => void
}

export default function LinealidadDemo({ onBack }: LinealidadDemoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerCalculosRef = useRef<HTMLDivElement>(null)
  const containerTooltipRef = useRef<HTMLDivElement>(null)
  
  // Referencias a las clases OOP
  const escenarioFactory = useRef<EscenarioFactory | null>(null)
  const escenarioLinealidad = useRef<any>(null)
  const estado = useRef<EstadoLinealidad | null>(null)
  const configuracion = useRef<ConfiguracionLinealidad | null>(null)
  const calculadora = useRef<CalculadoraLinealidad | null>(null)
  const verificador = useRef<VerificadorLinealidad | null>(null)
  const gestorVisualizacion = useRef<GestorVisualizacionLinealidad | null>(null)
  const renderizadorGrafico = useRef<RenderizadorGraficoLinealidad | null>(null)
  const renderizadorCalculos = useRef<RenderizadorCalculosLinealidad | null>(null)

  // Estado React
  const [fFuncion, setFFuncion] = useState("x")
  const [gFuncion, setGFuncion] = useState("x²")
  const [alpha, setAlpha] = useState(2)
  const [beta, setBeta] = useState(1)
  const [limiteA, setLimiteA] = useState(0)
  const [limiteB, setLimiteB] = useState(2)
  const [calculos, setCalculos] = useState<any>(null)
  const [validacion, setValidacion] = useState<any>(null)

  // Inicializar clases OOP
  useEffect(() => {
    try {
      // Crear instancias
      estado.current = new EstadoLinealidad()
      configuracion.current = new ConfiguracionLinealidad()
      calculadora.current = new CalculadoraLinealidad()
      verificador.current = new VerificadorLinealidad()
      gestorVisualizacion.current = new GestorVisualizacionLinealidad()
      
      // Crear escenario usando Factory
      escenarioFactory.current = new EscenarioFactory()
      escenarioLinealidad.current = escenarioFactory.current.crearEscenario('propiedades-linealidad')
      
      // Configurar canvas
      if (canvasRef.current && containerCalculosRef.current) {
        // Configurar canvas con tooltip opcional
        // @ts-ignore - TypeScript es muy estricto con los tipos aquí
        escenarioLinealidad.current.configurarCanvas(
          canvasRef.current, 
          containerCalculosRef.current,
          containerTooltipRef.current
        )
        
        // Obtener renderizadores
        renderizadorGrafico.current = escenarioLinealidad.current.renderizadorGrafico
        renderizadorCalculos.current = escenarioLinealidad.current.renderizadorCalculos
        
        // Configurar gestor de visualización
        gestorVisualizacion.current.inicializar(
          estado.current,
          configuracion.current,
          calculadora.current,
          verificador.current,
          renderizadorGrafico.current,
          renderizadorCalculos.current
        )
        
        // Renderizar inicial
        renderizar()
      }
    } catch (error) {
      // Error al inicializar linealidad
    }
  }, [])

  // Actualizar cuando cambian los valores
  useEffect(() => {
    if (gestorVisualizacion.current && estado.current) {
      // Actualizar estado
      estado.current.actualizarFFuncion(fFuncion)
      estado.current.actualizarGFuncion(gFuncion)
      estado.current.actualizarAlpha(alpha)
      estado.current.actualizarBeta(beta)
      estado.current.actualizarLimiteA(limiteA)
      estado.current.actualizarLimiteB(limiteB)
      
      // Recalcular y renderizar
      gestorVisualizacion.current.recalcularYRenderizar()
      
      // Actualizar estado React
      const nuevosCalculos = gestorVisualizacion.current.obtenerCalculos()
      const nuevaValidacion = gestorVisualizacion.current.obtenerValidacion()
      setCalculos(nuevosCalculos)
      setValidacion(nuevaValidacion)
    }
  }, [fFuncion, gFuncion, alpha, beta, limiteA, limiteB])

  // Renderizar cuando el canvas esté listo
  useEffect(() => {
    if (canvasRef.current && renderizadorGrafico.current && estado.current) {
      // Forzar re-renderizado
      setTimeout(() => {
        renderizar()
      }, 100)
    }
  }, [canvasRef.current, renderizadorGrafico.current, estado.current])

  const renderizar = () => {
    if (gestorVisualizacion.current) {
      gestorVisualizacion.current.renderizar()
    }
  }

  const funcionesDisponibles = [
    { value: "x", label: "x" },
    { value: "x²", label: "x²" },
    { value: "x³", label: "x³" },
    { value: "sin(x)", label: "sin(x)" },
    { value: "cos(x)", label: "cos(x)" },
    { value: "√x", label: "√x" },
    { value: "eˣ", label: "eˣ" }
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-[95vw] w-full mx-4 max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" onClick={onBack}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver al Jardín
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Linealidad</h1>
                  <p className="text-sm text-gray-600">
                    La integral de una combinación lineal es igual a la combinación lineal de las integrales
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Panel de Controles */}
            <div className="lg:col-span-1">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <span className="text-purple-600 mr-2">🪄</span>
                  Controles Mágicos
                </h3>
                
                <div className="space-y-4">
                  {/* Función f(x) */}
                  <div>
                    <Label htmlFor="f-funcion">Función f(x):</Label>
                    <Select value={fFuncion} onValueChange={setFFuncion}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {funcionesDisponibles.map((func) => (
                          <SelectItem key={func.value} value={func.value}>
                            {func.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Función g(x) */}
                  <div>
                    <Label htmlFor="g-funcion">Función g(x):</Label>
                    <Select value={gFuncion} onValueChange={setGFuncion}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {funcionesDisponibles.map((func) => (
                          <SelectItem key={func.value} value={func.value}>
                            {func.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Coeficiente α */}
                  <div>
                    <Label htmlFor="alpha">Coeficiente α (alpha): {alpha}</Label>
                    <Slider
                      value={[alpha]}
                      onValueChange={(value) => setAlpha(value[0])}
                      min={-5}
                      max={5}
                      step={0.1}
                      className="mt-2"
                    />
                  </div>

                  {/* Coeficiente β */}
                  <div>
                    <Label htmlFor="beta">Coeficiente β (beta): {beta}</Label>
                    <Slider
                      value={[beta]}
                      onValueChange={(value) => setBeta(value[0])}
                      min={-5}
                      max={5}
                      step={0.1}
                      className="mt-2"
                    />
                  </div>

                  {/* Límites */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="limite-a">Límite inferior (a):</Label>
                      <Input
                        type="number"
                        value={limiteA}
                        onChange={(e) => setLimiteA(Number(e.target.value))}
                        step={0.1}
                      />
                    </div>
                    <div>
                      <Label htmlFor="limite-b">Límite superior (b):</Label>
                      <Input
                        type="number"
                        value={limiteB}
                        onChange={(e) => setLimiteB(Number(e.target.value))}
                        step={0.1}
                      />
                    </div>
                  </div>

                  {/* Botón Salir */}
                  <div className="pt-2">
                    <Button 
                      variant="destructive" 
                      className="w-full"
                      onClick={onBack}
                    >
                      Salir
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Panel de Visualización */}
            <div className="lg:col-span-2">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <span className="text-purple-600 mr-2">⭐</span>
                  Visualización Mágica
                </h3>
                
                <div className="bg-gray-50 rounded-lg p-4 relative">
                  <canvas
                    ref={canvasRef}
                    width={800}
                    height={500}
                    className="border border-gray-200 rounded cursor-crosshair w-full"
                  />
                  {/* Container para tooltip */}
                  <div 
                    ref={containerTooltipRef}
                    className="absolute inset-0 pointer-events-none"
                  />
                </div>
              </Card>

              {/* Panel de Cálculos */}
              <div className="mt-6">
                <div ref={containerCalculosRef} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Los cálculos se renderizarán aquí por las clases OOP */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Play, Pause, RotateCcw, Settings, BookOpen, Lightbulb, FlaskConical, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"

import { EscenarioFactory } from "@/src/escenarios/EscenarioFactory"
import { TransformadorCoordenadas } from "@/src/servicios/TransformadorCoordenadas"
import { RenderizadorCanvas } from "@/src/presentacion/RenderizadorCanvas"
import { RenderizadorEjes } from "@/src/presentacion/RenderizadorEjes"
import { RenderizadorFuncion } from "@/src/presentacion/RenderizadorFuncion"
import { RenderizadorRectangulos } from "@/src/presentacion/RenderizadorRectangulos"
import { RenderizadorPuntos } from "@/src/presentacion/RenderizadorPuntos"
import { GestorInteraccion } from "@/src/interaccion/GestorInteraccion"
import { PuntoInteractivo } from "@/src/entidades/PuntoInteractivo"
import { CalculadoraRiemann } from "@/src/servicios/CalculadoraRiemann"
import LinealidadDemo from "./LinealidadDemo"

export default function JardinRiemannPage() {
  const router = useRouter()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Factory para manejar escenarios
  const escenarioFactory = useRef(new EscenarioFactory())
  const escenario = useRef(escenarioFactory.current.crearEscenario('jardin-riemann'))

  // Estado React para UI
  const [funcionActual, setFuncionActual] = useState("parabola")
  const [aproximacionRiemann, setAproximacionRiemann] = useState(0)
  const [integralExacta, setIntegralExacta] = useState(0)
  const [errorAbsoluto, setErrorAbsoluto] = useState(0)
  const [precision, setPrecision] = useState(0)
  const [logros, setLogros] = useState<any[]>([])
  const [metricas, setMetricas] = useState<any>({})
  const [, setForceUpdate] = useState(0)

  // Estado para propiedades mágicas
  const [mostrarPropiedades, setMostrarPropiedades] = useState(false)
  const [propiedadSeleccionada, setPropiedadSeleccionada] = useState<string | null>(null)
  const [mostrarLinealidad, setMostrarLinealidad] = useState(false)

  // Referencias para renderizado
  const gestorInteraccion = useRef<GestorInteraccion | null>(null)
  const calculadoraRiemann = useRef(new CalculadoraRiemann())

  // Manejar selección de propiedad mágica
  useEffect(() => {
    if (propiedadSeleccionada === 'linealidad') {
      setMostrarLinealidad(true)
      setPropiedadSeleccionada(null)
    } else if (propiedadSeleccionada === 'aditividad') {
      // Redirigir a la página de aditividad
      window.location.href = '/escenario-jardin-riemann/aditividad'
    } else if (propiedadSeleccionada === 'inversion') {
      // Redirigir a la página de inversión de límites
      window.location.href = '/escenario-jardin-riemann/inversion-limites'
    } else if (propiedadSeleccionada === 'comparacion') {
      // Redirigir a la página de comparación
      window.location.href = '/escenario-jardin-riemann/comparacion'
    }
  }, [propiedadSeleccionada])

  // Inicializar escenario
  useEffect(() => {
    if (!canvasRef.current) return

    // Cambiar función en el escenario si es necesario
    if (escenario.current && escenario.current.funcionActual !== funcionActual) {
      escenario.current.cambiarFuncion(funcionActual)
    }

    // Configurar interacción
    if (!escenario.current || !escenario.current.estado) return
    
    const intervaloX = escenario.current.estado.obtenerIntervalo()
    const intervaloY = { min: -1, max: 10 }
    const transformador = new TransformadorCoordenadas(escenario.current.configuracion, intervaloX, intervaloY)

    gestorInteraccion.current = new GestorInteraccion(canvasRef.current, transformador)
    // Type assertion to bypass callback type restrictions
    const callbacks = gestorInteraccion.current.callbacks as any
    callbacks.onLimiteIzquierdoCambiado = (x: number) => {
      if (escenario.current && escenario.current.estado) {
        escenario.current.actualizarLimites(x, escenario.current.estado.limiteDerecho)
        actualizarUI()
      }
    }
    callbacks.onLimiteDerechoCambiado = (x: number) => {
      if (escenario.current && escenario.current.estado) {
        escenario.current.actualizarLimites(escenario.current.estado.limiteIzquierdo, x)
        actualizarUI()
      }
    }

    // Agregar puntos interactivos
    const puntoIzq = transformador.matematicasACanvas(escenario.current.estado.limiteIzquierdo, 0)
    const puntoDer = transformador.matematicasACanvas(escenario.current.estado.limiteDerecho, 0)
    gestorInteraccion.current.agregarPunto(new PuntoInteractivo(puntoIzq.x, puntoIzq.y, "limite-izquierdo"))
    gestorInteraccion.current.agregarPunto(new PuntoInteractivo(puntoDer.x, puntoDer.y, "limite-derecho"))

    actualizarUI()
  }, [funcionActual])

  const actualizarUI = () => {
    if (!escenario.current) return
    
    const datos = escenario.current.obtenerDatos()
    setAproximacionRiemann(datos.resultados.aproximacionRiemann)
    setIntegralExacta(datos.resultados.integralExacta)
    setErrorAbsoluto(datos.resultados.errorAbsoluto)
    setPrecision(datos.resultados.precision)
    setLogros(datos.logros)
    setMetricas(datos.metricas)
    renderizar()
  }

  const renderizar = () => {
    if (!canvasRef.current || !escenario.current || !escenario.current.estado || !escenario.current.estado.funcion) return

    const intervalo = escenario.current.estado.obtenerIntervalo()
    const intervaloY = { min: -1, max: 10 }
    const transformador = new TransformadorCoordenadas(escenario.current.configuracion, intervalo, intervaloY)

    // Crear renderizadores
    const renderizadorCanvas = new RenderizadorCanvas(canvasRef.current, escenario.current.configuracion)
    const renderizadorEjes = new RenderizadorEjes(escenario.current.configuracion, transformador)
    const renderizadorFuncion = new RenderizadorFuncion(escenario.current.estado.funcion, transformador, escenario.current.configuracion)

    const tipoAproximacion =
      escenario.current.estado.tipoHechizo === "izquierdo" ? "izquierda" : 
      escenario.current.estado.tipoHechizo === "derecho" ? "derecha" : "punto-medio"
    const rectangulos = calculadoraRiemann.current.generarRectangulos(
      escenario.current.estado.funcion,
      intervalo,
      escenario.current.estado.numeroMacetas,
      tipoAproximacion,
    )
    const renderizadorRectangulos = new RenderizadorRectangulos(rectangulos, transformador, escenario.current.configuracion)

    const puntos = gestorInteraccion.current?.obtenerPuntos() || []
    const renderizadorPuntos = new RenderizadorPuntos(puntos, transformador)

    // Renderizar todo
    renderizadorCanvas.renderizar([renderizadorEjes, renderizadorRectangulos, renderizadorFuncion, renderizadorPuntos])
  }

  const toggleAnimacion = () => {
    escenario.current.toggleAnimacion()
    actualizarUI()
    setForceUpdate((n) => n + 1)
  }

  const reiniciar = () => {
    if (escenario.current) {
      escenario.current.reiniciar()
      actualizarUI()
    }
  }

  const nombresFunciones = {
    parabola: "Parábola Mágica",
    seno: "Onda Senoidal",
    cubica: "Curva Cúbica",
  }

  const expresionesFunciones = {
    parabola: "f(x) = 0.5x^2 + 1",
    seno: "f(x) = 2sin(x) + 3",
    cubica: "f(x) = 0.1x^3 + 0.5x^2 + 2",
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <header className="bg-white border-b border-green-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white text-xl">
              🌸
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">El Jardín Mágico de Riemann</h1>
              <p className="text-sm text-green-600">
                Aprende integrales definidas plantando macetas mágicas con el Hada Aria
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              className="gap-2 bg-transparent hover:bg-gray-50"
              onClick={() => router.push('/')}
            >
              <Home className="h-4 w-4 text-gray-600" />
              Ir al Inicio
            </Button>
            <Button 
              variant="outline" 
              className="gap-2 bg-transparent"
              onClick={() => setMostrarPropiedades(true)}
            >
              <span className="text-purple-600">✨</span>
              Propiedades Mágicas
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <Tabs defaultValue="visualizacion" className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
            <TabsTrigger value="teoria" className="gap-2">
              <BookOpen className="w-4 h-4" />
              Teoría
            </TabsTrigger>
            <TabsTrigger value="visualizacion" className="gap-2">
              <Lightbulb className="w-4 h-4" />
              Visualización
            </TabsTrigger>
            <TabsTrigger value="ejemplos" className="gap-2">
              <FlaskConical className="w-4 h-4" />
              Ejemplos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="visualizacion" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Panel Izquierdo */}
              <div className="space-y-6">
                {/* Función Actual */}
                <Card className="p-6 bg-white border-2 border-green-200">
                  <div className="text-center space-y-3">
                    <div className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium">
                      Función Actual:
                    </div>
                    <div className="text-2xl font-bold text-gray-800">
                      {expresionesFunciones[funcionActual as keyof typeof expresionesFunciones]}
                    </div>
                    <div className="text-sm text-green-600">
                      {nombresFunciones[funcionActual as keyof typeof nombresFunciones]}
                    </div>
                    <div className="pt-3 border-t border-green-100">
                      <div className="text-sm text-gray-600 mb-1">Integral Definida:</div>
                      <div className="text-lg font-mono text-blue-600">
                        integral[{escenario.current?.estado?.limiteIzquierdo?.toFixed(1) || '0.0'}, {escenario.current?.estado?.limiteDerecho?.toFixed(1) || '0.0'}] f(x)dx
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                    <span className="font-medium">💡 Tip:</span> Arrastra los puntos rojos y azules para cambiar los
                    límites de integración
                  </div>
                </Card>
              </div>

              {/* Canvas Central */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="p-6 bg-white">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Visualización Mágica</h3>
                  <div className="relative">
                    <canvas
                      ref={canvasRef}
                      width={800}
                      height={500}
                      className="w-full border-2 border-green-200 rounded-lg bg-green-50"
                    />
                  </div>
                </Card>

                {/* Métricas */}
                <div className="grid grid-cols-3 gap-4">
                  <Card className="p-4 bg-blue-50 border-2 border-blue-200">
                    <div className="text-sm text-blue-600 mb-1">Aproximación de Riemann</div>
                    <div className="text-3xl font-bold text-blue-700">{aproximacionRiemann.toFixed(4)}</div>
                    <div className="text-xs text-blue-500 mt-1">Σf(xi) con {escenario.current?.estado?.numeroMacetas || 0} macetas</div>
                  </Card>
                  <Card className="p-4 bg-green-50 border-2 border-green-200">
                    <div className="text-sm text-green-600 mb-1">Integral Exacta</div>
                    <div className="text-3xl font-bold text-green-700">{integralExacta.toFixed(4)}</div>
                    <div className="text-xs text-green-500 mt-1">Teorema Fundamental del Cálculo</div>
                  </Card>
                  <Card className="p-4 bg-purple-50 border-2 border-purple-200">
                    <div className="text-sm text-purple-600 mb-1">Error</div>
                    <div className="text-3xl font-bold text-purple-700">{errorAbsoluto.toFixed(6)}</div>
                    <div className="text-xs text-purple-500 mt-1">Aproximación - Exacta</div>
                  </Card>
                </div>

                {/* Verificación y Logros */}
                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4 bg-blue-50">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">
                        ✓
                      </div>
                      <h4 className="font-bold text-blue-900">Verificación Mágica</h4>
                      <span className="ml-auto text-sm text-blue-600">0:40</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Precisión</span>
                        <span className="font-bold text-blue-600">{precision.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-blue-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${precision}%` }} />
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-2">
                        <div className="text-center">
                          <div className="text-xs text-gray-600">Tu Aproximación</div>
                          <div className="font-bold text-blue-700">{aproximacionRiemann.toFixed(4)}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-600">Valor Exacto</div>
                          <div className="font-bold text-green-700">{integralExacta.toFixed(4)}</div>
                        </div>
                      </div>
                      <div className="text-center pt-2">
                        <div className="text-xs text-gray-600">Error Absoluto</div>
                        <div className="font-bold text-purple-700">{errorAbsoluto.toFixed(6)}</div>
                      </div>
                      <div className="mt-3 p-2 bg-blue-100 rounded text-center text-sm text-blue-800 font-medium">
                        {precision > 99
                          ? "¡BIEN! Vas por buen camino, intenta con más macetas"
                          : "Aumenta las macetas para mejorar"}
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 bg-yellow-50">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center text-white">
                        🏆
                      </div>
                      <h4 className="font-bold text-yellow-900">Logros del Jardín Mágico</h4>
                    </div>
                    <div className="space-y-2">
                      {logros.map((logro) => (
                        <div
                          key={logro.id}
                          className={`p-2 rounded-lg border-2 ${
                            logro.desbloqueado
                              ? "bg-green-100 border-green-300"
                              : "bg-gray-100 border-gray-200 opacity-50"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{logro.icono}</span>
                            <div className="flex-1">
                              <div className="font-bold text-sm">{logro.nombre}</div>
                              <div className="text-xs text-gray-600">{logro.descripcion}</div>
                            </div>
                            {logro.desbloqueado && <span className="text-green-600">✓</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>
            </div>

            {/* Panel Derecho - Controles */}
            <Card className="p-6 bg-white">
              <div className="space-y-6">
                {/* Modo de Aprendizaje */}
                <div>
                  <h4 className="font-bold text-gray-800 mb-3">Modo de Aprendizaje</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={escenario.current?.estado?.modoAprendizaje === "guiado" ? "default" : "outline"}
                      onClick={() => {
                        escenario.current.cambiarModoAprendizaje("guiado")
                        actualizarUI()
                        setForceUpdate((n) => n + 1)
                      }}
                      className="gap-2"
                    >
                      📚 Guiado
                    </Button>
                    <Button
                      variant={escenario.current?.estado?.modoAprendizaje === "libre" ? "default" : "outline"}
                      onClick={() => {
                        escenario.current.cambiarModoAprendizaje("libre")
                        actualizarUI()
                        setForceUpdate((n) => n + 1)
                      }}
                      className="gap-2 bg-green-600 hover:bg-green-700"
                    >
                      ✨ Libre
                    </Button>
                  </div>
                </div>

                {/* Función del Jardín */}
                <div>
                  <h4 className="font-bold text-gray-800 mb-3">Función del Jardín</h4>
                  <div className="space-y-2">
                    {Object.entries(nombresFunciones).map(([key, nombre]) => (
                      <Button
                        key={key}
                        variant={funcionActual === key ? "default" : "outline"}
                        onClick={() => {
                          setFuncionActual(key)
                          escenario.current.cambiarFuncion(key)
                          actualizarUI()
                        }}
                        className={`w-full justify-start gap-2 ${funcionActual === key ? "bg-green-600" : ""}`}
                      >
                        <span>{key === "parabola" ? "🌱" : key === "seno" ? "🌊" : "🌿"}</span>
                        {nombre}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Número de Macetas */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-bold text-gray-800">Número de Macetas</h4>
                    <span className="text-2xl font-bold text-green-600">{escenario.current?.estado?.numeroMacetas || 0}</span>
                  </div>
                  <Slider
                    value={[escenario.current?.estado?.numeroMacetas || 0]}
                    onValueChange={([value]) => {
                      if (escenario.current) {
                        escenario.current.actualizarMacetas(value)
                        actualizarUI()
                      setForceUpdate((n) => n + 1)
                      }
                    }}
                    min={1}
                    max={50}
                    step={1}
                    className="mb-2"
                  />
                  <Button variant="destructive" size="sm" className="w-full">
                    Sembrar
                  </Button>
                </div>

                {/* Animación */}
                <div>
                  <h4 className="font-bold text-gray-800 mb-3">Animación</h4>
                  <Button onClick={toggleAnimacion} className="w-full gap-2 bg-green-600 hover:bg-green-700">
                    {escenario.current.gestorAnimacion.estaActiva() ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                    {escenario.current.gestorAnimacion.estaActiva() ? "Pausar" : "Play"}
                  </Button>
                  <div className="mt-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Velocidad</span>
                      <span className="text-gray-800">{escenario.current?.estado?.velocidadAnimacion?.toFixed(1) || '1.0'}x</span>
                    </div>
                    <Slider
                      value={[escenario.current?.estado?.velocidadAnimacion || 1.0]}
                      onValueChange={([value]) => {
                        if (escenario.current) {
                          escenario.current.actualizarVelocidadAnimacion(value)
                          actualizarUI()
                        setForceUpdate((n) => n + 1)
                        }
                      }}
                      min={0.1}
                      max={5}
                      step={0.1}
                    />
                  </div>
                </div>

                {/* Controles del Jardín */}
                <div>
                  <h4 className="font-bold text-gray-800 mb-3">Controles del Jardín</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Límite Izquierdo</span>
                        <span className="text-gray-800">{escenario.current?.estado?.limiteIzquierdo?.toFixed(1) || '0.0'}</span>
                      </div>
                      <Slider
                        value={[escenario.current?.estado?.limiteIzquierdo || 0]}
                        onValueChange={([value]) => {
                          if (escenario.current && escenario.current.estado) {
                            escenario.current.actualizarLimites(value, escenario.current.estado.limiteDerecho)
                            actualizarUI()
                          setForceUpdate((n) => n + 1)
                          }
                        }}
                        min={-10}
                        max={0}
                        step={0.1}
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Límite Derecho</span>
                        <span className="text-gray-800">{escenario.current?.estado?.limiteDerecho?.toFixed(1) || '0.0'}</span>
                      </div>
                      <Slider
                        value={[escenario.current?.estado?.limiteDerecho || 0]}
                        onValueChange={([value]) => {
                          if (escenario.current && escenario.current.estado) {
                            escenario.current.actualizarLimites(escenario.current.estado.limiteIzquierdo, value)
                            actualizarUI()
                          setForceUpdate((n) => n + 1)
                          }
                        }}
                        min={0}
                        max={10}
                        step={0.1}
                      />
                    </div>
                  </div>
                </div>

                {/* Tipo de Hechizo */}
                <div>
                  <h4 className="font-bold text-gray-800 mb-3">Tipo de Hechizo</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {["izquierdo", "derecho", "central"].map((tipo) => (
                      <Button
                        key={tipo}
                        variant={escenario.current?.estado?.tipoHechizo === tipo ? "default" : "outline"}
                        onClick={() => {
                          escenario.current.cambiarTipoHechizo(tipo)
                          actualizarUI()
                          setForceUpdate((n) => n + 1)
                        }}
                        className={`text-xs ${escenario.current?.estado?.tipoHechizo === tipo ? "bg-green-600" : ""}`}
                      >
                        {tipo === "izquierdo" ? "⬅️ Izq" : tipo === "derecho" ? "➡️ Der" : "⬆️ Central"}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                  <span className="font-medium">💡</span> Arrastra los puntos rojos y azules en el gráfico
                </div>

                {/* Botones de acción */}
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 gap-2 bg-transparent">
                    <Settings className="w-4 h-4" />
                    Configuración
                  </Button>
                  <Button onClick={reiniciar} variant="outline" className="flex-1 gap-2 bg-transparent">
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="teoria">
            <div className="space-y-6">
              {/* Teoría de Riemann */}
              <Card className="p-6">
                <div className="teoria-container">
                  <h2 className="text-2xl font-bold mb-4 text-green-800">{escenario.current.obtenerTeoria('riemann')?.titulo}</h2>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">Definición</h3>
                    <p className="text-gray-700 mb-4">{escenario.current.obtenerTeoria('riemann')?.definicion}</p>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">Fórmula</h3>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <code className="text-lg font-mono text-blue-800">{escenario.current.obtenerTeoria('riemann')?.formula}</code>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">Símbolos</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      {Object.entries(escenario.current.obtenerTeoria('riemann')?.simbolos || {}).map(([simbolo, descripcion], index: number, array: any[]) => (
                        <div key={simbolo} className={`flex justify-between py-1 ${index < array.length - 1 ? 'border-b border-gray-200' : ''}`}>
                          <code className="font-mono text-blue-600">{simbolo}</code>
                          <span className="text-gray-700">{descripcion as string}</span>
                      </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">Tipos de Aproximación</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {Object.entries(escenario.current.obtenerTeoria('riemann')?.tiposAproximacion || {}).map(([tipo, descripcion], index: number) => {
                        const colors = ['green', 'blue', 'purple']
                        const color = colors[index % colors.length]
                        return (
                          <div key={tipo} className={`bg-${color}-50 p-4 rounded-lg border border-${color}-200`}>
                            <h4 className={`font-semibold text-${color}-800 mb-2 capitalize`}>{tipo}</h4>
                            <p className="text-sm text-gray-700">{descripcion as string}</p>
                      </div>
                        )
                      })}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">Ventajas</h3>
                    <ul className="list-none">
                      {escenario.current.obtenerTeoria('riemann')?.ventajas?.map((ventaja: string, index: number) => (
                        <li key={index} className="text-green-700 mb-1">✓ {ventaja}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">Limitaciones</h3>
                    <ul className="list-none">
                      {escenario.current.obtenerTeoria('riemann')?.limitaciones?.map((limitacion: string, index: number) => (
                        <li key={index} className="text-red-700 mb-1">⚠ {limitacion}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>

              {/* Propiedades de las Integrales */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Aditividad */}
                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-blue-800">{escenario.current.obtenerTeoria('aditividad')?.titulo}</h3>
                  <p className="text-gray-700 mb-4">{escenario.current.obtenerTeoria('aditividad')?.definicion}</p>
                  
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
                    <code className="text-lg font-mono text-blue-800">{escenario.current.obtenerTeoria('aditividad')?.formula}</code>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold mb-2 text-gray-800">Condiciones:</h4>
                    <ul className="list-none">
                      {escenario.current.obtenerTeoria('aditividad')?.condiciones?.map((condicion: string, index: number) => (
                        <li key={index} className="text-gray-700 mb-1">• {condicion}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <p className="text-gray-700"><strong>Interpretación:</strong> {escenario.current.obtenerTeoria('aditividad')?.interpretacionGeometrica}</p>
                  </div>
                </Card>

                {/* Comparación */}
                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-purple-800">{escenario.current.obtenerTeoria('comparacion')?.titulo}</h3>
                  <p className="text-gray-700 mb-4">{escenario.current.obtenerTeoria('comparacion')?.definicion}</p>
                  
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 mb-4">
                    <code className="text-lg font-mono text-purple-800">{escenario.current.obtenerTeoria('comparacion')?.formula}</code>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold mb-2 text-gray-800">Condiciones:</h4>
                    <ul className="list-none">
                      {escenario.current.obtenerTeoria('comparacion')?.condiciones?.map((condicion: string, index: number) => (
                        <li key={index} className="text-gray-700 mb-1">• {condicion}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <p className="text-gray-700"><strong>Interpretación:</strong> {escenario.current.obtenerTeoria('comparacion')?.interpretacionGeometrica}</p>
                  </div>
                </Card>

                {/* Inversión de Límites */}
                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-red-800">{escenario.current.obtenerTeoria('inversionLimites')?.titulo}</h3>
                  <p className="text-gray-700 mb-4">{escenario.current.obtenerTeoria('inversionLimites')?.definicion}</p>
                  
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200 mb-4">
                    <code className="text-lg font-mono text-red-800">{escenario.current.obtenerTeoria('inversionLimites')?.formula}</code>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold mb-2 text-gray-800">Condiciones:</h4>
                    <ul className="list-none">
                      {escenario.current.obtenerTeoria('inversionLimites')?.condiciones?.map((condicion: string, index: number) => (
                        <li key={index} className="text-gray-700 mb-1">• {condicion}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <p className="text-gray-700"><strong>Interpretación:</strong> {escenario.current.obtenerTeoria('inversionLimites')?.interpretacionGeometrica}</p>
                  </div>
                </Card>

                {/* Linealidad */}
            <Card className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-green-800">{escenario.current.obtenerTeoria('linealidad')?.titulo}</h3>
                  <p className="text-gray-700 mb-4">{escenario.current.obtenerTeoria('linealidad')?.definicion}</p>
                  
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-4">
                    <code className="text-lg font-mono text-green-800">{escenario.current.obtenerTeoria('linealidad')?.formula}</code>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold mb-2 text-gray-800">Condiciones:</h4>
                    <ul className="list-none">
                      {escenario.current.obtenerTeoria('linealidad')?.condiciones?.map((condicion: string, index: number) => (
                        <li key={index} className="text-gray-700 mb-1">• {condicion}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <p className="text-gray-700"><strong>Interpretación:</strong> {escenario.current.obtenerTeoria('linealidad')?.interpretacionGeometrica}</p>
                  </div>
            </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ejemplos">
            <div className="space-y-6">
              {/* Ejemplo de Riemann */}
              <Card className="p-6">
                <h3 className="text-2xl font-bold mb-4 text-blue-800">{escenario.current.obtenerEjemplo('riemann').titulo}</h3>
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
                  <p className="text-gray-700 mb-2"><strong>Función:</strong> {escenario.current.obtenerEjemplo('riemann').funcion}</p>
                  <p className="text-gray-700 mb-2"><strong>Intervalo:</strong> [{escenario.current.obtenerEjemplo('riemann').intervalo.inicio}, {escenario.current.obtenerEjemplo('riemann').intervalo.fin}]</p>
                  <p className="text-gray-700 mb-2"><strong>Particiones:</strong> {escenario.current.obtenerEjemplo('riemann').particiones}</p>
                  <p className="text-gray-700 mb-2"><strong>Tipo:</strong> Aproximación {escenario.current.obtenerEjemplo('riemann').tipoAproximacion}</p>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold mb-2 text-gray-800">Pasos:</h4>
                  <ol className="list-decimal list-inside">
                    {escenario.current.obtenerEjemplo('riemann').pasos.map((paso: string, index: number) => (
                      <li key={index} className="text-gray-700 mb-2">{paso}</li>
                    ))}
                  </ol>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <p className="text-green-700 font-semibold">{escenario.current.obtenerEjemplo('riemann').resultado}</p>
                </div>
              </Card>

              {/* Ejemplos de Propiedades */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Ejemplo Aditividad */}
                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-blue-800">{escenario.current.obtenerEjemplo('aditividad').titulo}</h3>
                  
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
                    <p className="text-gray-700 mb-2"><strong>Función:</strong> {escenario.current.obtenerEjemplo('aditividad').funcion}</p>
                    <p className="text-gray-700 mb-2"><strong>Intervalo:</strong> [{escenario.current.obtenerEjemplo('aditividad').intervalo.inicio}, {escenario.current.obtenerEjemplo('aditividad').intervalo.fin}]</p>
                    <p className="text-gray-700 mb-2"><strong>Punto intermedio:</strong> {escenario.current.obtenerEjemplo('aditividad').puntoIntermedio}</p>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold mb-2 text-gray-800">Cálculos:</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between py-1 border-b border-gray-200">
                        <span className="text-gray-700">Integral completa:</span>
                        <code className="font-mono text-blue-600">{escenario.current.obtenerEjemplo('aditividad').calculos.integralCompleta}</code>
                      </div>
                      <div className="flex justify-between py-1 border-b border-gray-200">
                        <span className="text-gray-700">Primera parte:</span>
                        <code className="font-mono text-blue-600">{escenario.current.obtenerEjemplo('aditividad').calculos.integral1}</code>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-gray-700">Segunda parte:</span>
                        <code className="font-mono text-blue-600">{escenario.current.obtenerEjemplo('aditividad').calculos.integral2}</code>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <p className="text-green-700 font-semibold">Verificación: {escenario.current.obtenerEjemplo('aditividad').verificacion}</p>
                  </div>
                </Card>

                {/* Ejemplo Comparación */}
                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-purple-800">{escenario.current.obtenerEjemplo('comparacion').titulo}</h3>
                  
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 mb-4">
                    <p className="text-gray-700 mb-2"><strong>{escenario.current.obtenerEjemplo('comparacion').funcion1}</strong></p>
                    <p className="text-gray-700 mb-2"><strong>{escenario.current.obtenerEjemplo('comparacion').funcion2}</strong></p>
                    <p className="text-gray-700 mb-2"><strong>Intervalo:</strong> [{escenario.current.obtenerEjemplo('comparacion').intervalo.inicio}, {escenario.current.obtenerEjemplo('comparacion').intervalo.fin}]</p>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-700 mb-2">{escenario.current.obtenerEjemplo('comparacion').verificacion}</p>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold mb-2 text-gray-800">Cálculos:</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between py-1 border-b border-gray-200">
                        <span className="text-gray-700">{escenario.current.obtenerEjemplo('comparacion').funcion1} dx:</span>
                        <code className="font-mono text-blue-600">{escenario.current.obtenerEjemplo('comparacion').calculos.integral1}</code>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-gray-700">{escenario.current.obtenerEjemplo('comparacion').funcion2} dx:</span>
                        <code className="font-mono text-blue-600">{escenario.current.obtenerEjemplo('comparacion').calculos.integral2}</code>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <p className="text-green-700 font-semibold">Resultado: {escenario.current.obtenerEjemplo('comparacion').resultado}</p>
                  </div>
                </Card>

                {/* Ejemplo Inversión */}
                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-red-800">{escenario.current.obtenerEjemplo('inversionLimites').titulo}</h3>
                  
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200 mb-4">
                    <p className="text-gray-700 mb-2"><strong>Función:</strong> {escenario.current.obtenerEjemplo('inversionLimites').funcion}</p>
                    <p className="text-gray-700 mb-2"><strong>Intervalo original:</strong> [{escenario.current.obtenerEjemplo('inversionLimites').intervaloOriginal.inicio}, {escenario.current.obtenerEjemplo('inversionLimites').intervaloOriginal.fin}]</p>
                    <p className="text-gray-700 mb-2"><strong>Intervalo invertido:</strong> [{escenario.current.obtenerEjemplo('inversionLimites').intervaloInvertido.inicio}, {escenario.current.obtenerEjemplo('inversionLimites').intervaloInvertido.fin}]</p>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold mb-2 text-gray-800">Cálculos:</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between py-1 border-b border-gray-200">
                        <span className="text-gray-700">∫[{escenario.current.obtenerEjemplo('inversionLimites').intervaloOriginal.inicio},{escenario.current.obtenerEjemplo('inversionLimites').intervaloOriginal.fin}] x² dx:</span>
                        <code className="font-mono text-blue-600">{escenario.current.obtenerEjemplo('inversionLimites').calculos.integralOriginal}</code>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-gray-700">∫[{escenario.current.obtenerEjemplo('inversionLimites').intervaloInvertido.inicio},{escenario.current.obtenerEjemplo('inversionLimites').intervaloInvertido.fin}] x² dx:</span>
                        <code className="font-mono text-blue-600">{escenario.current.obtenerEjemplo('inversionLimites').calculos.integralInvertida}</code>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <p className="text-green-700 font-semibold">Verificación: {escenario.current.obtenerEjemplo('inversionLimites').verificacion}</p>
                  </div>
                </Card>

                {/* Ejemplo Linealidad */}
            <Card className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-green-800">{escenario.current.obtenerEjemplo('linealidad').titulo}</h3>
                  
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-4">
                    <p className="text-gray-700 mb-2"><strong>{escenario.current.obtenerEjemplo('linealidad').funcion1}</strong></p>
                    <p className="text-gray-700 mb-2"><strong>{escenario.current.obtenerEjemplo('linealidad').funcion2}</strong></p>
                    <p className="text-gray-700 mb-2"><strong>α = {escenario.current.obtenerEjemplo('linealidad').constante1}, β = {escenario.current.obtenerEjemplo('linealidad').constante2}</strong></p>
                    <p className="text-gray-700 mb-2"><strong>Intervalo:</strong> [{escenario.current.obtenerEjemplo('linealidad').intervalo.inicio}, {escenario.current.obtenerEjemplo('linealidad').intervalo.fin}]</p>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold mb-2 text-gray-800">Cálculos:</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between py-1 border-b border-gray-200">
                        <span className="text-gray-700">Lado izquierdo:</span>
                        <code className="font-mono text-blue-600">{escenario.current.obtenerEjemplo('linealidad').calculos.ladoIzquierdo}</code>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-gray-700">Lado derecho:</span>
                        <code className="font-mono text-blue-600">{escenario.current.obtenerEjemplo('linealidad').calculos.ladoDerecho}</code>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <p className="text-green-700 font-semibold">Verificación: {escenario.current.obtenerEjemplo('linealidad').verificacion}</p>
                  </div>
            </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Mostrar Linealidad Demo */}
      {mostrarLinealidad && (
        <LinealidadDemo onBack={() => setMostrarLinealidad(false)} />
      )}

      {/* Modal de Propiedades Mágicas */}
      {mostrarPropiedades && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Propiedades Mágicas de las Integrales</h2>
              <Button 
                variant="outline" 
                onClick={() => setMostrarPropiedades(false)}
              >
                ✕
              </Button>
            </div>
            
            <p className="text-gray-600 mb-6">
              Explora las cuatro propiedades fundamentales del cálculo integral de forma interactiva
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Linealidad */}
              <Card className="p-6 border-l-4 border-blue-500">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-blue-500 rounded mr-3 flex items-center justify-center">
                    <span className="text-white text-sm">📊</span>
                  </div>
                  <h3 className="text-lg font-semibold">Linealidad</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  La integral de una combinación lineal es igual a la combinación lineal de las integrales.
                </p>
                <div className="bg-gray-100 p-3 rounded mb-4">
                  <code className="text-sm">
                    ∫[a,b] (αf(x) + βg(x)) dx = α∫[a,b] f(x) dx + β∫[a,b] g(x) dx
                  </code>
                </div>
                <Button 
                  className="w-full bg-blue-500 hover:bg-blue-600"
                  onClick={() => {
                    setPropiedadSeleccionada('linealidad')
                    setMostrarPropiedades(false)
                  }}
                >
                  Ver ejemplo interactivo
                </Button>
              </Card>

              {/* Aditividad */}
              <Card className="p-6 border-l-4 border-green-500">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-green-500 rounded mr-3 flex items-center justify-center">
                    <span className="text-white text-sm">🏔️</span>
                  </div>
                  <h3 className="text-lg font-semibold">Aditividad</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  La integral sobre un intervalo puede dividirse en la suma de integrales sobre subintervalos.
                </p>
                <div className="bg-gray-100 p-3 rounded mb-4">
                  <code className="text-sm">
                    ∫[a,c] f(x) dx = ∫[a,b] f(x) dx + ∫[b,c] f(x) dx
                  </code>
                </div>
                <Button 
                  className="w-full bg-green-500 hover:bg-green-600"
                  onClick={() => {
                    setPropiedadSeleccionada('aditividad')
                    setMostrarPropiedades(false)
                  }}
                >
                  Ver ejemplo interactivo
                </Button>
              </Card>

              {/* Inversión de Límites */}
              <Card className="p-6 border-l-4 border-orange-500">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-orange-500 rounded mr-3 flex items-center justify-center">
                    <span className="text-white text-sm">🔄</span>
                  </div>
                  <h3 className="text-lg font-semibold">Inversión de Límites</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Invertir los límites de integración cambia el signo de la integral.
                </p>
                <div className="bg-gray-100 p-3 rounded mb-4">
                  <code className="text-sm">
                    ∫[a,b] f(x) dx = -∫[b,a] f(x) dx
                  </code>
                </div>
                <Button 
                  className="w-full bg-orange-500 hover:bg-orange-600"
                  onClick={() => {
                    setPropiedadSeleccionada('inversion')
                    setMostrarPropiedades(false)
                  }}
                >
                  Ver ejemplo interactivo
                </Button>
              </Card>

              {/* Comparación */}
              <Card className="p-6 border-l-4 border-purple-500">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-purple-500 rounded mr-3 flex items-center justify-center">
                    <span className="text-white text-sm">📈</span>
                  </div>
                  <h3 className="text-lg font-semibold">Propiedad de Comparación</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Si una función es menor o igual que otra, su integral también es menor o igual.
                </p>
                <div className="bg-gray-100 p-3 rounded mb-4">
                  <code className="text-sm">
                    Si f(x) ≤ g(x) en [a,b] → ∫[a,b] f(x) dx ≤ ∫[a,b] g(x) dx
                  </code>
                </div>
                <Button 
                  className="w-full bg-purple-500 hover:bg-purple-600"
                  onClick={() => {
                    setPropiedadSeleccionada('comparacion')
                    setMostrarPropiedades(false)
                  }}
                >
                  Ver ejemplo interactivo
                </Button>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

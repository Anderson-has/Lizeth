'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useTorreValorMedio } from '../../src/hooks/useTorreValorMedio'
import { useEstimation } from '../../src/hooks/useEstimation'
import { RenderizadorTeoria } from '../../src/presentacion/RenderizadorTeoria.js'
import { FunctionValidator } from '../../src/servicios/FunctionValidator.js'
import { FunctionScaler } from '../../src/servicios/FunctionScaler.js'
import { CustomFunctionManager } from '../../src/servicios/CustomFunctionManager.js'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Calculator, 
  Target, 
  Trophy, 
  Clock, 
  Lightbulb, 
  CheckCircle, 
  XCircle,
  Play,
  RotateCcw,
  Search,
  Home
} from 'lucide-react'

function TorreValorMedioDemo() {
  const router = useRouter()
  
  // Referencias a los canvas
  const canvasTorreRef = useRef<HTMLCanvasElement>(null)
  const canvasCartesianoRef = useRef<HTMLCanvasElement>(null)
  const canvasSegundoTeoremaRef = useRef<HTMLCanvasElement>(null)
  
  // Hook para manejo de estimación
  const { userEstimateC, isEstimating, hasVerified, attempts, startEstimation, updateEstimation, verifyEstimation, resetEstimation } = useEstimation()
  const containerTooltipRef = useRef<HTMLDivElement>(null)
  
  // Hook del escenario
  const {
    // Estado del escenario
    escenario,
    estado,
    configuracion,
    
    // Estado de la interfaz
    funcionActual,
    limiteA,
    limiteB,
    estimacionUsuario,
    puntoCReal,
    errorEstimacion,
    verificacionExitosa,
    
    // Estado de renderizado
    estaRenderizando,
    estaVerificando,
    estaBloqueado,
    
    // Métricas
    tiempoInicio,
    numeroIntentos,
    estimacionesExcelentes,
    
    // Ejemplos y logros
    ejemplos,
    logros,
    logrosDesbloqueados,
    
    // Setters para actualización manual
    setEstimacionUsuario,
    setPuntoCReal,
    setErrorEstimacion,
    setVerificacionExitosa,
    
    // Métodos
    establecerFuncion,
    establecerLimites,
    establecerEstimacionUsuario,
    calcularPuntoCReal,
    verificarEstimacion,
    cargarEjemplo,
    resetear,
    manejarClickTorre,
    manejarClickCartesiano,
    obtenerInformacionHover,
    renderizarCompleto,
    configurarCanvas,
    obtenerCalculos,
    obtenerMetricas,
    obtenerInformacionTeorema,
    verificarCondicionesTeorema,
    verificarLogros
  } = useTorreValorMedio()
  
  // Estado local
  const [teoremaActivo, setTeoremaActivo] = useState('valor-medio') // 'valor-medio' o 'segundo-teorema'
  const [tabActivo, setTabActivo] = useState('visualizacion')
  const [funcionPersonalizada, setFuncionPersonalizada] = useState('')
  const [errorFuncion, setErrorFuncion] = useState('')
  const [informacionHover, setInformacionHover] = useState<{x: number, y: number} | null>(null)
  const [tiempoTranscurrido, setTiempoTranscurrido] = useState(0)
  const [renderizadorTeoria, setRenderizadorTeoria] = useState<RenderizadorTeoria | null>(null)
  
  // Estado para el Segundo Teorema
  const [funcionSegundoTeorema, setFuncionSegundoTeorema] = useState('seno')
  const [limiteASegundoTeorema, setLimiteASegundoTeorema] = useState(0)
  const [limiteBSegundoTeorema, setLimiteBSegundoTeorema] = useState(2)
  const [antiderivadaUsuario, setAntiderivadaUsuario] = useState('')
  const [evaluacionA, setEvaluacionA] = useState('')
  const [evaluacionB, setEvaluacionB] = useState('')
  const [resultadoIntegral, setResultadoIntegral] = useState(0)
  const [pasoActualSegundoTeorema, setPasoActualSegundoTeorema] = useState(1)
  const [errorAntiderivada, setErrorAntiderivada] = useState('')
  const [errorEvaluacion, setErrorEvaluacion] = useState('')
  
  // Estado para función personalizada del Segundo Teorema
  const [funcionPersonalizadaSegundoTeorema, setFuncionPersonalizadaSegundoTeorema] = useState('')
  const [errorFuncionPersonalizadaSegundoTeorema, setErrorFuncionPersonalizadaSegundoTeorema] = useState('')
  const [mostrarTecladoSegundoTeorema, setMostrarTecladoSegundoTeorema] = useState(false)
  
  // Estado para función personalizada
  const [mostrarTeclado, setMostrarTeclado] = useState(false)
  const [cursorPosicion, setCursorPosicion] = useState(0)
  const [sugerencias, setSugerencias] = useState<any[]>([])
  
  // Servicios para función personalizada
  const [functionValidator] = useState(() => new FunctionValidator())
  const [functionScaler] = useState(() => new FunctionScaler())
  const [customFunctionManager] = useState(() => new CustomFunctionManager(functionValidator, functionScaler))
  
  // ✅ CONFIGURAR CANVAS AL MONTAR
  useEffect(() => {
    if (canvasTorreRef.current && canvasCartesianoRef.current) {
      // Pequeño delay para asegurar que los canvas estén completamente renderizados
      setTimeout(() => {
      configurarCanvas(canvasTorreRef.current, canvasCartesianoRef.current)
        // Forzar renderizado inicial
        setTimeout(() => {
          renderizarCompleto()
        }, 100)
      }, 100)
    }
  }, [configurarCanvas, renderizarCompleto])

  // ✅ CONFIGURAR CANVAS SEGUNDO TEOREMA
  useEffect(() => {
    if (canvasSegundoTeoremaRef.current && escenario && teoremaActivo === 'segundo-teorema') {
      try {
        escenario.configurarCanvasSegundoTeorema(canvasSegundoTeoremaRef.current)
        console.log('✅ Canvas Segundo Teorema configurado')
      } catch (error) {
        console.error('❌ Error configurando canvas Segundo Teorema:', error)
      }
    }
  }, [escenario, teoremaActivo, canvasSegundoTeoremaRef.current])

  // ✅ RENDERIZAR SEGUNDO TEOREMA CUANDO CAMBIEN LOS PARÁMETROS
  useEffect(() => {
    console.log('🔄 useEffect Segundo Teorema ejecutado:', {
      escenario: !!escenario,
      teoremaActivo,
      tabActivo,
      funcionSegundoTeorema,
      limiteASegundoTeorema,
      limiteBSegundoTeorema,
      funcionPersonalizadaSegundoTeorema
    })
    
    if (escenario && teoremaActivo === 'segundo-teorema' && tabActivo === 'visualizacion') {
      try {
        console.log('🎨 Intentando renderizar Segundo Teorema...')
        escenario.renderizarSegundoTeorema()
        console.log('✅ Segundo Teorema renderizado exitosamente')
      } catch (error) {
        console.error('❌ Error renderizando Segundo Teorema:', error)
      }
    }
  }, [escenario, teoremaActivo, tabActivo, funcionSegundoTeorema, limiteASegundoTeorema, limiteBSegundoTeorema, funcionPersonalizadaSegundoTeorema])

  // ✅ RENDERIZAR CUANDO CAMBIEN LOS PARÁMETROS
  useEffect(() => {
    if (escenario && !estaRenderizando) {
      console.log('🎨 Renderizando con estimación:', estimacionUsuario)
      renderizarCompleto()
    }
  }, [funcionActual, limiteA, limiteB, estimacionUsuario, puntoCReal, escenario, renderizarCompleto, estaRenderizando])

  // ✅ INICIALIZAR RENDERIZADOR DE TEORÍA CUANDO EL REF ESTÉ DISPONIBLE
  useEffect(() => {
    console.log('🔄 Verificando disponibilidad del containerTooltipRef...')
    console.log('- containerTooltipRef.current:', containerTooltipRef.current)
    console.log('- renderizadorTeoria actual:', !!renderizadorTeoria)
    console.log('- tabActivo:', tabActivo)
    
    // Solo inicializar si estamos en la pestaña de teoría y el contenedor está disponible
    if (tabActivo === 'teoria' && containerTooltipRef.current && !renderizadorTeoria) {
      console.log('✅ Creando RenderizadorTeoria...')
      const renderizador = new RenderizadorTeoria(containerTooltipRef.current)
      setRenderizadorTeoria(renderizador)
      console.log('✅ RenderizadorTeoria creado:', renderizador)
    }
  }, [containerTooltipRef.current, renderizadorTeoria, tabActivo])

  // ✅ RENDERIZAR TEORÍA CUANDO SE CAMBIE A LA PESTAÑA Y EL RENDERIZADOR ESTÉ LISTO
  useEffect(() => {
    console.log('🔄 useEffect de renderizado de teoría ejecutado:', { tabActivo, renderizadorTeoria: !!renderizadorTeoria, escenario: !!escenario })
    
    if (tabActivo === 'teoria' && renderizadorTeoria && escenario) {
      console.log('📚 Intentando obtener información del teorema para renderizar...')
      const informacionTeorema = obtenerInformacionTeorema()
      console.log('📚 Información del teorema:', informacionTeorema)
      
      if (informacionTeorema) {
        console.log('✅ Renderizando teoría...')
        renderizadorTeoria.renderizarTeoria(informacionTeorema)
      } else {
        console.log('⚠️ No se encontró información del teorema para renderizar')
      }
    } else if (tabActivo !== 'teoria' && renderizadorTeoria) {
      // Limpiar el renderizador cuando se cambie de pestaña
      console.log('🧹 Limpiando renderizador de teoría al cambiar de pestaña')
      setRenderizadorTeoria(null)
    } else {
      console.log('❌ Condiciones no cumplidas para renderizar teoría (tab, renderizador o escenario no listos)')
    }
  }, [tabActivo, renderizadorTeoria, escenario, obtenerInformacionTeorema])

  // ✅ RENDERIZAR GRÁFICAS CUANDO SE CAMBIE A VISUALIZACIÓN
  useEffect(() => {
    if (tabActivo === 'visualizacion' && escenario && !estaRenderizando) {
      // Pequeño delay para asegurar que los canvas estén listos
      setTimeout(() => {
        // Reconfigurar canvas para asegurar dimensiones correctas
        if (canvasTorreRef.current && canvasCartesianoRef.current) {
          configurarCanvas(canvasTorreRef.current, canvasCartesianoRef.current)
        }
        // Renderizar después de reconfigurar
        setTimeout(() => {
          renderizarCompleto()
        }, 50)
      }, 100)
    }
  }, [tabActivo, escenario, renderizarCompleto, estaRenderizando, configurarCanvas, teoremaActivo])
  
  // ✅ ACTUALIZAR TIEMPO TRANSCURRIDO
  useEffect(() => {
    const interval = setInterval(() => {
      setTiempoTranscurrido(Date.now() - tiempoInicio)
    }, 1000)
    
    return () => clearInterval(interval)
  }, [tiempoInicio])
  
  // ✅ MANEJAR CAMBIO DE FUNCIÓN
  const handleFuncionChange = useCallback((tipo: string) => {
    if (!estaBloqueado) {
      establecerFuncion(tipo, funcionPersonalizada)
    }
  }, [establecerFuncion, funcionPersonalizada, estaBloqueado])
  
  // ✅ MANEJAR CAMBIO DE LÍMITES
  const handleLimitesChange = useCallback((a: number, b: number) => {
    if (!estaBloqueado) {
      establecerLimites(a, b)
    }
  }, [establecerLimites, estaBloqueado])
  
  // ✅ MANEJAR CLICK EN TORRE
  const handleClickTorre = useCallback((evento: React.MouseEvent<HTMLCanvasElement>) => {
    // Solo permitir clicks si no se ha verificado aún
    if (!hasVerified) {
      const x = manejarClickTorre(evento.nativeEvent)
      if (x !== null) {
        if (isEstimating) {
          updateEstimation(x)
        } else {
        startEstimation(x)
        }
        console.log(`🎯 Estimación colocada en torre: ${x}`)
      }
    } else {
      console.log('⚠️ No se puede reposicionar después de verificar. Usa "Intentar de nuevo"')
    }
  }, [manejarClickTorre, hasVerified, isEstimating, startEstimation, updateEstimation])
  
  // ✅ MANEJAR CLICK EN CARTESIANO
  const handleClickCartesiano = useCallback((evento: React.MouseEvent<HTMLCanvasElement>) => {
    // Solo permitir clicks si no se ha verificado aún
    if (!hasVerified) {
      const x = manejarClickCartesiano(evento.nativeEvent)
      if (x !== null) {
        if (isEstimating) {
          updateEstimation(x)
        } else {
          startEstimation(x)
        }
        console.log(`🎯 Estimación colocada en cartesiano: ${x}`)
      }
    } else {
      console.log('⚠️ No se puede reposicionar después de verificar. Usa "Intentar de nuevo"')
    }
  }, [manejarClickCartesiano, hasVerified, isEstimating, startEstimation, updateEstimation])
  
  // ✅ MANEJAR HOVER
  const handleHover = useCallback((evento: React.MouseEvent<HTMLCanvasElement>, tipoCanvas: string) => {
    const info = obtenerInformacionHover(evento.nativeEvent, tipoCanvas)
    setInformacionHover(info)
  }, [obtenerInformacionHover])
  
  // ✅ MANEJAR VERIFICACIÓN
  const handleVerificacion = useCallback(async () => {
    if (estimacionUsuario !== null) {
      const puntoC = calcularPuntoCReal()
      if (puntoC !== null) {
        const exitosa = verificarEstimacion()
        // Marcar como verificado para bloquear reposicionamiento
        verifyEstimation()
        
        // Forzar actualización del estado después de la verificación
        setTimeout(() => {
          if (escenario) {
            // Forzar actualización del estado del escenario
            const nuevoEstado = escenario.obtenerEstado()
            console.log('🔄 Estado después de verificación:')
            console.log('- Estimación usuario:', nuevoEstado.obtenerEstimacionUsuario())
            console.log('- Punto c real:', nuevoEstado.obtenerPuntoCReal())
            console.log('- Error estimación:', nuevoEstado.obtenerErrorEstimacion())
            console.log('- Verificación exitosa:', nuevoEstado.obtenerVerificacionExitosa())
            
            // Actualizar manualmente el estado del componente
            setEstimacionUsuario(nuevoEstado.obtenerEstimacionUsuario())
            setPuntoCReal(nuevoEstado.obtenerPuntoCReal())
            setErrorEstimacion(nuevoEstado.obtenerErrorEstimacion())
            setVerificacionExitosa(nuevoEstado.obtenerVerificacionExitosa())
            
            // Forzar renderizado para actualizar la UI
            renderizarCompleto()
          }
        }, 100)
        
        console.log(`✅ Verificación: ${exitosa ? 'Exitosa' : 'Fallida'}`)
        
        // Verificar logros después de la verificación
        const logrosDesbloqueados = verificarLogros()
        if (logrosDesbloqueados.length > 0) {
          console.log('🏆 Logros desbloqueados:', logrosDesbloqueados)
        }
      }
    }
  }, [estimacionUsuario, calcularPuntoCReal, verificarEstimacion, verifyEstimation, verificarLogros, escenario])

  // ✅ MANEJAR FUNCIÓN PERSONALIZADA
  const handleFuncionPersonalizada = useCallback((func: string) => {
    setFuncionPersonalizada(func)
    
    // Validar función en tiempo real
    const validation = functionValidator.validateComplete(func, limiteA, limiteB)
    
    if (validation.valid) {
      setErrorFuncion('')
      // Establecer función personalizada en el escenario
      establecerFuncion('personalizada', func)
    } else {
      setErrorFuncion(validation.error)
    }
  }, [functionValidator, limiteA, limiteB, establecerFuncion])

  // ✅ INSERTAR EN POSICIÓN DEL CURSOR
  const insertarEnCursor = useCallback((texto: string) => {
    const nuevaFuncion = funcionPersonalizada.slice(0, cursorPosicion) + texto + funcionPersonalizada.slice(cursorPosicion)
    setFuncionPersonalizada(nuevaFuncion)
    setCursorPosicion(cursorPosicion + texto.length)
  }, [funcionPersonalizada, cursorPosicion])

  // ✅ OBTENER SUGERENCIAS INTELIGENTES
  const obtenerSugerencias = useCallback(() => {
    const sugerencias = customFunctionManager.getSmartSuggestions(funcionPersonalizada, [limiteA, limiteB])
    setSugerencias(sugerencias)
  }, [customFunctionManager, funcionPersonalizada, limiteA, limiteB])

  // ✅ MANEJAR CAMBIO DE FUNCIÓN
  const handleCambioFuncion = useCallback((tipo: string) => {
    if (tipo === 'personalizada') {
      // Mostrar teclado para función personalizada
      setMostrarTeclado(true)
      obtenerSugerencias()
      // Establecer función personalizada
      establecerFuncion('personalizada', funcionPersonalizada)
    } else {
      // Ocultar teclado para funciones predefinidas
      setMostrarTeclado(false)
      establecerFuncion(tipo)
    }
  }, [establecerFuncion, obtenerSugerencias, funcionPersonalizada])
  
  // ✅ MANEJAR CARGA DE EJEMPLO
  const handleCargarEjemplo = useCallback((ejemplo: any) => {
    console.log('📚 Cargando ejemplo:', ejemplo)
    cargarEjemplo(ejemplo)
    console.log(`📚 Ejemplo cargado: ${ejemplo.titulo}`)
    
    // Redirigir automáticamente a Visualizaciones después de cargar el ejemplo
    setTimeout(() => {
      setTabActivo('visualizacion')
      console.log('🎯 Redirigiendo a Visualizaciones después de cargar ejemplo')
    }, 200)
    
    // Forzar actualización del estado después de cargar el ejemplo
    setTimeout(() => {
      if (escenario) {
        const nuevoEstado = escenario.obtenerEstado()
        console.log('🔄 Estado después de cargar ejemplo:')
        console.log('- Función:', nuevoEstado.obtenerTipoFuncion())
        console.log('- Límites:', nuevoEstado.obtenerLimites())
        console.log('- Ejemplo actual:', nuevoEstado.ejemploActual)
      }
    }, 100)
  }, [cargarEjemplo, escenario])
  
  // ✅ MANEJAR RESET
  const handleReset = useCallback(() => {
    resetear()
    setFuncionPersonalizada('')
    setErrorFuncion('')
    setInformacionHover(null)
    console.log('🔄 Escenario reseteado')
  }, [resetear])
  
  // ✅ MANEJAR FUNCIÓN PERSONALIZADA
  const handleFuncionPersonalizadaChange = useCallback((valor: string) => {
    setFuncionPersonalizada(valor)
    setErrorFuncion('')
    
    try {
      if (valor.trim()) {
        const func = new Function('x', `return ${valor}`)
        // Probar la función
        func(0)
        establecerFuncion('personalizada', valor)
      }
    } catch (error) {
      setErrorFuncion('Sintaxis inválida')
    }
  }, [establecerFuncion])
  
  // ✅ FORMATEAR TIEMPO
  const formatearTiempo = (ms: number) => {
    const segundos = Math.floor(ms / 1000)
    const minutos = Math.floor(segundos / 60)
    const segundosRestantes = segundos % 60
    return `${minutos}:${segundosRestantes.toString().padStart(2, '0')}`
  }
  
  // ✅ OBTENER CLASIFICACIÓN DE ERROR
  const obtenerClasificacionError = (error: number) => {
    if (error < 0.1) return { nivel: 'Perfecto', emoji: '🎯', color: 'bg-green-100 text-green-800' }
    if (error < 0.3) return { nivel: 'Excelente', emoji: '✨', color: 'bg-blue-100 text-blue-800' }
    if (error < 0.6) return { nivel: 'Bueno', emoji: '👍', color: 'bg-yellow-100 text-yellow-800' }
    if (error < 1.0) return { nivel: 'Regular', emoji: '⚠️', color: 'bg-orange-100 text-orange-800' }
    return { nivel: 'Intenta', emoji: '🔄', color: 'bg-red-100 text-red-800' }
  }

  // ========================================
  // MÉTODOS PARA EL SEGUNDO TEOREMA FUNDAMENTAL
  // ========================================

  // ✅ MANEJAR CAMBIO DE TEOREMA
  const handleCambioTeorema = useCallback((teorema: string) => {
    setTeoremaActivo(teorema)
    if (teorema === 'segundo-teorema') {
      setTabActivo('teoria')
    } else {
      setTabActivo('visualizacion')
    }
  }, [])

  // ✅ MANEJAR FUNCIÓN SEGUNDO TEOREMA
  const handleFuncionSegundoTeorema = useCallback((tipo: string) => {
    setFuncionSegundoTeorema(tipo)
    if (escenario) {
      escenario.cambiarTeoremaActivo('segundo-teorema')
      if (tipo === 'personalizada') {
        // Para función personalizada, no establecer función aún hasta que sea válida
        setMostrarTecladoSegundoTeorema(true)
      } else {
        escenario.establecerFuncionSegundoTeorema(tipo, '')
        setMostrarTecladoSegundoTeorema(false)
      }
    }
  }, [escenario])

  // ✅ MANEJAR FUNCIÓN PERSONALIZADA SEGUNDO TEOREMA
  const handleFuncionPersonalizadaSegundoTeorema = useCallback((funcion: string) => {
    setFuncionPersonalizadaSegundoTeorema(funcion)
    setErrorFuncionPersonalizadaSegundoTeorema('')
    
    if (escenario && funcion.trim()) {
      try {
        // Validar sintaxis básica
        const testFunc = new Function('x', `return ${funcion}`)
        const testValue = testFunc(1)
        
        if (!isFinite(testValue)) {
          setErrorFuncionPersonalizadaSegundoTeorema('La función produce valores no finitos')
          return
        }
        
        // Establecer la función personalizada
        escenario.establecerFuncionSegundoTeorema('personalizada', funcion)
        setErrorFuncionPersonalizadaSegundoTeorema('')
      } catch (error) {
        setErrorFuncionPersonalizadaSegundoTeorema('Sintaxis inválida en la función')
      }
    }
  }, [escenario])

  // ✅ MANEJAR LÍMITES SEGUNDO TEOREMA
  const handleLimitesSegundoTeorema = useCallback((a: number, b: number) => {
    setLimiteASegundoTeorema(a)
    setLimiteBSegundoTeorema(b)
    if (escenario) {
      escenario.establecerLimitesSegundoTeorema(a, b)
    }
  }, [escenario])

  // ✅ VALIDAR ANTIDERIVADA
  const handleValidarAntiderivada = useCallback(() => {
    if (escenario && antiderivadaUsuario) {
      const validacion = escenario.validarAntiderivada(antiderivadaUsuario)
      if (validacion.valida) {
        setErrorAntiderivada('')
        escenario.establecerAntiderivadaUsuario(antiderivadaUsuario)
        escenario.avanzarPasoSegundoTeorema()
        setPasoActualSegundoTeorema(2)
      } else {
        setErrorAntiderivada(validacion.error)
      }
    }
  }, [escenario, antiderivadaUsuario])

  // ✅ VALIDAR EVALUACIÓN LÍMITES
  const handleValidarEvaluacion = useCallback(() => {
    if (escenario && evaluacionA && evaluacionB) {
      const validacion = escenario.validarEvaluacionLimites(evaluacionA, evaluacionB)
      if (validacion.valida) {
        setErrorEvaluacion('')
        escenario.establecerEvaluacionLimites(evaluacionA, evaluacionB)
        escenario.avanzarPasoSegundoTeorema()
        setPasoActualSegundoTeorema(3)
      } else {
        setErrorEvaluacion(validacion.error)
      }
    }
  }, [escenario, evaluacionA, evaluacionB])

  // ✅ CALCULAR RESULTADO INTEGRAL
  const handleCalcularResultado = useCallback(() => {
    if (escenario) {
      const resultado = escenario.calcularResultadoIntegral()
      if (resultado.exitosa) {
        setResultadoIntegral(resultado.resultado)
        escenario.avanzarPasoSegundoTeorema()
        setPasoActualSegundoTeorema(4)
      }
    }
  }, [escenario])

  // ✅ CARGAR EJEMPLO SEGUNDO TEOREMA
  const handleCargarEjemploSegundoTeorema = useCallback((ejemplo: any) => {
    if (escenario) {
      escenario.cambiarTeoremaActivo('segundo-teorema')
      escenario.cargarEjemploSegundoTeorema(ejemplo)
      setFuncionSegundoTeorema(ejemplo.tipoFuncion || 'seno')
      setLimiteASegundoTeorema(ejemplo.limiteA)
      setLimiteBSegundoTeorema(ejemplo.limiteB)
      setTabActivo('visualizacion')
    }
  }, [escenario])

  // ✅ RESETEAR SEGUNDO TEOREMA
  const handleResetearSegundoTeorema = useCallback(() => {
    if (escenario) {
      escenario.resetearSegundoTeorema()
      setAntiderivadaUsuario('')
      setEvaluacionA('')
      setEvaluacionB('')
      setResultadoIntegral(0)
      setPasoActualSegundoTeorema(1)
      setErrorAntiderivada('')
      setErrorEvaluacion('')
    }
  }, [escenario])
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1"></div>
            <div className="flex-1 text-center">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                🏰 Torre del Valor Medio
              </h1>
              <p className="text-lg text-gray-600">
                Bienvenido al reino mágico del cálculo, donde las derivadas e integrales se encuentran en perfecta armonía
              </p>
            </div>
            <div className="flex-1 flex justify-end">
              <Button 
                variant="outline" 
                className="gap-2 bg-transparent hover:bg-gray-50"
                onClick={() => router.push('/')}
              >
                <Home className="h-4 w-4 text-gray-600" />
                Ir al Inicio
              </Button>
            </div>
          </div>
        </div>
        
        {/* Navegación principal de teoremas */}
        <Tabs value={teoremaActivo} onValueChange={handleCambioTeorema} className="mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="valor-medio" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Teorema del Valor Medio
            </TabsTrigger>
            <TabsTrigger value="segundo-teorema" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              2do Teorema Fundamental
            </TabsTrigger>
          </TabsList>
          
          {/* Contenido del Teorema del Valor Medio */}
          <TabsContent value="valor-medio" className="space-y-6">
            {/* Subpestañas para el Teorema del Valor Medio */}
            <Tabs value={tabActivo} onValueChange={setTabActivo}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="teoria" className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  Teoría
                </TabsTrigger>
                <TabsTrigger value="visualizacion" className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Visualizaciones
                </TabsTrigger>
                <TabsTrigger value="ejemplos" className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  Ejemplos
                </TabsTrigger>
              </TabsList>
              
              {/* Pestaña de Teoría del Valor Medio */}
          <TabsContent value="teoria" className="space-y-6">
                <div ref={containerTooltipRef} className="min-h-[600px] bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200 shadow-sm">
              {/* El contenido se renderiza dinámicamente por RenderizadorTeoria.js */}
            </div>
          </TabsContent>
          
              {/* Pestaña de Ejemplos del Valor Medio */}
          <TabsContent value="ejemplos" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Ejemplos Mágicos
                </CardTitle>
                <CardDescription>
                  Haz clic en un ejemplo para cargarlo y explorar cómo funciona el teorema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ejemplos.map((ejemplo) => (
                    <Card key={ejemplo.id} className="p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-3">
                        <div className="text-blue-600 text-xl">*</div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 mb-1">
                            {ejemplo.titulo}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {ejemplo.descripcion}
                          </p>
                          <div className="text-sm text-gray-700 mb-2">
                            <strong>Función:</strong> {ejemplo.funcion}
                          </div>
                          <div className="text-sm text-gray-700 mb-2">
                            <strong>Intervalo:</strong> [{ejemplo.limiteA}, {ejemplo.limiteB}]
                          </div>
                          <div className="text-sm text-gray-700 mb-2">
                            <strong>Valor de c:</strong> {ejemplo.puntoC}
                          </div>
                          <div className="bg-yellow-50 p-2 rounded text-sm text-yellow-800 mb-3">
                            {ejemplo.insight}
                          </div>
                          <Button 
                            onClick={() => handleCargarEjemplo(ejemplo)}
                            className="w-full"
                            size="sm"
                          >
                            Cargar ejemplo
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
              {/* Pestaña de Visualización del Valor Medio */}
          <TabsContent value="visualizacion" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Panel de Controles */}
              <div className="space-y-4">
                {/* Controles Interactivos */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Controles Interactivos</CardTitle>
                    <CardDescription>
                      Ajusta los parámetros para explorar el teorema
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Límites */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium">Punto inicial a = {limiteA.toFixed(1)}</label>
                      <Slider
                        value={[limiteA]}
                        onValueChange={(value) => handleLimitesChange(value[0], limiteB)}
                        min={-4}
                        max={4}
                        step={0.1}
                        disabled={estaBloqueado}
                        className="w-full"
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <label className="text-sm font-medium">Punto final b = {limiteB.toFixed(1)}</label>
                      <Slider
                        value={[limiteB]}
                        onValueChange={(value) => handleLimitesChange(limiteA, value[0])}
                        min={-4}
                        max={4}
                        step={0.1}
                        disabled={estaBloqueado}
                        className="w-full"
                      />
                    </div>
                    
                    {/* Tipo de función */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Tipo de función</label>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant={funcionActual === 'cuadratica' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleFuncionChange('cuadratica')}
                          disabled={estaBloqueado}
                        >
                          x²
                        </Button>
                        <Button
                          variant={funcionActual === 'cubica' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleFuncionChange('cubica')}
                          disabled={estaBloqueado}
                        >
                          x³
                        </Button>
                        <Button
                          variant={funcionActual === 'seno' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleFuncionChange('seno')}
                          disabled={estaBloqueado}
                        >
                          sin(x)
                        </Button>
                        <Button
                          variant={funcionActual === 'lineal' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleFuncionChange('lineal')}
                          disabled={estaBloqueado}
                        >
                          2x + 1
                        </Button>
                        <Button
                          variant={funcionActual === 'personalizada' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleCambioFuncion('personalizada')}
                          disabled={estaBloqueado}
                        >
                          f(x)
                        </Button>
                      </div>
                    </div>
                    
                    {/* Función personalizada */}
                    {funcionActual === 'personalizada' && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Función personalizada</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={funcionPersonalizada}
                            onChange={(e) => {
                              setFuncionPersonalizada(e.target.value)
                              setCursorPosicion(e.target.selectionStart || 0)
                              handleFuncionPersonalizada(e.target.value)
                            }}
                            placeholder="x**2"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            disabled={estaBloqueado}
                          />
                          <Button
                            onClick={() => setMostrarTeclado(!mostrarTeclado)}
                            variant="outline"
                            size="sm"
                          >
                            {mostrarTeclado ? 'Ocultar' : 'Mostrar'} Teclado
                          </Button>
                        </div>
                        
                        {errorFuncion && (
                          <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                            {errorFuncion}
                          </div>
                        )}
                        
                        {/* Sugerencias */}
                        {sugerencias.length > 0 && (
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-600">Sugerencias:</label>
                            <div className="flex flex-wrap gap-1">
                              {sugerencias.map((sugerencia, index) => (
                                <Button
                                  key={index}
                                  onClick={() => insertarEnCursor(sugerencia.code)}
                                  variant="outline"
                                  size="sm"
                                  className="text-xs"
                                >
                                  {sugerencia.name}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Teclado matemático */}
                        {mostrarTeclado && (
                          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                            <div className="grid grid-cols-4 gap-2">
                              <Button onClick={() => insertarEnCursor('+')} variant="outline" size="sm">+</Button>
                              <Button onClick={() => insertarEnCursor('-')} variant="outline" size="sm">-</Button>
                              <Button onClick={() => insertarEnCursor('*')} variant="outline" size="sm">×</Button>
                              <Button onClick={() => insertarEnCursor('/')} variant="outline" size="sm">÷</Button>
                            </div>
                            
                            <div className="grid grid-cols-4 gap-2">
                              <Button onClick={() => insertarEnCursor('**')} variant="outline" size="sm">x^y</Button>
                              <Button onClick={() => insertarEnCursor('(')} variant="outline" size="sm">(</Button>
                              <Button onClick={() => insertarEnCursor(')')} variant="outline" size="sm">)</Button>
                              <Button onClick={() => insertarEnCursor('x')} variant="outline" size="sm">x</Button>
                            </div>
                            
                            <div className="grid grid-cols-4 gap-2">
                              <Button onClick={() => insertarEnCursor('Math.sin(')} variant="outline" size="sm">sin</Button>
                              <Button onClick={() => insertarEnCursor('Math.cos(')} variant="outline" size="sm">cos</Button>
                              <Button onClick={() => insertarEnCursor('Math.tan(')} variant="outline" size="sm">tan</Button>
                              <Button onClick={() => insertarEnCursor('Math.exp(')} variant="outline" size="sm">e^x</Button>
                            </div>
                            
                            <div className="grid grid-cols-4 gap-2">
                              <Button onClick={() => insertarEnCursor('Math.log(')} variant="outline" size="sm">ln</Button>
                              <Button onClick={() => insertarEnCursor('Math.sqrt(')} variant="outline" size="sm">√</Button>
                              <Button onClick={() => insertarEnCursor('Math.abs(')} variant="outline" size="sm">|x|</Button>
                              <Button onClick={() => insertarEnCursor('Math.PI')} variant="outline" size="sm">π</Button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Instrucciones */}
                    <div className="bg-purple-50 p-3 rounded text-sm text-purple-800">
                      <strong>Paso 1:</strong> Haz clic en la gráfica o torre para colocar tu estimación de c.
                    </div>
                    
                    {/* Botones de control */}
                    <div className="space-y-2">
                      <Button
                        onClick={() => {
                          console.log('🔄 Forzando renderizado...')
                          console.log('Escenario:', escenario)
                          console.log('Canvas Torre:', canvasTorreRef.current)
                          console.log('Canvas Cartesiano:', canvasCartesianoRef.current)
                          renderizarCompleto()
                        }}
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        🔄 Forzar Renderizado
                      </Button>
                      
                      <Button
                        onClick={() => {
                          resetEstimation()
                          // También resetear el escenario para limpiar el punto c real
                          resetear()
                          console.log('🔄 Estimación reseteada - puedes reposicionar')
                        }}
                        variant="outline"
                        size="sm"
                        className="w-full"
                        disabled={!isEstimating && !hasVerified}
                      >
                        🎯 Reposicionar Punto
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Logros */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Trophy className="h-5 w-5" />
                      Logros
                    </CardTitle>
                    <CardDescription>
                      {logrosDesbloqueados.length} de {logros.length} desbloqueados
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {logros.map((logro) => (
                        <div key={logro.id} className={`flex items-center gap-3 p-2 rounded-lg transition-all ${
                          logrosDesbloqueados.includes(logro.id) 
                            ? 'bg-yellow-50 border border-yellow-200 shadow-sm' 
                            : 'bg-gray-50 border border-gray-200'
                        }`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                            logrosDesbloqueados.includes(logro.id)
                              ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 shadow-lg' 
                              : 'bg-gray-300'
                          }`}>
                            <span className="text-lg">
                              {logrosDesbloqueados.includes(logro.id) ? '🏆' : '🔒'}
                            </span>
                          </div>
                          <div className="flex-1">
                            <span className={`text-sm font-medium ${
                              logrosDesbloqueados.includes(logro.id) ? 'text-yellow-700' : 'text-gray-500'
                            }`}>
                              {logro.titulo}
                            </span>
                            {logro.descripcion && (
                              <p className={`text-xs mt-1 ${
                                logrosDesbloqueados.includes(logro.id) ? 'text-yellow-600' : 'text-gray-400'
                              }`}>
                                {logro.descripcion}
                              </p>
                            )}
                          </div>
                          {logrosDesbloqueados.includes(logro.id) && (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Cronómetro */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Cronómetro
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-2xl font-mono font-bold text-blue-600">
                        {formatearTiempo(tiempoTranscurrido)}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Tiempo total</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Visualizaciones */}
              <div className="lg:col-span-2 space-y-4">
                {/* Torre del Valor Medio */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Torre del Valor Medio</CardTitle>
                    <CardDescription>
                      Representación visual de la función
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <canvas
                        ref={canvasTorreRef}
                        onClick={handleClickTorre}
                        onMouseMove={(e) => handleHover(e, 'torre')}
                        className="w-full h-80 border rounded-lg cursor-crosshair"
                        style={{ 
                          background: 'linear-gradient(180deg, #D1C4E9 0%, #F8BBD0 100%)',
                          width: '100%',
                          height: '320px',
                          display: 'block'
                        }}
                        width={800}
                        height={320}
                      />
                      {informacionHover && (
                        <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
                          x: {informacionHover.x.toFixed(2)}, y: {informacionHover.y.toFixed(2)}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Plano Cartesiano */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Plano Cartesiano</CardTitle>
                    <CardDescription>
                      Haz clic para colocar tu estimación de c
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <canvas
                        ref={canvasCartesianoRef}
                        onClick={handleClickCartesiano}
                        onMouseMove={(e) => handleHover(e, 'cartesiano')}
                        className="w-full h-80 border rounded-lg cursor-crosshair bg-white"
                        style={{ 
                          width: '100%',
                          height: '320px',
                          display: 'block'
                        }}
                        width={800}
                        height={320}
                      />
                      {informacionHover && (
                        <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
                          x: {informacionHover.x.toFixed(2)}, y: {informacionHover.y.toFixed(2)}
                        </div>
                      )}
                    </div>
                    
                    {/* Botones de acción */}
                    <div className="flex gap-2 mt-4">
                      <Button
                        onClick={handleVerificacion}
                        disabled={estimacionUsuario === null || estaVerificando || hasVerified}
                        className="flex-1"
                      >
                        <Search className="h-4 w-4 mr-2" />
                        {estaVerificando ? 'Buscando c...' : 'Buscar c'}
                      </Button>
                      <Button
                        onClick={() => {
                          resetEstimation()
                          // También resetear el escenario para limpiar el punto c real
                          resetear()
                          console.log('🔄 Estimación reseteada - puedes reposicionar')
                        }}
                        variant="outline"
                        disabled={estimacionUsuario === null}
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Intentar de nuevo
                      </Button>
                    </div>
                    
                    {/* Indicadores de estado */}
                    {isEstimating && !hasVerified && (
                      <div className="mt-2 text-sm text-blue-600">
                        Estimando c... Haz clic para reposicionar (Intento {attempts})
                      </div>
                    )}
                    
                    {hasVerified && (
                      <div className="mt-2 text-sm text-green-600">
                        ✅ c verificado - Usa "Intentar de nuevo" para reposicionar
                      </div>
                    )}
                    
                    {!isEstimating && !hasVerified && estimacionUsuario !== null && (
                      <div className="mt-2 text-sm text-orange-600">
                        ⚠️ Estimación colocada - Haz clic en "Buscar c" para verificar
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Resultados */}
                {estimacionUsuario !== null && puntoCReal !== null && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Resultado</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Debug info */}
                        {console.log('🔍 Valores en resultados:', {
                          estimacionUsuario,
                          puntoCReal,
                          errorEstimacion,
                          verificacionExitosa
                        })}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Tu estimación:</span>
                            <span className="ml-2 text-blue-600">{estimacionUsuario.toFixed(3)}</span>
                          </div>
                          <div>
                            <span className="font-medium">c real:</span>
                            <span className="ml-2 text-orange-600">{puntoCReal.toFixed(3)}</span>
                          </div>
                          <div>
                            <span className="font-medium">Error:</span>
                            <span className="ml-2 text-red-600">{errorEstimacion.toFixed(3)}</span>
                          </div>
                          <div>
                            <span className="font-medium">Precisión:</span>
                            <span className="ml-2 text-green-600">
                              {(() => {
                                if (Math.abs(puntoCReal) < 0.001) {
                                  // Si el punto c real es muy cercano a 0, usar una escala diferente
                                  if (errorEstimacion < 0.1) return '100.0%'
                                  if (errorEstimacion < 0.3) return '90.0%'
                                  if (errorEstimacion < 0.6) return '70.0%'
                                  if (errorEstimacion < 1.0) return '50.0%'
                                  return `${Math.max(0, (1 - errorEstimacion) * 100).toFixed(1)}%`
                                }
                                const precision = Math.max(0, (1 - errorEstimacion / Math.abs(puntoCReal)) * 100)
                                return precision.toFixed(1) + '%'
                              })()}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {verificacionExitosa ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-500" />
                            )}
                            <span className="font-medium">
                              {verificacionExitosa ? 'Verificación exitosa' : 'Verificación fallida'}
                            </span>
                          </div>
                          <Badge className={obtenerClasificacionError(errorEstimacion).color}>
                            {obtenerClasificacionError(errorEstimacion).emoji} {obtenerClasificacionError(errorEstimacion).nivel}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
              </TabsContent>
            </Tabs>
          </TabsContent>
          
          {/* Contenido del Segundo Teorema Fundamental */}
          <TabsContent value="segundo-teorema" className="space-y-6">
            {/* Subpestañas para el Segundo Teorema Fundamental */}
            <Tabs value={tabActivo} onValueChange={setTabActivo}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="teoria" className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  Teoría
                </TabsTrigger>
                <TabsTrigger value="visualizacion" className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Visualizaciones
                </TabsTrigger>
                <TabsTrigger value="ejemplos" className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  Ejemplos
                </TabsTrigger>
              </TabsList>
              
              {/* Pestaña de Teoría del Segundo Teorema */}
              <TabsContent value="teoria" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Calculator className="h-6 w-6" />
                  Segundo Teorema Fundamental del Cálculo
                </CardTitle>
                <CardDescription>
                  La conexión entre derivadas e integrales definidas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">Enunciado del Teorema</h3>
                  <p className="text-blue-700 mb-3">
                    Si f es continua en [a, b] y F(x) = ∫[a,x] f(t) dt, entonces F'(x) = f(x) para todo x en [a, b].
                  </p>
                  <div className="bg-white p-3 rounded border-l-4 border-blue-500">
                    <code className="text-sm font-mono">
                      d/dx [∫[a,x] f(t) dt] = f(x)
                    </code>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Interpretación Geométrica</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>La derivada de la integral es la función original</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>Conecta el área bajo la curva con la pendiente</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>Fundamental para el cálculo de integrales</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Aplicaciones</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        <span>Cálculo de integrales definidas</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        <span>Resolución de ecuaciones diferenciales</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        <span>Análisis de funciones acumulativas</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-yellow-800 mb-2">Ejemplo Práctico</h3>
                  <p className="text-yellow-700 mb-3">
                    Si f(x) = x², entonces F(x) = ∫[0,x] t² dt = x³/3
                  </p>
                  <p className="text-yellow-700">
                    Verificamos: F'(x) = d/dx[x³/3] = x² = f(x) ✓
                  </p>
                </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Pestaña de Visualizaciones del Segundo Teorema */}
              <TabsContent value="visualizacion" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Panel de Controles del Segundo Teorema */}
                  <div className="space-y-4">
                    {/* Controles Interactivos */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Controles del Segundo Teorema</CardTitle>
                        <CardDescription>
                          Configura la función y los límites de integración
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Límites */}
                        <div className="space-y-3">
                          <label className="text-sm font-medium">Límite inferior a = {limiteASegundoTeorema.toFixed(1)}</label>
                          <Slider
                            value={[limiteASegundoTeorema]}
                            onValueChange={(value) => handleLimitesSegundoTeorema(value[0], limiteBSegundoTeorema)}
                            min={-4}
                            max={4}
                            step={0.1}
                            className="w-full"
                          />
                        </div>
                        
                        <div className="space-y-3">
                          <label className="text-sm font-medium">Límite superior b = {limiteBSegundoTeorema.toFixed(1)}</label>
                          <Slider
                            value={[limiteBSegundoTeorema]}
                            onValueChange={(value) => handleLimitesSegundoTeorema(limiteASegundoTeorema, value[0])}
                            min={-4}
                            max={4}
                            step={0.1}
                            className="w-full"
                          />
                        </div>
                        
                        {/* Tipo de función */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Tipo de función</label>
                          <div className="grid grid-cols-2 gap-2">
                            <Button
                              variant={funcionSegundoTeorema === 'seno' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => handleFuncionSegundoTeorema('seno')}
                            >
                              sin(x)
                            </Button>
                            <Button
                              variant={funcionSegundoTeorema === 'coseno' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => handleFuncionSegundoTeorema('coseno')}
                            >
                              cos(x)
                            </Button>
                            <Button
                              variant={funcionSegundoTeorema === 'exponencial' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => handleFuncionSegundoTeorema('exponencial')}
                            >
                              e^x
                            </Button>
                            <Button
                              variant={funcionSegundoTeorema === 'personalizada' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => handleFuncionSegundoTeorema('personalizada')}
                            >
                              f(x)
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Objetivo Principal */}
                    <div className="bg-purple-100 p-4 rounded-lg mb-4">
                      <h3 className="text-lg font-semibold text-purple-800 mb-2">
                        🎯 Objetivo: Usa el Segundo Teorema Fundamental para calcular la integral
                      </h3>
                    </div>

                    {/* Paso 1: Función dada */}
                    <div className="bg-blue-50 p-4 rounded-lg mb-4">
                      <h3 className="text-lg font-semibold text-blue-800 mb-2">Paso 1: Función dada</h3>
                      <div className="text-center">
                        <div className="text-2xl font-mono mb-2">
                          f(x) = {funcionSegundoTeorema === 'seno' ? 'sin(x)' : 
                                 funcionSegundoTeorema === 'coseno' ? 'cos(x)' :
                                 funcionSegundoTeorema === 'exponencial' ? 'e^x' : 
                                 funcionSegundoTeorema === 'personalizada' ? (funcionPersonalizadaSegundoTeorema || 'f(x)') : 'sin(x)'}
                        </div>
                        <div className="text-gray-600">
                          Queremos calcular: ∫[{limiteASegundoTeorema.toFixed(1)} → {limiteBSegundoTeorema.toFixed(1)}] f(x)dx
                        </div>
                        
                        {/* Entrada de función personalizada */}
                        {funcionSegundoTeorema === 'personalizada' && (
                          <div className="mt-4 space-y-2">
                            <label className="text-sm font-medium">Ingresa tu función personalizada:</label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={funcionPersonalizadaSegundoTeorema}
                                onChange={(e) => handleFuncionPersonalizadaSegundoTeorema(e.target.value)}
                                placeholder="Ej: x**2 + 3*x + 1"
                                className="flex-1 p-2 border rounded text-sm"
                              />
                              <Button
                                onClick={() => setMostrarTecladoSegundoTeorema(!mostrarTecladoSegundoTeorema)}
                                variant="outline"
                                size="sm"
                              >
                                {mostrarTecladoSegundoTeorema ? "Ocultar" : "Mostrar"} Teclado
                              </Button>
                            </div>
                            
                            {errorFuncionPersonalizadaSegundoTeorema && (
                              <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                                {errorFuncionPersonalizadaSegundoTeorema}
                              </div>
                            )}
                            
                            {/* Teclado Matemático para función personalizada */}
                            {mostrarTecladoSegundoTeorema && (
                              <div className="bg-gray-50 p-4 rounded-lg mt-2">
                                <h4 className="text-sm font-medium mb-2">Teclado Matemático</h4>
                                <div className="grid grid-cols-6 gap-2">
                                  {/* Números */}
                                  {['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
                                    <Button
                                      key={num}
                                      size="sm"
                                      variant="outline"
                                      onClick={() => setFuncionPersonalizadaSegundoTeorema(prev => prev + num)}
                                      className="text-xs"
                                    >
                                      {num}
                                    </Button>
                                  ))}
                                  
                                  {/* Operaciones */}
                                  {['+', '-', '*', '/', '^', '(', ')'].map(op => (
                                    <Button
                                      key={op}
                                      size="sm"
                                      variant="outline"
                                      onClick={() => setFuncionPersonalizadaSegundoTeorema(prev => prev + op)}
                                      className="text-xs"
                                    >
                                      {op}
                                    </Button>
                                  ))}
                                  
                                  {/* Funciones */}
                                  {['sin', 'cos', 'tan', 'log', 'exp', 'sqrt'].map(func => (
                                    <Button
                                      key={func}
                                      size="sm"
                                      variant="outline"
                                      onClick={() => setFuncionPersonalizadaSegundoTeorema(prev => prev + func + '(x)')}
                                      className="text-xs"
                                    >
                                      {func}
                                    </Button>
                                  ))}
                                  
                                  {/* Variable x */}
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setFuncionPersonalizadaSegundoTeorema(prev => prev + 'x')}
                                    className="text-xs"
                                  >
                                    x
                                  </Button>
                                  
                                  {/* Control */}
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setFuncionPersonalizadaSegundoTeorema(prev => prev.slice(0, -1))}
                                    className="text-xs"
                                  >
                                    ←
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setFuncionPersonalizadaSegundoTeorema('')}
                                    className="text-xs"
                                  >
                                    C
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Paso 2: Encuentra la antiderivada */}
                    <div className="bg-green-50 p-4 rounded-lg mb-4">
                      <h3 className="text-lg font-semibold text-green-800 mb-2">Paso 2: Encuentra la antiderivada F(x)</h3>
                      <div className="mb-4">
                        <div className="text-gray-700 mb-2">
                          Recuerda: F'(x) = f(x). ¿Qué función al derivarla da {funcionSegundoTeorema === 'seno' ? 'sin(x)' : 
                                                                                    funcionSegundoTeorema === 'coseno' ? 'cos(x)' :
                                                                                    funcionSegundoTeorema === 'exponencial' ? 'e^x' : 'f(x)'}?
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          {funcionSegundoTeorema === 'seno' ? 'Ej: -cos(x), -Math.cos(x)' :
                           funcionSegundoTeorema === 'coseno' ? 'Ej: sin(x), Math.sin(x)' :
                           funcionSegundoTeorema === 'exponencial' ? 'Ej: exp(x), Math.exp(x)' :
                           'Ej: (x**2)/2, (x**3)/3'}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">F(x) =</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={antiderivadaUsuario}
                            onChange={(e) => setAntiderivadaUsuario(e.target.value)}
                            placeholder="Ej: -cos(x)"
                            className="flex-1 p-2 border rounded text-sm"
                          />
                          <Button
                            onClick={() => setMostrarTecladoSegundoTeorema(!mostrarTecladoSegundoTeorema)}
                            variant="outline"
                            size="sm"
                          >
                            {mostrarTecladoSegundoTeorema ? "Ocultar" : "Mostrar"} Teclado
                          </Button>
                        </div>
                        
                        {/* Teclado Matemático */}
                        {mostrarTecladoSegundoTeorema && (
                          <div className="bg-gray-50 p-4 rounded-lg mt-2">
                            <h4 className="text-sm font-medium mb-2">Teclado Matemático</h4>
                            <div className="grid grid-cols-6 gap-2">
                              {/* Números */}
                              {['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
                                <Button
                                  key={num}
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setAntiderivadaUsuario(prev => prev + num)}
                                  className="text-xs"
                                >
                                  {num}
                                </Button>
                              ))}
                              
                              {/* Operaciones */}
                              {['+', '-', '*', '/', '^', '(', ')'].map(op => (
                                <Button
                                  key={op}
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setAntiderivadaUsuario(prev => prev + op)}
                                  className="text-xs"
                                >
                                  {op}
                                </Button>
                              ))}
                              
                              {/* Funciones */}
                              {['sin', 'cos', 'tan', 'log', 'exp', 'sqrt'].map(func => (
                                <Button
                                  key={func}
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setAntiderivadaUsuario(prev => prev + func + '(x)')}
                                  className="text-xs"
                                >
                                  {func}
                                </Button>
                              ))}
                              
                              {/* Variable x */}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setAntiderivadaUsuario(prev => prev + 'x')}
                                className="text-xs"
                              >
                                x
                              </Button>
                              
                              {/* Control */}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setAntiderivadaUsuario(prev => prev.slice(0, -1))}
                                className="text-xs"
                              >
                                ←
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setAntiderivadaUsuario('')}
                                className="text-xs"
                              >
                                C
                              </Button>
                            </div>
                          </div>
                        )}
                        
                        {errorAntiderivada && (
                          <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                            {errorAntiderivada}
                          </div>
                        )}
                        
                        <Button onClick={handleValidarAntiderivada} size="sm" className="w-full">
                          Confirmar
                        </Button>
                      </div>
                    </div>

                    {/* Paso 3: Evalúa en los límites */}
                    <div className="bg-yellow-50 p-4 rounded-lg mb-4">
                      <h3 className="text-lg font-semibold text-yellow-800 mb-2">Paso 3: Evalúa en los límites</h3>
                      <div className="mb-4">
                        <div className="text-gray-700 mb-2">
                          Calcula F(a) y F(b) usando tu antiderivada F(x) = {antiderivadaUsuario || 'F(x)'}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">F({limiteASegundoTeorema.toFixed(1)}) =</label>
                          <input
                            type="text"
                            value={evaluacionA}
                            onChange={(e) => setEvaluacionA(e.target.value)}
                            placeholder={`Ej: F(${limiteASegundoTeorema.toFixed(1)})`}
                            className="w-full p-2 border rounded text-sm"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">F({limiteBSegundoTeorema.toFixed(1)}) =</label>
                          <input
                            type="text"
                            value={evaluacionB}
                            onChange={(e) => setEvaluacionB(e.target.value)}
                            placeholder={`Ej: F(${limiteBSegundoTeorema.toFixed(1)})`}
                            className="w-full p-2 border rounded text-sm"
                          />
                        </div>
                      </div>
                      
                      {errorEvaluacion && (
                        <div className="text-sm text-red-600 bg-red-50 p-2 rounded mt-2">
                          {errorEvaluacion}
                        </div>
                      )}
                      
                      <Button onClick={handleValidarEvaluacion} size="sm" className="w-full mt-2">
                        Confirmar
                      </Button>
                    </div>

                    {/* Paso 4: Calcula la integral */}
                    <div className="bg-purple-50 p-4 rounded-lg mb-4">
                      <h3 className="text-lg font-semibold text-purple-800 mb-2">Paso 4: Calcula la integral</h3>
                      <div className="mb-4">
                        <div className="text-gray-700 mb-2">
                          Usa la fórmula: ∫[{limiteASegundoTeorema.toFixed(1)} → {limiteBSegundoTeorema.toFixed(1)}] f(x)dx = F({limiteBSegundoTeorema.toFixed(1)}) - F({limiteASegundoTeorema.toFixed(1)})
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-center">
                          <div className="text-xl font-mono">
                            ∫[{limiteASegundoTeorema.toFixed(1)} → {limiteBSegundoTeorema.toFixed(1)}] f(x)dx = {evaluacionB} - {evaluacionA}
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-2xl font-mono">
                            = {resultadoIntegral.toFixed(4)}
                          </div>
                        </div>
                        
                        <Button onClick={handleCalcularResultado} size="sm" className="w-full">
                          Calcular Integral
                        </Button>
                      </div>
                    </div>

                    {/* Botón Resetear */}
                    <Button onClick={handleResetearSegundoTeorema} variant="outline" className="w-full">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Resetear Proceso
                    </Button>
                  </div>

                  {/* Gráfica del Segundo Teorema */}
                  <div className="lg:col-span-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Visualización del Segundo Teorema</CardTitle>
                        <CardDescription>
                          Gráfica interactiva del área bajo la curva
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-white border rounded-lg p-4">
                          <canvas
                            ref={canvasSegundoTeoremaRef}
                            width={800}
                            height={400}
                            className="w-full h-64 border border-gray-300 rounded"
                            style={{ width: '100%', height: '256px', display: 'block' }}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              
              {/* Pestaña de Ejemplos del Segundo Teorema */}
              <TabsContent value="ejemplos" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5" />
                      Ejemplos del Segundo Teorema Fundamental
                    </CardTitle>
                    <CardDescription>
                      Haz clic en un ejemplo para cargarlo y explorar el Segundo Teorema Fundamental
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Ejemplo 1: Integral de sin(x) */}
                      <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleCargarEjemploSegundoTeorema({
                        id: 'seno',
                        titulo: 'Integral de sin(x)',
                        descripcion: 'Calcular ∫[0, π] sin(x) dx',
                        tipoFuncion: 'seno',
                        limiteA: 0,
                        limiteB: Math.PI,
                        resultado: 2
                      })}>
                        <div className="flex items-start gap-3">
                          <div className="text-blue-600 text-xl">∫</div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-800 mb-1">
                              Integral de sin(x)
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                              Calcular ∫[0, π] sin(x) dx usando el Segundo Teorema
                            </p>
                            <div className="text-sm text-gray-700 mb-2">
                              <strong>Función:</strong> sin(x)
                            </div>
                            <div className="text-sm text-gray-700 mb-2">
                              <strong>Intervalo:</strong> [0, π]
                            </div>
                            <div className="text-sm text-gray-700 mb-2">
                              <strong>Resultado:</strong> 2
                            </div>
                            <div className="bg-blue-50 p-2 rounded text-sm text-blue-800 mb-3">
                              La antiderivada de sin(x) es -cos(x)
                            </div>
                          </div>
                        </div>
                      </Card>

                      {/* Ejemplo 2: Integral de cos(x) */}
                      <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleCargarEjemploSegundoTeorema({
                        id: 'coseno',
                        titulo: 'Integral de cos(x)',
                        descripcion: 'Calcular ∫[0, π/2] cos(x) dx',
                        tipoFuncion: 'coseno',
                        limiteA: 0,
                        limiteB: Math.PI / 2,
                        resultado: 1
                      })}>
                        <div className="flex items-start gap-3">
                          <div className="text-green-600 text-xl">∫</div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-800 mb-1">
                              Integral de cos(x)
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                              Calcular ∫[0, π/2] cos(x) dx usando el Segundo Teorema
                            </p>
                            <div className="text-sm text-gray-700 mb-2">
                              <strong>Función:</strong> cos(x)
                            </div>
                            <div className="text-sm text-gray-700 mb-2">
                              <strong>Intervalo:</strong> [0, π/2]
                            </div>
                            <div className="text-sm text-gray-700 mb-2">
                              <strong>Resultado:</strong> 1
                            </div>
                            <div className="bg-green-50 p-2 rounded text-sm text-green-800 mb-3">
                              La antiderivada de cos(x) es sin(x)
                            </div>
                          </div>
                        </div>
                      </Card>

                      {/* Ejemplo 3: Integral de e^x */}
                      <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleCargarEjemploSegundoTeorema({
                        id: 'exponencial',
                        titulo: 'Integral de e^x',
                        descripcion: 'Calcular ∫[0, 1] e^x dx',
                        tipoFuncion: 'exponencial',
                        limiteA: 0,
                        limiteB: 1,
                        resultado: Math.E - 1
                      })}>
                        <div className="flex items-start gap-3">
                          <div className="text-purple-600 text-xl">∫</div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-800 mb-1">
                              Integral de e^x
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                              Calcular ∫[0, 1] e^x dx usando el Segundo Teorema
                            </p>
                            <div className="text-sm text-gray-700 mb-2">
                              <strong>Función:</strong> e^x
                            </div>
                            <div className="text-sm text-gray-700 mb-2">
                              <strong>Intervalo:</strong> [0, 1]
                            </div>
                            <div className="text-sm text-gray-700 mb-2">
                              <strong>Resultado:</strong> e - 1
                            </div>
                            <div className="bg-purple-50 p-2 rounded text-sm text-purple-800 mb-3">
                              La antiderivada de e^x es e^x
                            </div>
                          </div>
                        </div>
                      </Card>

                      {/* Ejemplo 4: Integral de x² */}
                      <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleCargarEjemploSegundoTeorema({
                        id: 'polinomio',
                        titulo: 'Integral de x²',
                        descripcion: 'Calcular ∫[0, 2] x² dx',
                        tipoFuncion: 'personalizada',
                        funcionPersonalizada: 'x**2',
                        limiteA: 0,
                        limiteB: 2,
                        resultado: 8/3
                      })}>
                        <div className="flex items-start gap-3">
                          <div className="text-orange-600 text-xl">∫</div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-800 mb-1">
                              Integral de x²
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                              Calcular ∫[0, 2] x² dx usando el Segundo Teorema
                            </p>
                            <div className="text-sm text-gray-700 mb-2">
                              <strong>Función:</strong> x²
                            </div>
                            <div className="text-sm text-gray-700 mb-2">
                              <strong>Intervalo:</strong> [0, 2]
                            </div>
                            <div className="text-sm text-gray-700 mb-2">
                              <strong>Resultado:</strong> 8/3
                            </div>
                            <div className="bg-orange-50 p-2 rounded text-sm text-orange-800 mb-3">
                              La antiderivada de x² es x³/3
                            </div>
                          </div>
                        </div>
                      </Card>
                </div>
              </CardContent>
            </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default TorreValorMedioDemo

/**
 * Escenario Torre del Valor Medio
 * Extiende Escenario.js y maneja el Teorema del Valor Medio
 */
import { Escenario } from './Escenario.js'
import { EstadoTorreValorMedio } from '../entidades/EstadoTorreValorMedio.js'
import { ConfiguracionTorreValorMedio } from '../entidades/ConfiguracionTorreValorMedio.js'
import { CalculadoraValorMedio } from '../servicios/CalculadoraValorMedio.js'
import { GestorVisualizacionTorre } from '../servicios/GestorVisualizacionTorre.js'
import { GestorLogros } from '../servicios/GestorLogros.js'
import { GestorTeoria } from '../servicios/GestorTeoria.js'
import { RenderizadorTorre } from '../presentacion/RenderizadorTorre.js'
import { RenderizadorCartesianoTorre } from '../presentacion/RenderizadorCartesianoTorre.js'

// Importaciones para el Segundo Teorema
import { EstadoSegundoTeorema } from '../entidades/EstadoSegundoTeorema.js'
import { ConfiguracionSegundoTeorema } from '../entidades/ConfiguracionSegundoTeorema.js'
import { CalculadoraSegundoTeorema } from '../servicios/CalculadoraSegundoTeorema.js'
import { TeoriaSegundoTeorema } from '../entidades/TeoriaSegundoTeorema.js'
import { EjemplosSegundoTeorema } from '../entidades/EjemplosSegundoTeorema.js'
import { RenderizadorSegundoTeorema } from '../presentacion/RenderizadorSegundoTeorema.js'

export class EscenarioTorreValorMedio extends Escenario {
    constructor() {
        super('Torre del Valor Medio', 'Escenario para el Teorema del Valor Medio y Segundo Teorema Fundamental')
        
        // Estado y configuración específicos del Teorema del Valor Medio
        this.estadoTorre = new EstadoTorreValorMedio()
        this.configuracionTorre = new ConfiguracionTorreValorMedio()
        
        // Estado y configuración específicos del Segundo Teorema
        this.estadoSegundoTeorema = new EstadoSegundoTeorema()
        this.configuracionSegundoTeorema = new ConfiguracionSegundoTeorema()
        
        // Servicios del Teorema del Valor Medio
        this.calculadora = new CalculadoraValorMedio()
        this.gestorLogros = new GestorLogros()
        this.gestorTeoria = new GestorTeoria()
        this.gestorVisualizacion = new GestorVisualizacionTorre(
            this.estadoTorre,
            this.configuracionTorre,
            this.calculadora
        )
        
        // Servicios del Segundo Teorema
        this.calculadoraSegundoTeorema = new CalculadoraSegundoTeorema()
        this.teoriaSegundoTeorema = new TeoriaSegundoTeorema()
        this.ejemplosSegundoTeorema = new EjemplosSegundoTeorema()
        
        // Renderizadores del Teorema del Valor Medio
        this.renderizadorTorre = null
        this.renderizadorCartesiano = null
        
        // Renderizadores del Segundo Teorema
        this.renderizadorSegundoTeorema = null
        
        // Estado de inicialización
        this.inicializado = false
        this.canvasConfigurado = false
        this.teoremaActivo = 'valor-medio' // 'valor-medio' o 'segundo-teorema'
    }

    // ✅ INICIALIZAR ESCENARIO
    inicializar() {
        try {
            // Asignar estado y configuración al escenario base
            this.estado = this.estadoTorre
            this.configuracion = this.configuracionTorre
            
            // Inicializar gestor de visualización
            this.gestorVisualizacion = new GestorVisualizacionTorre(
                this.estadoTorre,
                this.configuracionTorre,
                this.calculadora
            )
            
            this.inicializado = true
            return this
        } catch (error) {
            console.error('Error inicializando EscenarioTorreValorMedio:', error)
            throw error
        }
    }

    // ✅ CONFIGURAR CANVAS
    configurarCanvas(canvasTorre, canvasCartesiano, containerTooltip = null) {
        try {
            if (!this.inicializado) {
                throw new Error('El escenario debe estar inicializado antes de configurar canvas')
            }
            
            // Configurar gestor de visualización
            this.gestorVisualizacion.configurarCanvas(canvasTorre, canvasCartesiano)
            
            // Crear renderizadores
            this.renderizadorTorre = new RenderizadorTorre(canvasTorre, this.configuracionTorre)
            this.renderizadorCartesiano = new RenderizadorCartesianoTorre(canvasCartesiano, this.configuracionTorre)
            
            // Configurar dimensiones
            this.renderizadorTorre.configurarDimensiones()
            this.renderizadorCartesiano.configurarDimensiones()
            
            this.canvasConfigurado = true
            
            // Renderizar inicial
            this.renderizarCompleto()
            
            return this
        } catch (error) {
            console.error('Error configurando canvas:', error)
            throw error
        }
    }

    // ✅ RENDERIZAR COMPLETO
    renderizarCompleto() {
        if (!this.canvasConfigurado) return
        
        try {
            const funcion = this.estadoTorre.obtenerFuncion()
            const limites = this.estadoTorre.obtenerLimites()
            const alturaPromedio = this.estadoTorre.obtenerAlturaPromedio()
            const estimacionUsuario = this.estadoTorre.obtenerEstimacionUsuario()
            const puntoCReal = this.estadoTorre.obtenerPuntoCReal()
            
            // Renderizar torre
            if (this.renderizadorTorre) {
                this.renderizadorTorre.renderizar(funcion, limites, alturaPromedio, estimacionUsuario)
            }
            
            // Renderizar plano cartesiano
            if (this.renderizadorCartesiano) {
                this.renderizadorCartesiano.renderizar(funcion, limites, estimacionUsuario, puntoCReal)
            }
        } catch (error) {
            console.error('Error en renderizado completo:', error)
        }
    }

    // ✅ ESTABLECER FUNCIÓN
    establecerFuncion(tipo, funcionPersonalizada = '') {
        try {
            this.estadoTorre.establecerFuncion(tipo, funcionPersonalizada)
            this.renderizarCompleto()
            return this
        } catch (error) {
            console.error('Error estableciendo función:', error)
            throw error
        }
    }

    // ✅ ESTABLECER LÍMITES
    establecerLimites(a, b) {
        try {
            this.estadoTorre.establecerLimites(a, b)
            this.renderizarCompleto()
            return this
        } catch (error) {
            console.error('Error estableciendo límites:', error)
            throw error
        }
    }

    // ✅ ESTABLECER ESTIMACIÓN DEL USUARIO
    establecerEstimacionUsuario(c) {
        try {
            this.estadoTorre.establecerEstimacionUsuario(c)
            this.renderizarCompleto()
            return this
        } catch (error) {
            console.error('Error estableciendo estimación:', error)
            throw error
        }
    }

    // ✅ CALCULAR PUNTO C REAL
    calcularPuntoCReal() {
        try {
            const puntoCReal = this.estadoTorre.calcularPuntoCReal()
            this.renderizarCompleto()
            return puntoCReal
        } catch (error) {
            console.error('Error calculando punto c real:', error)
            throw error
        }
    }

    // ✅ VERIFICAR ESTIMACIÓN
    verificarEstimacion() {
        try {
            const verificacionExitosa = this.estadoTorre.verificarEstimacion()
            this.renderizarCompleto()
            return verificacionExitosa
        } catch (error) {
            console.error('Error verificando estimación:', error)
            throw error
        }
    }

    // ✅ CARGAR EJEMPLO
    cargarEjemplo(ejemplo) {
        try {
            this.estadoTorre.cargarEjemplo(ejemplo)
            this.renderizarCompleto()
            return this
        } catch (error) {
            console.error('Error cargando ejemplo:', error)
            throw error
        }
    }

    // ✅ RESETEAR ESCENARIO
    resetear() {
        try {
            this.estadoTorre.resetear()
            this.renderizarCompleto()
            return this
        } catch (error) {
            console.error('Error reseteando escenario:', error)
            throw error
        }
    }

    // ✅ MANEJAR CLICK EN TORRE
    manejarClickTorre(evento) {
        if (!this.renderizadorTorre) return null
        
        try {
            const limites = this.estadoTorre.obtenerLimites()
            
            if (this.renderizadorTorre.esClickValido(evento, limites)) {
                const x = this.renderizadorTorre.convertirCoordenadasAX(evento, limites)
                if (x !== null) {
                    this.establecerEstimacionUsuario(x)
                    return x
                }
            }
            
            return null
        } catch (error) {
            console.error('Error manejando click en torre:', error)
            return null
        }
    }

    // ✅ MANEJAR CLICK EN CARTESIANO
    manejarClickCartesiano(evento) {
        if (!this.renderizadorCartesiano) return null
        
        try {
            const limites = this.estadoTorre.obtenerLimites()
            
            if (this.renderizadorCartesiano.esClickValido(evento, limites)) {
                const { x } = this.renderizadorCartesiano.obtenerCoordenadasClick(evento)
                this.establecerEstimacionUsuario(x)
                return x
            }
            
            return null
        } catch (error) {
            console.error('Error manejando click en cartesiano:', error)
            return null
        }
    }

    // ✅ OBTENER INFORMACIÓN DE HOVER
    obtenerInformacionHover(evento, tipoCanvas) {
        try {
            if (tipoCanvas === 'torre' && this.renderizadorTorre) {
                const limites = this.estadoTorre.obtenerLimites()
                const posicionRelativa = this.renderizadorTorre.obtenerCoordenadasClick(evento)
                if (posicionRelativa !== null) {
                    const { a, b } = limites
                    const x = a + posicionRelativa * (b - a)
                    const funcion = this.estadoTorre.obtenerFuncion()
                    const y = funcion(x)
                    return { x, y }
                }
            } else if (tipoCanvas === 'cartesiano' && this.renderizadorCartesiano) {
                return this.renderizadorCartesiano.obtenerCoordenadasClick(evento)
            }
            
            return null
        } catch (error) {
            console.error('Error obteniendo información de hover:', error)
            return null
        }
    }

    // ✅ OBTENER ESTADO
    obtenerEstado() {
        return this.estadoTorre
    }

    // ✅ OBTENER CONFIGURACIÓN
    obtenerConfiguracion() {
        return this.configuracionTorre
    }

    // ✅ OBTENER CÁLCULOS
    obtenerCalculos() {
        return {
            alturaPromedio: this.estadoTorre.obtenerAlturaPromedio(),
            estimacionUsuario: this.estadoTorre.obtenerEstimacionUsuario(),
            puntoCReal: this.estadoTorre.obtenerPuntoCReal(),
            errorEstimacion: this.estadoTorre.obtenerErrorEstimacion(),
            verificacionExitosa: this.estadoTorre.obtenerVerificacionExitosa()
        }
    }

    // ✅ OBTENER MÉTRICAS
    obtenerMetricas() {
        return this.estadoTorre.obtenerMetricas()
    }

    // ✅ OBTENER EJEMPLOS
    obtenerEjemplos() {
        return this.configuracionTorre.obtenerTodosLosEjemplos()
    }

    // ✅ OBTENER LOGROS
    obtenerLogros() {
        try {
            const usuarioActual = this.gestorLogros.servicioAuth.obtenerUsuarioActual()
            if (usuarioActual && usuarioActual.esEstudiante()) {
                return this.gestorLogros.obtenerLogrosEstudiante(usuarioActual.id)
            }
        } catch (error) {
            console.error('Error obteniendo logros:', error)
        }
        return []
    }

    // ✅ VERIFICAR LOGROS
    verificarLogros() {
        const datos = {
            estimacionUsuario: this.estadoTorre.obtenerEstimacionUsuario(),
            errorEstimacion: this.estadoTorre.obtenerErrorEstimacion(),
            estimacionesExcelentes: this.estadoTorre.obtenerMetricas().estimacionesExcelentes,
            ejemplosCompletados: this.estadoTorre.obtenerEjemplosCompletados?.() || 0,
            tiempoCompletado: this.estadoTorre.obtenerTiempoTranscurrido()
        }
        
        try {
          const usuarioActual = this.gestorLogros.servicioAuth.obtenerUsuarioActual()
          if (usuarioActual && usuarioActual.esEstudiante()) {
            return this.gestorLogros.verificarLogrosEstudiante(usuarioActual.id)
          }
        } catch (error) {
          console.error('Error verificando logros:', error)
        }
        return []
    }

    // ✅ VERIFICAR LOGROS SEGUNDO TEOREMA FUNDAMENTAL
    verificarLogrosSegundoTeorema() {
        try {
            const usuarioActual = this.gestorLogros.servicioAuth.obtenerUsuarioActual()
            if (usuarioActual && usuarioActual.esEstudiante()) {
                const datosSegundoTeorema = {
                    pasoCompletado: this.estadoSegundoTeorema.obtenerPasoActual(),
                    pasosCompletados: this.estadoSegundoTeorema.obtenerPasosCompletados(),
                    antiderivadaCorrecta: this.estadoSegundoTeorema.obtenerAntiderivadaValida(),
                    evaluacionCorrecta: this.estadoSegundoTeorema.obtenerEvaluacionValida(),
                    funcionesCompletadas: this.estadoSegundoTeorema.obtenerFuncionesCompletadas?.() || [],
                    procesoCompletado: this.estadoSegundoTeorema.obtenerProcesoCompletado()
                }

                console.log('🏆 Verificando logros Segundo Teorema:', datosSegundoTeorema)
                return this.gestorLogros.verificarLogrosSegundoTeorema(usuarioActual.id, datosSegundoTeorema)
            }
        } catch (error) {
            console.error('Error verificando logros Segundo Teorema:', error)
        }
        return []
    }

    // ✅ VERIFICAR CONDICIONES DEL TEOREMA
    verificarCondicionesTeorema() {
        const funcion = this.estadoTorre.obtenerFuncion()
        const limites = this.estadoTorre.obtenerLimites()
        
        return this.calculadora.verificarCondicionesTeorema(funcion, limites.a, limites.b)
    }

    // ✅ OBTENER INFORMACIÓN DEL TEOREMA
    obtenerInformacionTeorema() {
        console.log('📚 Obteniendo información del teorema...')
        console.log('- GestorTeoria:', this.gestorTeoria)
        
        if (!this.gestorTeoria) {
            console.error('❌ GestorTeoria no está inicializado')
            return null
        }
        
        const teoria = this.gestorTeoria.obtenerTeoria('torreValorMedio')
        console.log('- Teoría obtenida:', teoria)
        
        if (!teoria) {
            console.error('❌ No se encontró la teoría torreValorMedio')
            return null
        }
        
        const limites = this.estadoTorre.obtenerLimites()
        const funcion = this.estadoTorre.obtenerFuncion()
        const alturaPromedio = this.estadoTorre.obtenerAlturaPromedio()
        
        const informacionCompleta = teoria.obtenerInformacionCompleta()
        console.log('- Información completa:', informacionCompleta)
        
        return {
            ...informacionCompleta,
            datosDinamicos: {
                limites: limites,
                alturaPromedio: alturaPromedio,
                pendienteSecante: this.calculadora.calcularPendienteSecante(funcion, limites.a, limites.b)
            }
        }
    }

    // ========================================
    // MÉTODOS PARA EL SEGUNDO TEOREMA FUNDAMENTAL
    // ========================================

    // ✅ CAMBIAR TEOREMA ACTIVO
    cambiarTeoremaActivo(teorema) {
        this.teoremaActivo = teorema
        return this
    }

    // ✅ OBTENER TEOREMA ACTIVO
    obtenerTeoremaActivo() {
        return this.teoremaActivo
    }

    // ✅ CONFIGURAR CANVAS SEGUNDO TEOREMA
    configurarCanvasSegundoTeorema(canvasSegundoTeorema) {
        console.log('🎨 configurarCanvasSegundoTeorema ejecutado')
        console.log('- canvasSegundoTeorema:', !!canvasSegundoTeorema)
        console.log('- canvasSegundoTeorema tipo:', typeof canvasSegundoTeorema)
        console.log('- canvasSegundoTeorema width:', canvasSegundoTeorema?.width)
        console.log('- canvasSegundoTeorema height:', canvasSegundoTeorema?.height)
        console.log('- inicializado:', this.inicializado)
        
        try {
            if (!this.inicializado) {
                throw new Error('El escenario debe estar inicializado antes de configurar canvas')
            }
            
            console.log('✅ Creando RenderizadorSegundoTeorema...')
            this.renderizadorSegundoTeorema = new RenderizadorSegundoTeorema(canvasSegundoTeorema)
            console.log('✅ RenderizadorSegundoTeorema creado:', !!this.renderizadorSegundoTeorema)
            console.log('- renderizadorSegundoTeorema tipo:', typeof this.renderizadorSegundoTeorema)
            return this
        } catch (error) {
            console.error('❌ Error configurando canvas Segundo Teorema:', error)
            throw error
        }
    }

    // ✅ ESTABLECER FUNCIÓN SEGUNDO TEOREMA
    establecerFuncionSegundoTeorema(tipo, funcionPersonalizada = '') {
        console.log('🔄 establecerFuncionSegundoTeorema ejecutado:', { tipo, funcionPersonalizada })
        console.log('- estadoSegundoTeorema:', !!this.estadoSegundoTeorema)
        console.log('- renderizadorSegundoTeorema:', !!this.renderizadorSegundoTeorema)
        
        try {
            this.estadoSegundoTeorema.establecerFuncion(tipo, funcionPersonalizada)
            console.log('✅ Función establecida en el estado')
            
            // Verificar que la función se estableció correctamente
            const funcionActual = this.estadoSegundoTeorema.obtenerFuncionActual()
            console.log('- función actual:', typeof funcionActual, !!funcionActual)
            
            this.renderizarSegundoTeorema()
            return this
        } catch (error) {
            console.error('Error estableciendo función Segundo Teorema:', error)
            throw error
        }
    }

    // ✅ ESTABLECER LÍMITES SEGUNDO TEOREMA
    establecerLimitesSegundoTeorema(a, b) {
        try {
            this.estadoSegundoTeorema.establecerLimites(a, b)
            this.renderizarSegundoTeorema()
            return this
        } catch (error) {
            console.error('Error estableciendo límites Segundo Teorema:', error)
            throw error
        }
    }

    // ✅ ESTABLECER ANTIDERIVADA USUARIO
    establecerAntiderivadaUsuario(antiderivada) {
        try {
            this.estadoSegundoTeorema.establecerAntiderivadaUsuario(antiderivada)
            return this
        } catch (error) {
            console.error('Error estableciendo antiderivada usuario:', error)
            throw error
        }
    }

    // ✅ VALIDAR ANTIDERIVADA
    validarAntiderivada(antiderivadaUsuario) {
        try {
            const funcion = this.estadoSegundoTeorema.obtenerFuncionActual()
            if (!funcion) {
                return { valida: false, error: 'No hay función definida' }
            }
            
            return this.calculadoraSegundoTeorema.validarAntiderivada(antiderivadaUsuario, funcion)
        } catch (error) {
            console.error('Error validando antiderivada:', error)
            return { valida: false, error: 'Error en la validación' }
        }
    }

    // ✅ AVANZAR PASO SEGUNDO TEOREMA
    avanzarPasoSegundoTeorema() {
        try {
            this.estadoSegundoTeorema.avanzarPaso()
            this.renderizarSegundoTeorema()
            return this
        } catch (error) {
            console.error('Error avanzando paso Segundo Teorema:', error)
            throw error
        }
    }

    // ✅ ESTABLECER EVALUACIÓN LÍMITES
    establecerEvaluacionLimites(evaluacionA, evaluacionB) {
        try {
            this.estadoSegundoTeorema.establecerEvaluacion(evaluacionA, evaluacionB)
            return this
        } catch (error) {
            console.error('Error estableciendo evaluación límites:', error)
            throw error
        }
    }

    // ✅ VALIDAR EVALUACIÓN LÍMITES
    validarEvaluacionLimites(evaluacionA, evaluacionB) {
        try {
            const antiderivada = this.estadoSegundoTeorema.obtenerAntiderivadaUsuario()
            const limites = this.estadoSegundoTeorema.obtenerLimites()
            
            return this.calculadoraSegundoTeorema.validarEvaluacionLimites(
                evaluacionA, 
                evaluacionB, 
                antiderivada, 
                limites.a, 
                limites.b
            )
        } catch (error) {
            console.error('Error validando evaluación límites:', error)
            return { valida: false, error: 'Error en la validación' }
        }
    }

    // ✅ CALCULAR RESULTADO INTEGRAL
    calcularResultadoIntegral() {
        try {
            const antiderivada = this.estadoSegundoTeorema.obtenerAntiderivadaUsuario()
            const limites = this.estadoSegundoTeorema.obtenerLimites()
            
            const resultado = this.calculadoraSegundoTeorema.evaluarAntiderivadaEnLimites(
                antiderivada, 
                limites.a, 
                limites.b
            )
            
            if (resultado.exitosa) {
                this.estadoSegundoTeorema.establecerResultadoCalculado(resultado.resultado)
                this.estadoSegundoTeorema.completarProceso()
            }
            
            return resultado
        } catch (error) {
            console.error('Error calculando resultado integral:', error)
            return { exitosa: false, error: 'Error en el cálculo', resultado: 0 }
        }
    }

    // ✅ RENDERIZAR SEGUNDO TEOREMA
    renderizarSegundoTeorema() {
        console.log('🎨 renderizarSegundoTeorema ejecutado')
        console.log('- renderizadorSegundoTeorema:', !!this.renderizadorSegundoTeorema)
        console.log('- estadoSegundoTeorema:', !!this.estadoSegundoTeorema)
        
        if (!this.renderizadorSegundoTeorema) {
            console.log('❌ No hay renderizador Segundo Teorema')
            return
        }
        
        if (!this.estadoSegundoTeorema) {
            console.log('❌ No hay estado Segundo Teorema')
            return
        }
        
        try {
            const funcion = this.estadoSegundoTeorema.obtenerFuncionActual()
            const limites = this.estadoSegundoTeorema.obtenerLimites()
            const resultado = this.estadoSegundoTeorema.obtenerResultadoCalculado()
            
            console.log('📊 Datos para renderizado:', {
                funcion: !!funcion,
                funcionTipo: typeof funcion,
                limites,
                resultado
            })
            
            // Probar la función
            if (funcion) {
                try {
                    const testValue = funcion(1)
                    console.log('🧪 Prueba de función en x=1:', testValue)
                } catch (error) {
                    console.error('❌ Error probando función:', error)
                }
            }
            
            if (funcion) {
                const xMin = Math.min(limites.a, limites.b) - 1
                const xMax = Math.max(limites.a, limites.b) + 1
                const yMin = -3
                const yMax = 3
                
                console.log('📐 Parámetros de renderizado:', {
                    xMin, xMax, yMin, yMax,
                    limiteA: limites.a,
                    limiteB: limites.b
                })
                
                // Calcular resultado automáticamente si no existe
                let resultadoFinal = resultado
                if (!resultadoFinal || resultadoFinal === 0) {
                    try {
                        // Calcular integral numéricamente para mostrar el resultado
                        const numPuntos = 1000
                        let suma = 0
                        const dx = (limites.b - limites.a) / numPuntos
                        
                        for (let i = 0; i < numPuntos; i++) {
                            const x = limites.a + i * dx
                            const y = funcion(x)
                            if (isFinite(y)) {
                                suma += y * dx
                            }
                        }
                        
                        resultadoFinal = suma
                        this.estadoSegundoTeorema.establecerResultadoCalculado(resultadoFinal)
                        console.log('🧮 Resultado calculado automáticamente:', resultadoFinal)
                    } catch (error) {
                        console.error('Error calculando resultado automático:', error)
                        resultadoFinal = 0
                    }
                }
                
                this.renderizadorSegundoTeorema.renderizarVisualizacionCompleta(
                    funcion, 
                    limites.a, 
                    limites.b, 
                    xMin, 
                    xMax, 
                    yMin, 
                    yMax, 
                    resultadoFinal
                )
                
                console.log('✅ Renderizado Segundo Teorema completado')
            } else {
                console.log('❌ No hay función definida')
            }
        } catch (error) {
            console.error('❌ Error renderizando Segundo Teorema:', error)
        }
    }

    // ✅ CARGAR EJEMPLO SEGUNDO TEOREMA
    cargarEjemploSegundoTeorema(ejemplo) {
        try {
            this.estadoSegundoTeorema.establecerFuncion(ejemplo.tipoFuncion || 'seno', ejemplo.funcionPersonalizada || '')
            this.estadoSegundoTeorema.establecerLimites(ejemplo.limiteA, ejemplo.limiteB)
            this.renderizarSegundoTeorema()
            return this
        } catch (error) {
            console.error('Error cargando ejemplo Segundo Teorema:', error)
            throw error
        }
    }

    // ✅ RESETEAR SEGUNDO TEOREMA
    resetearSegundoTeorema() {
        try {
            this.estadoSegundoTeorema.resetear()
            this.renderizarSegundoTeorema()
            return this
        } catch (error) {
            console.error('Error reseteando Segundo Teorema:', error)
            throw error
        }
    }

    // ✅ OBTENER ESTADO SEGUNDO TEOREMA
    obtenerEstadoSegundoTeorema() {
        return this.estadoSegundoTeorema
    }

    // ✅ OBTENER CONFIGURACIÓN SEGUNDO TEOREMA
    obtenerConfiguracionSegundoTeorema() {
        return this.configuracionSegundoTeorema
    }

    // ✅ OBTENER TEORÍA SEGUNDO TEOREMA
    obtenerTeoriaSegundoTeorema() {
        return this.teoriaSegundoTeorema.obtenerInformacionCompleta()
    }

    // ✅ OBTENER EJEMPLOS SEGUNDO TEOREMA
    obtenerEjemplosSegundoTeorema() {
        return this.ejemplosSegundoTeorema.obtenerTodosLosEjemplos()
    }

    // ✅ OBTENER EJEMPLO SEGUNDO TEOREMA
    obtenerEjemploSegundoTeorema(id) {
        return this.ejemplosSegundoTeorema.obtenerEjemplo(id)
    }

    // ✅ OBTENER INFORMACIÓN TEOREMA SEGÚN ACTIVO
    obtenerInformacionTeoremaActivo() {
        if (this.teoremaActivo === 'segundo-teorema') {
            return this.obtenerTeoriaSegundoTeorema()
        } else {
            return this.obtenerInformacionTeorema()
        }
    }

    // ✅ OBTENER EJEMPLOS TEOREMA SEGÚN ACTIVO
    obtenerEjemplosTeoremaActivo() {
        if (this.teoremaActivo === 'segundo-teorema') {
            return this.obtenerEjemplosSegundoTeorema()
        } else {
            return this.obtenerEjemplos()
        }
    }

    // ✅ DESTRUIR ESCENARIO
    destruir() {
        try {
            // Destruir componentes del Teorema del Valor Medio
            this.renderizadorTorre = null
            this.renderizadorCartesiano = null
            this.gestorVisualizacion = null
            this.calculadora = null
            this.estadoTorre = null
            this.configuracionTorre = null
            
            // Destruir componentes del Segundo Teorema
            this.renderizadorSegundoTeorema = null
            this.calculadoraSegundoTeorema = null
            this.teoriaSegundoTeorema = null
            this.ejemplosSegundoTeorema = null
            this.estadoSegundoTeorema = null
            this.configuracionSegundoTeorema = null
            
            this.inicializado = false
            this.canvasConfigurado = false
        } catch (error) {
            console.error('Error destruyendo escenario:', error)
        }
    }
}

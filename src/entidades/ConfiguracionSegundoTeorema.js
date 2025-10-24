/**
 * ENTIDAD: ConfiguracionSegundoTeorema
 * RESPONSABILIDAD: Almacenar configuración específica del Segundo Teorema Fundamental del Cálculo
 * SRP: Solo maneja datos de configuración, no realiza cálculos ni renderizado
 */
export class ConfiguracionSegundoTeorema {
    constructor() {
        // Configuración de funciones disponibles
        this.funciones = {
            seno: {
                id: 'seno',
                nombre: 'Seno',
                simbolo: 'sin(x)',
                antiderivada: '-cos(x)',
                descripcion: 'Función trigonométrica seno',
                color: '#8B5CF6',
                ejemplo: 'sin(x)'
            },
            coseno: {
                id: 'coseno',
                nombre: 'Coseno',
                simbolo: 'cos(x)',
                antiderivada: 'sin(x)',
                descripcion: 'Función trigonométrica coseno',
                color: '#06B6D4',
                ejemplo: 'cos(x)'
            },
            exponencial: {
                id: 'exponencial',
                nombre: 'Exponencial',
                simbolo: 'e^x',
                antiderivada: 'e^x',
                descripcion: 'Función exponencial natural',
                color: '#10B981',
                ejemplo: 'exp(x)'
            },
            personalizada: {
                id: 'personalizada',
                nombre: 'Personalizada',
                simbolo: 'f(x)',
                antiderivada: 'F(x)',
                descripcion: 'Función definida por el usuario',
                color: '#F59E0B',
                ejemplo: 'x^2'
            }
        }

        // Configuración de límites por defecto
        this.limitesPorDefecto = {
            seno: { a: 0, b: Math.PI },
            coseno: { a: 0, b: Math.PI / 2 },
            exponencial: { a: 0, b: 1 },
            personalizada: { a: 0, b: 2 }
        }

        // Configuración de validación
        this.validacion = {
            toleranciaNumerica: 0.01,
            puntosPrueba: [-2, -1, 0, 1, 2],
            pasoDerivada: 1e-5,
            maximoIntentos: 10,
            tiempoMaximo: 300000 // 5 minutos en ms
        }

        // Configuración de la interfaz
        this.interfaz = {
            mostrarPasos: true,
            mostrarPistas: true,
            mostrarTiempo: true,
            mostrarMetricas: true,
            animacionTransicion: true,
            velocidadAnimacion: 300
        }

        // Configuración de ejemplos
        this.ejemplos = {
            seno: {
                titulo: 'Integral de sin(x)',
                descripcion: 'Calcular ∫[0, π] sin(x) dx',
                funcion: 'sin(x)',
                antiderivada: '-cos(x)',
                limiteA: 0,
                limiteB: Math.PI,
                evaluacionA: '-cos(0) = -1',
                evaluacionB: '-cos(π) = 1',
                resultado: 2,
                explicacion: 'La antiderivada de sin(x) es -cos(x). Evaluando: -cos(π) - (-cos(0)) = 1 - (-1) = 2'
            },
            coseno: {
                titulo: 'Integral de cos(x)',
                descripcion: 'Calcular ∫[0, π/2] cos(x) dx',
                funcion: 'cos(x)',
                antiderivada: 'sin(x)',
                limiteA: 0,
                limiteB: Math.PI / 2,
                evaluacionA: 'sin(0) = 0',
                evaluacionB: 'sin(π/2) = 1',
                resultado: 1,
                explicacion: 'La antiderivada de cos(x) es sin(x). Evaluando: sin(π/2) - sin(0) = 1 - 0 = 1'
            },
            exponencial: {
                titulo: 'Integral de e^x',
                descripcion: 'Calcular ∫[0, 1] e^x dx',
                funcion: 'e^x',
                antiderivada: 'e^x',
                limiteA: 0,
                limiteB: 1,
                evaluacionA: 'e^0 = 1',
                evaluacionB: 'e^1 = e',
                resultado: Math.E - 1,
                explicacion: 'La antiderivada de e^x es e^x. Evaluando: e^1 - e^0 = e - 1'
            }
        }

        // Configuración de logros
        this.logros = {
            primeraAntiderivada: {
                id: 'primera_antiderivada',
                titulo: 'Primera Antiderivada',
                descripcion: 'Encuentra tu primera antiderivada correcta',
                icono: '🎯',
                condicion: (datos) => datos.antiderivadasCorrectas >= 1
            },
            maestroAntiderivadas: {
                id: 'maestro_antiderivadas',
                titulo: 'Maestro de Antiderivadas',
                descripcion: 'Encuentra 5 antiderivadas correctas',
                icono: '🏆',
                condicion: (datos) => datos.antiderivadasCorrectas >= 5
            },
            velocidadDemon: {
                id: 'velocidad_demon',
                titulo: 'Demonio de la Velocidad',
                descripcion: 'Resuelve un problema en menos de 30 segundos',
                icono: '⚡',
                condicion: (datos) => datos.tiempoResolucion < 30
            },
            perfeccionista: {
                id: 'perfeccionista',
                titulo: 'Perfeccionista',
                descripcion: 'Resuelve 10 problemas sin errores',
                icono: '💎',
                condicion: (datos) => datos.problemasPerfectos >= 10
            },
            exploradorFunciones: {
                id: 'explorador_funciones',
                titulo: 'Explorador de Funciones',
                descripcion: 'Prueba todas las funciones disponibles',
                icono: '🔍',
                condicion: (datos) => datos.funcionesProbadas >= 4
            }
        }

        // Configuración de métricas
        this.metricas = {
            seguimientoTiempo: true,
            seguimientoIntentos: true,
            seguimientoPrecision: true,
            seguimientoProgreso: true,
            mostrarEstadisticas: true
        }

        // Configuración de visualización
        this.visualizacion = {
            mostrarGrafica: true,
            mostrarArea: true,
            mostrarPuntos: true,
            mostrarEtiquetas: true,
            colorFuncion: '#8B5CF6',
            colorArea: 'rgba(139, 92, 246, 0.3)',
            colorPuntos: '#4CAF50',
            grosorLinea: 3,
            radioPuntos: 8
        }

        // Configuración de ayuda
        this.ayuda = {
            mostrarPistas: true,
            mostrarEjemplos: true,
            mostrarTeoria: true,
            nivelAyuda: 'intermedio', // basico, intermedio, avanzado
            pistasDisponibles: 3,
            ejemplosDisponibles: 5
        }
    }

    // ✅ OBTENER FUNCIÓN POR ID
    obtenerFuncion(id) {
        return this.funciones[id] || null
    }

    // ✅ OBTENER TODAS LAS FUNCIONES
    obtenerTodasLasFunciones() {
        return Object.values(this.funciones)
    }

    // ✅ OBTENER LÍMITES POR DEFECTO
    obtenerLimitesPorDefecto(tipoFuncion) {
        return this.limitesPorDefecto[tipoFuncion] || { a: 0, b: 2 }
    }

    // ✅ OBTENER EJEMPLO
    obtenerEjemplo(tipoFuncion) {
        return this.ejemplos[tipoFuncion] || null
    }

    // ✅ OBTENER TODOS LOS EJEMPLOS
    obtenerTodosLosEjemplos() {
        return Object.values(this.ejemplos)
    }

    // ✅ OBTENER LOGRO POR ID
    obtenerLogro(id) {
        return this.logros[id] || null
    }

    // ✅ OBTENER TODOS LOS LOGROS
    obtenerTodosLosLogros() {
        return Object.values(this.logros)
    }

    // ✅ OBTENER CONFIGURACIÓN DE VALIDACIÓN
    obtenerConfiguracionValidacion() {
        return this.validacion
    }

    // ✅ OBTENER CONFIGURACIÓN DE INTERFAZ
    obtenerConfiguracionInterfaz() {
        return this.interfaz
    }

    // ✅ OBTENER CONFIGURACIÓN DE MÉTRICAS
    obtenerConfiguracionMetricas() {
        return this.metricas
    }

    // ✅ OBTENER CONFIGURACIÓN DE VISUALIZACIÓN
    obtenerConfiguracionVisualizacion() {
        return this.visualizacion
    }

    // ✅ OBTENER CONFIGURACIÓN DE AYUDA
    obtenerConfiguracionAyuda() {
        return this.ayuda
    }

    // ✅ ACTUALIZAR CONFIGURACIÓN
    actualizarConfiguracion(seccion, configuracion) {
        if (this[seccion]) {
            Object.assign(this[seccion], configuracion)
        }
    }

    // ✅ RESETEAR CONFIGURACIÓN
    resetearConfiguracion() {
        // Mantener la configuración por defecto
        // Este método podría ser útil para resetear configuraciones personalizadas
    }
}


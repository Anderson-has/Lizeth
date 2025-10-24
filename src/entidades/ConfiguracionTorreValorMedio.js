/**
 * Configuración del Escenario Torre del Valor Medio
 * Define la configuración visual y de comportamiento
 */
export class ConfiguracionTorreValorMedio {
    constructor() {
        // Configuración de la torre
        this.torre = {
            numeroBarras: 50,
            anchoBarra: 0,
            alturaMaxima: 100,
            colores: {
                base: '#4CAF50',
                textura: '#2E7D32',
                degradadoInicio: '#D1C4E9',
                degradadoFin: '#F8BBD0'
            }
        }

        // Configuración del plano cartesiano
        this.cartesiano = {
            rangoX: { min: -4, max: 4 },
            rangoY: { min: -4, max: 4 },
            grid: { intervalos: 4 },
            colores: {
                funcion: '#8B5CF6',
                puntoA: '#4CAF50',
                puntoB: '#4CAF50',
                secante: '#4CAF50',
                estimacionUsuario: '#EC4899',
                puntoCReal: '#F59E0B',
                tangente: '#F59E0B',
                grid: '#E0E0E0'
            }
        }

        // Configuración de la línea promedio
        this.lineaPromedio = {
            color: '#FF9800',
            grosor: 3,
            estilo: [8, 4] // Punteado
        }

        // Configuración de validación
        this.validacion = {
            toleranciaError: 0.0001,
            maximoIteraciones: 20,
            precisionCalculo: 1000
        }

        // Los logros se manejan con GestorLogros.js existente

        // Configuración de ejemplos
        this.ejemplos = {
            cuadraticaSimetrica: {
                id: 'cuadratica_simetrica',
                titulo: 'Función Cuadrática Simétrica',
                descripcion: 'Una parábola centrada en el origen',
                funcion: 'x**2',
                tipoFuncion: 'cuadratica',
                limiteA: -2,
                limiteB: 2,
                puntoC: 0,
                insight: 'En funciones simétricas, el punto c está exactamente en el medio del intervalo.'
            },
            cubicaAsimetrica: {
                id: 'cubica_asimetrica',
                titulo: 'Función Cúbica Asimétrica',
                descripcion: 'Una curva con crecimiento acelerado',
                funcion: 'x**3',
                tipoFuncion: 'cubica',
                limiteA: 0,
                limiteB: 2,
                puntoC: 1.15,
                insight: 'El punto c NO está en el medio porque la función crece más rápido al final.'
            },
            trigonometrica: {
                id: 'trigonometrica',
                titulo: 'Función Trigonométrica',
                descripcion: 'Una onda sinusoidal',
                funcion: 'Math.sin(x)',
                tipoFuncion: 'seno',
                limiteA: 0,
                limiteB: Math.PI,
                puntoC: Math.PI / 2,
                insight: 'En funciones trigonométricas, c se encuentra donde la derivada es máxima.'
            },
            lineal: {
                id: 'lineal',
                titulo: 'Función Lineal',
                descripcion: 'Una línea recta',
                funcion: '2*x + 1',
                tipoFuncion: 'lineal',
                limiteA: 0,
                limiteB: 3,
                puntoC: 'cualquier punto',
                insight: 'En funciones lineales, cualquier punto c cumple el teorema porque la pendiente es constante.'
            }
        }

        // Configuración de la interfaz
        this.interfaz = {
            tema: 'claro',
            idioma: 'es',
            animaciones: true,
            sonidos: false,
            autoGuardado: true
        }

        // Configuración de rendimiento
        this.rendimiento = {
            fpsObjetivo: 30,
            debounceHover: 16,
            throttleSlider: 100,
            debounceTeclado: 300
        }
    }

    // ✅ OBTENER CONFIGURACIÓN DE LA TORRE
    obtenerConfiguracionTorre() {
        return this.torre
    }

    // ✅ OBTENER CONFIGURACIÓN CARTESIANA
    obtenerConfiguracionCartesiana() {
        return this.cartesiano
    }

    // ✅ OBTENER CONFIGURACIÓN DE LÍNEA PROMEDIO
    obtenerConfiguracionLineaPromedio() {
        return this.lineaPromedio
    }

    // ✅ OBTENER CONFIGURACIÓN DE VALIDACIÓN
    obtenerConfiguracionValidacion() {
        return this.validacion
    }

    // ✅ OBTENER CONFIGURACIÓN DE LOGROS (usar GestorLogros.js existente)
    obtenerConfiguracionLogros() {
        return null // Se usa GestorLogros.js existente
    }

    // ✅ OBTENER CONFIGURACIÓN DE EJEMPLOS
    obtenerConfiguracionEjemplos() {
        return this.ejemplos
    }

    // ✅ OBTENER CONFIGURACIÓN DE INTERFAZ
    obtenerConfiguracionInterfaz() {
        return this.interfaz
    }

    // ✅ OBTENER CONFIGURACIÓN DE RENDIMIENTO
    obtenerConfiguracionRendimiento() {
        return this.rendimiento
    }

    // ✅ OBTENER EJEMPLO POR ID
    obtenerEjemplo(id) {
        return this.ejemplos[id] || null
    }

    // ✅ OBTENER TODOS LOS EJEMPLOS
    obtenerTodosLosEjemplos() {
        return Object.values(this.ejemplos)
    }

    // ✅ OBTENER LOGRO POR ID (usar GestorLogros.js existente)
    obtenerLogro(id) {
        return null // Se usa GestorLogros.js existente
    }

    // ✅ OBTENER TODOS LOS LOGROS (usar GestorLogros.js existente)
    obtenerTodosLosLogros() {
        return [] // Se usa GestorLogros.js existente
    }

    // ✅ ACTUALIZAR CONFIGURACIÓN DE INTERFAZ
    actualizarConfiguracionInterfaz(nuevaConfiguracion) {
        this.interfaz = { ...this.interfaz, ...nuevaConfiguracion }
    }

    // ✅ ACTUALIZAR CONFIGURACIÓN DE RENDIMIENTO
    actualizarConfiguracionRendimiento(nuevaConfiguracion) {
        this.rendimiento = { ...this.rendimiento, ...nuevaConfiguracion }
    }
}

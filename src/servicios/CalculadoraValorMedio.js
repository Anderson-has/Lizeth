/**
 * Calculadora para el Teorema del Valor Medio
 * Maneja todos los cálculos matemáticos específicos
 */
export class CalculadoraValorMedio {
    constructor() {
        this.precision = 1000
        this.tolerancia = 0.0001
        this.maximoIteraciones = 20
    }

    // ✅ CALCULAR ALTURA PROMEDIO (Valor Medio)
    calcularAlturaPromedio(funcion, a, b) {
        const n = this.precision
        const dx = (b - a) / n
        let suma = 0
        
        for (let i = 0; i < n; i++) {
            const x = a + i * dx
            suma += funcion(x)
        }
        
        return suma / n
    }

    // ✅ CALCULAR DERIVADA NUMÉRICA
    calcularDerivada(funcion, x, h = 0.0001) {
        return (funcion(x + h) - funcion(x - h)) / (2 * h)
    }

    // ✅ CALCULAR PENDIENTE SECANTE
    calcularPendienteSecante(funcion, a, b) {
        const fa = funcion(a)
        const fb = funcion(b)
        return (fb - fa) / (b - a)
    }

    // ✅ ENCONTRAR PUNTO C REAL (Método de Newton)
    encontrarPuntoCReal(funcion, a, b) {
        // Calcular derivada numérica
        const fPrima = (x) => this.calcularDerivada(funcion, x)
        
        // Calcular pendiente de la secante
        const pendienteSecante = this.calcularPendienteSecante(funcion, a, b)
        
        // Buscar c usando método de Newton
        let c = (a + b) / 2
        
        for (let i = 0; i < this.maximoIteraciones; i++) {
            const error = fPrima(c) - pendienteSecante
            if (Math.abs(error) < this.tolerancia) break
            
            const derivada = this.calcularDerivada(fPrima, c, 0.001)
            if (Math.abs(derivada) < this.tolerancia) break
            
            c = c - error / derivada
            
            // Verificar que c esté dentro del intervalo
            if (c < a || c > b) {
                c = (a + b) / 2
                break
            }
        }
        
        return c
    }

    // ✅ VERIFICAR TEOREMA DEL VALOR MEDIO
    verificarTeorema(funcion, a, b, c) {
        const fPrima = (x) => this.calcularDerivada(funcion, x)
        const pendienteSecante = this.calcularPendienteSecante(funcion, a, b)
        const derivadaEnC = fPrima(c)
        
        return Math.abs(derivadaEnC - pendienteSecante) < this.tolerancia
    }

    // ✅ CALCULAR ERROR DE ESTIMACIÓN
    calcularErrorEstimacion(cReal, cEstimado) {
        return Math.abs(cReal - cEstimado)
    }

    // ✅ CLASIFICAR PRECISIÓN
    clasificarPrecision(error) {
        if (error < 0.1) return { nivel: 'perfecto', emoji: '🎯', color: '#10B981' }
        if (error < 0.3) return { nivel: 'excelente', emoji: '✨', color: '#3B82F6' }
        if (error < 0.6) return { nivel: 'bueno', emoji: '👍', color: '#F59E0B' }
        return { nivel: 'intenta', emoji: '🔄', color: '#EF4444' }
    }

    // ✅ CALCULAR INTEGRAL NUMÉRICA (Regla del Trapecio)
    calcularIntegral(funcion, a, b) {
        const n = this.precision
        const dx = (b - a) / n
        let suma = 0
        
        for (let i = 0; i < n; i++) {
            const x = a + i * dx
            suma += funcion(x) * dx
        }
        
        return suma
    }

    // ✅ VALIDAR FUNCIÓN
    validarFuncion(funcion, a, b) {
        const puntosPrueba = [a, (a + b) / 2, b]
        
        for (const x of puntosPrueba) {
            try {
                const resultado = funcion(x)
                if (!isFinite(resultado)) {
                    return { valida: false, error: 'La función produce valores no finitos' }
                }
            } catch (error) {
                return { valida: false, error: 'Error al evaluar la función' }
            }
        }
        
        return { valida: true, error: null }
    }

    // ✅ VERIFICAR CONTINUIDAD
    verificarContinuidad(funcion, a, b) {
        const n = 100
        const dx = (b - a) / n
        
        for (let i = 0; i < n; i++) {
            const x = a + i * dx
            try {
                const resultado = funcion(x)
                if (!isFinite(resultado)) {
                    return { continua: false, punto: x }
                }
            } catch (error) {
                return { continua: false, punto: x }
            }
        }
        
        return { continua: true, punto: null }
    }

    // ✅ VERIFICAR DERIVABILIDAD
    verificarDerivabilidad(funcion, a, b) {
        const n = 100
        const dx = (b - a) / n
        
        for (let i = 1; i < n - 1; i++) {
            const x = a + i * dx
            try {
                const derivada = this.calcularDerivada(funcion, x)
                if (!isFinite(derivada)) {
                    return { derivable: false, punto: x }
                }
            } catch (error) {
                return { derivable: false, punto: x }
            }
        }
        
        return { derivable: true, punto: null }
    }

    // ✅ VERIFICAR CONDICIONES DEL TEOREMA
    verificarCondicionesTeorema(funcion, a, b) {
        const continuidad = this.verificarContinuidad(funcion, a, b)
        const derivabilidad = this.verificarDerivabilidad(funcion, a, b)
        
        return {
            continuidad: continuidad.continua,
            derivabilidad: derivabilidad.derivable,
            cumpleCondiciones: continuidad.continua && derivabilidad.derivable,
            errores: {
                continuidad: continuidad.punto,
                derivabilidad: derivabilidad.punto
            }
        }
    }

    // ✅ CALCULAR MÉTRICAS DE RENDIMIENTO
    calcularMetricasRendimiento(tiempoInicio, tiempoEstimacion, tiempoVerificacion, numeroIntentos) {
        const tiempoTotal = Date.now() - tiempoInicio
        const tiempoEstimacionMs = tiempoEstimacion ? tiempoEstimacion - tiempoInicio : 0
        const tiempoVerificacionMs = tiempoVerificacion ? tiempoVerificacion - tiempoEstimacion : 0
        
        return {
            tiempoTotal,
            tiempoEstimacion: tiempoEstimacionMs,
            tiempoVerificacion: tiempoVerificacionMs,
            numeroIntentos,
            eficiencia: numeroIntentos > 0 ? tiempoTotal / numeroIntentos : 0
        }
    }

    // ✅ GENERAR PUNTOS PARA GRÁFICA
    generarPuntosFuncion(funcion, a, b, densidad = 100) {
        const puntos = []
        const dx = (b - a) / densidad
        
        for (let i = 0; i <= densidad; i++) {
            const x = a + i * dx
            try {
                const y = funcion(x)
                if (isFinite(y)) {
                    puntos.push({ x, y })
                }
            } catch (error) {
                // Saltar puntos problemáticos
            }
        }
        
        return puntos
    }

    // ✅ CALCULAR ESCALA DE COLORES
    calcularEscalaColores(valor, min, max) {
        const intensidad = Math.min(1, Math.max(0, (valor - min) / (max - min)))
        const r = Math.floor(100 + intensidad * 155)
        const g = Math.floor(50 + intensidad * 205)
        const b = Math.floor(150 + intensidad * 105)
        
        return `rgb(${r}, ${g}, ${b})`
    }

    // ✅ CONFIGURAR PRECISIÓN
    establecerPrecision(nuevaPrecision) {
        this.precision = nuevaPrecision
    }

    // ✅ CONFIGURAR TOLERANCIA
    establecerTolerancia(nuevaTolerancia) {
        this.tolerancia = nuevaTolerancia
    }

    // ✅ CONFIGURAR MÁXIMO DE ITERACIONES
    establecerMaximoIteraciones(nuevoMaximo) {
        this.maximoIteraciones = nuevoMaximo
    }
}



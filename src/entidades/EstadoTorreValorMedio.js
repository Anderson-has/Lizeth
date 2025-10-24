/**
 * Estado del Escenario Torre del Valor Medio
 * Maneja el estado específico del Teorema del Valor Medio
 */
export class EstadoTorreValorMedio {
    constructor() {
        // Propiedades del intervalo
        this.limiteA = -2
        this.limiteB = 2
        
        // Función actual
        this.funcionActual = null
        this.tipoFuncion = 'cuadratica'
        this.funcionPersonalizada = ''
        this.funcionPersonalizadaValida = false
        this.errorFuncionPersonalizada = ''
        
        // Inicializar función por defecto
        this.establecerFuncion('cuadratica')
        
        // Cálculos del teorema
        this.alturaPromedio = 0
        this.puntoCReal = null
        this.estimacionUsuario = null
        this.errorEstimacion = 0
        this.verificacionExitosa = false
        
        // Estado de la visualización
        this.estaBloqueado = false
        this.puedeVerificar = false
        this.estaVerificando = false
        
        // Métricas de rendimiento
        this.tiempoInicio = Date.now()
        this.tiempoEstimacion = null
        this.tiempoVerificacion = null
        this.numeroIntentos = 0
        this.estimacionesExcelentes = 0
        
        // Estado de los ejemplos
        this.ejemploActual = null
        this.ejemplosCompletados = []
        
        // Inicializar función por defecto
        this.inicializarFuncionPorDefecto()
    }

    // ✅ INICIALIZAR FUNCIÓN POR DEFECTO
    inicializarFuncionPorDefecto() {
        this.tipoFuncion = 'cuadratica'
        this.funcionActual = (x) => (x * x) / 4
        this.limiteA = -2
        this.limiteB = 2
        this.calcularAlturaPromedio()
    }

    // ✅ ESTABLECER LÍMITES
    establecerLimites(a, b) {
        if (a >= b) {
            throw new Error('El límite a debe ser menor que b')
        }
        this.limiteA = a
        this.limiteB = b
        this.calcularAlturaPromedio()
    }

    // ✅ ESTABLECER FUNCIÓN
    establecerFuncion(tipo, funcionPersonalizada = '') {
        this.tipoFuncion = tipo
        this.funcionPersonalizada = funcionPersonalizada
        
        switch (tipo) {
            case 'cuadratica':
                this.funcionActual = (x) => (x * x) / 4
                break
            case 'cubica':
                this.funcionActual = (x) => (x * x * x) / 16
                break
            case 'seno':
                this.funcionActual = (x) => 4 * Math.sin(x)
                break
            case 'lineal':
                this.funcionActual = (x) => 2 * x + 1
                break
            case 'personalizada':
                try {
                    this.funcionActual = new Function('x', `return ${funcionPersonalizada}`)
                    this.funcionPersonalizadaValida = true
                    this.errorFuncionPersonalizada = ''
                } catch (error) {
                    this.funcionPersonalizadaValida = false
                    this.errorFuncionPersonalizada = 'Función personalizada inválida'
                    throw new Error('Función personalizada inválida')
                }
                break
            default:
                this.funcionActual = (x) => (x * x) / 4
        }
        
        this.calcularAlturaPromedio()
    }

    // ✅ CALCULAR ALTURA PROMEDIO
    calcularAlturaPromedio() {
        if (!this.funcionActual) return 0
        
        const n = 1000
        const dx = (this.limiteB - this.limiteA) / n
        let suma = 0
        
        for (let i = 0; i < n; i++) {
            const x = this.limiteA + i * dx
            suma += this.funcionActual(x)
        }
        
        this.alturaPromedio = suma / n
        return this.alturaPromedio
    }

    // ✅ ESTABLECER ESTIMACIÓN DEL USUARIO
    establecerEstimacionUsuario(c) {
        if (c <= this.limiteA || c >= this.limiteB) {
            throw new Error('c debe estar entre a y b')
        }
        
        this.estimacionUsuario = c
        this.estaBloqueado = true
        this.puedeVerificar = true
        this.tiempoEstimacion = Date.now()
        this.numeroIntentos++
    }

    // ✅ CALCULAR PUNTO C REAL
    calcularPuntoCReal() {
        if (!this.funcionActual) return null
        
        // Calcular derivada numérica
        const fPrima = (x) => {
            const h = 0.0001
            return (this.funcionActual(x + h) - this.funcionActual(x - h)) / (2 * h)
        }
        
        // Calcular pendiente de la secante
        const fa = this.funcionActual(this.limiteA)
        const fb = this.funcionActual(this.limiteB)
        const pendienteSecante = (fb - fa) / (this.limiteB - this.limiteA)
        
        // Buscar c usando método de Newton
        let c = (this.limiteA + this.limiteB) / 2
        
        for (let i = 0; i < 20; i++) {
            const error = fPrima(c) - pendienteSecante
            if (Math.abs(error) < 0.0001) break
            
            const derivada = (fPrima(c + 0.001) - fPrima(c - 0.001)) / 0.002
            if (Math.abs(derivada) < 0.0001) break
            
            c = c - error / derivada
            
            if (c < this.limiteA || c > this.limiteB) {
                c = (this.limiteA + this.limiteB) / 2
                break
            }
        }
        
        this.puntoCReal = c
        this.tiempoVerificacion = Date.now()
        return c
    }

    // ✅ VERIFICAR ESTIMACIÓN
    verificarEstimacion() {
        if (this.estimacionUsuario === null || this.puntoCReal === null) {
            return false
        }
        
        this.errorEstimacion = Math.abs(this.puntoCReal - this.estimacionUsuario)
        this.verificacionExitosa = this.errorEstimacion < 0.3
        
        if (this.verificacionExitosa) {
            this.estimacionesExcelentes++
        }
        
        return this.verificacionExitosa
    }

    // ✅ RESETEAR ESTADO
    resetear() {
        this.estimacionUsuario = null
        this.puntoCReal = null
        this.errorEstimacion = 0
        this.verificacionExitosa = false
        this.estaBloqueado = false
        this.puedeVerificar = false
        this.estaVerificando = false
    }

    // ✅ CARGAR EJEMPLO
    cargarEjemplo(ejemplo) {
        this.ejemploActual = ejemplo
        this.establecerFuncion(ejemplo.tipoFuncion, ejemplo.funcionPersonalizada)
        this.establecerLimites(ejemplo.limiteA, ejemplo.limiteB)
        this.resetear()
    }

    // ✅ GETTERS
    obtenerLimites() {
        return { a: this.limiteA, b: this.limiteB }
    }

    obtenerFuncion() {
        return this.funcionActual
    }

    obtenerFuncionPersonalizada() {
        return this.funcionPersonalizada
    }

    obtenerFuncionPersonalizadaValida() {
        return this.funcionPersonalizadaValida
    }

    obtenerErrorFuncionPersonalizada() {
        return this.errorFuncionPersonalizada
    }

    obtenerTipoFuncion() {
        return this.tipoFuncion
    }

    obtenerAlturaPromedio() {
        return this.alturaPromedio
    }

    obtenerEstimacionUsuario() {
        return this.estimacionUsuario
    }

    obtenerPuntoCReal() {
        return this.puntoCReal
    }

    obtenerErrorEstimacion() {
        return this.errorEstimacion
    }

    obtenerVerificacionExitosa() {
        return this.verificacionExitosa
    }

    obtenerTiempoTranscurrido() {
        return Date.now() - this.tiempoInicio
    }

    obtenerMetricas() {
        return {
            numeroIntentos: this.numeroIntentos,
            estimacionesExcelentes: this.estimacionesExcelentes,
            tiempoEstimacion: this.tiempoEstimacion,
            tiempoVerificacion: this.tiempoVerificacion
        }
    }
}

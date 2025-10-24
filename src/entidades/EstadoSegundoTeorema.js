/**
 * ENTIDAD: EstadoSegundoTeorema
 * RESPONSABILIDAD: Almacenar el estado específico del Segundo Teorema Fundamental del Cálculo
 * SRP: Solo maneja datos de estado, no realiza cálculos ni renderizado
 */
export class EstadoSegundoTeorema {
    constructor() {
        // Propiedades de la función
        this.funcionActual = null
        this.tipoFuncion = 'seno'
        this.funcionPersonalizada = ''
        this.funcionPersonalizadaValida = false
        this.errorFuncionPersonalizada = ''
        
        // Propiedades del intervalo
        this.limiteA = 0
        this.limiteB = 2
        
        // Proceso paso a paso
        this.pasoActual = 1 // 1: función, 2: antiderivada, 3: evaluación, 4: resultado
        this.antiderivadaUsuario = ''
        this.antiderivadaCorrecta = ''
        this.evaluacionA = ''
        this.evaluacionB = ''
        this.resultadoCalculado = 0
        this.resultadoCorrecto = false
        
        // Estado de validación
        this.antiderivadaValida = false
        this.evaluacionValida = false
        this.procesoCompletado = false
        
        // Métricas
        this.tiempoInicio = Date.now()
        this.tiempoPaso1 = null
        this.tiempoPaso2 = null
        this.tiempoPaso3 = null
        this.tiempoPaso4 = null
        this.numeroIntentos = 0
        this.intentosAntiderivada = 0
        this.intentosEvaluacion = 0
        
        // Estado de la interfaz
        this.estaBloqueado = false
        this.puedeContinuar = false
        this.estaVerificando = false
        
        // Inicializar función por defecto
        this.inicializarFuncionPorDefecto()
    }

    // ✅ INICIALIZAR FUNCIÓN POR DEFECTO
    inicializarFuncionPorDefecto() {
        this.tipoFuncion = 'seno'
        this.funcionActual = (x) => Math.sin(x)
        this.antiderivadaCorrecta = '-cos(x)'
    }

    // ✅ ESTABLECER FUNCIÓN
    establecerFuncion(tipo, funcionPersonalizada = '') {
        this.tipoFuncion = tipo
        this.funcionPersonalizada = funcionPersonalizada
        
        switch (tipo) {
            case 'seno':
                this.funcionActual = (x) => Math.sin(x)
                this.antiderivadaCorrecta = '-cos(x)'
                break
            case 'coseno':
                this.funcionActual = (x) => Math.cos(x)
                this.antiderivadaCorrecta = 'sin(x)'
                break
            case 'exponencial':
                this.funcionActual = (x) => Math.exp(x)
                this.antiderivadaCorrecta = 'exp(x)'
                break
            case 'personalizada':
                if (funcionPersonalizada) {
                    try {
                        this.funcionActual = new Function('x', `return ${funcionPersonalizada}`)
                        this.funcionPersonalizadaValida = true
                        this.errorFuncionPersonalizada = ''
                        // Para función personalizada, no podemos determinar automáticamente la antiderivada
                        this.antiderivadaCorrecta = 'F(x)' // Placeholder
                    } catch (error) {
                        this.funcionPersonalizadaValida = false
                        this.errorFuncionPersonalizada = 'Sintaxis inválida'
                        this.funcionActual = null
                    }
                } else {
                    this.funcionPersonalizadaValida = false
                    this.errorFuncionPersonalizada = 'Función personalizada requerida'
                    this.funcionActual = null
                }
                break
            default:
                this.inicializarFuncionPorDefecto()
        }
    }

    // ✅ ESTABLECER LÍMITES
    establecerLimites(a, b) {
        this.limiteA = a
        this.limiteB = b
    }

    // ✅ ESTABLECER ANTIDERIVADA USUARIO
    establecerAntiderivadaUsuario(antiderivada) {
        this.antiderivadaUsuario = antiderivada
        this.numeroIntentos++
        this.intentosAntiderivada++
    }

    // ✅ ESTABLECER EVALUACIÓN
    establecerEvaluacion(evaluacionA, evaluacionB) {
        this.evaluacionA = evaluacionA
        this.evaluacionB = evaluacionB
        this.intentosEvaluacion++
    }

    // ✅ AVANZAR PASO
    avanzarPaso() {
        if (this.pasoActual < 4) {
            this.pasoActual++
            this.registrarTiempoPaso()
        }
    }

    // ✅ REGISTRAR TIEMPO DE PASO
    registrarTiempoPaso() {
        const tiempoActual = Date.now()
        switch (this.pasoActual) {
            case 2:
                this.tiempoPaso1 = tiempoActual - this.tiempoInicio
                break
            case 3:
                this.tiempoPaso2 = tiempoActual - this.tiempoInicio
                break
            case 4:
                this.tiempoPaso3 = tiempoActual - this.tiempoInicio
                break
        }
    }

    // ✅ COMPLETAR PROCESO
    completarProceso() {
        this.procesoCompletado = true
        this.tiempoPaso4 = Date.now() - this.tiempoInicio
    }

    // ✅ RESETEAR ESTADO
    resetear() {
        this.pasoActual = 1
        this.antiderivadaUsuario = ''
        this.evaluacionA = ''
        this.evaluacionB = ''
        this.resultadoCalculado = 0
        this.resultadoCorrecto = false
        this.antiderivadaValida = false
        this.evaluacionValida = false
        this.procesoCompletado = false
        this.numeroIntentos = 0
        this.intentosAntiderivada = 0
        this.intentosEvaluacion = 0
        this.estaBloqueado = false
        this.puedeContinuar = false
        this.estaVerificando = false
        this.tiempoInicio = Date.now()
        this.tiempoPaso1 = null
        this.tiempoPaso2 = null
        this.tiempoPaso3 = null
        this.tiempoPaso4 = null
    }

    // ✅ GETTERS
    obtenerFuncionActual() {
        return this.funcionActual
    }

    obtenerTipoFuncion() {
        return this.tipoFuncion
    }

    obtenerFuncionPersonalizada() {
        return this.funcionPersonalizada
    }

    obtenerLimites() {
        return { a: this.limiteA, b: this.limiteB }
    }

    obtenerPasoActual() {
        return this.pasoActual
    }

    obtenerAntiderivadaUsuario() {
        return this.antiderivadaUsuario
    }

    obtenerAntiderivadaCorrecta() {
        return this.antiderivadaCorrecta
    }

    obtenerEvaluacionA() {
        return this.evaluacionA
    }

    obtenerEvaluacionB() {
        return this.evaluacionB
    }

    obtenerResultadoCalculado() {
        return this.resultadoCalculado
    }

    obtenerResultadoCorrecto() {
        return this.resultadoCorrecto
    }

    obtenerAntiderivadaValida() {
        return this.antiderivadaValida
    }

    obtenerEvaluacionValida() {
        return this.evaluacionValida
    }

    obtenerProcesoCompletado() {
        return this.procesoCompletado
    }

    obtenerNumeroIntentos() {
        return this.numeroIntentos
    }

    obtenerIntentosAntiderivada() {
        return this.intentosAntiderivada
    }

    obtenerIntentosEvaluacion() {
        return this.intentosEvaluacion
    }

    obtenerTiempoTotal() {
        return Date.now() - this.tiempoInicio
    }

    obtenerTiempoPaso(paso) {
        switch (paso) {
            case 1: return this.tiempoPaso1
            case 2: return this.tiempoPaso2
            case 3: return this.tiempoPaso3
            case 4: return this.tiempoPaso4
            default: return null
        }
    }

    obtenerEstaBloqueado() {
        return this.estaBloqueado
    }

    obtenerPuedeContinuar() {
        return this.puedeContinuar
    }

    obtenerEstaVerificando() {
        return this.estaVerificando
    }

    // ✅ SETTERS
    establecerAntiderivadaValida(valida) {
        this.antiderivadaValida = valida
    }

    establecerEvaluacionValida(valida) {
        this.evaluacionValida = valida
    }

    establecerResultadoCalculado(resultado) {
        this.resultadoCalculado = resultado
    }

    establecerResultadoCorrecto(correcto) {
        this.resultadoCorrecto = correcto
    }

    establecerEstaBloqueado(bloqueado) {
        this.estaBloqueado = bloqueado
    }

    establecerPuedeContinuar(puede) {
        this.puedeContinuar = puede
    }

    establecerEstaVerificando(verificando) {
        this.estaVerificando = verificando
    }
}


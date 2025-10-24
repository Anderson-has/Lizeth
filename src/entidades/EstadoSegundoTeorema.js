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
        
        // Funciones completadas
        this.funcionesCompletadas = []
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
        console.log('🔄 EstadoSegundoTeorema.establecerFuncion ejecutado:', { tipo, funcionPersonalizada })
        
        this.tipoFuncion = tipo
        this.funcionPersonalizada = funcionPersonalizada
        
        switch (tipo) {
            case 'lineal':
                this.funcionActual = (x) => x
                this.antiderivadaCorrecta = 'x²/2'
                console.log('✅ Función lineal establecida')
                break
            case 'cuadratica':
                this.funcionActual = (x) => x * x
                this.antiderivadaCorrecta = 'x³/3'
                console.log('✅ Función cuadrática establecida')
                break
            case 'seno':
                this.funcionActual = (x) => Math.sin(x)
                this.antiderivadaCorrecta = '-cos(x)'
                console.log('✅ Función seno establecida')
                break
            case 'coseno':
                this.funcionActual = (x) => Math.cos(x)
                this.antiderivadaCorrecta = 'sin(x)'
                console.log('✅ Función coseno establecida')
                break
            case 'exponencial':
                this.funcionActual = (x) => Math.exp(x)
                this.antiderivadaCorrecta = 'exp(x)'
                console.log('✅ Función exponencial establecida')
                break
            case 'personalizada':
                if (funcionPersonalizada) {
                    try {
                        // Validar sintaxis básica
                        const testFunc = new Function('x', `return ${funcionPersonalizada}`)
                        const testValue = testFunc(1)
                        
                        if (!isFinite(testValue)) {
                            this.funcionPersonalizadaValida = false
                            this.errorFuncionPersonalizada = 'La función produce valores no finitos'
                            this.funcionActual = null
                            console.log('❌ Función personalizada produce valores no finitos')
                            return
                        }
                        
                        this.funcionActual = testFunc
                        this.funcionPersonalizadaValida = true
                        this.errorFuncionPersonalizada = ''
                        // Para función personalizada, no podemos determinar automáticamente la antiderivada
                        this.antiderivadaCorrecta = 'F(x)' // Placeholder
                        console.log('✅ Función personalizada establecida y validada')
                    } catch (error) {
                        this.funcionPersonalizadaValida = false
                        this.errorFuncionPersonalizada = 'Sintaxis inválida en la función personalizada'
                        this.funcionActual = null
                        console.error('❌ Error en función personalizada:', error)
                    }
                } else {
                    this.funcionPersonalizadaValida = false
                    this.errorFuncionPersonalizada = 'Debe ingresar una función personalizada'
                    this.funcionActual = null
                    console.log('⚠️ Función personalizada requerida')
                }
                break
            default:
                this.inicializarFuncionPorDefecto()
                console.log('⚠️ Tipo de función no reconocido, usando función por defecto')
        }
        
        console.log('- función actual:', typeof this.funcionActual, !!this.funcionActual)
        console.log('- tipo función:', this.tipoFuncion)
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
        
        // ✅ MARCAR ANTIDERIVADA COMO VÁLIDA CUANDO SE ESTABLECE
        this.antiderivadaValida = true
        console.log('✅ Antiderivada marcada como válida:', antiderivada)
    }

    // ✅ ESTABLECER EVALUACIÓN
    establecerEvaluacion(evaluacionA, evaluacionB) {
        this.evaluacionA = evaluacionA
        this.evaluacionB = evaluacionB
        this.intentosEvaluacion++
        
        // ✅ MARCAR EVALUACIÓN COMO VÁLIDA CUANDO SE ESTABLECE
        this.evaluacionValida = true
        console.log('✅ Evaluación marcada como válida:', { evaluacionA, evaluacionB })
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
        
        // ✅ AGREGAR FUNCIÓN COMPLETADA
        if (this.tipoFuncion && !this.funcionesCompletadas.includes(this.tipoFuncion)) {
            this.funcionesCompletadas.push(this.tipoFuncion)
            console.log('✅ Función completada agregada:', this.tipoFuncion)
        }
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

    // ✅ OBTENER PASOS COMPLETADOS
    obtenerPasosCompletados() {
        return this.pasoActual - 1 // Los pasos completados son los anteriores al actual
    }

    // ✅ OBTENER FUNCIONES COMPLETADAS
    obtenerFuncionesCompletadas() {
        // Retorna un array con las funciones que se han completado exitosamente
        const funcionesCompletadas = []
        
        if (this.tipoFuncion && this.procesoCompletado) {
            funcionesCompletadas.push(this.tipoFuncion)
        }
        
        return funcionesCompletadas
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


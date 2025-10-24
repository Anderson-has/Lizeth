/**
 * ENTIDAD: ResultadoPTFC
 * RESPONSABILIDAD: Solo almacenar resultados del Primer Teorema Fundamental del Cálculo
 * SRP: Solo datos de resultados, no cálculos ni presentación
 */
export class ResultadoPTFC {
    constructor() {
        // ✅ RESULTADOS MATEMÁTICOS
        this.valorFuncion = 0
        this.integralAcumulada = 0
        this.derivadaIntegral = 0
        this.diferenciaVerificacion = 0
        
        // ✅ ESTADO DE VERIFICACIÓN
        this.verificacionExitosa = false
        this.toleranciaUsada = 0.001
        this.precisionCalculo = 4
        
        // ✅ METADATOS DEL CÁLCULO
        this.tiempoCalculo = 0
        this.metodoUsado = 'trapecio'
        this.pasosIntegracion = 1000
        this.funcionEvaluada = ''
        
        // ✅ RESULTADOS DE ANIMACIÓN
        this.posicionAnimacion = 0
        this.progresoAnimacion = 0
        this.velocidadActual = 1
        
        // ✅ RESULTADOS DE LOGROS
        this.logrosDesbloqueados = []
        this.nuevosLogros = []
        this.progresoTotal = 0
        
        // ✅ RESULTADOS DE TIEMPO
        this.tiempoSesion = 0
        this.tiempoExploracion = 0
        this.tiempoHastaVerificacion = 0
        
        // ✅ ESTADO DE VALIDACIÓN
        this.esValido = true
        this.errores = []
        this.advertencias = []
    }
    
    // ✅ GETTERS Y SETTERS PARA RESULTADOS MATEMÁTICOS
    obtenerResultadosMatematicos() {
        return {
            valorFuncion: this.valorFuncion,
            integralAcumulada: this.integralAcumulada,
            derivadaIntegral: this.derivadaIntegral,
            diferenciaVerificacion: this.diferenciaVerificacion
        }
    }
    
    establecerResultadosMatematicos(resultados) {
        this.valorFuncion = resultados.valorFuncion
        this.integralAcumulada = resultados.integralAcumulada
        this.derivadaIntegral = resultados.derivadaIntegral
        this.diferenciaVerificacion = resultados.diferenciaVerificacion
    }
    
    // ✅ GETTERS Y SETTERS PARA VERIFICACIÓN
    obtenerEstadoVerificacion() {
        return {
            exitosa: this.verificacionExitosa,
            tolerancia: this.toleranciaUsada,
            precision: this.precisionCalculo
        }
    }
    
    establecerEstadoVerificacion(estado) {
        this.verificacionExitosa = estado.exitosa
        this.toleranciaUsada = estado.tolerancia
        this.precisionCalculo = estado.precision
    }
    
    // ✅ GETTERS Y SETTERS PARA METADATOS
    obtenerMetadatos() {
        return {
            tiempoCalculo: this.tiempoCalculo,
            metodo: this.metodoUsado,
            pasos: this.pasosIntegracion,
            funcion: this.funcionEvaluada
        }
    }
    
    establecerMetadatos(metadatos) {
        this.tiempoCalculo = metadatos.tiempoCalculo
        this.metodoUsado = metadatos.metodo
        this.pasosIntegracion = metadatos.pasos
        this.funcionEvaluada = metadatos.funcion
    }
    
    // ✅ GETTERS Y SETTERS PARA ANIMACIÓN
    obtenerEstadoAnimacion() {
        return {
            posicion: this.posicionAnimacion,
            progreso: this.progresoAnimacion,
            velocidad: this.velocidadActual
        }
    }
    
    establecerEstadoAnimacion(estado) {
        this.posicionAnimacion = estado.posicion
        this.progresoAnimacion = estado.progreso
        this.velocidadActual = estado.velocidad
    }
    
    // ✅ GETTERS Y SETTERS PARA LOGROS
    obtenerLogros() {
        return {
            desbloqueados: this.logrosDesbloqueados,
            nuevos: this.nuevosLogros,
            progreso: this.progresoTotal
        }
    }
    
    establecerLogros(logros) {
        this.logrosDesbloqueados = logros.desbloqueados
        this.nuevosLogros = logros.nuevos
        this.progresoTotal = logros.progreso
    }
    
    agregarLogroDesbloqueado(logro) {
        if (!this.logrosDesbloqueados.find(l => l.id === logro.id)) {
            this.logrosDesbloqueados.push(logro)
            this.nuevosLogros.push(logro)
        }
    }
    
    // ✅ GETTERS Y SETTERS PARA TIEMPO
    obtenerTiempos() {
        return {
            sesion: this.tiempoSesion,
            exploracion: this.tiempoExploracion,
            hastaVerificacion: this.tiempoHastaVerificacion
        }
    }
    
    establecerTiempos(tiempos) {
        this.tiempoSesion = tiempos.sesion
        this.tiempoExploracion = tiempos.exploracion
        this.tiempoHastaVerificacion = tiempos.hastaVerificacion
    }
    
    // ✅ GETTERS Y SETTERS PARA VALIDACIÓN
    obtenerEstadoValidacion() {
        return {
            esValido: this.esValido,
            errores: this.errores,
            advertencias: this.advertencias
        }
    }
    
    establecerEstadoValidacion(validacion) {
        this.esValido = validacion.esValido
        this.errores = validacion.errores
        this.advertencias = validacion.advertencias
    }
    
    // ✅ MÉTODOS DE UTILIDAD
    formatearNumero(numero, decimales = 4) {
        return Number(numero.toFixed(decimales))
    }
    
    formatearTiempo(milisegundos) {
        const segundos = Math.floor(milisegundos / 1000)
        const minutos = Math.floor(segundos / 60)
        const segundosRestantes = segundos % 60
        
        if (minutos > 0) {
            return `${minutos}:${segundosRestantes.toString().padStart(2, '0')}`
        }
        return `${segundosRestantes}s`
    }
    
    // ✅ VERIFICAR SI HAY NUEVOS LOGROS
    tieneNuevosLogros() {
        return this.nuevosLogros.length > 0
    }
    
    // ✅ LIMPIAR NUEVOS LOGROS
    limpiarNuevosLogros() {
        this.nuevosLogros = []
    }
    
    // ✅ OBTENER RESUMEN COMPLETO
    obtenerResumen() {
        return {
            matematicos: this.obtenerResultadosMatematicos(),
            verificacion: this.obtenerEstadoVerificacion(),
            metadatos: this.obtenerMetadatos(),
            animacion: this.obtenerEstadoAnimacion(),
            logros: this.obtenerLogros(),
            tiempos: this.obtenerTiempos(),
            validacion: this.obtenerEstadoValidacion()
        }
    }
    
    // ✅ REINICIAR RESULTADOS
    reiniciar() {
        this.valorFuncion = 0
        this.integralAcumulada = 0
        this.derivadaIntegral = 0
        this.diferenciaVerificacion = 0
        this.verificacionExitosa = false
        this.posicionAnimacion = 0
        this.progresoAnimacion = 0
        this.nuevosLogros = []
        this.tiempoHastaVerificacion = 0
        this.esValido = true
        this.errores = []
        this.advertencias = []
    }
}

/**
 * SERVICIO: GestorTiempoPTFC
 * RESPONSABILIDAD: Solo gestión de tiempo y métricas del Primer Teorema Fundamental del Cálculo
 * SRP: Solo métricas de tiempo, no cálculos ni presentación
 */
export class GestorTiempoPTFC {
    constructor() {
        this.tiempoInicio = Date.now()
        this.tiempoPausa = null
        this.tiempoTotalPausado = 0
        this.eventos = []
        this.metricas = {
            tiempoSesion: 0,
            tiempoExploracion: 0,
            tiempoAnimacion: 0,
            tiempoVerificacion: 0,
            tiempoHastaPrimerLogro: null,
            tiempoHastaVerificacion: null,
            tiempoHastaAnimacionCompleta: null
        }
    }
    
    // ✅ INICIAR SESIÓN
    iniciarSesion() {
        this.tiempoInicio = Date.now()
        this.registrarEvento('sesion_iniciada')
    }
    
    // ✅ PAUSAR SESIÓN
    pausarSesion() {
        if (!this.tiempoPausa) {
            this.tiempoPausa = Date.now()
            this.registrarEvento('sesion_pausada')
        }
    }
    
    // ✅ REANUDAR SESIÓN
    reanudarSesion() {
        if (this.tiempoPausa) {
            const tiempoPausado = Date.now() - this.tiempoPausa
            this.tiempoTotalPausado += tiempoPausado
            this.tiempoPausa = null
            this.registrarEvento('sesion_reanudada')
        }
    }
    
    // ✅ OBTENER TIEMPO DE SESIÓN
    obtenerTiempoSesion() {
        const tiempoActual = this.tiempoPausa || Date.now()
        return tiempoActual - this.tiempoInicio - this.tiempoTotalPausado
    }
    
    // ✅ OBTENER TIEMPO DE EXPLORACIÓN
    obtenerTiempoExploracion() {
        return this.metricas.tiempoExploracion
    }
    
    // ✅ ACTUALIZAR TIEMPO DE EXPLORACIÓN
    actualizarTiempoExploracion() {
        this.metricas.tiempoExploracion = this.obtenerTiempoSesion()
    }
    
    // ✅ INICIAR ANIMACIÓN
    iniciarAnimacion() {
        this.registrarEvento('animacion_iniciada')
        this.metricas.tiempoAnimacion = 0
    }
    
    // ✅ FINALIZAR ANIMACIÓN
    finalizarAnimacion() {
        this.registrarEvento('animacion_finalizada')
        if (!this.metricas.tiempoHastaAnimacionCompleta) {
            this.metricas.tiempoHastaAnimacionCompleta = this.obtenerTiempoSesion()
        }
    }
    
    // ✅ INICIAR VERIFICACIÓN
    iniciarVerificacion() {
        this.registrarEvento('verificacion_iniciada')
        this.metricas.tiempoVerificacion = 0
    }
    
    // ✅ COMPLETAR VERIFICACIÓN
    completarVerificacion() {
        this.registrarEvento('verificacion_completada')
        if (!this.metricas.tiempoHastaVerificacion) {
            this.metricas.tiempoHastaVerificacion = this.obtenerTiempoSesion()
        }
    }
    
    // ✅ REGISTRAR LOGRO
    registrarLogro(logro) {
        this.registrarEvento('logro_desbloqueado', { logro: logro.id })
        
        if (!this.metricas.tiempoHastaPrimerLogro) {
            this.metricas.tiempoHastaPrimerLogro = this.obtenerTiempoSesion()
        }
    }
    
    // ✅ REGISTRAR EVENTO
    registrarEvento(tipo, datos = {}) {
        const evento = {
            tipo,
            timestamp: Date.now(),
            tiempoSesion: this.obtenerTiempoSesion(),
            datos
        }
        
        this.eventos.push(evento)
        
        // Limitar eventos a los últimos 100
        if (this.eventos.length > 100) {
            this.eventos = this.eventos.slice(-100)
        }
    }
    
    // ✅ OBTENER MÉTRICAS COMPLETAS
    obtenerMetricas() {
        return {
            ...this.metricas,
            tiempoSesion: this.obtenerTiempoSesion(),
            tiempoExploracion: this.obtenerTiempoExploracion(),
            eventos: this.eventos.length,
            eventosRecientes: this.eventos.slice(-10)
        }
    }
    
    // ✅ OBTENER ESTADÍSTICAS DE TIEMPO
    obtenerEstadisticasTiempo() {
        const tiempoSesion = this.obtenerTiempoSesion()
        
        return {
            sesion: {
                total: tiempoSesion,
                formateado: this.formatearTiempo(tiempoSesion),
                minutos: Math.floor(tiempoSesion / 60000),
                segundos: Math.floor((tiempoSesion % 60000) / 1000)
            },
            exploracion: {
                total: this.metricas.tiempoExploracion,
                formateado: this.formatearTiempo(this.metricas.tiempoExploracion)
            },
            animacion: {
                total: this.metricas.tiempoAnimacion,
                formateado: this.formatearTiempo(this.metricas.tiempoAnimacion)
            },
            verificacion: {
                total: this.metricas.tiempoVerificacion,
                formateado: this.formatearTiempo(this.metricas.tiempoVerificacion)
            }
        }
    }
    
    // ✅ OBTENER EFICIENCIA DE APRENDIZAJE
    obtenerEficienciaAprendizaje() {
        const tiempoSesion = this.obtenerTiempoSesion()
        const logrosDesbloqueados = this.eventos.filter(e => e.tipo === 'logro_desbloqueado').length
        
        return {
            logrosPorMinuto: logrosDesbloqueados / (tiempoSesion / 60000),
            tiempoPromedioPorLogro: logrosDesbloqueados > 0 ? tiempoSesion / logrosDesbloqueados : 0,
            eficiencia: logrosDesbloqueados / (tiempoSesion / 60000) * 100
        }
    }
    
    // ✅ OBTENER PATRONES DE USO
    obtenerPatronesUso() {
        const eventosPorTipo = this.eventos.reduce((acc, evento) => {
            acc[evento.tipo] = (acc[evento.tipo] || 0) + 1
            return acc
        }, {})
        
        return {
            eventosPorTipo,
            frecuenciaEventos: this.calcularFrecuenciaEventos(),
            secuenciaEventos: this.eventos.map(e => e.tipo)
        }
    }
    
    // ✅ CALCULAR FRECUENCIA DE EVENTOS
    calcularFrecuenciaEventos() {
        const ahora = Date.now()
        const ultimos5Minutos = this.eventos.filter(e => ahora - e.timestamp < 300000)
        
        return {
            ultimos5Minutos: ultimos5Minutos.length,
            eventosPorMinuto: ultimos5Minutos.length / 5,
            actividadReciente: ultimos5Minutos.length > 0
        }
    }
    
    // ✅ FORMATEAR TIEMPO
    formatearTiempo(milisegundos) {
        const segundos = Math.floor(milisegundos / 1000)
        const minutos = Math.floor(segundos / 60)
        const segundosRestantes = segundos % 60
        
        if (minutos > 0) {
            return `${minutos}:${segundosRestantes.toString().padStart(2, '0')}`
        }
        return `${segundosRestantes}s`
    }
    
    // ✅ OBTENER RESUMEN DE SESIÓN
    obtenerResumenSesion() {
        const metricas = this.obtenerMetricas()
        const estadisticas = this.obtenerEstadisticasTiempo()
        const eficiencia = this.obtenerEficienciaAprendizaje()
        const patrones = this.obtenerPatronesUso()
        
        return {
            metricas,
            estadisticas,
            eficiencia,
            patrones,
            resumen: {
                duracionTotal: estadisticas.sesion.formateado,
                logrosDesbloqueados: this.eventos.filter(e => e.tipo === 'logro_desbloqueado').length,
                eventosRegistrados: this.eventos.length,
                eficienciaAprendizaje: eficiencia.eficiencia.toFixed(2) + '%'
            }
        }
    }
    
    // ✅ REINICIAR MÉTRICAS
    reiniciar() {
        this.tiempoInicio = Date.now()
        this.tiempoPausa = null
        this.tiempoTotalPausado = 0
        this.eventos = []
        this.metricas = {
            tiempoSesion: 0,
            tiempoExploracion: 0,
            tiempoAnimacion: 0,
            tiempoVerificacion: 0,
            tiempoHastaPrimerLogro: null,
            tiempoHastaVerificacion: null,
            tiempoHastaAnimacionCompleta: null
        }
    }
    
    // ✅ EXPORTAR DATOS
    exportarDatos() {
        return {
            timestamp: Date.now(),
            metricas: this.obtenerMetricas(),
            eventos: this.eventos,
            resumen: this.obtenerResumenSesion()
        }
    }
}

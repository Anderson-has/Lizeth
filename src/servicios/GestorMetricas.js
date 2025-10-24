/**
 * SERVICIO: GestorMetricas
 * RESPONSABILIDAD: Gestionar las métricas de rendimiento del usuario
 */
export class GestorMetricas {
  constructor() {
    this.metricas = new Map()
    this.tiempoInicio = Date.now()
    this.intentos = 0
    this.errores = 0
    this.precision = 0
  }

  registrarIntento() {
    this.intentos++
  }

  registrarError(tipoError) {
    this.errores++
    if (!this.metricas.has("errores")) {
      this.metricas.set("errores", new Map())
    }
    const errores = this.metricas.get("errores")
    errores.set(tipoError, (errores.get(tipoError) || 0) + 1)
  }

  calcularPrecision(valorCalculado, valorExacto) {
    const error = Math.abs(valorCalculado - valorExacto)
    const errorRelativo = valorExacto !== 0 ? (error / Math.abs(valorExacto)) * 100 : 0
    this.precision = Math.max(0, 100 - errorRelativo)
    return this.precision
  }

  obtenerResumen() {
    const tiempoTranscurrido = (Date.now() - this.tiempoInicio) / 1000
    return {
      intentos: this.intentos,
      errores: this.errores,
      precision: this.precision.toFixed(2),
      tiempo: tiempoTranscurrido.toFixed(1),
      tasaExito: this.intentos > 0 ? (((this.intentos - this.errores) / this.intentos) * 100).toFixed(1) : 0,
    }
  }

  reiniciar() {
    this.metricas.clear()
    this.tiempoInicio = Date.now()
    this.intentos = 0
    this.errores = 0
    this.precision = 0
  }
}

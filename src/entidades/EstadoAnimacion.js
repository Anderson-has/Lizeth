/**
 * ENTIDAD: EstadoAnimacion
 * RESPONSABILIDAD: Almacenar el estado de la animación
 */
export class EstadoAnimacion {
  constructor() {
    this.activa = false
    this.velocidad = 1.0
    this.macetasActuales = 1
    this.macetasObjetivo = 50
    this.tiempoUltimoFrame = 0
    this.duracionFrame = 100 // ms entre incrementos
  }

  iniciar(macetasInicio, macetasObjetivo) {
    this.activa = true
    this.macetasActuales = macetasInicio
    this.macetasObjetivo = macetasObjetivo
    this.tiempoUltimoFrame = Date.now()
  }

  detener() {
    this.activa = false
  }

  actualizar() {
    if (!this.activa) return false

    const ahora = Date.now()
    const tiempoTranscurrido = ahora - this.tiempoUltimoFrame

    if (tiempoTranscurrido >= this.duracionFrame / this.velocidad) {
      this.macetasActuales++
      this.tiempoUltimoFrame = ahora

      if (this.macetasActuales >= this.macetasObjetivo) {
        this.detener()
        return false
      }
      return true
    }
    return false
  }

  obtenerMacetasActuales() {
    return Math.floor(this.macetasActuales)
  }

  cambiarVelocidad(velocidad) {
    this.velocidad = Math.max(0.1, Math.min(5.0, velocidad))
  }
}

import { EstadoAnimacion } from "../entidades/EstadoAnimacion"

/**
 * SERVICIO: GestorAnimacion
 * RESPONSABILIDAD: Controlar el flujo de animaciones
 */
export class GestorAnimacion {
  constructor() {
    this.estado = new EstadoAnimacion()
    this.callbacks = []
    this.animationFrameId = null
  }

  iniciar(macetasInicio, macetasObjetivo, callback) {
    this.estado.iniciar(macetasInicio, macetasObjetivo)
    this.callbacks.push(callback)
    this.loop()
  }

  detener() {
    this.estado.detener()
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId)
      this.animationFrameId = null
    }
  }

  loop() {
    if (!this.estado.activa) return

    const actualizado = this.estado.actualizar()
    if (actualizado) {
      const macetas = this.estado.obtenerMacetasActuales()
      this.callbacks.forEach((callback) => callback(macetas))
    }

    if (this.estado.activa) {
      this.animationFrameId = requestAnimationFrame(() => this.loop())
    }
  }

  cambiarVelocidad(velocidad) {
    this.estado.cambiarVelocidad(velocidad)
  }

  estaActiva() {
    return this.estado.activa
  }
}

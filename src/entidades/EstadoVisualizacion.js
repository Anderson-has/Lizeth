/**
 * ENTIDAD: EstadoVisualizacion
 * RESPONSABILIDAD: Almacenar el estado completo de la visualización
 */
export class EstadoVisualizacion {
  constructor() {
    this.funcion = null
    this.limiteIzquierdo = -2.0
    this.limiteDerecho = 4.0
    this.numeroMacetas = 8
    this.tipoHechizo = "central" // izquierdo, derecho, central
    this.modoAprendizaje = "libre" // guiado, libre
    this.animando = false
    this.velocidadAnimacion = 1.0
    this.tabActiva = "visualizacion" // teoria, visualizacion, ejemplos
  }

  actualizarLimites(izquierdo, derecho) {
    this.limiteIzquierdo = izquierdo
    this.limiteDerecho = derecho
  }

  actualizarMacetas(numero) {
    this.numeroMacetas = Math.max(1, Math.min(50, numero))
  }

  cambiarTipoHechizo(tipo) {
    if (["izquierdo", "derecho", "central"].includes(tipo)) {
      this.tipoHechizo = tipo
    }
  }

  cambiarModoAprendizaje(modo) {
    if (["guiado", "libre"].includes(modo)) {
      this.modoAprendizaje = modo
    }
  }

  toggleAnimacion() {
    this.animando = !this.animando
  }

  actualizarVelocidad(velocidad) {
    this.velocidadAnimacion = Math.max(0.1, Math.min(5.0, velocidad))
  }

  obtenerIntervalo() {
    return {
      inicio: this.limiteIzquierdo,
      fin: this.limiteDerecho,
    }
  }

  reiniciar() {
    this.limiteIzquierdo = -2.0
    this.limiteDerecho = 4.0
    this.numeroMacetas = 8
    this.tipoHechizo = "central"
    this.animando = false
    this.velocidadAnimacion = 1.0
  }
}

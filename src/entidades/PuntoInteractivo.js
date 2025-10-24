/**
 * ENTIDAD: PuntoInteractivo
 * RESPONSABILIDAD: Representar un punto arrastrable en el canvas
 */
export class PuntoInteractivo {
  constructor(x, y, tipo, radio = 8) {
    this.x = x
    this.y = y
    this.tipo = tipo // "limite-izquierdo", "limite-derecho", "control-funcion"
    this.radio = radio
    this.arrastrando = false
    this.color = this.obtenerColor()
  }

  obtenerColor() {
    switch (this.tipo) {
      case "limite-izquierdo":
      case "limite-derecho":
        return "#dc2626" // rojo para límites
      case "control-funcion":
        return "#2563eb" // azul para control de función
      default:
        return "#6b7280"
    }
  }

  contienePunto(px, py) {
    const distancia = Math.sqrt((px - this.x) ** 2 + (py - this.y) ** 2)
    return distancia <= this.radio
  }

  actualizar(x, y) {
    this.x = x
    this.y = y
  }

  iniciarArrastre() {
    this.arrastrando = true
  }

  detenerArrastre() {
    this.arrastrando = false
  }
}

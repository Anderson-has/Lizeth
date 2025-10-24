/**
 * INTERACCIÓN: GestorInteraccion
 * RESPONSABILIDAD: Manejar eventos del mouse en el canvas
 */
export class GestorInteraccion {
  constructor(canvas, transformador) {
    this.canvas = canvas
    this.transformador = transformador
    this.puntos = []
    this.puntoArrastrado = null
    this.callbacks = {
      onLimiteIzquierdoCambiado: null,
      onLimiteDerechoCambiado: null,
    }

    this.inicializarEventos()
  }

  inicializarEventos() {
    this.canvas.addEventListener("mousedown", this.onMouseDown.bind(this))
    this.canvas.addEventListener("mousemove", this.onMouseMove.bind(this))
    this.canvas.addEventListener("mouseup", this.onMouseUp.bind(this))
    this.canvas.addEventListener("mouseleave", this.onMouseUp.bind(this))
  }

  agregarPunto(punto) {
    this.puntos.push(punto)
  }

  onMouseDown(e) {
    const rect = this.canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    for (const punto of this.puntos) {
      if (punto.contienePunto(x, y)) {
        punto.iniciarArrastre()
        this.puntoArrastrado = punto
        break
      }
    }
  }

  onMouseMove(e) {
    if (!this.puntoArrastrado) return

    const rect = this.canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    this.puntoArrastrado.actualizar(x, y)

    // Convertir a coordenadas matemáticas y notificar
    const coordMat = this.transformador.canvasAMatematicas(x, y)

    if (this.puntoArrastrado.tipo === "limite-izquierdo" && this.callbacks.onLimiteIzquierdoCambiado) {
      this.callbacks.onLimiteIzquierdoCambiado(coordMat.x)
    } else if (this.puntoArrastrado.tipo === "limite-derecho" && this.callbacks.onLimiteDerechoCambiado) {
      this.callbacks.onLimiteDerechoCambiado(coordMat.x)
    }
  }

  onMouseUp() {
    if (this.puntoArrastrado) {
      this.puntoArrastrado.detenerArrastre()
      this.puntoArrastrado = null
    }
  }

  obtenerPuntos() {
    return this.puntos
  }

  limpiarPuntos() {
    this.puntos = []
  }
}

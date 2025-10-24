/**
 * PRESENTACIÓN: RenderizadorCanvas
 * RESPONSABILIDAD: Coordinar el renderizado completo del canvas
 */
export class RenderizadorCanvas {
  constructor(canvas, configuracion) {
    this.canvas = canvas
    this.ctx = canvas.getContext("2d")
    this.configuracion = configuracion
  }

  limpiar() {
    this.ctx.fillStyle = this.configuracion.colorFondo
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
  }

  renderizar(componentes) {
    this.limpiar()
    componentes.forEach((componente) => componente.renderizar(this.ctx))
  }

  obtenerContexto() {
    return this.ctx
  }
}

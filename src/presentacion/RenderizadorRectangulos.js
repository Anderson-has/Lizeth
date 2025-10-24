/**
 * PRESENTACIÓN: RenderizadorRectangulos
 * RESPONSABILIDAD: Dibujar rectángulos de Riemann
 */
export class RenderizadorRectangulos {
  constructor(rectangulos, transformador, configuracion) {
    this.rectangulos = rectangulos
    this.transformador = transformador
    this.configuracion = configuracion
  }

  renderizar(ctx) {
    this.rectangulos.forEach((rect, index) => {
      const posInicio = this.transformador.matematicasACanvas(rect.x, 0)
      const posFin = this.transformador.matematicasACanvas(rect.x, rect.altura)
      const ancho = this.transformador.escalarAncho(rect.ancho)
      const alto = Math.abs(posFin.y - posInicio.y)

      const colorIndex = index % this.configuracion.coloresRectangulos.length
      const color = this.configuracion.coloresRectangulos[colorIndex]

      // Rellenar rectángulo
      ctx.fillStyle = color + "80" // 50% transparencia
      ctx.fillRect(posInicio.x, posFin.y, ancho, alto)

      // Borde del rectángulo
      ctx.strokeStyle = color
      ctx.lineWidth = 2
      ctx.strokeRect(posInicio.x, posFin.y, ancho, alto)
    })
  }
}

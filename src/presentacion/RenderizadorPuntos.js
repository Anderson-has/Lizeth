/**
 * PRESENTACIÓN: RenderizadorPuntos
 * RESPONSABILIDAD: Dibujar puntos interactivos
 */
export class RenderizadorPuntos {
  constructor(puntos, transformador) {
    this.puntos = puntos
    this.transformador = transformador
  }

  renderizar(ctx) {
    this.puntos.forEach((punto) => {
      ctx.fillStyle = punto.color
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 2

      ctx.beginPath()
      ctx.arc(punto.x, punto.y, punto.radio, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()

      // Sombra para resaltar
      if (punto.arrastrando) {
        ctx.shadowColor = punto.color
        ctx.shadowBlur = 10
        ctx.beginPath()
        ctx.arc(punto.x, punto.y, punto.radio + 2, 0, Math.PI * 2)
        ctx.stroke()
        ctx.shadowBlur = 0
      }
    })
  }
}

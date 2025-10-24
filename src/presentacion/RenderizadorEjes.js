/**
 * PRESENTACIÓN: RenderizadorEjes
 * RESPONSABILIDAD: Dibujar ejes y grid del canvas
 */
export class RenderizadorEjes {
  constructor(configuracion, transformador) {
    this.configuracion = configuracion
    this.transformador = transformador
  }

  renderizar(ctx) {
    this.dibujarGrid(ctx)
    this.dibujarEjes(ctx)
    this.dibujarEtiquetas(ctx)
  }

  dibujarGrid(ctx) {
    ctx.strokeStyle = this.configuracion.colorGrid
    ctx.lineWidth = 1
    ctx.setLineDash([2, 2])

    const area = this.configuracion.obtenerAreaDibujo()
    const intervaloX = this.transformador.intervaloX
    const intervaloY = this.transformador.intervaloY

    // Líneas verticales
    for (let x = Math.ceil(intervaloX.inicio); x <= Math.floor(intervaloX.fin); x++) {
      const pos = this.transformador.matematicasACanvas(x, 0)
      ctx.beginPath()
      ctx.moveTo(pos.x, area.y)
      ctx.lineTo(pos.x, area.y + area.alto)
      ctx.stroke()
    }

    // Líneas horizontales
    for (let y = Math.ceil(intervaloY.min); y <= Math.floor(intervaloY.max); y++) {
      const pos = this.transformador.matematicasACanvas(0, y)
      ctx.beginPath()
      ctx.moveTo(area.x, pos.y)
      ctx.lineTo(area.x + area.ancho, pos.y)
      ctx.stroke()
    }

    ctx.setLineDash([])
  }

  dibujarEjes(ctx) {
    ctx.strokeStyle = this.configuracion.colorEjes
    ctx.lineWidth = 2

    const cero = this.transformador.matematicasACanvas(0, 0)
    const area = this.configuracion.obtenerAreaDibujo()

    // Eje X
    ctx.beginPath()
    ctx.moveTo(area.x, cero.y)
    ctx.lineTo(area.x + area.ancho, cero.y)
    ctx.stroke()

    // Eje Y
    ctx.beginPath()
    ctx.moveTo(cero.x, area.y)
    ctx.lineTo(cero.x, area.y + area.alto)
    ctx.stroke()
  }

  dibujarEtiquetas(ctx) {
    ctx.fillStyle = this.configuracion.colorEjes
    ctx.font = "12px sans-serif"
    ctx.textAlign = "center"

    const intervaloX = this.transformador.intervaloX
    const area = this.configuracion.obtenerAreaDibujo()

    // Etiquetas del eje X
    for (let x = Math.ceil(intervaloX.inicio); x <= Math.floor(intervaloX.fin); x++) {
      if (x === 0) continue
      const pos = this.transformador.matematicasACanvas(x, 0)
      ctx.fillText(x.toString(), pos.x, pos.y + 20)
    }
  }
}

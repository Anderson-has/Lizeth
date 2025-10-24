/**
 * PRESENTACIÓN: RenderizadorFuncion
 * RESPONSABILIDAD: Dibujar la función matemática
 */
export class RenderizadorFuncion {
  constructor(funcion, transformador, configuracion) {
    this.funcion = funcion
    this.transformador = transformador
    this.configuracion = configuracion
  }

  renderizar(ctx) {
    ctx.strokeStyle = this.configuracion.colorFuncion
    ctx.lineWidth = 3
    ctx.beginPath()

    const intervaloX = this.transformador.intervaloX
    const paso = (intervaloX.fin - intervaloX.inicio) / 500

    let primerPunto = true
    for (let x = intervaloX.inicio; x <= intervaloX.fin; x += paso) {
      const y = this.funcion.evaluar(x)
      const pos = this.transformador.matematicasACanvas(x, y)

      if (primerPunto) {
        ctx.moveTo(pos.x, pos.y)
        primerPunto = false
      } else {
        ctx.lineTo(pos.x, pos.y)
      }
    }
    ctx.stroke()
  }
}

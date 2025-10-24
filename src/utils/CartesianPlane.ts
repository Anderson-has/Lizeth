/**
 * Clase para manejar el dibujo del plano cartesiano
 * Con 4 intervalos en X e Y, cuadrícula y etiquetas
 */
export class CartesianPlane {
  private ctx: CanvasRenderingContext2D
  private width: number
  private height: number
  private xMin: number = -4
  private xMax: number = 4
  private yMin: number = -4
  private yMax: number = 4

  constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
    this.ctx = ctx
    this.width = width
    this.height = height
  }

  // Convertir coordenadas del mundo a pantalla
  toScreenX(x: number): number {
    const padding = 50
    const width = this.width - 2 * padding
    return padding + ((x - this.xMin) / (this.xMax - this.xMin)) * width
  }

  toScreenY(y: number): number {
    const padding = 50
    const height = this.height - 2 * padding
    return padding + height - ((y - this.yMin) / (this.yMax - this.yMin)) * height
  }

  // Convertir coordenadas de pantalla a mundo
  toWorldX(screenX: number): number {
    const padding = 50
    const width = this.width - 2 * padding
    return this.xMin + ((screenX - padding) / width) * (this.xMax - this.xMin)
  }

  toWorldY(screenY: number): number {
    const padding = 50
    const height = this.height - 2 * padding
    return this.yMin + ((height - (screenY - padding)) / height) * (this.yMax - this.yMin)
  }

  // Dibujar cuadrícula
  drawGrid(): void {
    this.ctx.strokeStyle = '#E0E0E0'
    this.ctx.lineWidth = 1

    // Líneas verticales (4 intervalos en X)
    for (let i = 0; i <= 4; i++) {
      const x = this.xMin + (i / 4) * (this.xMax - this.xMin)
      const screenX = this.toScreenX(x)
      
      this.ctx.beginPath()
      this.ctx.moveTo(screenX, 0)
      this.ctx.lineTo(screenX, this.height)
      this.ctx.stroke()
    }

    // Líneas horizontales (4 intervalos en Y)
    for (let i = 0; i <= 4; i++) {
      const y = this.yMin + (i / 4) * (this.yMax - this.yMin)
      const screenY = this.toScreenY(y)
      
      this.ctx.beginPath()
      this.ctx.moveTo(0, screenY)
      this.ctx.lineTo(this.width, screenY)
      this.ctx.stroke()
    }
  }

  // Dibujar ejes
  drawAxes(): void {
    this.ctx.strokeStyle = '#000000'
    this.ctx.lineWidth = 2

    // Eje X
    const xAxisY = this.toScreenY(0)
    this.ctx.beginPath()
    this.ctx.moveTo(0, xAxisY)
    this.ctx.lineTo(this.width, xAxisY)
    this.ctx.stroke()

    // Eje Y
    const yAxisX = this.toScreenX(0)
    this.ctx.beginPath()
    this.ctx.moveTo(yAxisX, 0)
    this.ctx.lineTo(yAxisX, this.height)
    this.ctx.stroke()
  }

  // Dibujar marcas y etiquetas
  drawLabels(): void {
    this.ctx.fillStyle = '#000000'
    this.ctx.font = '12px Arial'
    this.ctx.textAlign = 'center'
    this.ctx.textBaseline = 'top'

    // Etiquetas del eje X
    for (let i = 0; i <= 4; i++) {
      const x = this.xMin + (i / 4) * (this.xMax - this.xMin)
      const screenX = this.toScreenX(x)
      const screenY = this.toScreenY(0)
      
      this.ctx.fillText(x.toString(), screenX, screenY + 5)
    }

    // Etiquetas del eje Y
    this.ctx.textAlign = 'right'
    this.ctx.textBaseline = 'middle'
    
    for (let i = 0; i <= 4; i++) {
      const y = this.yMin + (i / 4) * (this.yMax - this.yMin)
      const screenX = this.toScreenX(0)
      const screenY = this.toScreenY(y)
      
      this.ctx.fillText(y.toString(), screenX - 5, screenY)
    }

    // Etiquetas de los ejes
    this.ctx.fillStyle = '#000'
    this.ctx.font = 'bold 14px Arial'
    this.ctx.textAlign = 'center'
    this.ctx.textBaseline = 'top'
    this.ctx.fillText('x', this.width / 2, this.height - 10)
    
    this.ctx.save()
    this.ctx.translate(10, this.height / 2)
    this.ctx.rotate(-Math.PI / 2)
    this.ctx.fillText('y', 0, 0)
    this.ctx.restore()
  }

  // Dibujar plano completo
  drawPlane(): void {
    this.ctx.clearRect(0, 0, this.width, this.height)
    this.drawGrid()
    this.drawAxes()
    this.drawLabels()
  }
}

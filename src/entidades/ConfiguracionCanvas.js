/**
 * ENTIDAD: ConfiguracionCanvas
 * RESPONSABILIDAD: Almacenar configuración del canvas y escalas
 */
export class ConfiguracionCanvas {
  constructor(ancho = 800, alto = 500) {
    this.ancho = ancho
    this.alto = alto
    this.padding = 60
    this.paddingTop = 40
    this.paddingBottom = 60
    this.paddingLeft = 60
    this.paddingRight = 40

    // Colores
    this.colorFondo = "#f0fdf4"
    this.colorEjes = "#166534"
    this.colorGrid = "#bbf7d0"
    this.colorFuncion = "#2563eb"
    this.coloresRectangulos = ["#fda4af", "#67e8f9", "#fde047", "#c084fc", "#86efac"]
  }

  obtenerAreaDibujo() {
    return {
      x: this.paddingLeft,
      y: this.paddingTop,
      ancho: this.ancho - this.paddingLeft - this.paddingRight,
      alto: this.alto - this.paddingTop - this.paddingBottom,
    }
  }

  calcularEscalas(intervaloX, intervaloY) {
    const area = this.obtenerAreaDibujo()
    return {
      escalaX: area.ancho / (intervaloX.fin - intervaloX.inicio),
      escalaY: area.alto / (intervaloY.max - intervaloY.min),
    }
  }
}

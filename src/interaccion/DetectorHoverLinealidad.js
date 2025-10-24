/**
 * DETECTOR: DetectorHoverLinealidad
 * RESPONSABILIDAD: Detectar hover del mouse sobre el canvas y calcular coordenadas
 * SRP: Solo maneja detección de hover, no renderizado ni cálculos
 */
export class DetectorHoverLinealidad {
  constructor(canvas, transformador, estado, calculadora) {
    this.canvas = canvas
    this.transformador = transformador
    this.estado = estado
    this.calculadora = calculadora
    
    // Estado del hover
    this.hoverActivo = false
    this.coordenadasHover = null
    this.valoresHover = null
    
    // Configurar eventos
    this.configurarEventos()
  }

  // Configurar eventos del mouse
  configurarEventos() {
    this.canvas.addEventListener('mousemove', (event) => {
      this.procesarHover(event)
    })
    
    this.canvas.addEventListener('mouseleave', () => {
      this.desactivarHover()
    })
  }

  // Procesar hover del mouse
  procesarHover(event) {
    const rect = this.canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    
    // Convertir coordenadas del canvas a matemáticas
    const coordenadasMatematicas = this.transformador.canvasAMatematicas(x, y)
    
    // Verificar si está dentro del área de dibujo
    if (this.estaDentroDelAreaDibujo(x, y)) {
      this.activarHover(coordenadasMatematicas, { x, y })
    } else {
      this.desactivarHover()
    }
  }

  // Verificar si está dentro del área de dibujo
  estaDentroDelAreaDibujo(x, y) {
    const area = this.transformador.configuracion.obtenerAreaDibujo()
    return x >= area.x && x <= area.x + area.ancho && 
           y >= area.y && y <= area.y + area.alto
  }

  // Activar hover
  activarHover(coordenadasMatematicas, coordenadasCanvas) {
    this.hoverActivo = true
    this.coordenadasHover = {
      matematicas: coordenadasMatematicas,
      canvas: coordenadasCanvas
    }
    
    // Calcular valores en el punto hover
    this.calcularValoresHover(coordenadasMatematicas.x)
    
    // Notificar cambio
    if (this.onHoverCambiado) {
      this.onHoverCambiado(this.obtenerDatosHover())
    }
  }

  // Desactivar hover
  desactivarHover() {
    this.hoverActivo = false
    this.coordenadasHover = null
    this.valoresHover = null
    
    // Notificar cambio
    if (this.onHoverCambiado) {
      this.onHoverCambiado(null)
    }
  }

  // Calcular valores en el punto hover
  calcularValoresHover(x) {
    const f = this.calcularFuncion(this.estado.fFuncion, x)
    const g = this.calcularFuncion(this.estado.gFuncion, x)
    const alphaF = this.estado.alpha * f
    const betaG = this.estado.beta * g
    const combinada = alphaF + betaG
    
    this.valoresHover = {
      x: x,
      f: f,
      g: g,
      alphaF: alphaF,
      betaG: betaG,
      combinada: combinada,
      alpha: this.estado.alpha,
      beta: this.estado.beta
    }
  }

  // Calcular valor de función
  calcularFuncion(funcion, x) {
    switch (funcion) {
      case "x": return x
      case "x²": return x * x
      case "x³": return x * x * x
      case "sin(x)": return Math.sin(x)
      case "cos(x)": return Math.cos(x)
      case "√x": return Math.sqrt(Math.max(0, x))
      case "eˣ": return Math.exp(x)
      default: return 0
    }
  }

  // Obtener datos del hover
  obtenerDatosHover() {
    if (!this.hoverActivo || !this.valoresHover) return null
    
    return {
      activo: this.hoverActivo,
      coordenadas: this.coordenadasHover,
      valores: this.valoresHover
    }
  }

  // Verificar si hay hover activo
  hayHoverActivo() {
    return this.hoverActivo
  }

  // Obtener coordenadas del hover
  obtenerCoordenadasHover() {
    return this.coordenadasHover
  }

  // Obtener valores del hover
  obtenerValoresHover() {
    return this.valoresHover
  }

  // Configurar callback de cambio de hover
  configurarCallbackHover(callback) {
    this.onHoverCambiado = callback
  }

  // Limpiar recursos
  limpiar() {
    this.canvas.removeEventListener('mousemove', this.procesarHover)
    this.canvas.removeEventListener('mouseleave', this.desactivarHover)
  }
}

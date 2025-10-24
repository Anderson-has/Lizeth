/**
 * RENDERIZADOR: RenderizadorGraficoLinealidad
 * RESPONSABILIDAD: Renderizar el gráfico de linealidad en el canvas
 * SRP: Solo maneja presentación visual, no lógica de negocio ni estado
 */
export class RenderizadorGraficoLinealidad {
  constructor(canvas, configuracion, transformador) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.configuracion = configuracion
    this.transformador = transformador
    
    // Componentes de interacción
    this.detectorHover = null
    this.renderizadorTooltip = null
    this.datosHover = null
  }

  // Configurar componentes de interacción
  configurarInteraccion(estado, calculadora, containerTooltip) {
    if (!containerTooltip) {
      return
    }
    
    try {
      // Importar dinámicamente para evitar dependencias circulares
      import('../interaccion/DetectorHoverLinealidad.js').then(({ DetectorHoverLinealidad }) => {
        this.detectorHover = new DetectorHoverLinealidad(this.canvas, this.transformador, estado, calculadora)
        this.detectorHover.configurarCallbackHover((datosHover) => {
          this.manejarCambioHover(datosHover)
        })
      }).catch(error => {
      })
      
      import('./RenderizadorTooltipLinealidad.js').then(({ RenderizadorTooltipLinealidad }) => {
        this.renderizadorTooltip = new RenderizadorTooltipLinealidad(containerTooltip, this.configuracion)
      }).catch(error => {
      })
    } catch (error) {
      // Error configurando interacción
    }
  }

  // Manejar cambio de hover
  manejarCambioHover(datosHover) {
    this.datosHover = datosHover
    
    if (datosHover && this.renderizadorTooltip) {
      const posicion = {
        x: datosHover.coordenadas.canvas.x,
        y: datosHover.coordenadas.canvas.y
      }
      this.renderizadorTooltip.mostrarTooltip(datosHover, posicion)
    } else if (this.renderizadorTooltip) {
      this.renderizadorTooltip.ocultarTooltip()
    }
  }

  // Renderizar el gráfico completo
  renderizar(estado, calculos) {
    this.limpiarCanvas()
    this.renderizarEjes()
    this.renderizarGrid()
    this.renderizarFunciones(estado, calculos)
    this.renderizarLeyenda(estado)
    this.renderizarLímites(estado)
    this.renderizarPuntoHover()
  }

  // Limpiar el canvas
  limpiarCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  // Renderizar ejes
  renderizarEjes() {
    const { ancho, alto, margen } = this.configuracion.grafico
    const colores = this.configuracion.colores
    
    this.ctx.strokeStyle = colores.eje
    this.ctx.lineWidth = 2
    
    // Eje X
    this.ctx.beginPath()
    this.ctx.moveTo(margen.izquierdo, alto - margen.inferior)
    this.ctx.lineTo(ancho - margen.derecho, alto - margen.inferior)
    this.ctx.stroke()
    
    // Eje Y
    this.ctx.beginPath()
    this.ctx.moveTo(margen.izquierdo, margen.superior)
    this.ctx.lineTo(margen.izquierdo, alto - margen.inferior)
    this.ctx.stroke()
    
    // Renderizar etiquetas numéricas
    this.renderizarEtiquetasEjes()
  }

  // Renderizar grid
  renderizarGrid() {
    const { ancho, alto, margen } = this.configuracion.grafico
    const colores = this.configuracion.colores
    
    this.ctx.strokeStyle = colores.grid
    this.ctx.lineWidth = 1
    
    // Líneas verticales
    for (let x = margen.izquierdo; x <= ancho - margen.derecho; x += 50) {
      this.ctx.beginPath()
      this.ctx.moveTo(x, margen.superior)
      this.ctx.lineTo(x, alto - margen.inferior)
      this.ctx.stroke()
    }
    
    // Líneas horizontales
    for (let y = margen.superior; y <= alto - margen.inferior; y += 50) {
      this.ctx.beginPath()
      this.ctx.moveTo(margen.izquierdo, y)
      this.ctx.lineTo(ancho - margen.derecho, y)
      this.ctx.stroke()
    }
  }

  // Renderizar las funciones
  renderizarFunciones(estado, calculos) {
    this.renderizarFuncionF(estado)
    this.renderizarFuncionG(estado)
    this.renderizarFuncionCombinada(estado)
  }

  // Renderizar función f(x)
  renderizarFuncionF(estado) {
    const colores = this.configuracion.colores
    this.ctx.strokeStyle = colores.fFuncion
    this.ctx.lineWidth = 2
    
    this.renderizarFuncion(estado.fFuncion, estado.limiteA, estado.limiteB)
  }

  // Renderizar función g(x)
  renderizarFuncionG(estado) {
    const colores = this.configuracion.colores
    this.ctx.strokeStyle = colores.gFuncion
    this.ctx.lineWidth = 2
    
    this.renderizarFuncion(estado.gFuncion, estado.limiteA, estado.limiteB)
  }

  // Renderizar función combinada αf(x) + βg(x)
  renderizarFuncionCombinada(estado) {
    const colores = this.configuracion.colores
    this.ctx.strokeStyle = colores.combinada
    this.ctx.lineWidth = 3
    
    this.renderizarCombinacionLineal(estado)
  }

  // Renderizar una función individual
  renderizarFuncion(funcion, limiteA, limiteB) {
    const puntos = this.generarPuntosFuncion(funcion, limiteA, limiteB)
    this.dibujarLinea(puntos)
  }

  // Renderizar combinación lineal
  renderizarCombinacionLineal(estado) {
    const puntos = this.generarPuntosCombinacion(estado)
    this.dibujarLinea(puntos)
  }

  // Generar puntos para una función
  generarPuntosFuncion(funcion, limiteA, limiteB) {
    const puntos = []
    const paso = (limiteB - limiteA) / 200
    
    for (let x = limiteA; x <= limiteB; x += paso) {
      const y = this.calcularFuncion(funcion, x)
      const puntoCanvas = this.transformador.matematicasACanvas(x, y)
      puntos.push(puntoCanvas)
    }
    
    return puntos
  }

  // Generar puntos para combinación lineal
  generarPuntosCombinacion(estado) {
    const puntos = []
    const paso = (estado.limiteB - estado.limiteA) / 200
    
    for (let x = estado.limiteA; x <= estado.limiteB; x += paso) {
      const y = this.calcularCombinacionLineal(estado, x)
      const puntoCanvas = this.transformador.matematicasACanvas(x, y)
      puntos.push(puntoCanvas)
    }
    
    return puntos
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

  // Calcular combinación lineal
  calcularCombinacionLineal(estado, x) {
    const f = this.calcularFuncion(estado.fFuncion, x)
    const g = this.calcularFuncion(estado.gFuncion, x)
    return estado.alpha * f + estado.beta * g
  }

  // Dibujar línea
  dibujarLinea(puntos) {
    if (puntos.length < 2) return
    
    this.ctx.beginPath()
    this.ctx.moveTo(puntos[0].x, puntos[0].y)
    
    for (let i = 1; i < puntos.length; i++) {
      this.ctx.lineTo(puntos[i].x, puntos[i].y)
    }
    
    this.ctx.stroke()
  }

  // Renderizar leyenda
  renderizarLeyenda(estado) {
    const { ancho, alto, margen } = this.configuracion.grafico
    const colores = this.configuracion.colores
    
    // Posicionar leyenda en la parte inferior
    const y = alto - margen.inferior + 20
    const x = margen.izquierdo + 20
    
    this.ctx.font = "14px Arial"
    
    // f(x)
    this.ctx.fillStyle = colores.fFuncion
    this.ctx.fillRect(x, y, 15, 15)
    this.ctx.fillStyle = "#000"
    this.ctx.fillText(`f(x) = ${estado.fFuncion}`, x + 20, y + 12)
    
    // g(x)
    this.ctx.fillStyle = colores.gFuncion
    this.ctx.fillRect(x, y + 25, 15, 15)
    this.ctx.fillStyle = "#000"
    this.ctx.fillText(`g(x) = ${estado.gFuncion}`, x + 20, y + 37)
    
    // Combinada
    this.ctx.fillStyle = colores.combinada
    this.ctx.fillRect(x, y + 50, 15, 15)
    this.ctx.fillStyle = "#000"
    this.ctx.fillText(`αf(x) + βg(x)`, x + 20, y + 62)
  }

  // Renderizar límites
  renderizarLímites(estado) {
    const colores = this.configuracion.colores
    this.ctx.strokeStyle = colores.eje
    this.ctx.lineWidth = 1
    this.ctx.setLineDash([5, 5])
    
    // Línea límite A
    const puntoA = this.transformador.matematicasACanvas(estado.limiteA, 0)
    this.ctx.beginPath()
    this.ctx.moveTo(puntoA.x, 0)
    this.ctx.lineTo(puntoA.x, this.canvas.height)
    this.ctx.stroke()
    
    // Línea límite B
    const puntoB = this.transformador.matematicasACanvas(estado.limiteB, 0)
    this.ctx.beginPath()
    this.ctx.moveTo(puntoB.x, 0)
    this.ctx.lineTo(puntoB.x, this.canvas.height)
    this.ctx.stroke()
    
    this.ctx.setLineDash([])
  }

  // Renderizar punto de hover
  renderizarPuntoHover() {
    if (!this.datosHover || !this.datosHover.activo) return
    
    const { coordenadas } = this.datosHover
    const puntoCanvas = coordenadas.canvas
    
    // Dibujar punto de hover
    this.ctx.save()
    this.ctx.fillStyle = '#7c3aed'
    this.ctx.strokeStyle = '#ffffff'
    this.ctx.lineWidth = 2
    this.ctx.beginPath()
    this.ctx.arc(puntoCanvas.x, puntoCanvas.y, 6, 0, 2 * Math.PI)
    this.ctx.fill()
    this.ctx.stroke()
    this.ctx.restore()
    
    // Dibujar líneas de referencia
    this.renderizarLineasReferenciaHover(coordenadas)
  }

  // Renderizar líneas de referencia del hover
  renderizarLineasReferenciaHover(coordenadas) {
    const { ancho, alto, margen } = this.configuracion.grafico
    
    this.ctx.save()
    this.ctx.strokeStyle = '#7c3aed'
    this.ctx.lineWidth = 1
    this.ctx.setLineDash([3, 3])
    
    // Línea vertical
    this.ctx.beginPath()
    this.ctx.moveTo(coordenadas.canvas.x, margen.superior)
    this.ctx.lineTo(coordenadas.canvas.x, alto - margen.inferior)
    this.ctx.stroke()
    
    // Línea horizontal
    this.ctx.beginPath()
    this.ctx.moveTo(margen.izquierdo, coordenadas.canvas.y)
    this.ctx.lineTo(ancho - margen.derecho, coordenadas.canvas.y)
    this.ctx.stroke()
    
    this.ctx.restore()
  }

  // Actualizar gráfica automáticamente
  actualizarGrafica(estado, calculos) {
    // Actualizar transformador si cambian los límites
    if (this.transformador) {
      const nuevoIntervaloX = { 
        min: estado.limiteA, 
        max: estado.limiteB,
        inicio: estado.limiteA,
        fin: estado.limiteB
      }
      this.transformador.actualizarIntervaloX(nuevoIntervaloX)
    }
    
    // Re-renderizar
    this.renderizar(estado, calculos)
  }

  // Renderizar etiquetas de los ejes
  renderizarEtiquetasEjes() {
    const { ancho, alto, margen } = this.configuracion.grafico
    const colores = this.configuracion.colores
    
    // Obtener intervalos del transformador
    const intervaloX = this.transformador.intervaloX
    const intervaloY = this.transformador.intervaloY
    
    if (!intervaloX || !intervaloY) {
      return
    }
    
    this.ctx.fillStyle = colores.eje
    this.ctx.font = "12px Arial"
    this.ctx.textAlign = "center"
    this.ctx.textBaseline = "top"
    
    // Etiquetas del eje X
    const pasoX = (intervaloX.max - intervaloX.min) / 5
    for (let i = 0; i <= 5; i++) {
      const valorX = intervaloX.min + i * pasoX
      const puntoCanvas = this.transformador.matematicasACanvas(valorX, 0)
      this.ctx.fillText(valorX.toFixed(1), puntoCanvas.x, alto - margen.inferior + 5)
    }
    
    // Etiquetas del eje Y
    this.ctx.textAlign = "right"
    this.ctx.textBaseline = "middle"
    const pasoY = (intervaloY.max - intervaloY.min) / 5
    for (let i = 0; i <= 5; i++) {
      const valorY = intervaloY.min + i * pasoY
      const puntoCanvas = this.transformador.matematicasACanvas(0, valorY)
      this.ctx.fillText(valorY.toFixed(1), margen.izquierdo - 5, puntoCanvas.y)
    }
  }

  // Limpiar recursos
  limpiar() {
    if (this.detectorHover) {
      this.detectorHover.limpiar()
    }
    if (this.renderizadorTooltip) {
      this.renderizadorTooltip.limpiar()
    }
  }
}

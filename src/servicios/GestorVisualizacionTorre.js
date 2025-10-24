/**
 * Gestor de Visualización para Torre del Valor Medio
 * Orquesta el renderizado de la torre y el plano cartesiano
 */
export class GestorVisualizacionTorre {
    constructor(estado, configuracion, calculadora) {
        this.estado = estado
        this.configuracion = configuracion
        this.calculadora = calculadora
        
        // Referencias a los canvas
        this.canvasTorre = null
        this.canvasCartesiano = null
        this.ctxTorre = null
        this.ctxCartesiano = null
        
        // Estado de renderizado
        this.estaRenderizando = false
        this.colaRenderizado = false
        this.ultimoRenderizado = 0
        this.fpsObjetivo = 30
        
        // Configuración de rendimiento
        this.configuracionRendimiento = configuracion.obtenerConfiguracionRendimiento()
    }

    // ✅ CONFIGURAR CANVAS
    configurarCanvas(canvasTorre, canvasCartesiano) {
        this.canvasTorre = canvasTorre
        this.canvasCartesiano = canvasCartesiano
        
        if (this.canvasTorre) {
            this.ctxTorre = this.canvasTorre.getContext('2d')
        }
        
        if (this.canvasCartesiano) {
            this.ctxCartesiano = this.canvasCartesiano.getContext('2d')
        }
        
        this.configurarDimensiones()
    }

    // ✅ CONFIGURAR DIMENSIONES
    configurarDimensiones() {
        if (this.canvasTorre) {
            const rect = this.canvasTorre.getBoundingClientRect()
            this.canvasTorre.width = rect.width * window.devicePixelRatio
            this.canvasTorre.height = rect.height * window.devicePixelRatio
            this.ctxTorre.scale(window.devicePixelRatio, window.devicePixelRatio)
        }
        
        if (this.canvasCartesiano) {
            const rect = this.canvasCartesiano.getBoundingClientRect()
            this.canvasCartesiano.width = rect.width * window.devicePixelRatio
            this.canvasCartesiano.height = rect.height * window.devicePixelRatio
            this.ctxCartesiano.scale(window.devicePixelRatio, window.devicePixelRatio)
        }
    }

    // ✅ RENDERIZAR COMPLETO
    async renderizarCompleto() {
        if (this.estaRenderizando) {
            this.colaRenderizado = true
            return
        }
        
        this.estaRenderizando = true
        
        try {
            await this.renderizarTorre()
            await this.renderizarCartesiano()
        } catch (error) {
            console.error('Error en renderizado completo:', error)
        } finally {
            this.estaRenderizando = false
            this.ultimoRenderizado = Date.now()
            
            if (this.colaRenderizado) {
                this.colaRenderizado = false
                this.renderizarCompleto()
            }
        }
    }

    // ✅ RENDERIZAR TORRE
    async renderizarTorre() {
        if (!this.ctxTorre || !this.canvasTorre) return
        
        const configuracionTorre = this.configuracion.obtenerConfiguracionTorre()
        const limites = this.estado.obtenerLimites()
        const funcion = this.estado.obtenerFuncion()
        const alturaPromedio = this.estado.obtenerAlturaPromedio()
        
        // Limpiar canvas
        this.ctxTorre.clearRect(0, 0, this.canvasTorre.width, this.canvasTorre.height)
        
        // Dibujar fondo degradado
        this.dibujarFondoDegradado()
        
        // Dibujar base de césped
        this.dibujarBaseCesped()
        
        // Dibujar torre (barras)
        this.dibujarTorre(funcion, limites, configuracionTorre)
        
        // Dibujar línea de altura promedio
        this.dibujarLineaPromedio(alturaPromedio, limites, configuracionTorre)
        
        // Dibujar etiquetas
        this.dibujarEtiquetasTorre(limites)
    }

    // ✅ DIBUJAR FONDO DEGRADADO
    dibujarFondoDegradado() {
        const configuracionTorre = this.configuracion.obtenerConfiguracionTorre()
        const colores = configuracionTorre.colores
        
        const gradient = this.ctxTorre.createLinearGradient(0, 0, 0, this.canvasTorre.height)
        gradient.addColorStop(0, colores.degradadoInicio)
        gradient.addColorStop(1, colores.degradadoFin)
        
        this.ctxTorre.fillStyle = gradient
        this.ctxTorre.fillRect(0, 0, this.canvasTorre.width, this.canvasTorre.height)
    }

    // ✅ DIBUJAR BASE DE CÉSPED
    dibujarBaseCesped() {
        const configuracionTorre = this.configuracion.obtenerConfiguracionTorre()
        const colores = configuracionTorre.colores
        const baseY = this.canvasTorre.height - 50
        
        // Césped verde
        this.ctxTorre.fillStyle = colores.base
        this.ctxTorre.fillRect(0, baseY, this.canvasTorre.width, 50)
        
        // Textura del césped
        this.ctxTorre.strokeStyle = colores.textura
        this.ctxTorre.lineWidth = 1
        for (let i = 0; i < this.canvasTorre.width; i += 8) {
            this.ctxTorre.beginPath()
            this.ctxTorre.moveTo(i, baseY)
            this.ctxTorre.lineTo(i + 4, baseY - 2)
            this.ctxTorre.stroke()
        }
    }

    // ✅ DIBUJAR TORRE
    dibujarTorre(funcion, limites, configuracionTorre) {
        const { a, b } = limites
        const numBars = configuracionTorre.numeroBarras
        const barWidth = (this.canvasTorre.width - 100) / numBars
        const towerStartX = 50
        const baseY = this.canvasTorre.height - 50
        
        // Calcular rango de valores
        let minY = Infinity, maxY = -Infinity
        for (let i = 0; i < numBars; i++) {
            const x = a + (i / numBars) * (b - a)
            const y = funcion(x)
            minY = Math.min(minY, y)
            maxY = Math.max(maxY, y)
        }
        
        const yRange = maxY - minY
        const scaleFactor = yRange > 0 ? 100 / yRange : 1
        
        // Dibujar cada barra
        for (let i = 0; i < numBars; i++) {
            const x = a + (i / numBars) * (b - a)
            const y = funcion(x)
            const barHeight = Math.max(5, (y - minY) * scaleFactor)
            const barX = towerStartX + i * barWidth
            const barY = baseY - barHeight
            
            // Color basado en altura
            const color = this.calculadora.calcularEscalaColores(y, minY, maxY)
            
            this.ctxTorre.fillStyle = color
            this.ctxTorre.fillRect(barX, barY, barWidth, barHeight)
            
            // Borde de la barra
            this.ctxTorre.strokeStyle = color.replace('rgb', 'rgba').replace(')', ', 0.7)')
            this.ctxTorre.lineWidth = 1
            this.ctxTorre.strokeRect(barX, barY, barWidth, barHeight)
        }
    }

    // ✅ DIBUJAR LÍNEA PROMEDIO
    dibujarLineaPromedio(alturaPromedio, limites, configuracionTorre) {
        const configuracionLinea = this.configuracion.obtenerConfiguracionLineaPromedio()
        const { a, b } = limites
        const towerStartX = 50
        const towerWidth = this.canvasTorre.width - 100
        const baseY = this.canvasTorre.height - 50
        
        // Calcular posición de la línea
        const minY = Math.min(...this.obtenerValoresFuncion(limites))
        const maxY = Math.max(...this.obtenerValoresFuncion(limites))
        const yRange = maxY - minY
        const scaleFactor = yRange > 0 ? 100 / yRange : 1
        const meanHeightScaled = (alturaPromedio - minY) * scaleFactor
        const meanHeightScreen = baseY - meanHeightScaled
        
        this.ctxTorre.strokeStyle = configuracionLinea.color
        this.ctxTorre.lineWidth = configuracionLinea.grosor
        this.ctxTorre.setLineDash(configuracionLinea.estilo)
        this.ctxTorre.beginPath()
        this.ctxTorre.moveTo(towerStartX, meanHeightScreen)
        this.ctxTorre.lineTo(towerStartX + towerWidth, meanHeightScreen)
        this.ctxTorre.stroke()
        this.ctxTorre.setLineDash([])
    }

    // ✅ DIBUJAR ETIQUETAS TORRE
    dibujarEtiquetasTorre(limites) {
        const { a, b } = limites
        const towerStartX = 50
        const towerWidth = this.canvasTorre.width - 100
        const baseY = this.canvasTorre.height - 50
        
        // Etiqueta a
        this.ctxTorre.fillStyle = '#4CAF50'
        this.ctxTorre.font = 'bold 16px Arial'
        this.ctxTorre.textAlign = 'center'
        this.ctxTorre.fillText(`a = ${a.toFixed(1)}`, towerStartX, baseY + 20)
        
        // Etiqueta b
        this.ctxTorre.fillStyle = '#4CAF50'
        this.ctxTorre.fillText(`b = ${b.toFixed(1)}`, towerStartX + towerWidth, baseY + 20)
        
        // Título
        this.ctxTorre.fillStyle = '#333'
        this.ctxTorre.font = 'bold 20px Arial'
        this.ctxTorre.textAlign = 'center'
        this.ctxTorre.fillText('Torre del Valor Medio', this.canvasTorre.width / 2, 30)
        
        // Descripción
        this.ctxTorre.fillStyle = '#666'
        this.ctxTorre.font = '14px Arial'
        this.ctxTorre.fillText('La altura de la torre representa f(x)', this.canvasTorre.width / 2, 50)
    }

    // ✅ RENDERIZAR CARTESIANO
    async renderizarCartesiano() {
        if (!this.ctxCartesiano || !this.canvasCartesiano) return
        
        const configuracionCartesiana = this.configuracion.obtenerConfiguracionCartesiana()
        const limites = this.estado.obtenerLimites()
        const funcion = this.estado.obtenerFuncion()
        const estimacionUsuario = this.estado.obtenerEstimacionUsuario()
        const puntoCReal = this.estado.obtenerPuntoCReal()
        
        // Limpiar canvas
        this.ctxCartesiano.clearRect(0, 0, this.canvasCartesiano.width, this.canvasCartesiano.height)
        
        // Dibujar grid
        this.dibujarGridCartesiano(configuracionCartesiana)
        
        // Dibujar función
        this.dibujarFuncionCartesiana(funcion, configuracionCartesiana)
        
        // Dibujar puntos a y b
        this.dibujarPuntosAB(limites, funcion, configuracionCartesiana)
        
        // Dibujar recta secante
        this.dibujarRectaSecante(limites, funcion, configuracionCartesiana)
        
        // Dibujar estimación del usuario
        if (estimacionUsuario !== null) {
            this.dibujarEstimacionUsuario(estimacionUsuario, funcion, configuracionCartesiana)
        }
        
        // Dibujar punto c real
        if (puntoCReal !== null) {
            this.dibujarPuntoCReal(puntoCReal, funcion, configuracionCartesiana)
        }
        
        // Dibujar etiquetas
        this.dibujarEtiquetasCartesiano()
    }

    // ✅ DIBUJAR GRID CARTESIANO
    dibujarGridCartesiano(configuracionCartesiana) {
        const { rangoX, rangoY, grid, colores } = configuracionCartesiana
        const { min: xMin, max: xMax } = rangoX
        const { min: yMin, max: yMax } = rangoY
        
        this.ctxCartesiano.strokeStyle = colores.grid
        this.ctxCartesiano.lineWidth = 1
        
        // Líneas verticales
        for (let i = 0; i <= grid.intervalos; i++) {
            const x = xMin + (i / grid.intervalos) * (xMax - xMin)
            const screenX = this.convertirCoordenadaX(x, xMin, xMax)
            this.ctxCartesiano.beginPath()
            this.ctxCartesiano.moveTo(screenX, 0)
            this.ctxCartesiano.lineTo(screenX, this.canvasCartesiano.height)
            this.ctxCartesiano.stroke()
        }
        
        // Líneas horizontales
        for (let i = 0; i <= grid.intervalos; i++) {
            const y = yMin + (i / grid.intervalos) * (yMax - yMin)
            const screenY = this.convertirCoordenadaY(y, yMin, yMax)
            this.ctxCartesiano.beginPath()
            this.ctxCartesiano.moveTo(0, screenY)
            this.ctxCartesiano.lineTo(this.canvasCartesiano.width, screenY)
            this.ctxCartesiano.stroke()
        }
    }

    // ✅ DIBUJAR FUNCIÓN CARTESIANA
    dibujarFuncionCartesiana(funcion, configuracionCartesiana) {
        const { rangoX, rangoY, colores } = configuracionCartesiana
        const { min: xMin, max: xMax } = rangoX
        const { min: yMin, max: yMax } = rangoY
        
        this.ctxCartesiano.strokeStyle = colores.funcion
        this.ctxCartesiano.lineWidth = 3
        this.ctxCartesiano.beginPath()
        
        let firstPoint = true
        for (let i = 0; i < this.canvasCartesiano.width; i++) {
            const x = xMin + (i / this.canvasCartesiano.width) * (xMax - xMin)
            const y = funcion(x)
            
            if (y >= yMin && y <= yMax) {
                const screenX = i
                const screenY = this.convertirCoordenadaY(y, yMin, yMax)
                
                if (firstPoint) {
                    this.ctxCartesiano.moveTo(screenX, screenY)
                    firstPoint = false
                } else {
                    this.ctxCartesiano.lineTo(screenX, screenY)
                }
            }
        }
        this.ctxCartesiano.stroke()
    }

    // ✅ DIBUJAR PUNTOS A Y B
    dibujarPuntosAB(limites, funcion, configuracionCartesiana) {
        const { a, b } = limites
        const { rangoX, rangoY, colores } = configuracionCartesiana
        const { min: xMin, max: xMax } = rangoX
        const { min: yMin, max: yMax } = rangoY
        
        const fa = funcion(a)
        const fb = funcion(b)
        
        // Punto a
        if (a >= xMin && a <= xMax && fa >= yMin && fa <= yMax) {
            const screenX = this.convertirCoordenadaX(a, xMin, xMax)
            const screenY = this.convertirCoordenadaY(fa, yMin, yMax)
            
            this.ctxCartesiano.fillStyle = colores.puntoA
            this.ctxCartesiano.beginPath()
            this.ctxCartesiano.arc(screenX, screenY, 10, 0, 2 * Math.PI)
            this.ctxCartesiano.fill()
            this.ctxCartesiano.strokeStyle = '#FFFFFF'
            this.ctxCartesiano.lineWidth = 4
            this.ctxCartesiano.stroke()
            
            this.ctxCartesiano.fillStyle = colores.puntoA
            this.ctxCartesiano.font = 'bold 16px Arial'
            this.ctxCartesiano.textAlign = 'center'
            this.ctxCartesiano.fillText('a', screenX, screenY - 25)
        }
        
        // Punto b
        if (b >= xMin && b <= xMax && fb >= yMin && fb <= yMax) {
            const screenX = this.convertirCoordenadaX(b, xMin, xMax)
            const screenY = this.convertirCoordenadaY(fb, yMin, yMax)
            
            this.ctxCartesiano.fillStyle = colores.puntoB
            this.ctxCartesiano.beginPath()
            this.ctxCartesiano.arc(screenX, screenY, 10, 0, 2 * Math.PI)
            this.ctxCartesiano.fill()
            this.ctxCartesiano.strokeStyle = '#FFFFFF'
            this.ctxCartesiano.lineWidth = 4
            this.ctxCartesiano.stroke()
            
            this.ctxCartesiano.fillStyle = colores.puntoB
            this.ctxCartesiano.font = 'bold 16px Arial'
            this.ctxCartesiano.textAlign = 'center'
            this.ctxCartesiano.fillText('b', screenX, screenY - 25)
        }
    }

    // ✅ DIBUJAR RECTA SECANTE
    dibujarRectaSecante(limites, funcion, configuracionCartesiana) {
        const { a, b } = limites
        const { rangoX, rangoY, colores } = configuracionCartesiana
        const { min: xMin, max: xMax } = rangoX
        const { min: yMin, max: yMax } = rangoY
        
        const fa = funcion(a)
        const fb = funcion(b)
        
        if (a >= xMin && a <= xMax && b >= xMin && b <= xMax && 
            fa >= yMin && fa <= yMax && fb >= yMin && fb <= yMax) {
            
            const screenAX = this.convertirCoordenadaX(a, xMin, xMax)
            const screenAY = this.convertirCoordenadaY(fa, yMin, yMax)
            const screenBX = this.convertirCoordenadaX(b, xMin, xMax)
            const screenBY = this.convertirCoordenadaY(fb, yMin, yMax)
            
            this.ctxCartesiano.strokeStyle = colores.secante
            this.ctxCartesiano.lineWidth = 3
            this.ctxCartesiano.setLineDash([8, 4])
            this.ctxCartesiano.beginPath()
            this.ctxCartesiano.moveTo(screenAX, screenAY)
            this.ctxCartesiano.lineTo(screenBX, screenBY)
            this.ctxCartesiano.stroke()
            this.ctxCartesiano.setLineDash([])
        }
    }

    // ✅ DIBUJAR ESTIMACIÓN USUARIO
    dibujarEstimacionUsuario(estimacionUsuario, funcion, configuracionCartesiana) {
        const { rangoX, rangoY, colores } = configuracionCartesiana
        const { min: xMin, max: xMax } = rangoX
        const { min: yMin, max: yMax } = rangoY
        
        const userY = funcion(estimacionUsuario)
        const screenX = this.convertirCoordenadaX(estimacionUsuario, xMin, xMax)
        const screenY = this.convertirCoordenadaY(userY, yMin, yMax)
        
        this.ctxCartesiano.fillStyle = colores.estimacionUsuario
        this.ctxCartesiano.beginPath()
        this.ctxCartesiano.arc(screenX, screenY, 8, 0, 2 * Math.PI)
        this.ctxCartesiano.fill()
        this.ctxCartesiano.strokeStyle = '#FFFFFF'
        this.ctxCartesiano.lineWidth = 2
        this.ctxCartesiano.stroke()
        
        this.ctxCartesiano.fillStyle = colores.estimacionUsuario
        this.ctxCartesiano.font = 'bold 14px Arial'
        this.ctxCartesiano.textAlign = 'center'
        this.ctxCartesiano.fillText(`Tu c ≈ ${estimacionUsuario.toFixed(2)}`, screenX + 10, screenY - 10)
    }

    // ✅ DIBUJAR PUNTO C REAL
    dibujarPuntoCReal(puntoCReal, funcion, configuracionCartesiana) {
        const { rangoX, rangoY, colores } = configuracionCartesiana
        const { min: xMin, max: xMax } = rangoX
        const { min: yMin, max: yMax } = rangoY
        
        const actualY = funcion(puntoCReal)
        const screenX = this.convertirCoordenadaX(puntoCReal, xMin, xMax)
        const screenY = this.convertirCoordenadaY(actualY, yMin, yMax)
        
        this.ctxCartesiano.fillStyle = colores.puntoCReal
        this.ctxCartesiano.beginPath()
        this.ctxCartesiano.arc(screenX, screenY, 6, 0, 2 * Math.PI)
        this.ctxCartesiano.fill()
        this.ctxCartesiano.strokeStyle = '#FFFFFF'
        this.ctxCartesiano.lineWidth = 2
        this.ctxCartesiano.stroke()
        
        this.ctxCartesiano.fillStyle = colores.puntoCReal
        this.ctxCartesiano.font = 'bold 14px Arial'
        this.ctxCartesiano.textAlign = 'center'
        this.ctxCartesiano.fillText(`c real ≈ ${puntoCReal.toFixed(2)}`, screenX + 10, screenY + 20)
        
        // Dibujar tangente
        this.dibujarTangente(puntoCReal, funcion, configuracionCartesiana)
    }

    // ✅ DIBUJAR TANGENTE
    dibujarTangente(c, funcion, configuracionCartesiana) {
        const { rangoX, rangoY, colores } = configuracionCartesiana
        const { min: xMin, max: xMax } = rangoX
        const { min: yMin, max: yMax } = rangoY
        
        const slope = this.calculadora.calcularDerivada(funcion, c)
        const tangentLength = 1
        const startX = c - tangentLength
        const endX = c + tangentLength
        const startY = funcion(c) - slope * tangentLength
        const endY = funcion(c) + slope * tangentLength
        
        this.ctxCartesiano.strokeStyle = colores.tangente
        this.ctxCartesiano.lineWidth = 2
        this.ctxCartesiano.setLineDash([4, 2])
        this.ctxCartesiano.beginPath()
        this.ctxCartesiano.moveTo(
            this.convertirCoordenadaX(startX, xMin, xMax),
            this.convertirCoordenadaY(startY, yMin, yMax)
        )
        this.ctxCartesiano.lineTo(
            this.convertirCoordenadaX(endX, xMin, xMax),
            this.convertirCoordenadaY(endY, yMin, yMax)
        )
        this.ctxCartesiano.stroke()
        this.ctxCartesiano.setLineDash([])
    }

    // ✅ DIBUJAR ETIQUETAS CARTESIANO
    dibujarEtiquetasCartesiano() {
        // Título
        this.ctxCartesiano.fillStyle = '#333'
        this.ctxCartesiano.font = 'bold 18px Arial'
        this.ctxCartesiano.textAlign = 'center'
        this.ctxCartesiano.fillText('Plano Cartesiano', this.canvasCartesiano.width / 2, 25)
        
        // Descripción
        this.ctxCartesiano.fillStyle = '#666'
        this.ctxCartesiano.font = '14px Arial'
        this.ctxCartesiano.fillText('Haz clic para colocar tu estimación de c', this.canvasCartesiano.width / 2, 45)
    }

    // ✅ CONVERTIR COORDENADAS
    convertirCoordenadaX(x, xMin, xMax) {
        return ((x - xMin) / (xMax - xMin)) * this.canvasCartesiano.width
    }

    convertirCoordenadaY(y, yMin, yMax) {
        return this.canvasCartesiano.height - ((y - yMin) / (yMax - yMin)) * this.canvasCartesiano.height
    }

    // ✅ OBTENER VALORES FUNCIÓN
    obtenerValoresFuncion(limites) {
        const { a, b } = limites
        const funcion = this.estado.obtenerFuncion()
        const valores = []
        
        for (let i = 0; i <= 50; i++) {
            const x = a + (i / 50) * (b - a)
            valores.push(funcion(x))
        }
        
        return valores
    }

    // ✅ ACTUALIZAR ESTADO
    actualizarEstado(nuevoEstado) {
        this.estado = nuevoEstado
    }

    // ✅ ACTUALIZAR CONFIGURACIÓN
    actualizarConfiguracion(nuevaConfiguracion) {
        this.configuracion = nuevaConfiguracion
    }

    // ✅ LIMPIAR CANVAS
    limpiarCanvas() {
        if (this.ctxTorre) {
            this.ctxTorre.clearRect(0, 0, this.canvasTorre.width, this.canvasTorre.height)
        }
        if (this.ctxCartesiano) {
            this.ctxCartesiano.clearRect(0, 0, this.canvasCartesiano.width, this.canvasCartesiano.height)
        }
    }
}



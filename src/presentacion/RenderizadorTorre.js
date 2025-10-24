/**
 * Renderizador de la Torre del Valor Medio
 * Especializado en renderizar la torre con histograma
 */
export class RenderizadorTorre {
    constructor(canvas, configuracion) {
        this.canvas = canvas
        this.ctx = canvas.getContext('2d')
        this.configuracion = configuracion
        
        // Configuración de la torre
        this.configuracionTorre = configuracion.obtenerConfiguracionTorre()
        this.configuracionLinea = configuracion.obtenerConfiguracionLineaPromedio()
        
        // Estado de renderizado
        this.ultimoRenderizado = 0
        this.fpsObjetivo = 30

        // Dimensiones en CSS pixels para cálculos (evita desajustes con DPR)
        this.cssWidth = 0
        this.cssHeight = 0
    }

    // RENDERIZAR TORRE COMPLETA
    renderizar(funcion, limites, alturaPromedio, estimacionUsuario = null) {
        // Configurar canvas para ocupar todo el espacio
        this.configurarCanvas()
        
        this.limpiarCanvas()
        this.dibujarFondoDegradado()
        this.dibujarBaseCesped()
        this.dibujarBarrasTorre(funcion, limites)
        this.dibujarLineaPromedio(alturaPromedio, limites, funcion)
        this.dibujarEtiquetas(limites)
        
        if (estimacionUsuario !== null) {
            this.dibujarEstimacionUsuario(estimacionUsuario, funcion, limites)
        }
    }

    // CONFIGURAR CANVAS CON DPR CORRECTO
    configurarCanvas() {
        const rect = this.canvas.getBoundingClientRect()
        const dpr = window.devicePixelRatio || 1

        // Guardar dimensiones en CSS pixels para dibujar
        this.cssWidth = rect.width
        this.cssHeight = rect.height

        // Ajustar buffer interno en device pixels
        this.canvas.width = Math.max(1, Math.floor(rect.width * dpr))
        this.canvas.height = Math.max(1, Math.floor(rect.height * dpr))

        // Resetear transform y escalar al DPR
        this.ctx.setTransform(1, 0, 0, 1, 0, 0)
        this.ctx.scale(dpr, dpr)
        this.ctx.imageSmoothingEnabled = true
        this.ctx.imageSmoothingQuality = 'high'

        // Tamaño visual del canvas
        this.canvas.style.width = rect.width + 'px'
        this.canvas.style.height = rect.height + 'px'
    }

    // LIMPIAR CANVAS
    limpiarCanvas() {
        this.ctx.clearRect(0, 0, this.cssWidth, this.cssHeight)
    }

    // DIBUJAR FONDO DEGRADADO
    dibujarFondoDegradado() {
        const colores = this.configuracionTorre?.colores || {}
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.cssHeight)
        gradient.addColorStop(0, colores.degradadoInicio)
        gradient.addColorStop(1, colores.degradadoFin)
        
        this.ctx.fillStyle = gradient
        this.ctx.fillRect(0, 0, this.cssWidth, this.cssHeight)
    }

    // DIBUJAR BASE DE CÉSPED
    dibujarBaseCesped() {
        const colores = this.configuracionTorre?.colores || {}
        const baseY = this.cssHeight - 50
        
        // Césped verde
        this.ctx.fillStyle = colores.base
        this.ctx.fillRect(0, baseY, this.cssWidth, 50)
        
        // Textura del césped (líneas diagonales)
        this.ctx.strokeStyle = colores.textura
        this.ctx.lineWidth = 1
        for (let i = 0; i < this.cssWidth; i += 8) {
            this.ctx.beginPath()
            this.ctx.moveTo(i, baseY)
            this.ctx.lineTo(i + 4, baseY - 2)
            this.ctx.stroke()
        }
    }

    // DIBUJAR BARRAS DE LA TORRE
    dibujarBarrasTorre(funcion, limites) {
        // Verificar que limites tenga la estructura correcta
        if (!limites || typeof limites.a === 'undefined' || typeof limites.b === 'undefined') {
            console.error('Error: limites no tiene la estructura correcta:', limites)
            return
        }
        
        // Extraer límites de forma segura
        const a = limites.a
        const b = limites.b
        
        if (typeof a !== 'number' || typeof b !== 'number') {
            console.error('Error: límites no son números válidos:', { a, b })
            return
        }
        
        const numBars = this.configuracionTorre?.numeroBarras || 50
        const barWidth = (this.cssWidth - 100) / numBars
        const towerStartX = 50
        const baseY = this.cssHeight - 50
        
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
            const intensidad = Math.min(1, Math.max(0, (y - minY) / yRange))
            const r = Math.floor(100 + intensidad * 155)
            const g = Math.floor(50 + intensidad * 205)
            const blue = Math.floor(150 + intensidad * 105)
            
            this.ctx.fillStyle = `rgb(${r}, ${g}, ${blue})`
            this.ctx.fillRect(barX, barY, barWidth, barHeight)
            
            // Borde de la barra
            this.ctx.strokeStyle = `rgba(${Math.floor(r * 0.7)}, ${Math.floor(g * 0.7)}, ${Math.floor(blue * 0.7)}, 0.9)`
            this.ctx.lineWidth = 1
            this.ctx.strokeRect(barX, barY, barWidth, barHeight)
        }
    }

    // DIBUJAR LÍNEA DE ALTURA PROMEDIO
    dibujarLineaPromedio(alturaPromedio, limites, funcion) {
        const { a, b } = limites
        const towerStartX = 50
        const towerWidth = this.cssWidth - 100
        const baseY = this.cssHeight - 50
        
        // Calcular posición de la línea
        const minY = this.calcularMinY(funcion, limites)
        const maxY = this.calcularMaxY(funcion, limites)
        const yRange = maxY - minY
        const scaleFactor = yRange > 0 ? 100 / yRange : 1
        const meanHeightScaled = (alturaPromedio - minY) * scaleFactor
        const meanHeightScreen = baseY - meanHeightScaled
        
        this.ctx.strokeStyle = this.configuracionLinea.color
        this.ctx.lineWidth = this.configuracionLinea.grosor
        this.ctx.setLineDash(this.configuracionLinea.estilo)
        this.ctx.beginPath()
        this.ctx.moveTo(towerStartX, meanHeightScreen)
        this.ctx.lineTo(towerStartX + towerWidth, meanHeightScreen)
        this.ctx.stroke()
        this.ctx.setLineDash([])
        
        // Etiqueta de altura
        this.ctx.fillStyle = this.configuracionLinea.color
        this.ctx.font = 'bold 14px Arial'
        this.ctx.textAlign = 'right'
        this.ctx.fillText('Altura', towerStartX + towerWidth - 10, meanHeightScreen - 5)
    }

    // DIBUJAR ESTIMACIÓN DEL USUARIO
    dibujarEstimacionUsuario(estimacionUsuario, funcion, limites) {
        const { a, b } = limites
        const towerStartX = 50
        const towerWidth = this.cssWidth - 100
        const baseY = this.cssHeight - 50
        
        // Calcular posición en la torre
        const posicionRelativa = (estimacionUsuario - a) / (b - a)
        const xEnTorre = towerStartX + posicionRelativa * towerWidth
        
        // Dibujar línea vertical
        this.ctx.strokeStyle = '#EC4899'
        this.ctx.lineWidth = 3
        this.ctx.setLineDash([4, 4])
        this.ctx.beginPath()
        this.ctx.moveTo(xEnTorre, baseY - 100)
        this.ctx.lineTo(xEnTorre, baseY)
        this.ctx.stroke()
        this.ctx.setLineDash([])
        
        // Etiqueta
        this.ctx.fillStyle = '#EC4899'
        this.ctx.font = 'bold 12px Arial'
        this.ctx.textAlign = 'center'
        this.ctx.fillText(`Tu c = ${estimacionUsuario.toFixed(2)}`, xEnTorre, baseY - 110)
    }

    // DIBUJAR ETIQUETAS
    dibujarEtiquetas(limites) {
        const { a, b } = limites
        const towerStartX = 50
        const towerWidth = this.cssWidth - 100
        const baseY = this.cssHeight - 50
        
        // Título
        this.ctx.fillStyle = '#333'
        this.ctx.font = 'bold 20px Arial'
        this.ctx.textAlign = 'center'
        this.ctx.fillText('Torre del Valor Medio', this.cssWidth / 2, 30)
        
        // Descripción
        this.ctx.fillStyle = '#666'
        this.ctx.font = '14px Arial'
        this.ctx.fillText('La altura de la torre representa f(x)', this.cssWidth / 2, 50)
        
        // Etiquetas a y b
        this.ctx.fillStyle = '#4CAF50'
        this.ctx.font = 'bold 16px Arial'
        this.ctx.textAlign = 'center'
        this.ctx.fillText(`a = ${a.toFixed(1)}`, towerStartX, baseY + 20)
        this.ctx.fillText(`b = ${b.toFixed(1)}`, towerStartX + towerWidth, baseY + 20)
    }

    // CALCULAR MIN Y MAX DE LA FUNCIÓN
    calcularMinY(funcion, limites) {
        const { a, b } = limites
        let minY = Infinity
        
        for (let i = 0; i <= 100; i++) {
            const x = a + (i / 100) * (b - a)
            const y = funcion(x)
            minY = Math.min(minY, y)
        }
        
        return minY
    }

    calcularMaxY(funcion, limites) {
        const { a, b } = limites
        let maxY = -Infinity
        
        for (let i = 0; i <= 100; i++) {
            const x = a + (i / 100) * (b - a)
            const y = funcion(x)
            maxY = Math.max(maxY, y)
        }
        
        return maxY
    }

    // CONFIGURAR DIMENSIONES (para cambios de tamaño)
    configurarDimensiones() {
        const rect = this.canvas.getBoundingClientRect()
        this.cssWidth = rect.width
        this.cssHeight = rect.height
        const dpr = window.devicePixelRatio || 1
        this.canvas.width = Math.max(1, Math.floor(rect.width * dpr))
        this.canvas.height = Math.max(1, Math.floor(rect.height * dpr))
        this.ctx.setTransform(1, 0, 0, 1, 0, 0)
        this.ctx.scale(dpr, dpr)
    }

    // ACTUALIZAR CONFIGURACIÓN
    actualizarConfiguracion(nuevaConfiguracion) {
        this.configuracion = nuevaConfiguracion
        this.configuracionTorre = nuevaConfiguracion.obtenerConfiguracionTorre()
        this.configuracionLinea = nuevaConfiguracion.obtenerConfiguracionLineaPromedio()
    }

    // OBTENER COORDENADAS DEL CLICK
    obtenerCoordenadasClick(evento) {
        const rect = this.canvas.getBoundingClientRect()
        const x = evento.clientX - rect.left
        const y = evento.clientY - rect.top
        
        // Convertir a coordenadas del mundo
        const towerStartX = 50
        const towerWidth = this.cssWidth - 100
        
        if (x >= towerStartX && x <= towerStartX + towerWidth) {
            const posicionRelativa = (x - towerStartX) / towerWidth
            return posicionRelativa
        }
        
        return null
    }

    // VERIFICAR SI EL CLICK ES VÁLIDO
    esClickValido(evento, limites) {
        const posicionRelativa = this.obtenerCoordenadasClick(evento)
        if (posicionRelativa === null) return false
        
        const { a, b } = limites
        const x = a + posicionRelativa * (b - a)
        
        return x > a && x < b
    }

    // CONVERTIR COORDENADAS A VALOR X
    convertirCoordenadasAX(evento, limites) {
        const posicionRelativa = this.obtenerCoordenadasClick(evento)
        if (posicionRelativa === null) return null
        
        const { a, b } = limites
        return a + posicionRelativa * (b - a)
    }
}


/**
 * Renderizador del Plano Cartesiano para Torre del Valor Medio
 * Reescrito para usar dimensiones en píxeles CSS (corrige desajustes de layout)
 */
import { CartesianPlane } from '../utils/CartesianPlane.ts'

export class RenderizadorCartesianoTorre {
    constructor(canvas, configuracion) {
        this.canvas = canvas
        this.ctx = canvas.getContext('2d')
        this.configuracion = configuracion

        // Configuración del plano cartesiano
        this.configuracionCartesiana = configuracion.obtenerConfiguracionCartesiana()

        // Instancia del plano cartesiano
        this.plane = null

        // Estado de renderizado
        this.ultimoRenderizado = 0
        this.fpsObjetivo = 30

        // Dimensiones CSS (no device pixels)
        this.cssWidth = 0
        this.cssHeight = 0
    }

    // RENDERIZAR PLANO CARTESIANO COMPLETO
    renderizar(funcion, limites, estimacionUsuario = null, puntoCReal = null) {
        // Configurar canvas
        this.configurarCanvas()

        // Crear instancia del plano con dimensiones CSS
        this.plane = new CartesianPlane(this.ctx, this.cssWidth, this.cssHeight)

        this.limpiarCanvas()
        this.plane.drawPlane()
        this.dibujarFuncion(funcion)
        this.dibujarPuntosAB(limites, funcion)
        this.dibujarRectaSecante(limites, funcion)

        if (estimacionUsuario !== null) {
            this.dibujarEstimacionUsuario(estimacionUsuario, funcion)
        }
        if (puntoCReal !== null) {
            this.dibujarPuntoCReal(puntoCReal, funcion)
        }
    }

    // CONFIGURAR CANVAS (DPR-aware)
    configurarCanvas() {
        const rect = this.canvas.getBoundingClientRect()
        const dpr = window.devicePixelRatio || 1

        this.cssWidth = rect.width
        this.cssHeight = rect.height

        this.canvas.width = Math.max(1, Math.floor(rect.width * dpr))
        this.canvas.height = Math.max(1, Math.floor(rect.height * dpr))

        this.ctx.setTransform(1, 0, 0, 1, 0, 0)
        this.ctx.scale(dpr, dpr)
        this.ctx.imageSmoothingEnabled = true
        this.ctx.imageSmoothingQuality = 'high'

        this.canvas.style.width = rect.width + 'px'
        this.canvas.style.height = rect.height + 'px'
    }

    limpiarCanvas() {
        this.ctx.clearRect(0, 0, this.cssWidth, this.cssHeight)
    }

    // GRID + ETIQUETAS
    dibujarGrid() {
        const { rangoX, rangoY, grid, colores } = this.configuracionCartesiana || {}
        const { min: xMin, max: xMax } = rangoX
        const { min: yMin, max: yMax } = rangoY

        this.ctx.strokeStyle = colores.grid
        this.ctx.lineWidth = 1

        // Verticales
        for (let i = 0; i <= grid.intervalos; i++) {
            const x = xMin + (i / grid.intervalos) * (xMax - xMin)
            const screenX = this.convertirCoordenadaX(x, xMin, xMax)
            this.ctx.beginPath()
            this.ctx.moveTo(screenX, 0)
            this.ctx.lineTo(screenX, this.cssHeight)
            this.ctx.stroke()
        }

        // Horizontales
        for (let i = 0; i <= grid.intervalos; i++) {
            const y = yMin + (i / grid.intervalos) * (yMax - yMin)
            const screenY = this.convertirCoordenadaY(y, yMin, yMax)
            this.ctx.beginPath()
            this.ctx.moveTo(0, screenY)
            this.ctx.lineTo(this.cssWidth, screenY)
            this.ctx.stroke()
        }

        this.dibujarEtiquetasEjes(xMin, xMax, yMin, yMax, grid.intervalos)
    }

    dibujarEtiquetasEjes(xMin, xMax, yMin, yMax, intervalos) {
        this.ctx.fillStyle = '#333'
        this.ctx.font = '12px Arial'
        this.ctx.textAlign = 'center'
        this.ctx.textBaseline = 'top'

        // Eje X
        for (let i = 0; i <= intervalos; i++) {
            const x = xMin + (i / intervalos) * (xMax - xMin)
            const screenX = this.convertirCoordenadaX(x, xMin, xMax)
            this.ctx.fillText(x.toFixed(1), screenX, this.cssHeight - 20)
        }

        // Eje Y
        this.ctx.textAlign = 'right'
        this.ctx.textBaseline = 'middle'
        for (let i = 0; i <= intervalos; i++) {
            const y = yMin + (i / intervalos) * (yMax - yMin)
            const screenY = this.convertirCoordenadaY(y, yMin, yMax)
            this.ctx.fillText(y.toFixed(1), 20, screenY)
        }

        // Etiquetas de ejes
        this.ctx.fillStyle = '#000'
        this.ctx.font = 'bold 14px Arial'
        this.ctx.textAlign = 'center'
        this.ctx.textBaseline = 'top'
        this.ctx.fillText('x', this.cssWidth / 2, this.cssHeight - 10)

        this.ctx.save()
        this.ctx.translate(10, this.cssHeight / 2)
        this.ctx.rotate(-Math.PI / 2)
        this.ctx.fillText('y', 0, 0)
        this.ctx.restore()
    }

    // FUNCIÓN Y ELEMENTOS
    dibujarFuncion(funcion) {
        const { rangoX, rangoY, colores } = this.configuracionCartesiana || {}
        const { min: xMin, max: xMax } = rangoX
        const { min: yMin, max: yMax } = rangoY

        // Redibujar base
        this.dibujarGrid()

        this.ctx.strokeStyle = colores.funcion
        this.ctx.lineWidth = 3
        this.ctx.beginPath()

        let firstPoint = true
        const numPoints = 200
        for (let i = 0; i < numPoints; i++) {
            const x = xMin + (i / numPoints) * (xMax - xMin)
            const y = funcion(x)
            if (y >= yMin && y <= yMax) {
                const screenX = this.convertirCoordenadaX(x, xMin, xMax)
                const screenY = this.convertirCoordenadaY(y, yMin, yMax)
                if (firstPoint) {
                    this.ctx.moveTo(screenX, screenY)
                    firstPoint = false
                } else {
                    this.ctx.lineTo(screenX, screenY)
                }
            }
        }
        this.ctx.stroke()
    }

    dibujarPuntosAB(limites, funcion) {
        const { a, b } = limites
        const { rangoX, rangoY, colores } = this.configuracionCartesiana || {}
        const { min: xMin, max: xMax } = rangoX
        const { min: yMin, max: yMax } = rangoY

        const fa = funcion(a)
        const fb = funcion(b)

        // Punto A
        if (a >= xMin && a <= xMax && fa >= yMin && fa <= yMax) {
            const screenX = this.convertirCoordenadaX(a, xMin, xMax)
            const screenY = this.convertirCoordenadaY(fa, yMin, yMax)
            this.ctx.fillStyle = colores.puntoA
            this.ctx.beginPath()
            this.ctx.arc(screenX, screenY, 10, 0, 2 * Math.PI)
            this.ctx.fill()
            this.ctx.strokeStyle = '#FFFFFF'
            this.ctx.lineWidth = 4
            this.ctx.stroke()
            this.ctx.fillStyle = colores.puntoA
            this.ctx.font = 'bold 16px Arial'
            this.ctx.textAlign = 'center'
            this.ctx.fillText('a', screenX, screenY - 25)
        }

        // Punto B
        if (b >= xMin && b <= xMax && fb >= yMin && fb <= yMax) {
            const screenX = this.convertirCoordenadaX(b, xMin, xMax)
            const screenY = this.convertirCoordenadaY(fb, yMin, yMax)
            this.ctx.fillStyle = colores.puntoB
            this.ctx.beginPath()
            this.ctx.arc(screenX, screenY, 10, 0, 2 * Math.PI)
            this.ctx.fill()
            this.ctx.strokeStyle = '#FFFFFF'
            this.ctx.lineWidth = 4
            this.ctx.stroke()
            this.ctx.fillStyle = colores.puntoB
            this.ctx.font = 'bold 16px Arial'
            this.ctx.textAlign = 'center'
            this.ctx.fillText('b', screenX, screenY - 25)
        }
    }

    dibujarRectaSecante(limites, funcion) {
        const { a, b } = limites
        const { rangoX, rangoY, colores } = this.configuracionCartesiana || {}
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

            this.ctx.strokeStyle = colores.secante
            this.ctx.lineWidth = 3
            this.ctx.setLineDash([8, 4])
            this.ctx.beginPath()
            this.ctx.moveTo(screenAX, screenAY)
            this.ctx.lineTo(screenBX, screenBY)
            this.ctx.stroke()
            this.ctx.setLineDash([])
        }
    }

    dibujarEstimacionUsuario(estimacionUsuario, funcion) {
        const { rangoX, rangoY, colores } = this.configuracionCartesiana || {}
        const { min: xMin, max: xMax } = rangoX
        const { min: yMin, max: yMax } = rangoY

        const userY = funcion(estimacionUsuario)
        const screenX = this.convertirCoordenadaX(estimacionUsuario, xMin, xMax)
        const screenY = this.convertirCoordenadaY(userY, yMin, yMax)

        this.ctx.fillStyle = colores.estimacionUsuario
        this.ctx.beginPath()
        this.ctx.arc(screenX, screenY, 8, 0, 2 * Math.PI)
        this.ctx.fill()
        this.ctx.strokeStyle = '#FFFFFF'
        this.ctx.lineWidth = 2
        this.ctx.stroke()

        this.ctx.fillStyle = colores.estimacionUsuario
        this.ctx.font = 'bold 14px Arial'
        this.ctx.textAlign = 'center'
        this.ctx.fillText(`Tu c = ${estimacionUsuario.toFixed(2)}`, screenX + 10, screenY - 10)
    }

    dibujarPuntoCReal(puntoCReal, funcion) {
        const { rangoX, rangoY, colores } = this.configuracionCartesiana || {}
        const { min: xMin, max: xMax } = rangoX
        const { min: yMin, max: yMax } = rangoY

        const actualY = funcion(puntoCReal)
        const screenX = this.convertirCoordenadaX(puntoCReal, xMin, xMax)
        const screenY = this.convertirCoordenadaY(actualY, yMin, yMax)

        this.ctx.fillStyle = colores.puntoCReal
        this.ctx.beginPath()
        this.ctx.arc(screenX, screenY, 6, 0, 2 * Math.PI)
        this.ctx.fill()
        this.ctx.strokeStyle = '#FFFFFF'
        this.ctx.lineWidth = 2
        this.ctx.stroke()

        this.ctx.fillStyle = colores.puntoCReal
        this.ctx.font = 'bold 14px Arial'
        this.ctx.textAlign = 'center'
        this.ctx.fillText(`c real = ${puntoCReal.toFixed(2)}`, screenX + 10, screenY + 20)

        this.dibujarTangente(puntoCReal, funcion)
    }

    dibujarTangente(c, funcion) {
        const { rangoX, rangoY, colores } = this.configuracionCartesiana || {}
        const { min: xMin, max: xMax } = rangoX
        const { min: yMin, max: yMax } = rangoY

        const h = 0.0001
        const slope = (funcion(c + h) - funcion(c - h)) / (2 * h)

        const tangentLength = 1
        const startX = c - tangentLength
        const endX = c + tangentLength
        const startY = funcion(c) - slope * tangentLength
        const endY = funcion(c) + slope * tangentLength

        this.ctx.strokeStyle = colores.tangente
        this.ctx.lineWidth = 2
        this.ctx.setLineDash([4, 2])
        this.ctx.beginPath()
        this.ctx.moveTo(
            this.convertirCoordenadaX(startX, xMin, xMax),
            this.convertirCoordenadaY(startY, yMin, yMax)
        )
        this.ctx.lineTo(
            this.convertirCoordenadaX(endX, xMin, xMax),
            this.convertirCoordenadaY(endY, yMin, yMax)
        )
        this.ctx.stroke()
        this.ctx.setLineDash([])
    }

    dibujarEtiquetas() {
        this.ctx.fillStyle = '#333'
        this.ctx.font = 'bold 18px Arial'
        this.ctx.textAlign = 'center'
        this.ctx.fillText('Plano Cartesiano', this.cssWidth / 2, 25)
        this.ctx.fillStyle = '#666'
        this.ctx.font = '14px Arial'
        this.ctx.fillText('Haz clic para colocar tu estimación de c', this.cssWidth / 2, 45)
        this.dibujarLeyenda()
    }

    dibujarLeyenda() {
        const { colores } = this.configuracionCartesiana || {}
        const x = this.cssWidth - 120
        const y = 20

        // Función
        this.ctx.strokeStyle = colores.funcion
        this.ctx.lineWidth = 3
        this.ctx.beginPath()
        this.ctx.moveTo(x, y)
        this.ctx.lineTo(x + 20, y)
        this.ctx.stroke()
        this.ctx.fillStyle = '#333'
        this.ctx.font = '12px Arial'
        this.ctx.textAlign = 'left'
        this.ctx.fillText('f(x)', x + 25, y + 5)

        // Recta secante
        this.ctx.strokeStyle = colores.secante
        this.ctx.lineWidth = 2
        this.ctx.setLineDash([4, 2])
        this.ctx.beginPath()
        this.ctx.moveTo(x, y + 15)
        this.ctx.lineTo(x + 20, y + 15)
        this.ctx.stroke()
        this.ctx.setLineDash([])
        this.ctx.fillText('Recta secante', x + 25, y + 20)
    }

    // Utilidades: conversión coordenadas
    convertirCoordenadaX(x, xMin, xMax) {
        const padding = 50
        const width = this.cssWidth - 2 * padding
        return padding + ((x - xMin) / (xMax - xMin)) * width
    }

    convertirCoordenadaY(y, yMin, yMax) {
        const padding = 50
        const height = this.cssHeight - 2 * padding
        return padding + height - ((y - yMin) / (yMax - yMin)) * height
    }

    // Inversas: de pantalla a mundo
    toWorldX(screenX, xMin, xMax) {
        const padding = 50
        const width = this.cssWidth - 2 * padding
        return xMin + ((screenX - padding) / width) * (xMax - xMin)
    }

    toWorldY(screenY, yMin, yMax) {
        const padding = 50
        const height = this.cssHeight - 2 * padding
        return yMin + ((height - (screenY - padding)) / height) * (yMax - yMin)
    }

    // API esperada por EscenarioTorreValorMedio
    configurarDimensiones() {
        // Reusar configurarCanvas para actualizar buffers y escala
        this.configurarCanvas()
    }

    obtenerCoordenadasClick(evento) {
        const rect = this.canvas.getBoundingClientRect()
        const xPix = evento.clientX - rect.left
        const yPix = evento.clientY - rect.top
        const { rangoX, rangoY } = this.configuracionCartesiana || { rangoX: {min:-4,max:4}, rangoY: {min:-4,max:4} }
        const x = this.toWorldX(xPix, rangoX.min, rangoX.max)
        const y = this.toWorldY(yPix, rangoY.min, rangoY.max)
        return { x, y }
    }

    esClickValido(evento, limites) {
        const { x } = this.obtenerCoordenadasClick(evento)
        return x > limites.a && x < limites.b
    }
}

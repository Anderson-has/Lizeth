/**
 * Renderizador del Plano Cartesiano para Torre del Valor Medio
 * Especializado en renderizar la grÃ¡fica cartesiana interactiva
 */
import { CartesianPlane } from '../utils/CartesianPlane.ts'

export class RenderizadorCartesianoTorre {
    constructor(canvas, configuracion) {
        this.canvas = canvas
        this.ctx = canvas.getContext('2d')
        this.configuracion = configuracion
        
        // ConfiguraciÃ³n del plano cartesiano
        this.configuracionCartesiana = configuracion.obtenerConfiguracionCartesiana()
        
        // Instancia del plano cartesiano
        this.plane = null
        
        // Estado de renderizado
        this.ultimoRenderizado = 0
        this.fpsObjetivo = 30
    }

    // âœ… RENDERIZAR PLANO CARTESIANO COMPLETO
    renderizar(funcion, limites, estimacionUsuario = null, puntoCReal = null) {
        // Configurar canvas para ocupar todo el espacio
        this.configurarCanvas()
        
        // Crear instancia del plano cartesiano
        this.plane = new CartesianPlane(this.ctx, this.canvas.width, this.canvas.height)
        
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

    // âœ… CONFIGURAR CANVAS
    configurarCanvas() {
        const rect = this.canvas.getBoundingClientRect()
        const dpr = window.devicePixelRatio || 1
        
        // Configurar dimensiones del canvas
        this.canvas.width = rect.width * dpr
        this.canvas.height = rect.height * dpr
        
        // Configurar contexto para alta resoluciÃ³n
        this.ctx.scale(dpr, dpr)
        this.ctx.imageSmoothingEnabled = true
        this.ctx.imageSmoothingQuality = 'high'
        
        // Asegurar que el canvas ocupe todo el espacio
        this.canvas.style.width = rect.width + 'px'
        this.canvas.style.height = rect.height + 'px'
    }

    // âœ… LIMPIAR CANVAS
    limpiarCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }

    // âœ… DIBUJAR GRID
    dibujarGrid() {
        const { rangoX, rangoY, grid, colores } = this.configuracionCartesiana || {}
        const { min: xMin, max: xMax } = rangoX
        const { min: yMin, max: yMax } = rangoY
        
        this.ctx.strokeStyle = colores.grid
        this.ctx.lineWidth = 1
        
        // LÃ­neas verticales
        for (let i = 0; i <= grid.intervalos; i++) {
            const x = xMin + (i / grid.intervalos) * (xMax - xMin)
            const screenX = this.convertirCoordenadaX(x, xMin, xMax)
            this.ctx.beginPath()
            this.ctx.moveTo(screenX, 0)
            this.ctx.lineTo(screenX, this.canvas.height)
            this.ctx.stroke()
        }
        
        // LÃ­neas horizontales
        for (let i = 0; i <= grid.intervalos; i++) {
            const y = yMin + (i / grid.intervalos) * (yMax - yMin)
            const screenY = this.convertirCoordenadaY(y, yMin, yMax)
            this.ctx.beginPath()
            this.ctx.moveTo(0, screenY)
            this.ctx.lineTo(this.canvas.width, screenY)
            this.ctx.stroke()
        }
        
        // Dibujar etiquetas de los ejes
        this.dibujarEtiquetasEjes(xMin, xMax, yMin, yMax, grid.intervalos)
    }

    // âœ… DIBUJAR ETIQUETAS DE LOS EJES
    dibujarEtiquetasEjes(xMin, xMax, yMin, yMax, intervalos) {
        this.ctx.fillStyle = '#333'
        this.ctx.font = '12px Arial'
        this.ctx.textAlign = 'center'
        this.ctx.textBaseline = 'top'
        
        // Etiquetas del eje X
        for (let i = 0; i <= intervalos; i++) {
            const x = xMin + (i / intervalos) * (xMax - xMin)
            const screenX = this.convertirCoordenadaX(x, xMin, xMax)
            this.ctx.fillText(x.toFixed(1), screenX, this.canvas.height - 20)
        }
        
        // Etiquetas del eje Y
        this.ctx.textAlign = 'right'
        this.ctx.textBaseline = 'middle'
        for (let i = 0; i <= intervalos; i++) {
            const y = yMin + (i / intervalos) * (yMax - yMin)
            const screenY = this.convertirCoordenadaY(y, yMin, yMax)
            this.ctx.fillText(y.toFixed(1), 20, screenY)
        }
        
        // Etiquetas de los ejes
        this.ctx.fillStyle = '#000'
        this.ctx.font = 'bold 14px Arial'
        this.ctx.textAlign = 'center'
        this.ctx.textBaseline = 'top'
        this.ctx.fillText('x', this.canvas.width / 2, this.canvas.height - 10)
        
        this.ctx.save()
        this.ctx.translate(10, this.canvas.height / 2)
        this.ctx.rotate(-Math.PI / 2)
        this.ctx.fillText('y', 0, 0)
        this.ctx.restore()
    }

    // âœ… DIBUJAR FUNCIÃ“N
    dibujarFuncion(funcion) {
        const { rangoX, rangoY, colores } = this.configuracionCartesiana || {}
        const { min: xMin, max: xMax } = rangoX
        const { min: yMin, max: yMax } = rangoY
        
        this.ctx.strokeStyle = colores.funcion
        this.ctx.lineWidth = 3
        this.ctx.beginPath()
        
        let firstPoint = true
        const numPoints = 200 // Aumentar resoluciÃ³n
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

    // âœ… DIBUJAR PUNTOS A Y B
    dibujarPuntosAB(limites, funcion) {
        const { a, b } = limites
        const { rangoX, rangoY, colores } = this.configuracionCartesiana || {}
        const { min: xMin, max: xMax } = rangoX
        const { min: yMin, max: yMax } = rangoY
        
        const fa = funcion(a)
        const fb = funcion(b)
        
        // Punto a
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
        
        // Punto b
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

    // âœ… DIBUJAR RECTA SECANTE
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

    // âœ… DIBUJAR ESTIMACIÃ“N DEL USUARIO
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
        this.ctx.fillText(`Tu c â‰ˆ ${estimacionUsuario.toFixed(2)}`, screenX + 10, screenY - 10)
    }

    // âœ… DIBUJAR PUNTO C REAL
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
        this.ctx.fillText(`c real â‰ˆ ${puntoCReal.toFixed(2)}`, screenX + 10, screenY + 20)
        
        // Dibujar tangente
        this.dibujarTangente(puntoCReal, funcion)
    }

    // âœ… DIBUJAR TANGENTE
    dibujarTangente(c, funcion) {
        const { rangoX, rangoY, colores } = this.configuracionCartesiana || {}
        const { min: xMin, max: xMax } = rangoX
        const { min: yMin, max: yMax } = rangoY
        
        // Calcular derivada numÃ©rica
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

    // âœ… DIBUJAR ETIQUETAS
    dibujarEtiquetas() {
        // TÃ­tulo
        this.ctx.fillStyle = '#333'
        this.ctx.font = 'bold 18px Arial'
        this.ctx.textAlign = 'center'
        this.ctx.fillText('Plano Cartesiano', this.canvas.width / 2, 25)
        
        // DescripciÃ³n
        this.ctx.fillStyle = '#666'
        this.ctx.font = '14px Arial'
        this.ctx.fillText('Haz clic para colocar tu estimaciÃ³n de c', this.canvas.width / 2, 45)
        
        // Leyenda
        this.dibujarLeyenda()
    }

    // âœ… DIBUJAR LEYENDA
    dibujarLeyenda() {
        const { colores } = this.configuracionCartesiana || {}
        const x = this.canvas.width - 120
        const y = 20
        
        // FunciÃ³n
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

    // âœ… CONVERTIR COORDENADAS
    convertirCoordenadaX(x, xMin, xMax) {
        const padding = 50
        const width = this.canvas.width - 2 * padding
        return padding + ((x - xMin) / (xMax - xMin)) * width
    }

    convertirCoordenadaY(y, yMin, yMax) {
        const padding = 50
        const height = this.canvas.height - 2 * padding
        return padding + height - ((y - yMin) / (yMax - yMin)) * height
    }

    // âœ… CONVERTIR COORDENADAS DE PANTALLA A MUNDO
    convertirPantallaAMundo(screenX, screenY) {
        const { rangoX, rangoY } = this.configuracionCartesiana || {}
        const { min: xMin, max: xMax } = rangoX
        const { min: yMin, max: yMax } = rangoY
        
        const padding = 50
        const width = this.canvas.width - 2 * padding
        const height = this.canvas.height - 2 * padding
        
        const x = xMin + ((screenX - padding) / width) * (xMax - xMin)
        const y = yMin + ((height - (screenY - padding)) / height) * (yMax - yMin)
        
        return { x, y }
    }

    // âœ… OBTENER COORDENADAS DEL CLICK
    obtenerCoordenadasClick(evento) {
        const rect = this.canvas.getBoundingClientRect()
        const screenX = evento.clientX - rect.left
        const screenY = evento.clientY - rect.top
        
        return this.convertirPantallaAMundo(screenX, screenY)
    }

    // âœ… VERIFICAR SI EL CLICK ES VÃLIDO
    esClickValido(evento, limites) {
        const { x, y } = this.obtenerCoordenadasClick(evento)
        const { a, b } = limites
        
        return x > a && x < b && y >= -4 && y <= 4
    }

    // âœ… CONFIGURAR DIMENSIONES
    configurarDimensiones() {
        const rect = this.canvas.getBoundingClientRect()
        this.canvas.width = rect.width * window.devicePixelRatio
        this.canvas.height = rect.height * window.devicePixelRatio
        this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    // âœ… ACTUALIZAR CONFIGURACIÃ“N
    actualizarConfiguracion(nuevaConfiguracion) {
        this.configuracion = nuevaConfiguracion
        this.configuracionCartesiana = nuevaConfiguracion.obtenerConfiguracionCartesiana()
    }

    // âœ… MOSTRAR INFORMACIÃ“N DE HOVER
    mostrarInformacionHover(evento, funcion) {
        const { x, y } = this.obtenerCoordenadasClick(evento)
        const valorFuncion = funcion(x)
        
        // Mostrar coordenadas en tiempo real
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
        this.ctx.fillRect(10, 10, 150, 40)
        
        this.ctx.fillStyle = '#FFFFFF'
        this.ctx.font = '12px Arial'
        this.ctx.textAlign = 'left'
        this.ctx.fillText(`x: ${x.toFixed(2)}`, 15, 25)
        this.ctx.fillText(`y: ${valorFuncion.toFixed(2)}`, 15, 40)
    }
}


/**
 * RENDERIZADOR: RenderizadorCartesianoPTFC
 * RESPONSABILIDAD: Solo renderizado de la gráfica cartesiana del Primer Teorema Fundamental del Cálculo
 * SRP: Solo presentación visual, no lógica de negocio ni cálculos
 */
export class RenderizadorCartesianoPTFC {
    constructor(configuracion) {
        this.configuracion = configuracion
        this.hoverActivo = false
        this.posicionHover = { x: 0, y: 0 }
    }
    
    // ✅ RENDERIZAR GRÁFICA CARTESIANA
    async renderizar(canvas, estado, transformador, colores) {
        if (!canvas || !estado || !transformador) return
        
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        
        // Limpiar canvas
        this.limpiarCanvas(ctx, canvas)
        
        // Obtener datos
        const funcion = estado.obtenerFuncionActual()
        const limites = estado.obtenerLimites()
        const posicionX = estado.obtenerPosicionX()
        const calculos = estado.obtenerCalculos()
        
        if (!funcion) return
        
        // Dibujar fondo
        this.dibujarFondo(ctx, canvas, colores)
        
        // Dibujar grid
        this.dibujarGrid(ctx, canvas, transformador, colores)
        
        // Dibujar ejes
        this.dibujarEjes(ctx, canvas, transformador, colores)
        
        // Dibujar área bajo la curva
        this.dibujarAreaBajoCurva(ctx, funcion, limites, posicionX, transformador, colores)
        
        // Dibujar función
        this.dibujarFuncion(ctx, funcion, limites, transformador, colores)
        
        // Dibujar línea indicadora
        this.dibujarLineaIndicadora(ctx, posicionX, funcion, transformador, colores)
        
        // Dibujar punto en la función
        this.dibujarPuntoFuncion(ctx, posicionX, funcion, transformador, colores)
        
        // Dibujar límites
        this.dibujarLimites(ctx, limites, transformador, colores)
        
        // Dibujar información
        this.dibujarInformacion(ctx, calculos, colores)
        
        // Dibujar hover si está activo
        if (this.hoverActivo) {
            this.dibujarHover(ctx, this.posicionHover, funcion, transformador, colores)
        }
    }
    
    // ✅ LIMPIAR CANVAS
    limpiarCanvas(ctx, canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
    
    // ✅ DIBUJAR FONDO
    dibujarFondo(ctx, canvas, colores) {
        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
    
    // ✅ DIBUJAR GRID
    dibujarGrid(ctx, canvas, transformador, colores) {
        const config = this.configuracion.visualizacion.cartesiana
        const margen = config.margen
        
        ctx.strokeStyle = colores.grid
        ctx.lineWidth = 0.5
        
        // Líneas verticales
        const pasoX = (canvas.width - 2 * margen) / 10
        for (let i = 0; i <= 10; i++) {
            const x = margen + i * pasoX
            ctx.beginPath()
            ctx.moveTo(x, margen)
            ctx.lineTo(x, canvas.height - margen)
            ctx.stroke()
        }
        
        // Líneas horizontales
        const pasoY = (canvas.height - 2 * margen) / 8
        for (let i = 0; i <= 8; i++) {
            const y = margen + i * pasoY
            ctx.beginPath()
            ctx.moveTo(margen, y)
            ctx.lineTo(canvas.width - margen, y)
            ctx.stroke()
        }
    }
    
    // ✅ DIBUJAR EJES
    dibujarEjes(ctx, canvas, transformador, colores) {
        const config = this.configuracion.visualizacion.cartesiana
        const margen = config.margen
        
        ctx.strokeStyle = colores.ejes
        ctx.lineWidth = 2
        
        // Eje X
        ctx.beginPath()
        ctx.moveTo(margen, canvas.height - margen)
        ctx.lineTo(canvas.width - margen, canvas.height - margen)
        ctx.stroke()
        
        // Eje Y
        ctx.beginPath()
        ctx.moveTo(margen, margen)
        ctx.lineTo(margen, canvas.height - margen)
        ctx.stroke()
        
        // ✅ DIBUJAR COORDENADAS E INTERVALOS
        this.dibujarCoordenadas(ctx, canvas, transformador, colores)
    }
    
    // ✅ DIBUJAR COORDENADAS E INTERVALOS
    dibujarCoordenadas(ctx, canvas, transformador, colores) {
        const config = this.configuracion.visualizacion.cartesiana
        const margen = config.margen
        
        // Obtener límites del transformador
        const limitesX = transformador.obtenerIntervaloX()
        const limitesY = transformador.obtenerIntervaloY()
        
        ctx.fillStyle = colores.ejes
        ctx.font = '12px Arial'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'top'
        
        // ✅ INTERVALOS EN EJE X
        const numIntervalosX = 8
        const pasoX = (limitesX.max - limitesX.min) / numIntervalosX
        
        for (let i = 0; i <= numIntervalosX; i++) {
            const valorX = limitesX.min + (i * pasoX)
            const posX = transformador.xACoordenada(valorX)
            
            // Dibujar línea vertical
            if (i > 0 && i < numIntervalosX) {
                ctx.strokeStyle = colores.grid
                ctx.lineWidth = 1
                ctx.setLineDash([2, 2])
                ctx.beginPath()
                ctx.moveTo(posX, margen)
                ctx.lineTo(posX, canvas.height - margen)
                ctx.stroke()
                ctx.setLineDash([])
            }
            
            // Dibujar etiqueta
            if (posX >= margen && posX <= canvas.width - margen) {
                ctx.fillText(valorX.toFixed(1), posX, canvas.height - margen + 5)
            }
        }
        
        // ✅ INTERVALOS EN EJE Y
        const numIntervalosY = 6
        const pasoY = (limitesY.max - limitesY.min) / numIntervalosY
        
        for (let i = 0; i <= numIntervalosY; i++) {
            const valorY = limitesY.min + (i * pasoY)
            const posY = transformador.yACoordenada(valorY)
            
            // Dibujar línea horizontal
            if (i > 0 && i < numIntervalosY) {
                ctx.strokeStyle = colores.grid
                ctx.lineWidth = 1
                ctx.setLineDash([2, 2])
                ctx.beginPath()
                ctx.moveTo(margen, posY)
                ctx.lineTo(canvas.width - margen, posY)
                ctx.stroke()
                ctx.setLineDash([])
            }
            
            // Dibujar etiqueta
            if (posY >= margen && posY <= canvas.height - margen) {
                ctx.textAlign = 'right'
                ctx.fillText(valorY.toFixed(1), margen - 5, posY - 6)
                ctx.textAlign = 'center'
            }
        }
        
        // ✅ ETIQUETAS DE EJES
        ctx.fillStyle = colores.ejes
        ctx.font = '14px Arial'
        ctx.textAlign = 'center'
        ctx.fillText('x', canvas.width / 2, canvas.height - 5)
        ctx.textAlign = 'center'
        ctx.save()
        ctx.translate(15, canvas.height / 2)
        ctx.rotate(-Math.PI / 2)
        ctx.fillText('y', 0, 0)
        ctx.restore()
    }
    
    // ✅ DIBUJAR ÁREA BAJO LA CURVA
    dibujarAreaBajoCurva(ctx, funcion, limites, posicionX, transformador, colores) {
        const puntos = this.generarPuntosArea(funcion, limites, posicionX, transformador)
        
        if (puntos.length < 3) return
        
        ctx.fillStyle = colores.areaBajoCurva
        ctx.beginPath()
        
        // Comenzar en el eje X
        const puntoInicio = transformador.matematicasACanvas(limites.a, 0)
        ctx.moveTo(puntoInicio.x, puntoInicio.y)
        
        // Seguir la curva
        for (const punto of puntos) {
            ctx.lineTo(punto.x, punto.y)
        }
        
        // Cerrar el área
        const puntoFinal = transformador.matematicasACanvas(posicionX, 0)
        ctx.lineTo(puntoFinal.x, puntoFinal.y)
        ctx.closePath()
        
        ctx.fill()
    }
    
    // ✅ DIBUJAR FUNCIÓN
    dibujarFuncion(ctx, funcion, limites, transformador, colores) {
        const puntos = this.generarPuntosFuncion(funcion, limites, transformador)
        
        if (puntos.length < 2) return
        
        ctx.strokeStyle = colores.funcion
        ctx.lineWidth = 3
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        
        ctx.beginPath()
        ctx.moveTo(puntos[0].x, puntos[0].y)
        
        for (let i = 1; i < puntos.length; i++) {
            ctx.lineTo(puntos[i].x, puntos[i].y)
        }
        
        ctx.stroke()
    }
    
    // ✅ DIBUJAR LÍNEA INDICADORA
    dibujarLineaIndicadora(ctx, posicionX, funcion, transformador, colores) {
        const config = this.configuracion.visualizacion.cartesiana
        const margen = config.margen
        
        const punto = transformador.matematicasACanvas(posicionX, 0)
        
        ctx.strokeStyle = colores.lineaIndicadora
        ctx.lineWidth = 2
        ctx.setLineDash([5, 5])
        
        ctx.beginPath()
        ctx.moveTo(punto.x, margen)
        ctx.lineTo(punto.x, config.alto - margen)
        ctx.stroke()
        
        ctx.setLineDash([])
    }
    
    // ✅ DIBUJAR PUNTO EN LA FUNCIÓN
    dibujarPuntoFuncion(ctx, posicionX, funcion, transformador, colores) {
        const y = funcion.evaluar(posicionX)
        const punto = transformador.matematicasACanvas(posicionX, y)
        
        // Círculo de fondo
        ctx.fillStyle = '#FFFFFF'
        ctx.beginPath()
        ctx.arc(punto.x, punto.y, 8, 0, 2 * Math.PI)
        ctx.fill()
        
        // Círculo del punto
        ctx.fillStyle = colores.puntoFuncion
        ctx.beginPath()
        ctx.arc(punto.x, punto.y, 5, 0, 2 * Math.PI)
        ctx.fill()
        
        // Borde
        ctx.strokeStyle = colores.funcion
        ctx.lineWidth = 2
        ctx.stroke()
    }
    
    // ✅ DIBUJAR LÍMITES
    dibujarLimites(ctx, limites, transformador, colores) {
        const config = this.configuracion.visualizacion.cartesiana
        const margen = config.margen
        
        // Límite A
        const puntoA = transformador.matematicasACanvas(limites.a, 0)
        ctx.strokeStyle = colores.verificacionExitosa
        ctx.lineWidth = 2
        ctx.setLineDash([3, 3])
        
        ctx.beginPath()
        ctx.moveTo(puntoA.x, margen)
        ctx.lineTo(puntoA.x, config.alto - margen)
        ctx.stroke()
        
        // Límite B
        const puntoB = transformador.matematicasACanvas(limites.b, 0)
        ctx.beginPath()
        ctx.moveTo(puntoB.x, margen)
        ctx.lineTo(puntoB.x, config.alto - margen)
        ctx.stroke()
        
        ctx.setLineDash([])
        
        // Etiquetas
        ctx.fillStyle = colores.verificacionExitosa
        ctx.font = 'bold 12px Arial'
        ctx.textAlign = 'center'
        ctx.fillText('a', puntoA.x, config.alto - margen + 20)
        ctx.fillText('b', puntoB.x, config.alto - margen + 20)
    }
    
    // ✅ DIBUJAR INFORMACIÓN
    dibujarInformacion(ctx, calculos, colores) {
        const x = 20
        let y = 30
        
        // Título
        ctx.fillStyle = '#374151'
        ctx.font = 'bold 14px Arial'
        ctx.fillText('Visualización del Teorema', x, y)
        y += 25
        
        // Valores
        ctx.fillStyle = '#6B7280'
        ctx.font = '12px Arial'
        ctx.fillText(`f(x) = ${calculos.valorFuncion.toFixed(4)}`, x, y)
        y += 20
        
        ctx.fillText(`F(x) = ${calculos.integralAcumulada.toFixed(4)}`, x, y)
        y += 20
        
        ctx.fillText(`F'(x) = ${calculos.derivadaIntegral.toFixed(4)}`, x, y)
        y += 20
        
        // Verificación
        const colorVerificacion = calculos.verificacionExitosa ? colores.verificacionExitosa : colores.verificacionError
        ctx.fillStyle = colorVerificacion
        ctx.font = 'bold 12px Arial'
        ctx.fillText(calculos.verificacionExitosa ? '✅ Teorema Verificado' : '❌ Teorema No Verificado', x, y)
    }
    
    // ✅ DIBUJAR HOVER
    dibujarHover(ctx, posicion, funcion, transformador, colores) {
        const y = funcion.evaluar(posicion.x)
        const punto = transformador.matematicasACanvas(posicion.x, y)
        
        // Línea vertical
        ctx.strokeStyle = colores.lineaIndicadora
        ctx.lineWidth = 1
        ctx.setLineDash([2, 2])
        
        ctx.beginPath()
        ctx.moveTo(punto.x, 0)
        ctx.lineTo(punto.x, ctx.canvas.height)
        ctx.stroke()
        
        ctx.setLineDash([])
        
        // Punto
        ctx.fillStyle = colores.puntoFuncion
        ctx.beginPath()
        ctx.arc(punto.x, punto.y, 4, 0, 2 * Math.PI)
        ctx.fill()
        
        // Tooltip
        this.dibujarTooltip(ctx, punto, posicion.x, y, colores)
    }
    
    // ✅ DIBUJAR TOOLTIP
    dibujarTooltip(ctx, punto, x, y, colores) {
        const texto = `x: ${x.toFixed(2)}\ny: ${y.toFixed(2)}`
        const lineas = texto.split('\n')
        const padding = 8
        const lineHeight = 16
        
        // Calcular dimensiones
        const maxWidth = Math.max(...lineas.map(linea => ctx.measureText(linea).width))
        const ancho = maxWidth + padding * 2
        const alto = lineas.length * lineHeight + padding * 2
        
        // Posición del tooltip
        let tooltipX = punto.x + 10
        let tooltipY = punto.y - 10
        
        if (tooltipX + ancho > ctx.canvas.width) {
            tooltipX = punto.x - ancho - 10
        }
        if (tooltipY < 0) {
            tooltipY = punto.y + 10
        }
        
        // Fondo
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
        ctx.fillRect(tooltipX, tooltipY, ancho, alto)
        
        // Texto
        ctx.fillStyle = '#FFFFFF'
        ctx.font = '12px Arial'
        ctx.textAlign = 'left'
        ctx.textBaseline = 'top'
        
        lineas.forEach((linea, index) => {
            ctx.fillText(linea, tooltipX + padding, tooltipY + padding + index * lineHeight)
        })
    }
    
    // ✅ GENERAR PUNTOS DE LA FUNCIÓN
    generarPuntosFuncion(funcion, limites, transformador) {
        const puntos = []
        // ✅ REDUCIR DENSIDAD PARA RENDERIZADO MÁS RÁPIDO
        const densidad = Math.min(this.configuracion.visualizacion.cartesiana.densidadPuntos, 100)
        const paso = (limites.b - limites.a) / densidad
        
        for (let i = 0; i <= densidad; i++) {
            const x = limites.a + i * paso
            const y = funcion.evaluar(x)
            const punto = transformador.matematicasACanvas(x, y)
            puntos.push(punto)
        }
        
        return puntos
    }
    
    // ✅ GENERAR PUNTOS DEL ÁREA
    generarPuntosArea(funcion, limites, posicionX, transformador) {
        const puntos = []
        // ✅ REDUCIR DENSIDAD PARA RENDERIZADO MÁS RÁPIDO
        const densidad = 50
        const paso = (posicionX - limites.a) / densidad
        
        for (let i = 0; i <= densidad; i++) {
            const x = limites.a + i * paso
            const y = funcion.evaluar(x)
            const punto = transformador.matematicasACanvas(x, y)
            puntos.push(punto)
        }
        
        return puntos
    }
    
    // ✅ MANEJAR HOVER
    manejarHover(evento, canvas, transformador, funcion) {
        const rect = canvas.getBoundingClientRect()
        const x = evento.clientX - rect.left
        const y = evento.clientY - rect.top
        
        const coordenadasMatematicas = transformador.canvasAMatematicas(x, y)
        this.posicionHover = coordenadasMatematicas
        this.hoverActivo = true
    }
    
    // ✅ DESACTIVAR HOVER
    desactivarHover() {
        this.hoverActivo = false
    }
    
    // ✅ OBTENER CONFIGURACIÓN
    obtenerConfiguracion() {
        return this.configuracion
    }
    
    // ✅ ACTUALIZAR CONFIGURACIÓN
    actualizarConfiguracion(nuevaConfiguracion) {
        this.configuracion = { ...this.configuracion, ...nuevaConfiguracion }
    }
}

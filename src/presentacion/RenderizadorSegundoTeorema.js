/**
 * PRESENTACIÓN: RenderizadorSegundoTeorema
 * RESPONSABILIDAD: Renderizar visualizaciones del Segundo Teorema Fundamental del Cálculo
 * SRP: Solo maneja presentación/visualización, no realiza cálculos ni almacena datos
 */
export class RenderizadorSegundoTeorema {
    constructor(canvas, configuracion = {}) {
        this.canvas = canvas
        this.ctx = canvas.getContext('2d')
        this.configuracion = {
            ancho: 800,
            alto: 400,
            margen: 50,
            colorFuncion: '#8B5CF6',
            colorArea: 'rgba(139, 92, 246, 0.3)',
            colorPuntos: '#4CAF50',
            colorEjes: '#374151',
            colorCuadricula: '#E5E7EB',
            grosorLinea: 3,
            radioPuntos: 8,
            ...configuracion
        }
        
        this.escalaX = 0
        this.escalaY = 0
        this.desplazamientoX = 0
        this.desplazamientoY = 0
        
        this.inicializarCanvas()
    }

    // ✅ INICIALIZAR CANVAS
    inicializarCanvas() {
        this.canvas.width = this.configuracion.ancho
        this.canvas.height = this.configuracion.alto
        this.ctx.lineCap = 'round'
        this.ctx.lineJoin = 'round'
    }

    // ✅ CONFIGURAR ESCALA
    configurarEscala(xMin, xMax, yMin, yMax) {
        const anchoUtil = this.configuracion.ancho - 2 * this.configuracion.margen
        const altoUtil = this.configuracion.alto - 2 * this.configuracion.margen
        
        this.escalaX = anchoUtil / (xMax - xMin)
        this.escalaY = altoUtil / (yMax - yMin)
        this.desplazamientoX = this.configuracion.margen - xMin * this.escalaX
        this.desplazamientoY = this.configuracion.alto - this.configuracion.margen + yMin * this.escalaY
    }

    // ✅ CONVERTIR COORDENADAS
    aPantallaX(x) {
        return x * this.escalaX + this.desplazamientoX
    }

    aPantallaY(y) {
        return this.configuracion.alto - (y * this.escalaY + this.desplazamientoY)
    }

    aMundoX(pantallaX) {
        return (pantallaX - this.desplazamientoX) / this.escalaX
    }

    aMundoY(pantallaY) {
        return (this.configuracion.alto - pantallaY - this.desplazamientoY) / this.escalaY
    }

    // ✅ DIBUJAR CUADRÍCULA
    dibujarCuadricula(xMin, xMax, yMin, yMax) {
        this.ctx.strokeStyle = this.configuracion.colorCuadricula
        this.ctx.lineWidth = 1
        
        // Líneas verticales
        const pasoX = (xMax - xMin) / 10
        for (let x = xMin; x <= xMax; x += pasoX) {
            const pantallaX = this.aPantallaX(x)
            this.ctx.beginPath()
            this.ctx.moveTo(pantallaX, this.configuracion.margen)
            this.ctx.lineTo(pantallaX, this.configuracion.alto - this.configuracion.margen)
            this.ctx.stroke()
        }
        
        // Líneas horizontales
        const pasoY = (yMax - yMin) / 10
        for (let y = yMin; y <= yMax; y += pasoY) {
            const pantallaY = this.aPantallaY(y)
            this.ctx.beginPath()
            this.ctx.moveTo(this.configuracion.margen, pantallaY)
            this.ctx.lineTo(this.configuracion.ancho - this.configuracion.margen, pantallaY)
            this.ctx.stroke()
        }
    }

    // ✅ DIBUJAR EJES
    dibujarEjes(xMin, xMax, yMin, yMax) {
        this.ctx.strokeStyle = this.configuracion.colorEjes
        this.ctx.lineWidth = 2
        
        // Eje X
        const ejeX = this.aPantallaY(0)
        if (ejeX >= this.configuracion.margen && ejeX <= this.configuracion.alto - this.configuracion.margen) {
            this.ctx.beginPath()
            this.ctx.moveTo(this.configuracion.margen, ejeX)
            this.ctx.lineTo(this.configuracion.ancho - this.configuracion.margen, ejeX)
            this.ctx.stroke()
        }
        
        // Eje Y
        const ejeY = this.aPantallaX(0)
        if (ejeY >= this.configuracion.margen && ejeY <= this.configuracion.ancho - this.configuracion.margen) {
            this.ctx.beginPath()
            this.ctx.moveTo(ejeY, this.configuracion.margen)
            this.ctx.lineTo(ejeY, this.configuracion.alto - this.configuracion.margen)
            this.ctx.stroke()
        }
    }

    // ✅ DIBUJAR FUNCIÓN
    dibujarFuncion(funcion, xMin, xMax, color = this.configuracion.colorFuncion) {
        this.ctx.strokeStyle = color
        this.ctx.lineWidth = this.configuracion.grosorLinea
        this.ctx.beginPath()
        
        let primerPunto = true
        const numPuntos = 1000
        
        for (let i = 0; i <= numPuntos; i++) {
            const x = xMin + (i / numPuntos) * (xMax - xMin)
            try {
                const y = funcion(x)
                if (isFinite(y)) {
                    const pantallaX = this.aPantallaX(x)
                    const pantallaY = this.aPantallaY(y)
                    
                    if (pantallaY >= this.configuracion.margen && 
                        pantallaY <= this.configuracion.alto - this.configuracion.margen) {
                        if (primerPunto) {
                            this.ctx.moveTo(pantallaX, pantallaY)
                            primerPunto = false
                        } else {
                            this.ctx.lineTo(pantallaX, pantallaY)
                        }
                    }
                }
            } catch (error) {
                // Continuar si hay error en la evaluación
            }
        }
        
        this.ctx.stroke()
    }

    // ✅ DIBUJAR ÁREA BAJO LA CURVA
    dibujarAreaBajoCurva(funcion, a, b, xMin, xMax, yMin, yMax) {
        this.ctx.fillStyle = this.configuracion.colorArea
        this.ctx.beginPath()
        
        // Comenzar desde el eje X
        this.ctx.moveTo(this.aPantallaX(a), this.aPantallaY(0))
        
        // Seguir la función
        const numPuntos = 500
        for (let i = 0; i <= numPuntos; i++) {
            const x = a + (i / numPuntos) * (b - a)
            try {
                const y = funcion(x)
                if (isFinite(y)) {
                    const pantallaX = this.aPantallaX(x)
                    const pantallaY = this.aPantallaY(y)
                    this.ctx.lineTo(pantallaX, pantallaY)
                }
            } catch (error) {
                // Continuar si hay error
            }
        }
        
        // Cerrar el área
        this.ctx.lineTo(this.aPantallaX(b), this.aPantallaY(0))
        this.ctx.closePath()
        this.ctx.fill()
    }

    // ✅ DIBUJAR PUNTOS LÍMITE
    dibujarPuntosLimite(funcion, a, b, xMin, xMax, yMin, yMax) {
        try {
            const fa = funcion(a)
            const fb = funcion(b)
            
            // Punto A
            if (isFinite(fa)) {
                const pantallaXA = this.aPantallaX(a)
                const pantallaYA = this.aPantallaY(fa)
                
                if (pantallaXA >= this.configuracion.margen && 
                    pantallaXA <= this.configuracion.ancho - this.configuracion.margen &&
                    pantallaYA >= this.configuracion.margen && 
                    pantallaYA <= this.configuracion.alto - this.configuracion.margen) {
                    
                    this.ctx.fillStyle = this.configuracion.colorPuntos
                    this.ctx.beginPath()
                    this.ctx.arc(pantallaXA, pantallaYA, this.configuracion.radioPuntos, 0, 2 * Math.PI)
                    this.ctx.fill()
                    
                    // Etiqueta
                    this.ctx.fillStyle = this.configuracion.colorEjes
                    this.ctx.font = 'bold 14px Arial'
                    this.ctx.textAlign = 'center'
                    this.ctx.fillText('a', pantallaXA, pantallaYA - 15)
                }
            }
            
            // Punto B
            if (isFinite(fb)) {
                const pantallaXB = this.aPantallaX(b)
                const pantallaYB = this.aPantallaY(fb)
                
                if (pantallaXB >= this.configuracion.margen && 
                    pantallaXB <= this.configuracion.ancho - this.configuracion.margen &&
                    pantallaYB >= this.configuracion.margen && 
                    pantallaYB <= this.configuracion.alto - this.configuracion.margen) {
                    
                    this.ctx.fillStyle = this.configuracion.colorPuntos
                    this.ctx.beginPath()
                    this.ctx.arc(pantallaXB, pantallaYB, this.configuracion.radioPuntos, 0, 2 * Math.PI)
                    this.ctx.fill()
                    
                    // Etiqueta
                    this.ctx.fillStyle = this.configuracion.colorEjes
                    this.ctx.font = 'bold 14px Arial'
                    this.ctx.textAlign = 'center'
                    this.ctx.fillText('b', pantallaXB, pantallaYB - 15)
                }
            }
        } catch (error) {
            console.error('Error dibujando puntos límite:', error)
        }
    }

    // ✅ DIBUJAR LÍNEAS VERTICALES EN LÍMITES
    dibujarLineasVerticales(a, b, xMin, xMax, yMin, yMax) {
        this.ctx.strokeStyle = this.configuracion.colorPuntos
        this.ctx.lineWidth = 2
        this.ctx.setLineDash([5, 5])
        
        // Línea en x = a
        const pantallaXA = this.aPantallaX(a)
        if (pantallaXA >= this.configuracion.margen && 
            pantallaXA <= this.configuracion.ancho - this.configuracion.margen) {
            this.ctx.beginPath()
            this.ctx.moveTo(pantallaXA, this.configuracion.margen)
            this.ctx.lineTo(pantallaXA, this.configuracion.alto - this.configuracion.margen)
            this.ctx.stroke()
        }
        
        // Línea en x = b
        const pantallaXB = this.aPantallaX(b)
        if (pantallaXB >= this.configuracion.margen && 
            pantallaXB <= this.configuracion.ancho - this.configuracion.margen) {
            this.ctx.beginPath()
            this.ctx.moveTo(pantallaXB, this.configuracion.margen)
            this.ctx.lineTo(pantallaXB, this.configuracion.alto - this.configuracion.margen)
            this.ctx.stroke()
        }
        
        this.ctx.setLineDash([])
    }

    // ✅ DIBUJAR ETIQUETAS DE LÍMITES
    dibujarEtiquetasLimites(a, b, xMin, xMax, yMin, yMax) {
        this.ctx.fillStyle = this.configuracion.colorEjes
        this.ctx.font = 'bold 16px Arial'
        this.ctx.textAlign = 'center'
        
        // Etiqueta para x = a
        const pantallaXA = this.aPantallaX(a)
        if (pantallaXA >= this.configuracion.margen && 
            pantallaXA <= this.configuracion.ancho - this.configuracion.margen) {
            this.ctx.fillText(`x = ${a.toFixed(2)}`, pantallaXA, this.configuracion.alto - 10)
        }
        
        // Etiqueta para x = b
        const pantallaXB = this.aPantallaX(b)
        if (pantallaXB >= this.configuracion.margen && 
            pantallaXB <= this.configuracion.ancho - this.configuracion.margen) {
            this.ctx.fillText(`x = ${b.toFixed(2)}`, pantallaXB, this.configuracion.alto - 10)
        }
    }

    // ✅ DIBUJAR INFORMACIÓN DE LA INTEGRAL
    dibujarInformacionIntegral(funcion, a, b, resultado) {
        const x = this.configuracion.ancho - 200
        const y = 30
        
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
        this.ctx.fillRect(x - 10, y - 10, 190, 80)
        
        this.ctx.strokeStyle = this.configuracion.colorEjes
        this.ctx.lineWidth = 1
        this.ctx.strokeRect(x - 10, y - 10, 190, 80)
        
        this.ctx.fillStyle = this.configuracion.colorEjes
        this.ctx.font = 'bold 14px Arial'
        this.ctx.textAlign = 'left'
        this.ctx.fillText(`∫[${a.toFixed(2)}, ${b.toFixed(2)}] f(x)dx`, x, y + 15)
        this.ctx.fillText(`= ${resultado.toFixed(4)}`, x, y + 35)
        this.ctx.fillText(`Área bajo la curva`, x, y + 55)
    }

    // ✅ RENDERIZAR VISUALIZACIÓN COMPLETA
    renderizarVisualizacionCompleta(funcion, a, b, xMin, xMax, yMin, yMax, resultado) {
        // Limpiar canvas
        this.ctx.clearRect(0, 0, this.configuracion.ancho, this.configuracion.alto)
        
        // Configurar escala
        this.configurarEscala(xMin, xMax, yMin, yMax)
        
        // Dibujar elementos en orden
        this.dibujarCuadricula(xMin, xMax, yMin, yMax)
        this.dibujarEjes(xMin, xMax, yMin, yMax)
        this.dibujarAreaBajoCurva(funcion, a, b, xMin, xMax, yMin, yMax)
        this.dibujarLineasVerticales(a, b, xMin, xMax, yMin, yMax)
        this.dibujarFuncion(funcion, xMin, xMax)
        this.dibujarPuntosLimite(funcion, a, b, xMin, xMax, yMin, yMax)
        this.dibujarEtiquetasLimites(a, b, xMin, xMax, yMin, yMax)
        this.dibujarInformacionIntegral(funcion, a, b, resultado)
    }

    // ✅ RENDERIZAR PASO A PASO
    renderizarPaso(paso, funcion, a, b, xMin, xMax, yMin, yMax, datosAdicionales = {}) {
        // Limpiar canvas
        this.ctx.clearRect(0, 0, this.configuracion.ancho, this.configuracion.alto)
        
        // Configurar escala
        this.configurarEscala(xMin, xMax, yMin, yMax)
        
        // Dibujar elementos base
        this.dibujarCuadricula(xMin, xMax, yMin, yMax)
        this.dibujarEjes(xMin, xMax, yMin, yMax)
        
        switch (paso) {
            case 1: // Mostrar solo la función
                this.dibujarFuncion(funcion, xMin, xMax)
                this.dibujarEtiquetasLimites(a, b, xMin, xMax, yMin, yMax)
                break
                
            case 2: // Mostrar función y área
                this.dibujarAreaBajoCurva(funcion, a, b, xMin, xMax, yMin, yMax)
                this.dibujarFuncion(funcion, xMin, xMax)
                this.dibujarLineasVerticales(a, b, xMin, xMax, yMin, yMax)
                break
                
            case 3: // Mostrar puntos límite
                this.dibujarAreaBajoCurva(funcion, a, b, xMin, xMax, yMin, yMax)
                this.dibujarFuncion(funcion, xMin, xMax)
                this.dibujarLineasVerticales(a, b, xMin, xMax, yMin, yMax)
                this.dibujarPuntosLimite(funcion, a, b, xMin, xMax, yMin, yMax)
                break
                
            case 4: // Mostrar resultado
                this.dibujarAreaBajoCurva(funcion, a, b, xMin, xMax, yMin, yMax)
                this.dibujarFuncion(funcion, xMin, xMax)
                this.dibujarLineasVerticales(a, b, xMin, xMax, yMin, yMax)
                this.dibujarPuntosLimite(funcion, a, b, xMin, xMax, yMin, yMax)
                this.dibujarEtiquetasLimites(a, b, xMin, xMax, yMin, yMax)
                if (datosAdicionales.resultado !== undefined) {
                    this.dibujarInformacionIntegral(funcion, a, b, datosAdicionales.resultado)
                }
                break
        }
    }

    // ✅ ACTUALIZAR CONFIGURACIÓN
    actualizarConfiguracion(nuevaConfiguracion) {
        this.configuracion = { ...this.configuracion, ...nuevaConfiguracion }
        this.inicializarCanvas()
    }

    // ✅ OBTENER CONFIGURACIÓN ACTUAL
    obtenerConfiguracion() {
        return { ...this.configuracion }
    }
}


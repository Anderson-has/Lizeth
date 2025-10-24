/**
 * RenderizadorGraficoInversionLimites - Renderizador que dibuja el gráfico de inversión de límites
 * RESPONSABILIDAD ÚNICA: Solo dibujo en canvas
 */
export class RenderizadorGraficoInversionLimites {
    constructor(configuracion) {
        this.configuracion = configuracion
        this.colores = configuracion.obtenerColores()
        this.lineas = configuracion.obtenerLineas()
        this.opacidades = configuracion.obtenerOpacidades()
    }
    
    // Renderizar el gráfico completo
    renderizar(ctx, estado, calculos, transformador) {
        if (!ctx || !estado || !calculos || !transformador) return
        
        const limites = estado.obtenerLimites()
        const datos = estado.obtenerDatosGrafico()
        const puntoHover = estado.obtenerPuntoHover()
        
        // Limpiar canvas
        this.limpiarCanvas(ctx)
        
        // Dibujar ejes
        this.dibujarEjes(ctx, transformador)
        
        // Dibujar función
        this.dibujarFuncion(ctx, datos, transformador)
        
        // Dibujar áreas
        this.dibujarAreas(ctx, limites, transformador)
        
        // Dibujar punto hover
        if (puntoHover) {
            this.dibujarPuntoHover(ctx, puntoHover, transformador)
        }
        
        // Dibujar leyenda
        this.dibujarLeyenda(ctx, limites, estado)
    }
    
    // Limpiar canvas
    limpiarCanvas(ctx) {
        const area = this.configuracion.obtenerAreaDibujo()
        ctx.clearRect(0, 0, area.x + area.ancho + 100, area.y + area.alto + 100)
        ctx.fillStyle = this.colores.fondo
        ctx.fillRect(0, 0, area.x + area.ancho + 100, area.y + area.alto + 100)
    }
    
    // Dibujar ejes
    dibujarEjes(ctx, transformador) {
        const area = transformador.area
        const intervaloX = transformador.intervaloX
        const intervaloY = transformador.intervaloY
        
        ctx.save()
        ctx.strokeStyle = this.colores.eje
        ctx.lineWidth = this.lineas.grosorEje
        
        // Eje X
        ctx.beginPath()
        ctx.moveTo(area.x, area.y + area.alto)
        ctx.lineTo(area.x + area.ancho, area.y + area.alto)
        ctx.stroke()
        
        // Eje Y
        ctx.beginPath()
        ctx.moveTo(area.x, area.y)
        ctx.lineTo(area.x, area.y + area.alto)
        ctx.stroke()
        
        // Numeración del eje X
        this.dibujarNumeracionEjeX(ctx, area, intervaloX)
        
        // Numeración del eje Y
        this.dibujarNumeracionEjeY(ctx, area, intervaloY)
        
        ctx.restore()
    }
    
    // Dibujar numeración del eje X
    dibujarNumeracionEjeX(ctx, area, intervaloX) {
        ctx.fillStyle = this.colores.texto
        ctx.font = '11px Arial'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'top'
        
        const numMarcas = 5
        const paso = (intervaloX.max - intervaloX.min) / (numMarcas - 1)
        
        for (let i = 0; i < numMarcas; i++) {
            const valorX = intervaloX.min + (i * paso)
            const canvasX = area.x + (i * area.ancho / (numMarcas - 1))
            
            // Línea de marca
            ctx.beginPath()
            ctx.moveTo(canvasX, area.y + area.alto)
            ctx.lineTo(canvasX, area.y + area.alto + 4)
            ctx.stroke()
            
            // Número
            ctx.fillText(valorX.toFixed(1), canvasX, area.y + area.alto + 6)
        }
    }
    
    // Dibujar numeración del eje Y
    dibujarNumeracionEjeY(ctx, area, intervaloY) {
        ctx.fillStyle = this.colores.texto
        ctx.font = '11px Arial'
        ctx.textAlign = 'right'
        ctx.textBaseline = 'middle'
        
        const numMarcas = 5
        const paso = (intervaloY.max - intervaloY.min) / (numMarcas - 1)
        
        for (let i = 0; i < numMarcas; i++) {
            const valorY = intervaloY.min + (i * paso)
            const canvasY = area.y + area.alto - (i * area.alto / (numMarcas - 1))
            
            // Línea de marca
            ctx.beginPath()
            ctx.moveTo(area.x - 4, canvasY)
            ctx.lineTo(area.x, canvasY)
            ctx.stroke()
            
            // Número
            ctx.fillText(valorY.toFixed(1), area.x - 6, canvasY)
        }
    }
    
    // Dibujar función
    dibujarFuncion(ctx, datos, transformador) {
        if (!datos || datos.length === 0) return
        
        ctx.save()
        ctx.strokeStyle = this.colores.funcion
        ctx.lineWidth = this.lineas.grosorFuncion
        ctx.beginPath()
        
        let primerPunto = true
        for (const punto of datos) {
            const canvasPoint = transformador.matematicasACanvas(punto.x, punto.y)
            
            if (primerPunto) {
                ctx.moveTo(canvasPoint.x, canvasPoint.y)
                primerPunto = false
            } else {
                ctx.lineTo(canvasPoint.x, canvasPoint.y)
            }
        }
        
        ctx.stroke()
        ctx.restore()
    }
    
    // Dibujar áreas
    dibujarAreas(ctx, limites, transformador) {
        // Área normal (∫[a→b] f(x)dx)
        this.dibujarAreaNormal(ctx, limites, transformador)
        
        // Área invertida (∫[b→a] f(x)dx)
        this.dibujarAreaInvertida(ctx, limites, transformador)
    }
    
    // Dibujar área normal
    dibujarAreaNormal(ctx, limites, transformador) {
        const a = limites.a
        const b = limites.b
        
        ctx.save()
        ctx.fillStyle = this.colores.areaNormal
        ctx.beginPath()
        
        // Dibujar área sombreada entre la función y el eje X
        const puntoA = transformador.matematicasACanvas(a, 0)
        const puntoB = transformador.matematicasACanvas(b, 0)
        const puntoFuncionA = transformador.matematicasACanvas(a, a) // f(x) = x
        const puntoFuncionB = transformador.matematicasACanvas(b, b) // f(x) = x
        
        ctx.moveTo(puntoA.x, puntoA.y)
        ctx.lineTo(puntoFuncionA.x, puntoFuncionA.y)
        ctx.lineTo(puntoFuncionB.x, puntoFuncionB.y)
        ctx.lineTo(puntoB.x, puntoB.y)
        ctx.closePath()
        ctx.fill()
        
        ctx.restore()
    }
    
    // Dibujar área invertida
    dibujarAreaInvertida(ctx, limites, transformador) {
        const a = limites.a
        const b = limites.b
        
        ctx.save()
        ctx.fillStyle = this.colores.areaInvertida
        ctx.beginPath()
        
        // Dibujar área sombreada invertida (con signo negativo)
        const puntoA = transformador.matematicasACanvas(a, 0)
        const puntoB = transformador.matematicasACanvas(b, 0)
        const puntoFuncionA = transformador.matematicasACanvas(a, -a) // -f(x) = -x
        const puntoFuncionB = transformador.matematicasACanvas(b, -b) // -f(x) = -x
        
        ctx.moveTo(puntoA.x, puntoA.y)
        ctx.lineTo(puntoFuncionA.x, puntoFuncionA.y)
        ctx.lineTo(puntoFuncionB.x, puntoFuncionB.y)
        ctx.lineTo(puntoB.x, puntoB.y)
        ctx.closePath()
        ctx.fill()
        
        ctx.restore()
    }
    
    // Dibujar punto hover
    dibujarPuntoHover(ctx, punto, transformador) {
        const canvasPoint = transformador.matematicasACanvas(punto.x, punto.y)
        
        ctx.save()
        ctx.fillStyle = this.colores.hover
        ctx.beginPath()
        ctx.arc(canvasPoint.x, canvasPoint.y, 6, 0, 2 * Math.PI)
        ctx.fill()
        ctx.restore()
    }
    
    // Dibujar leyenda
    dibujarLeyenda(ctx, limites, estado) {
        const area = this.configuracion.obtenerAreaDibujo()
        const x = area.x + area.ancho - 150
        const y = area.y + 20
        
        // Obtener la función del estado
        const funcion = estado ? estado.obtenerFuncion() : "x"
        
        const items = [
            { color: this.colores.funcion, texto: `f(x) = ${funcion}` },
            { color: this.colores.areaNormal, texto: `∫[${limites.a}→${limites.b}] f(x)dx` },
            { color: this.colores.areaInvertida, texto: `∫[${limites.b}→${limites.a}] f(x)dx` }
        ]
        
        ctx.save()
        ctx.font = '12px Arial'
        ctx.fillStyle = this.colores.texto
        
        let yOffset = y
        for (const item of items) {
            // Color
            ctx.fillStyle = item.color
            ctx.fillRect(x, yOffset, 15, 15)
            
            // Texto
            ctx.fillStyle = this.colores.texto
            ctx.fillText(item.texto, x + 20, yOffset + 10)
            yOffset += 20
        }
        
        ctx.restore()
    }
}

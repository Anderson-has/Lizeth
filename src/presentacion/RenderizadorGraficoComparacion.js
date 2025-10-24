/**
 * PRESENTACIÓN: RenderizadorGraficoComparacion
 * RESPONSABILIDAD: Solo renderizar el gráfico de comparación
 * SRP: Solo renderizado gráfico, no cálculos ni estado
 */
import { RenderizadorEjes } from './RenderizadorEjes'

export class RenderizadorGraficoComparacion {
    constructor(configuracion) {
        this.configuracion = configuracion
        this.colores = configuracion.obtenerColores()
        this.grafico = configuracion.obtenerGrafico()
    }

    renderizar(ctx, estado, calculos, transformador) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

        const limites = estado.obtenerLimites()
        const funciones = estado.obtenerFunciones()
        const puntoHover = estado.obtenerPuntoHover()
        const datosGrafico = estado.obtenerDatosGrafico()

        // Dibujar ejes
        const renderizadorEjes = new RenderizadorEjes(this.configuracion, transformador)
        renderizadorEjes.renderizar(ctx)

        // Dibujar números en los ejes
        this.dibujarNumerosEjes(ctx, transformador)

        // Dibujar áreas bajo las curvas
        this.dibujarAreas(ctx, datosGrafico, transformador)

        // Dibujar funciones
        this.dibujarFunciones(ctx, datosGrafico, transformador)

        // Dibujar punto hover si existe
        if (puntoHover) {
            this.dibujarPuntoHover(ctx, puntoHover, transformador)
            // Dibujar tooltip
            this.dibujarTooltip(ctx, puntoHover, transformador)
        }

        // Dibujar leyenda
        this.dibujarLeyenda(ctx, limites, funciones)
    }

    // Dibujar áreas bajo las curvas
    dibujarAreas(ctx, datos, transformador) {
        if (!datos || datos.length === 0) return

        // Área bajo f(x)
        ctx.fillStyle = this.colores.areaF
        ctx.beginPath()
        let primerPuntoF = true
        for (const punto of datos) {
            const pos = transformador.matematicasACanvas(punto.x, punto.yF)
            if (primerPuntoF) {
                ctx.moveTo(pos.x, pos.y)
                primerPuntoF = false
            } else {
                ctx.lineTo(pos.x, pos.y)
            }
        }
        // Completar el área hasta el eje X
        const ultimoPunto = datos[datos.length - 1]
        const posUltimo = transformador.matematicasACanvas(ultimoPunto.x, 0)
        ctx.lineTo(posUltimo.x, posUltimo.y)
        const primerPunto = datos[0]
        const posPrimer = transformador.matematicasACanvas(primerPunto.x, 0)
        ctx.lineTo(posPrimer.x, posPrimer.y)
        ctx.closePath()
        ctx.fill()

        // Área bajo g(x)
        ctx.fillStyle = this.colores.areaG
        ctx.beginPath()
        let primerPuntoG = true
        for (const punto of datos) {
            const pos = transformador.matematicasACanvas(punto.x, punto.yG)
            if (primerPuntoG) {
                ctx.moveTo(pos.x, pos.y)
                primerPuntoG = false
            } else {
                ctx.lineTo(pos.x, pos.y)
            }
        }
        // Completar el área hasta el eje X
        ctx.lineTo(posUltimo.x, posUltimo.y)
        ctx.lineTo(posPrimer.x, posPrimer.y)
        ctx.closePath()
        ctx.fill()
    }

    // Dibujar las funciones
    dibujarFunciones(ctx, datos, transformador) {
        if (!datos || datos.length === 0) return

        // Función f(x)
        ctx.strokeStyle = this.colores.funcionF
        ctx.lineWidth = this.grafico.grosorLinea
        ctx.beginPath()
        let primerPuntoF = true
        for (const punto of datos) {
            const pos = transformador.matematicasACanvas(punto.x, punto.yF)
            if (primerPuntoF) {
                ctx.moveTo(pos.x, pos.y)
                primerPuntoF = false
            } else {
                ctx.lineTo(pos.x, pos.y)
            }
        }
        ctx.stroke()

        // Función g(x)
        ctx.strokeStyle = this.colores.funcionG
        ctx.lineWidth = this.grafico.grosorLinea
        ctx.beginPath()
        let primerPuntoG = true
        for (const punto of datos) {
            const pos = transformador.matematicasACanvas(punto.x, punto.yG)
            if (primerPuntoG) {
                ctx.moveTo(pos.x, pos.y)
                primerPuntoG = false
            } else {
                ctx.lineTo(pos.x, pos.y)
            }
        }
        ctx.stroke()
    }

    // Dibujar punto hover
    dibujarPuntoHover(ctx, punto, transformador) {
        const pos = transformador.matematicasACanvas(punto.x, punto.yF)
        const posG = transformador.matematicasACanvas(punto.x, punto.yG)

        // Puntos en las funciones (más grandes para mejor visibilidad)
        ctx.fillStyle = this.colores.funcionF
        ctx.beginPath()
        ctx.arc(pos.x, pos.y, this.grafico.radioPunto + 2, 0, 2 * Math.PI)
        ctx.fill()

        ctx.fillStyle = this.colores.funcionG
        ctx.beginPath()
        ctx.arc(posG.x, posG.y, this.grafico.radioPunto + 2, 0, 2 * Math.PI)
        ctx.fill()
    }

    // Dibujar leyenda
    dibujarLeyenda(ctx, limites, funciones) {
        const area = this.configuracion.obtenerAreaDibujo()
        const x = area.x + area.ancho - 150
        const y = area.y + 20

        const items = [
            { color: this.colores.funcionF, texto: `f(x) = ${funciones.f}` },
            { color: this.colores.funcionG, texto: `g(x) = ${funciones.g}` }
        ]

        ctx.save()
        ctx.font = '12px Arial'
        ctx.fillStyle = this.colores.texto

        items.forEach((item, index) => {
            const itemY = y + index * 20
            ctx.fillStyle = item.color
            ctx.fillRect(x, itemY - 8, 10, 10)
            ctx.fillStyle = this.colores.texto
            ctx.fillText(item.texto, x + 15, itemY)
        })
        ctx.restore()
    }

    // Dibujar números en los ejes
    dibujarNumerosEjes(ctx, transformador) {
        const area = this.configuracion.obtenerAreaDibujo()
        const intervaloX = transformador.intervaloX
        const intervaloY = transformador.intervaloY

        ctx.save()
        ctx.font = '10px Arial'
        ctx.fillStyle = this.colores.texto
        ctx.textAlign = 'center'
        ctx.textBaseline = 'top'

        // Números en el eje X
        const pasoX = (intervaloX.max - intervaloX.min) / 8
        for (let i = 0; i <= 8; i++) {
            const x = intervaloX.min + i * pasoX
            const pos = transformador.matematicasACanvas(x, 0)
            ctx.fillText(x.toFixed(1), pos.x, area.y + area.alto + 5)
        }

        // Números en el eje Y
        ctx.textAlign = 'right'
        ctx.textBaseline = 'middle'
        const pasoY = (intervaloY.max - intervaloY.min) / 6
        for (let i = 0; i <= 6; i++) {
            const y = intervaloY.min + i * pasoY
            const pos = transformador.matematicasACanvas(0, y)
            ctx.fillText(y.toFixed(1), area.x - 5, pos.y)
        }

        ctx.restore()
    }

    // Dibujar tooltip
    dibujarTooltip(ctx, punto, transformador) {
        const canvasPointF = transformador.matematicasACanvas(punto.x, punto.yF)

        // Solo texto, sin ningún fondo
        ctx.save()
        ctx.font = '11px Arial'
        ctx.fillStyle = '#000000'

        // Posición simple a la derecha del punto
        const tooltipX = canvasPointF.x + 15
        const tooltipY = canvasPointF.y

        // Dibujar solo el texto, línea por línea
        ctx.fillText(`${punto.x.toFixed(2)}`, tooltipX, tooltipY - 10)
        ctx.fillText(`f(x): ${punto.yF.toFixed(2)}`, tooltipX, tooltipY)
        ctx.fillText(`g(x): ${punto.yG.toFixed(2)}`, tooltipX, tooltipY + 10)

        ctx.restore()
    }
}

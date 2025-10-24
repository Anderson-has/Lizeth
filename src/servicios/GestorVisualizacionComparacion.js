/**
 * SERVICIO: GestorVisualizacionComparacion
 * RESPONSABILIDAD: Coordinar servicios y renderizadores para comparación
 * SRP: Solo coordinación, no cálculos ni renderizado directo
 */
import { CalculadoraComparacion } from './CalculadoraComparacion'
import { VerificadorComparacion } from './VerificadorComparacion'
import { RenderizadorGraficoComparacion } from '../presentacion/RenderizadorGraficoComparacion'
import { RenderizadorCalculosComparacion } from '../presentacion/RenderizadorCalculosComparacion'

export class GestorVisualizacionComparacion {
    constructor(estado, configuracion) {
        this.estado = estado
        this.configuracion = configuracion

        // Servicios
        this.calculadora = new CalculadoraComparacion()
        this.verificador = new VerificadorComparacion()

        // Renderizadores
        this.renderizadorGrafico = new RenderizadorGraficoComparacion(configuracion)
        this.renderizadorCalculos = new RenderizadorCalculosComparacion(configuracion)

        // Referencias para renderizado automático
        this.canvas = null
        this.transformador = null
        this.containerCalculos = null

        // Debounce para renderizado
        this.debounceTimeout = null
        this.debounceDelay = 100 // ms
    }

    // Configurar referencias para renderizado automático
    configurarReferencias(canvas, transformador, containerCalculos = null) {
        this.canvas = canvas
        this.transformador = transformador
        this.containerCalculos = containerCalculos
    }

    // Recalcular y renderizar
    recalcularYRenderizar() {
        if (!this.estado || !this.canvas || !this.transformador) return

        if (this.debounceTimeout) {
            clearTimeout(this.debounceTimeout)
        }

        this.debounceTimeout = setTimeout(() => {
            // Obtener datos del estado
            const limites = this.estado.obtenerLimites()
            const funciones = this.estado.obtenerFunciones()

            // Calcular integrales
            const calculos = this.calculadora.calcularIntegrales(
                funciones.f,
                funciones.g,
                limites.a,
                limites.b
            )

            // Agregar límites al objeto calculos
            calculos.limites = limites

            // Verificar propiedad
            const verificacion = this.verificador.verificarPropiedad(
                calculos.integralF,
                calculos.integralG
            )

            // Actualizar estado
            this.estado.establecerResultados(
                calculos.integralF,
                calculos.integralG,
                calculos.diferencia
            )
            this.estado.establecerVerificacion(verificacion)

            // Generar datos del gráfico
            const datosGrafico = this.calculadora.generarDatosGrafico(
                funciones.f,
                funciones.g,
                limites.a,
                limites.b
            )
            this.estado.establecerDatosGrafico(datosGrafico)

            // Renderizar
            this.renderizar()
        }, this.debounceDelay)
    }

    // Renderizar
    renderizar() {
        if (!this.canvas || !this.transformador) return

        const ctx = this.canvas.getContext('2d')
        const limites = this.estado.obtenerLimites()
        const funciones = this.estado.obtenerFunciones()

        // Calcular integrales
        const calculos = this.calculadora.calcularIntegrales(
            funciones.f,
            funciones.g,
            limites.a,
            limites.b
        )

        // Agregar límites al objeto calculos
        calculos.limites = limites

        // Verificar propiedad
        const verificacion = this.verificador.verificarPropiedad(
            calculos.integralF,
            calculos.integralG
        )

        // Renderizar gráfico
        this.renderizadorGrafico.renderizar(ctx, this.estado, calculos, this.transformador)

        // Renderizar cálculos
        if (this.containerCalculos) {
            this.renderizadorCalculos.renderizar(this.containerCalculos, calculos, verificacion)
        }
    }

    // Actualizar límites
    actualizarLimites(a, b) {
        this.estado.actualizarLimites(a, b)
        this.recalcularYRenderizar()
    }

    // Actualizar funciones
    actualizarFunciones(funcionF, funcionG) {
        this.estado.actualizarFunciones(funcionF, funcionG)
        this.recalcularYRenderizar()
    }

    // Obtener funciones disponibles
    obtenerFuncionesDisponibles() {
        return this.calculadora.obtenerFuncionesDisponibles()
    }

    // Obtener explicación de la propiedad
    obtenerExplicacion() {
        return this.verificador.obtenerExplicacion()
    }

    // Obtener casos especiales
    obtenerCasosEspeciales() {
        return this.verificador.obtenerCasosEspeciales()
    }

    // Obtener colores
    obtenerColores() {
        return this.configuracion.obtenerColores()
    }

    // Manejar hover
    manejarHover(evento, canvas, transformador) {
        const rect = canvas.getBoundingClientRect()
        const mouseX = evento.clientX - rect.left
        const mouseY = evento.clientY - rect.top

        const { x, y } = transformador.canvasAMatematicas(mouseX, mouseY)

        // Evaluar ambas funciones en el punto x del mouse
        const funciones = this.estado.obtenerFunciones()
        const yF = this.calculadora.calcularValorFuncion(funciones.f, x)
        const yG = this.calculadora.calcularValorFuncion(funciones.g, x)

        // Crear un punto de hover con ambas funciones
        this.estado.establecerPuntoHover({ x, yF, yG })

        this.renderizar()
    }

    // Limpiar hover
    limpiarHover() {
        this.estado.limpiarPuntoHover()
        this.renderizar()
    }

    // Renderizar tooltip en canvas
    renderizarTooltipEnCanvas(canvas, punto, funciones) {
        const ctx = canvas.getContext('2d')
        const transformador = this.transformador

        if (!transformador) return

        const canvasPointF = transformador.matematicasACanvas(punto.x, punto.yF)
        const canvasPointG = transformador.matematicasACanvas(punto.x, punto.yG)

        // Configurar tooltip con formato mejorado
        const tooltipText = [
            `${punto.x.toFixed(2)}`,
            `f(x): ${punto.yF.toFixed(2)}`,
            `g(x): ${punto.yG.toFixed(2)}`
        ]
        const padding = 8
        const fontSize = 12
        const lineHeight = 16

        ctx.save()
        ctx.font = `${fontSize}px Arial`
        
        // Calcular dimensiones del tooltip
        const maxWidth = Math.max(...tooltipText.map(text => ctx.measureText(text).width))
        const tooltipWidth = maxWidth + padding * 2
        const tooltipHeight = tooltipText.length * lineHeight + padding * 2

        // Posición del tooltip (evitar que se salga del canvas)
        let tooltipX = canvasPointF.x + 15
        let tooltipY = canvasPointF.y - tooltipHeight / 2

        if (tooltipX + tooltipWidth > canvas.width) {
            tooltipX = canvasPointF.x - tooltipWidth - 15
        }
        if (tooltipY < 0) {
            tooltipY = 10
        }
        if (tooltipY + tooltipHeight > canvas.height) {
            tooltipY = canvas.height - tooltipHeight - 10
        }

        // Dibujar fondo del tooltip con bordes redondeados
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
        ctx.fillRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight)

        // Dibujar borde del tooltip
        ctx.strokeStyle = '#666666'
        ctx.lineWidth = 1
        ctx.strokeRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight)

        // Dibujar texto del tooltip con colores
        ctx.fillStyle = '#FFFFFF'
        tooltipText.forEach((line, index) => {
            if (index === 0) {
                // Coordenada x en negrita
                ctx.font = `bold ${fontSize}px Arial`
                ctx.fillText(line, tooltipX + padding, tooltipY + padding + (index + 1) * lineHeight)
            } else {
                // Valores de las funciones
                ctx.font = `${fontSize}px Arial`
                ctx.fillText(line, tooltipX + padding, tooltipY + padding + (index + 1) * lineHeight)
            }
        })

        ctx.restore()
    }

    // Reiniciar
    reiniciar() {
        this.estado.reiniciar()
        if (this.containerCalculos) {
            this.renderizadorCalculos.limpiar(this.containerCalculos)
        }
    }
}

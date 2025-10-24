/**
 * GestorVisualizacionInversionLimites - Servicio que coordina la visualización de inversión de límites
 * RESPONSABILIDAD ÚNICA: Solo coordinación de visualización
 */
import { CalculadoraInversionLimites } from './CalculadoraInversionLimites.js'
import { VerificadorInversionLimites } from './VerificadorInversionLimites.js'
import { RenderizadorGraficoInversionLimites } from '../presentacion/RenderizadorGraficoInversionLimites.js'
import { RenderizadorCalculosInversionLimites } from '../presentacion/RenderizadorCalculosInversionLimites.js'

export class GestorVisualizacionInversionLimites {
    constructor(estado, configuracion) {
        this.estado = estado
        this.configuracion = configuracion
        
        // Servicios
        this.calculadora = new CalculadoraInversionLimites()
        this.verificador = new VerificadorInversionLimites()
        
        // Renderizadores
        this.renderizadorGrafico = new RenderizadorGraficoInversionLimites(configuracion)
        this.renderizadorCalculos = new RenderizadorCalculosInversionLimites(configuracion)
        
        // Referencias para renderizado automático
        this.canvas = null
        this.transformador = null
        this.containerCalculos = null
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
        
        // Obtener datos del estado
        const limites = this.estado.obtenerLimites()
        const funcion = this.estado.obtenerFuncion()
        
        // Calcular áreas
        const calculos = this.calculadora.calcularAreas(funcion, limites.a, limites.b)
        
        // Agregar límites al objeto calculos
        calculos.limites = limites
        
        // Verificar propiedad
        const verificacion = this.verificador.verificarPropiedad(
            calculos.areaNormal, 
            calculos.areaInvertida
        )
        
        // Actualizar estado
        this.estado.establecerResultados(calculos.areaNormal, calculos.areaInvertida)
        this.estado.establecerVerificacion(verificacion)
        
        // Generar datos del gráfico
        const datosGrafico = this.calculadora.generarDatosGrafico(funcion, limites.a, limites.b)
        this.estado.establecerDatosGrafico(datosGrafico)
        
        // Renderizar
        this.renderizar()
    }
    
    // Renderizar
    renderizar() {
        if (!this.canvas || !this.transformador) return
        
        const ctx = this.canvas.getContext('2d')
        const limites = this.estado.obtenerLimites()
        const funcion = this.estado.obtenerFuncion()
        
        // Calcular áreas
        const calculos = this.calculadora.calcularAreas(funcion, limites.a, limites.b)
        
        // Agregar límites al objeto calculos
        calculos.limites = limites
        
        // Verificar propiedad
        const verificacion = this.verificador.verificarPropiedad(
            calculos.areaNormal, 
            calculos.areaInvertida
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
    
    // Actualizar función
    actualizarFuncion(funcion) {
        this.estado.actualizarFuncion(funcion)
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
        
        // Evaluar la función en el punto x del mouse
        const funcion = this.estado.obtenerFuncion()
        const yFuncion = this.calculadora.calcularValorFuncion(funcion, x)
        
        // Crear un punto de hover en la función
        this.estado.establecerPuntoHover({ x, y: yFuncion })
        
        // Renderizar tooltip
        this.renderizarTooltipEnCanvas(canvas, { x, y: yFuncion }, funcion)
        
        this.renderizar()
    }
    
    // Limpiar hover
    limpiarHover() {
        this.estado.limpiarPuntoHover()
        this.renderizar()
    }
    
    // Renderizar tooltip en canvas
    renderizarTooltipEnCanvas(canvas, punto, funcion) {
        const ctx = canvas.getContext('2d')
        const transformador = this.transformador
        
        if (!transformador) return
        
        const canvasPoint = transformador.matematicasACanvas(punto.x, punto.y)
        
        // Configurar tooltip
        const tooltipText = `f(${punto.x.toFixed(2)}) = ${punto.y.toFixed(2)}`
        const padding = 8
        const fontSize = 12
        
        ctx.save()
        ctx.font = `${fontSize}px Arial`
        const textWidth = ctx.measureText(tooltipText).width
        const tooltipWidth = textWidth + padding * 2
        const tooltipHeight = fontSize + padding * 2
        
        // Posición del tooltip (evitar que se salga del canvas)
        let tooltipX = canvasPoint.x + 10
        let tooltipY = canvasPoint.y - 10
        
        if (tooltipX + tooltipWidth > canvas.width) {
            tooltipX = canvasPoint.x - tooltipWidth - 10
        }
        if (tooltipY - tooltipHeight < 0) {
            tooltipY = canvasPoint.y + 20
        }
        
        // Dibujar fondo del tooltip
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
        ctx.fillRect(tooltipX, tooltipY - tooltipHeight, tooltipWidth, tooltipHeight)
        
        // Dibujar texto del tooltip
        ctx.fillStyle = '#FFFFFF'
        ctx.fillText(tooltipText, tooltipX + padding, tooltipY - padding)
        
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

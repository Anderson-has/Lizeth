/**
 * GestorVisualizacionAditividad - Servicio que coordina toda la visualización de aditividad
 * RESPONSABILIDAD ÚNICA: Solo coordinación de visualización
 */
import { CalculadoraAditividad } from './CalculadoraAditividad.js'
import { VerificadorAditividad } from './VerificadorAditividad.js'
import { RenderizadorGraficoAditividad } from '../presentacion/RenderizadorGraficoAditividad.js'
import { RenderizadorCalculosAditividad } from '../presentacion/RenderizadorCalculosAditividad.js'
import { DetectorHoverAditividad } from '../interaccion/DetectorHoverAditividad.js'
import { RenderizadorTooltipAditividad } from '../presentacion/RenderizadorTooltipAditividad.js'

export class GestorVisualizacionAditividad {
    constructor(estado, configuracion) {
        this.estado = estado
        this.configuracion = configuracion
        
        // Servicios
        this.calculadora = new CalculadoraAditividad()
        this.verificador = new VerificadorAditividad()
        
        // Renderizadores
        this.renderizadorGrafico = new RenderizadorGraficoAditividad(configuracion)
        this.renderizadorCalculos = new RenderizadorCalculosAditividad(configuracion)
        this.detectorHover = new DetectorHoverAditividad(estado, configuracion)
        this.renderizadorTooltip = new RenderizadorTooltipAditividad(configuracion)
        
        // ✅ CONTROL DE RENDERIZADO PARA EVITAR MÚLTIPLES RECÁLCULOS
        this.isRendering = false
        this.renderQueue = false
        this.lastRenderTime = 0
        this.targetFPS = 30
        this.frameDelay = 1000 / this.targetFPS
        
        // ✅ DEBOUNCING PARA EVITAR RECÁLCULOS EXCESIVOS
        this.debounceTimeout = null
        this.debounceDelay = 100 // 100ms de debounce
        
        // ✅ REFERENCIAS PARA RENDERIZADO AUTOMÁTICO
        this.canvas = null
        this.transformador = null
        this.containerTooltip = null
        
        // Bandera para evitar múltiples recálculos
        this.recalculando = false
    }
    
    // ✅ CONFIGURAR REFERENCIAS PARA RENDERIZADO AUTOMÁTICO
    configurarReferencias(canvas, transformador, containerTooltip = null) {
        this.canvas = canvas
        this.transformador = transformador
        this.containerTooltip = containerTooltip
        console.log('GestorVisualizacionAditividad - Referencias configuradas para renderizado automático')
    }
    
    // Actualizar función seleccionada
    actualizarFuncion(funcion) {
        this.estado.establecerFuncionSeleccionada(funcion)
        this.recalcularTodo()
    }
    
    // Actualizar límites
    actualizarLimites(a, b, c) {
        this.estado.establecerLimites(a, b, c)
        
        if (this.estado.validarLimites()) {
            this.recalcularTodo()
        }
    }
    
    // ✅ RECALCULAR CON CONTROL DE RENDERIZADO Y DEBOUNCING
    async recalcularTodo() {
        if (this.recalculando) {
            console.log('Ya se está recalculando, evitando múltiples llamadas')
            return
        }
        
        // ✅ DEBOUNCING: Cancelar recálculo anterior si existe
        if (this.debounceTimeout) {
            clearTimeout(this.debounceTimeout)
        }
        
        // ✅ PROGRAMAR RECÁLCULO CON DEBOUNCING
        this.debounceTimeout = setTimeout(async () => {
            this.recalculando = true
            console.log('GestorVisualizacionAditividad - Recalculando todo...')
            
            try {
                await this.ejecutarCalculos()
                
        // ✅ FORZAR RENDERIZADO DESPUÉS DE ESTABLECER DATOS
        console.log('GestorVisualizacionAditividad - Datos establecidos, forzando renderizado...')
        
        // ✅ EJECUTAR RENDERIZADO INMEDIATAMENTE DESPUÉS DE ESTABLECER DATOS
        if (this.canvas && this.transformador) {
            console.log('GestorVisualizacionAditividad - Ejecutando renderizado automático...')
            this.renderizar(this.canvas, this.transformador, this.containerTooltip)
        }
            } finally {
                this.recalculando = false
            }
        }, this.debounceDelay)
    }
    
    // ✅ EJECUTAR CÁLCULOS DE FORMA CONTROLADA
    async ejecutarCalculos() {
        const limites = this.estado.obtenerLimites()
        const funcion = this.estado.obtenerFuncionSeleccionada()
        
        if (!this.estado.obtenerEstadoValidacion().valida) {
            console.log('Estado no válido, no se recalcula')
            return
        }
        
        // Calcular todos los valores
        const calculos = this.calculadora.calcularTodosLosValores(
            funcion, 
            limites.a, 
            limites.b, 
            limites.c
        )
        
        // Actualizar estado
        this.estado.establecerCalculos(
            calculos.integralAC,
            calculos.integralAB,
            calculos.integralBC,
            calculos.sumaAB_BC
        )
        
        // Verificar aditividad
        const verificacion = this.verificador.verificarConDetalles(
            calculos.integralAC,
            calculos.sumaAB_BC
        )
        this.estado.establecerVerificacion(verificacion.exitosa)
        
        // Generar datos del gráfico
        const datosGrafico = this.calculadora.generarDatosGrafico(
            funcion,
            limites.a,
            limites.c
        )
        console.log('GestorVisualizacionAditividad - Datos del gráfico generados:', datosGrafico)
        
        // ✅ ESTABLECER DATOS Y VERIFICAR INMEDIATAMENTE
        this.estado.establecerDatosGrafico(datosGrafico)
        
        // ✅ VERIFICAR QUE LOS DATOS SE ESTABLECIERON CORRECTAMENTE
        const datosVerificacion = this.estado.obtenerDatosGrafico()
        console.log('GestorVisualizacionAditividad - Verificación de datos:', datosVerificacion?.length || 0, 'puntos')
    }
    
    // Manejar hover del mouse
    manejarHover(evento, canvas, transformador) {
        if (!canvas || !transformador) {
            return null
        }
        
        const punto = this.detectorHover.detectarPuntoHover(evento, canvas, transformador)
        this.estado.establecerPuntoHover(punto)
        return punto
    }
    
    // ✅ RENDERIZAR CON CONTROL DE RENDERIZADO
    async renderizar(canvas, transformador, containerTooltip = null) {
        if (this.isRendering) {
            this.renderQueue = true
            console.log('Ya se está renderizando, encolando...')
            return
        }
        
        this.isRendering = true
        console.log('GestorVisualizacionAditividad - Iniciando renderizado...')
        console.log('Canvas size:', canvas.width, 'x', canvas.height)
        
        try {
            await this.ejecutarRenderizado(canvas, transformador, containerTooltip)
        } finally {
            this.isRendering = false
            
            if (this.renderQueue) {
                this.renderQueue = false
                console.log('Ejecutando renderizado encolado...')
                this.renderizar(canvas, transformador, containerTooltip)
            }
        }
    }
    
    // ✅ EJECUTAR RENDERIZADO DE FORMA CONTROLADA
    async ejecutarRenderizado(canvas, transformador, containerTooltip = null) {
        const ctx = canvas.getContext('2d')
        
        // ✅ VERIFICAR QUE HAY DATOS ANTES DE RENDERIZAR
        const datos = this.estado.obtenerDatosGrafico()
        console.log('GestorVisualizacionAditividad - Datos antes de renderizar:', datos?.length || 0, 'puntos')
        
        if (!datos || datos.length === 0) {
            console.log('GestorVisualizacionAditividad - No hay datos para renderizar, saltando...')
            return
        }
        
            // ✅ LIMPIAR EL CANVAS ANTES DE RENDERIZAR
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            console.log('Canvas limpiado antes del renderizado')
        
        // Renderizar gráfico
        this.renderizadorGrafico.renderizar(
            ctx, 
            this.estado, 
            transformador
        )
        
        // ✅ RENDERIZAR TOOLTIP DIRECTAMENTE EN EL CANVAS
        const puntoHover = this.estado.obtenerPuntoHover()
        if (puntoHover) {
            this.renderizarTooltipEnCanvas(ctx, puntoHover, this.estado.obtenerFuncionSeleccionada())
        }
        
        console.log('GestorVisualizacionAditividad - Renderizado completo')
        
        // ✅ TEST VISUAL SIMPLE PARA CONFIRMAR QUE EL CANVAS FUNCIONA
        ctx.fillStyle = 'red'
        ctx.fillRect(50, 50, 100, 50)
        console.log('🔴 TEST: Rectángulo rojo dibujado para confirmar que el canvas funciona')
        
        // ✅ TEST VISUAL REMOVIDO - Canvas funciona correctamente
        
        // ✅ VERIFICAR CANVAS INMEDIATAMENTE DESPUÉS DEL RENDERIZADO
        console.log('Verificando canvas inmediatamente después del renderizado...')
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const hasContent = imageData.data.some(pixel => pixel !== 0)
        console.log('Canvas tiene contenido inmediatamente:', hasContent)
        
        // ✅ VERIFICAR CANVAS DESPUÉS DE 100ms
        setTimeout(() => {
            console.log('Verificando canvas después de 100ms...')
            const imageData2 = ctx.getImageData(0, 0, canvas.width, canvas.height)
            const hasContent2 = imageData2.data.some(pixel => pixel !== 0)
            console.log('Canvas tiene contenido después de 100ms:', hasContent2)
            
            if (hasContent && !hasContent2) {
                console.log('⚠️ PROBLEMA: Canvas se está limpiando después del renderizado!')
            }
            
        }, 100)
    }
    
    // ✅ RENDERIZAR TOOLTIP DIRECTAMENTE EN EL CANVAS
    renderizarTooltipEnCanvas(ctx, puntoHover, funcion) {
        const x = puntoHover.coordenadasCanvas.x
        const y = puntoHover.coordenadasCanvas.y
        
        // Información del intervalo
        const informacionIntervalo = this.obtenerInformacionIntervalo(puntoHover.intervalo)
        
        // Configurar estilo del tooltip
        ctx.save()
        ctx.fillStyle = 'rgba(31, 41, 55, 0.95)' // bg-gray-800 con transparencia
        ctx.strokeStyle = '#374151'
        ctx.lineWidth = 1
        
        // Dimensiones del tooltip
        const padding = 12
        const lineHeight = 16
        const lines = [
            `x = ${puntoHover.x.toFixed(2)}`,
            `f(x) = ${puntoHover.valorFuncion.toFixed(3)}`,
            `Intervalo: [${puntoHover.intervalo.inicio}, ${puntoHover.intervalo.fin}]`
        ]
        
        const maxWidth = Math.max(...lines.map(line => ctx.measureText(line).width))
        const tooltipWidth = maxWidth + (padding * 2)
        const tooltipHeight = (lines.length * lineHeight) + (padding * 2)
        
        // Posición del tooltip (evitar que se salga del canvas)
        let tooltipX = x + 10
        let tooltipY = y - 10
        
        if (tooltipX + tooltipWidth > ctx.canvas.width) {
            tooltipX = x - tooltipWidth - 10
        }
        if (tooltipY < 0) {
            tooltipY = y + 10
        }
        
        // Dibujar fondo del tooltip
        ctx.fillRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight)
        ctx.strokeRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight)
        
        // Dibujar texto
        ctx.fillStyle = '#f9fafb' // text-white
        ctx.font = '11px Arial'
        ctx.textAlign = 'left'
        ctx.textBaseline = 'top'
        
        lines.forEach((line, index) => {
            const textY = tooltipY + padding + (index * lineHeight)
            ctx.fillText(line, tooltipX + padding, textY)
        })
        
        ctx.restore()
    }
    
    // ✅ OBTENER INFORMACIÓN DEL INTERVALO
    obtenerInformacionIntervalo(intervalo) {
        const colores = this.configuracion.obtenerColores()
        
        if (intervalo.nombre === 'AB') {
            return {
                color: colores.areaAB,
                nombre: `[${intervalo.inicio}, ${intervalo.fin}]`
            }
        } else if (intervalo.nombre === 'BC') {
            return {
                color: colores.areaBC,
                nombre: `[${intervalo.inicio}, ${intervalo.fin}]`
            }
        }
        
        return {
            color: '#6b7280',
            nombre: `[${intervalo.inicio}, ${intervalo.fin}]`
        }
    }
    
    // Renderizar cálculos
    renderizarCalculos(container) {
        const calculos = this.estado.obtenerCalculos()
        const verificacion = this.estado.obtenerVerificacion()
        const estadoValidacion = this.estado.obtenerEstadoValidacion()
        
        this.renderizadorCalculos.renderizar(
            container,
            calculos,
            verificacion,
            estadoValidacion,
            this.estado.obtenerFuncionSeleccionada(),
            this.estado.obtenerLimites()
        )
    }
    
    // Obtener cálculos actuales
    obtenerCalculos() {
        return this.estado.obtenerCalculos()
    }
    
    // Obtener verificación actual
    obtenerVerificacion() {
        return this.estado.obtenerVerificacion()
    }
    
    // Obtener estado de validación
    obtenerEstadoValidacion() {
        return this.estado.obtenerEstadoValidacion()
    }
    
    // Obtener datos del gráfico
    obtenerDatosGrafico() {
        return this.estado.obtenerDatosGrafico()
    }
    
    // Obtener punto hover actual
    obtenerPuntoHover() {
        return this.estado.obtenerPuntoHover()
    }
}

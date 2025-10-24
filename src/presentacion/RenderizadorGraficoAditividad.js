/**
 * RenderizadorGraficoAditividad - Renderizador que dibuja el gráfico de aditividad
 * RESPONSABILIDAD ÚNICA: Solo dibujo en canvas
 */
export class RenderizadorGraficoAditividad {
    constructor(configuracion) {
        this.configuracion = configuracion
        this.colores = configuracion.obtenerColores()
        this.opacidades = configuracion.obtenerOpacidades()
        this.grosorLineas = configuracion.obtenerGrosorLineas()
        
        // ✅ PROPIEDADES PARA REACT
        this.canvas = null
        this.ctx = null
        this.lastRenderData = null
        this.mousePosition = { x: 0, y: 0 }
        this.showTooltip = false
    }
    
    // ✅ CONFIGURAR CANVAS PARA REACT
    setCanvas(canvas) {
        this.canvas = canvas
        this.ctx = canvas.getContext('2d')
        console.log('RenderizadorGraficoAditividad - Canvas configurado para React')
    }
    
    // ✅ LIMPIAR CANVAS DE FORMA INTELIGENTE - DESHABILITADO PARA EVITAR LIMPIAR EL CANVAS
    limpiarCanvas() {
        if (!this.ctx || !this.canvas) return
        
        // ✅ NO LIMPIAR EL CANVAS - Evitar que borre el contenido
        // if (this.necesitaLimpieza()) {
        //     this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        //     this.ctx.fillStyle = "#FFFFFF"
        //     this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
        //     console.log('RenderizadorGraficoAditividad - Canvas limpiado')
        // }
        console.log('RenderizadorGraficoAditividad - Limpieza del canvas deshabilitada')
    }
    
    // ✅ VERIFICAR SI NECESITA LIMPIEZA
    necesitaLimpieza() {
        // Siempre limpiar para evitar problemas de renderizado
        return true
    }
    
    // ✅ ACTUALIZAR POSICIÓN DEL MOUSE
    actualizarPosicionMouse(x, y) {
        this.mousePosition = { x, y }
        this.showTooltip = true
    }
    
    // ✅ LIMPIAR HOVER
    limpiarHover() {
        this.showTooltip = false
    }
    
    // ✅ RENDERIZAR EL GRÁFICO COMPLETO (ADAPTADO PARA REACT)
    renderizar(ctx, estado, transformador) {
        if (!ctx) {
            console.log('RenderizadorGraficoAditividad - No hay contexto de canvas')
            return
        }
        
        const limites = estado.obtenerLimites()
        const datos = estado.obtenerDatosGrafico()
        const puntoHover = estado.obtenerPuntoHover()
        
        console.log('RenderizadorGraficoAditividad - Renderizando...')
        console.log('Límites:', limites)
        console.log('Datos:', datos)
        console.log('Punto hover:', puntoHover)
        console.log('Transformador:', transformador)
        console.log('Canvas size:', ctx.canvas.width, 'x', ctx.canvas.height)
        
        // ✅ NO GUARDAR ESTADO DEL CONTEXTO - Evitar problemas con ctx.restore()
        // ctx.save() // ← COMENTADO PARA EVITAR PROBLEMAS
        
        try {
            // Renderizar ejes
            this.renderizarEjes(ctx, transformador)
            
            // Renderizar áreas
            this.renderizarAreas(ctx, datos, limites, transformador)
            
            // Renderizar función
            this.renderizarFuncion(ctx, datos, transformador)
            
            // Renderizar líneas de referencia
            this.renderizarLineasReferencia(ctx, limites, transformador)
            
            // Renderizar punto hover
            if (puntoHover) {
                this.renderizarPuntoHover(ctx, puntoHover, transformador)
            }
            
            // Renderizar leyenda
            this.renderizarLeyenda(ctx, limites)
            
            // ✅ RENDERIZAR EJES CON NUMERACIÓN
            this.renderizarEjes(ctx, transformador)
            
            console.log('RenderizadorGraficoAditividad - Renderizado completo')
            
        
        // ✅ VERIFICAR ESTADO DEL CONTEXTO DESPUÉS DEL RENDERIZADO
        console.log('RenderizadorGraficoAditividad - Estado del contexto después del renderizado:')
        console.log('Contexto válido:', !!ctx)
        console.log('Canvas válido:', !!ctx.canvas)
        console.log('Canvas size:', ctx.canvas.width, 'x', ctx.canvas.height)
        
        // ✅ VERIFICAR SI HAY CONTENIDO EN EL CANVAS
        const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)
        const hasContent = imageData.data.some(pixel => pixel !== 0)
        console.log('RenderizadorGraficoAditividad - Canvas tiene contenido:', hasContent)
        } finally {
            // ✅ NO RESTAURAR EL CONTEXTO - Mantener el contenido dibujado
            // ctx.restore() // ← COMENTADO PARA EVITAR LIMPIAR EL CANVAS
            
            // ✅ TEST VISUAL REMOVIDO - Problema identificado: ctx.restore() limpiaba el canvas
        }
    }
    
    // Renderizar ejes
    renderizarEjes(ctx, transformador) {
        const areaDibujo = this.configuracion.obtenerAreaDibujo()
        
        ctx.strokeStyle = '#374151'
        ctx.lineWidth = 1
        ctx.beginPath()
        
        // Eje X
        ctx.moveTo(0, areaDibujo.alto / 2)
        ctx.lineTo(areaDibujo.ancho, areaDibujo.alto / 2)
        
        // Eje Y
        ctx.moveTo(areaDibujo.ancho / 2, 0)
        ctx.lineTo(areaDibujo.ancho / 2, areaDibujo.alto)
        
        ctx.stroke()
    }
    
    // Renderizar áreas coloreadas
    renderizarAreas(ctx, datos, limites, transformador) {
        console.log('RenderizadorGraficoAditividad - Renderizando áreas...')
        const { a, b, c } = limites
        
        // Área [a, b] - Azul
        console.log(`Renderizando área [${a}, ${b}] - Azul`)
        this.renderizarAreaIntervalo(ctx, datos, a, b, this.colores.areaAB, this.opacidades.areaAB, transformador)
        
        // Área [b, c] - Verde
        console.log(`Renderizando área [${b}, ${c}] - Verde`)
        this.renderizarAreaIntervalo(ctx, datos, b, c, this.colores.areaBC, this.opacidades.areaBC, transformador)
    }
    
    // Renderizar área de un intervalo específico
    renderizarAreaIntervalo(ctx, datos, inicio, fin, color, opacidad, transformador) {
        const puntosIntervalo = datos.filter(punto => punto.x >= inicio && punto.x <= fin)
        
        console.log(`Área [${inicio}, ${fin}]: ${puntosIntervalo.length} puntos`)
        
        if (puntosIntervalo.length === 0) {
            console.log(`No hay puntos en el intervalo [${inicio}, ${fin}]`)
            return
        }
        
        ctx.fillStyle = color
        ctx.globalAlpha = opacidad
        ctx.beginPath()
        
        // Punto inicial en el eje X
        const puntoInicial = transformador.matematicasACanvas(inicio, 0)
        console.log(`Área [${inicio}, ${fin}] - Punto inicial: (${inicio}, 0) -> Canvas: (${puntoInicial.x}, ${puntoInicial.y})`)
        ctx.moveTo(puntoInicial.x, puntoInicial.y)
        
        // Seguir la función
        for (const punto of puntosIntervalo) {
            const canvasPoint = transformador.matematicasACanvas(punto.x, punto.y)
            ctx.lineTo(canvasPoint.x, canvasPoint.y)
        }
        
        // Punto final en el eje X
        const puntoFinal = transformador.matematicasACanvas(fin, 0)
        console.log(`Área [${inicio}, ${fin}] - Punto final: (${fin}, 0) -> Canvas: (${puntoFinal.x}, ${puntoFinal.y})`)
        ctx.lineTo(puntoFinal.x, puntoFinal.y)
        
        // Cerrar el área
        ctx.closePath()
        ctx.fill()
        
        ctx.globalAlpha = 1.0
        
        
        // ✅ TEST VISUAL REMOVIDO - Canvas funciona correctamente
        
        console.log(`Área [${inicio}, ${fin}] dibujada`)
    }
    
    // Renderizar función f(x)
    renderizarFuncion(ctx, datos, transformador) {
        console.log('RenderizadorGraficoAditividad - Renderizando función...')
        console.log('Datos para función:', datos.slice(0, 5)) // Primeros 5 puntos
        
        ctx.strokeStyle = this.colores.funcion
        ctx.lineWidth = this.grosorLineas.funcion
        ctx.beginPath()
        
        let primerPunto = true
        for (const punto of datos) {
            const canvasPoint = transformador.matematicasACanvas(punto.x, punto.y)
            console.log(`Función - Punto: (${punto.x}, ${punto.y}) -> Canvas: (${canvasPoint.x}, ${canvasPoint.y})`)
            
            if (primerPunto) {
                ctx.moveTo(canvasPoint.x, canvasPoint.y)
                primerPunto = false
            } else {
                ctx.lineTo(canvasPoint.x, canvasPoint.y)
            }
        }
        
        console.log('RenderizadorGraficoAditividad - Dibujando función...')
        ctx.stroke()
        
        
        // ✅ TEST VISUAL REMOVIDO - Canvas funciona correctamente
        
        console.log('RenderizadorGraficoAditividad - Función dibujada')
        
        // ✅ VERIFICAR SI EL CONTEXTO ESTÁ FUNCIONANDO
        console.log('RenderizadorGraficoAditividad - Verificando contexto del canvas...')
        console.log('Contexto válido:', !!ctx)
        console.log('Canvas válido:', !!ctx.canvas)
        console.log('Canvas size:', ctx.canvas.width, 'x', ctx.canvas.height)
    }
    
    // Renderizar líneas de referencia
    renderizarLineasReferencia(ctx, limites, transformador) {
        const { a, b, c } = limites
        
        // Línea a (gris)
        this.renderizarLineaReferencia(ctx, a, this.colores.lineaA, transformador)
        
        // Línea b (rojo - punto de división)
        this.renderizarLineaReferencia(ctx, b, this.colores.lineaB, transformador)
        
        // Línea c (gris)
        this.renderizarLineaReferencia(ctx, c, this.colores.lineaC, transformador)
    }
    
    // Renderizar una línea de referencia
    renderizarLineaReferencia(ctx, x, color, transformador) {
        const areaDibujo = this.configuracion.obtenerAreaDibujo()
        const punto = transformador.matematicasACanvas(x, 0)
        
        ctx.strokeStyle = color
        ctx.lineWidth = this.grosorLineas.referencia
        ctx.setLineDash([5, 5])
        
        ctx.beginPath()
        ctx.moveTo(punto.x, 0)
        ctx.lineTo(punto.x, areaDibujo.alto)
        ctx.stroke()
        
        ctx.setLineDash([])
    }
    
    // Renderizar punto hover
    renderizarPuntoHover(ctx, puntoHover, transformador) {
        if (!puntoHover) return
        
        const canvasPoint = transformador.matematicasACanvas(puntoHover.x, puntoHover.y)
        
        ctx.fillStyle = this.colores.hover
        ctx.beginPath()
        ctx.arc(canvasPoint.x, canvasPoint.y, 5, 0, 2 * Math.PI)
        ctx.fill()
        
        ctx.strokeStyle = this.colores.hover
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(canvasPoint.x, canvasPoint.y, 8, 0, 2 * Math.PI)
        ctx.stroke()
    }
    
    // Renderizar leyenda
    renderizarLeyenda(ctx, limites) {
        const areaDibujo = this.configuracion.obtenerAreaDibujo()
        const x = 20
        const y = areaDibujo.alto - 80
        
        // Fondo de la leyenda
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
        ctx.fillRect(x, y, 300, 60)
        
        // Borde
        ctx.strokeStyle = '#e5e7eb'
        ctx.lineWidth = 1
        ctx.strokeRect(x, y, 300, 60)
        
        // Texto de la leyenda
        ctx.fillStyle = '#374151'
        ctx.font = '12px Arial'
        
        const items = [
            { color: this.colores.funcion, texto: `f(x) - Función` },
            { color: this.colores.areaAB, texto: `[${limites.a}, ${limites.b}] - Área azul` },
            { color: this.colores.areaBC, texto: `[${limites.b}, ${limites.c}] - Área verde` }
        ]
        
        let yOffset = y + 20
        for (const item of items) {
            // Círculo de color
            ctx.fillStyle = item.color
            ctx.beginPath()
            ctx.arc(x + 15, yOffset, 5, 0, 2 * Math.PI)
            ctx.fill()
            
            // Texto
            ctx.fillStyle = '#374151'
            ctx.fillText(item.texto, x + 30, yOffset + 5)
            yOffset += 15
        }
    }
    
    // ✅ RENDERIZAR EJES CON NUMERACIÓN
    renderizarEjes(ctx, transformador) {
        const area = transformador.area
        const intervaloX = transformador.intervaloX
        const intervaloY = transformador.intervaloY
        
        ctx.save()
        ctx.strokeStyle = '#000000'
        ctx.lineWidth = 1
        ctx.fillStyle = '#000000'
        ctx.font = '11px Arial'
        
        // Eje X (línea horizontal)
        ctx.beginPath()
        ctx.moveTo(area.x, area.y + area.alto)
        ctx.lineTo(area.x + area.ancho, area.y + area.alto)
        ctx.stroke()
        
        // Eje Y (línea vertical)
        ctx.beginPath()
        ctx.moveTo(area.x, area.y)
        ctx.lineTo(area.x, area.y + area.alto)
        ctx.stroke()
        
        // ✅ NUMERACIÓN DEL EJE X - Mejorada
        const numMarcasX = 5 // Reducir número de marcas para mejor legibilidad
        const pasoX = (intervaloX.max - intervaloX.min) / (numMarcasX - 1)
        
        for (let i = 0; i < numMarcasX; i++) {
            const valorX = intervaloX.min + (i * pasoX)
            const canvasX = area.x + (i * area.ancho / (numMarcasX - 1))
            
            // Línea de marca en el eje X
            ctx.beginPath()
            ctx.moveTo(canvasX, area.y + area.alto)
            ctx.lineTo(canvasX, area.y + area.alto + 4)
            ctx.stroke()
            
            // Número del eje X
            ctx.textAlign = 'center'
            ctx.textBaseline = 'top'
            ctx.fillText(valorX.toFixed(1), canvasX, area.y + area.alto + 6)
        }
        
        // ✅ NUMERACIÓN DEL EJE Y - Mejorada
        const numMarcasY = 5 // Reducir número de marcas para mejor legibilidad
        const pasoY = (intervaloY.max - intervaloY.min) / (numMarcasY - 1)
        
        for (let i = 0; i < numMarcasY; i++) {
            const valorY = intervaloY.min + (i * pasoY)
            const canvasY = area.y + area.alto - (i * area.alto / (numMarcasY - 1))
            
            // Línea de marca en el eje Y
            ctx.beginPath()
            ctx.moveTo(area.x - 4, canvasY)
            ctx.lineTo(area.x, canvasY)
            ctx.stroke()
            
            // Número del eje Y
            ctx.textAlign = 'right'
            ctx.textBaseline = 'middle'
            ctx.fillText(valorY.toFixed(1), area.x - 6, canvasY)
        }
        
        ctx.restore()
    }
}

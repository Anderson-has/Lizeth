/**
 * RENDERIZADOR: RenderizadorPuenteMagico
 * RESPONSABILIDAD: Solo renderizado del puente mágico del Primer Teorema Fundamental del Cálculo
 * SRP: Solo presentación visual, no lógica de negocio ni cálculos
 */
export class RenderizadorPuenteMagico {
    constructor(configuracion) {
        this.configuracion = configuracion
        this.animacionFrame = 0
        this.efectosBrillo = []
    }
    
    // ✅ RENDERIZAR PUENTE MÁGICO
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
        
        // Dibujar fondo degradado
        this.dibujarFondoDegradado(ctx, canvas, colores)
        
        // Dibujar puente
        await this.dibujarPuente(ctx, funcion, limites, transformador, colores)
        
        // Dibujar área acumulada
        this.dibujarAreaAcumulada(ctx, funcion, limites, posicionX, transformador, colores)
        
        // Dibujar vigas de soporte
        this.dibujarVigasSoporte(ctx, funcion, limites, transformador, colores)
        
        // Dibujar hada
        this.dibujarHada(ctx, posicionX, funcion, transformador, colores)
        
        // Dibujar puntos de referencia
        this.dibujarPuntosReferencia(ctx, limites, transformador, colores)
        
        // Dibujar efectos de brillo
        this.dibujarEfectosBrillo(ctx, posicionX, funcion, transformador, colores)
        
        // Dibujar información
        this.dibujarInformacion(ctx, calculos, colores)
        
        // Actualizar efectos
        this.actualizarEfectos()
    }
    
    // ✅ LIMPIAR CANVAS
    limpiarCanvas(ctx, canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
    
    // ✅ DIBUJAR FONDO DEGRADADO
    dibujarFondoDegradado(ctx, canvas, colores) {
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
        gradient.addColorStop(0, '#FDF2F8') // Rosa claro
        gradient.addColorStop(1, '#F3E8FF') // Morado claro
        
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
    
    // ✅ DIBUJAR PUENTE
    async dibujarPuente(ctx, funcion, limites, transformador, colores) {
        const puntos = this.generarPuntosPuente(funcion, limites, transformador)
        
        if (puntos.length < 2) return
        
        // Dibujar curva del puente
        ctx.strokeStyle = colores.puente
        ctx.lineWidth = 8
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        
        ctx.beginPath()
        ctx.moveTo(puntos[0].x, puntos[0].y)
        
        for (let i = 1; i < puntos.length; i++) {
            ctx.lineTo(puntos[i].x, puntos[i].y)
        }
        
        ctx.stroke()
        
        // Dibujar sombra del puente
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
        ctx.shadowBlur = 10
        ctx.shadowOffsetX = 2
        ctx.shadowOffsetY = 2
        
        ctx.stroke()
        
        // Restaurar sombra
        ctx.shadowColor = 'transparent'
        ctx.shadowBlur = 0
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 0
    }
    
    // ✅ DIBUJAR ÁREA ACUMULADA
    dibujarAreaAcumulada(ctx, funcion, limites, posicionX, transformador, colores) {
        const puntos = this.generarPuntosArea(funcion, limites, posicionX, transformador)
        
        if (puntos.length < 3) return
        
        ctx.fillStyle = colores.areaAcumulada
        ctx.beginPath()
        
        // Comenzar en el límite inferior
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
    
    // ✅ DIBUJAR VIGAS DE SOPORTE
    dibujarVigasSoporte(ctx, funcion, limites, transformador, colores) {
        const separacion = 0.3
        const numVigas = Math.floor((limites.b - limites.a) / separacion)
        
        ctx.strokeStyle = colores.vigas
        ctx.lineWidth = 3
        
        for (let i = 0; i <= numVigas; i++) {
            const x = limites.a + i * separacion
            const y = funcion.evaluar(x)
            
            const puntoSuperior = transformador.matematicasACanvas(x, y)
            const puntoInferior = transformador.matematicasACanvas(x, 0)
            
            ctx.beginPath()
            ctx.moveTo(puntoSuperior.x, puntoSuperior.y)
            ctx.lineTo(puntoInferior.x, puntoInferior.y)
            ctx.stroke()
        }
    }
    
    // ✅ DIBUJAR HADA
    dibujarHada(ctx, posicionX, funcion, transformador, colores) {
        const y = funcion.evaluar(posicionX)
        const punto = transformador.matematicasACanvas(posicionX, y)
        
        // Cuerpo del hada
        ctx.fillStyle = colores.hada
        ctx.beginPath()
        ctx.arc(punto.x, punto.y, 12, 0, 2 * Math.PI)
        ctx.fill()
        
        // Alas del hada
        ctx.fillStyle = colores.alas
        ctx.beginPath()
        ctx.ellipse(punto.x - 8, punto.y - 5, 6, 3, -0.3, 0, 2 * Math.PI)
        ctx.fill()
        
        ctx.beginPath()
        ctx.ellipse(punto.x + 8, punto.y - 5, 6, 3, 0.3, 0, 2 * Math.PI)
        ctx.fill()
        
        // Efecto de brillo alrededor del hada
        this.agregarEfectoBrillo(punto.x, punto.y)
    }
    
    // ✅ DIBUJAR PUNTOS DE REFERENCIA
    dibujarPuntosReferencia(ctx, limites, transformador, colores) {
        // Punto A
        const puntoA = transformador.matematicasACanvas(limites.a, 0)
        this.dibujarPuntoReferencia(ctx, puntoA, 'A', colores)
        
        // Punto B
        const puntoB = transformador.matematicasACanvas(limites.b, 0)
        this.dibujarPuntoReferencia(ctx, puntoB, 'B', colores)
    }
    
    // ✅ DIBUJAR PUNTO DE REFERENCIA
    dibujarPuntoReferencia(ctx, punto, etiqueta, colores) {
        // Círculo de fondo
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
        ctx.beginPath()
        ctx.arc(punto.x, punto.y, 15, 0, 2 * Math.PI)
        ctx.fill()
        
        // Borde
        ctx.strokeStyle = colores.verificacionExitosa
        ctx.lineWidth = 2
        ctx.stroke()
        
        // Etiqueta
        ctx.fillStyle = colores.verificacionExitosa
        ctx.font = 'bold 14px Arial'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(etiqueta, punto.x, punto.y)
    }
    
    // ✅ DIBUJAR EFECTOS DE BRILLO
    dibujarEfectosBrillo(ctx, posicionX, funcion, transformador, colores) {
        this.efectosBrillo.forEach(efecto => {
            const alpha = Math.max(0, 1 - (Date.now() - efecto.tiempo) / 1000)
            if (alpha <= 0) return
            
            ctx.globalAlpha = alpha
            ctx.fillStyle = colores.hada
            ctx.beginPath()
            ctx.arc(efecto.x, efecto.y, efecto.radio, 0, 2 * Math.PI)
            ctx.fill()
        })
        
        ctx.globalAlpha = 1
    }
    
    // ✅ DIBUJAR INFORMACIÓN
    dibujarInformacion(ctx, calculos, colores) {
        const x = 20
        let y = 30
        
        // Título
        ctx.fillStyle = '#374151'
        ctx.font = 'bold 16px Arial'
        ctx.fillText('Área Acumulada', x, y)
        y += 25
        
        // Valor de la integral
        ctx.fillStyle = colores.verificacionExitosa
        ctx.font = 'bold 14px Arial'
        ctx.fillText(`F(x) = ${calculos.integralAcumulada.toFixed(4)}`, x, y)
        y += 20
        
        // Verificación del teorema
        const colorVerificacion = calculos.verificacionExitosa ? colores.verificacionExitosa : colores.verificacionError
        ctx.fillStyle = colorVerificacion
        ctx.font = '12px Arial'
        ctx.fillText(calculos.verificacionExitosa ? '✅ Teorema Verificado' : '❌ Teorema No Verificado', x, y)
    }
    
    // ✅ GENERAR PUNTOS DEL PUENTE
    generarPuntosPuente(funcion, limites, transformador) {
        const puntos = []
        // ✅ REDUCIR DENSIDAD PARA RENDERIZADO MÁS RÁPIDO
        const densidad = 100
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
    
    // ✅ AGREGAR EFECTO DE BRILLO
    agregarEfectoBrillo(x, y) {
        this.efectosBrillo.push({
            x,
            y,
            radio: 20,
            tiempo: Date.now()
        })
    }
    
    // ✅ ACTUALIZAR EFECTOS
    actualizarEfectos() {
        this.efectosBrillo = this.efectosBrillo.filter(efecto => 
            Date.now() - efecto.tiempo < 1000
        )
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

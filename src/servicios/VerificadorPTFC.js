/**
 * SERVICIO: VerificadorPTFC
 * RESPONSABILIDAD: Solo verificación del Primer Teorema Fundamental del Cálculo
 * SRP: Solo validaciones, no cálculos ni presentación
 */
export class VerificadorPTFC {
    constructor() {
        this.tolerancia = 0.001
        this.precision = 4
    }
    
    // ✅ VERIFICAR EL TEOREMA F'(x) = f(x)
    verificarTeorema(valorFuncion, derivadaIntegral, tolerancia = null) {
        const tol = tolerancia || this.tolerancia
        const diferencia = Math.abs(derivadaIntegral - valorFuncion)
        const esValida = diferencia < tol
        
        return {
            esValida,
            diferencia: this.formatearNumero(diferencia),
            tolerancia: tol,
            valorFuncion: this.formatearNumero(valorFuncion),
            derivadaIntegral: this.formatearNumero(derivadaIntegral),
            mensaje: this.obtenerMensajeVerificacion(esValida, diferencia, tol)
        }
    }
    
    // ✅ VERIFICAR LÍMITES
    verificarLimites(a, b) {
        const errores = []
        
        if (a >= b) {
            errores.push('El límite inferior debe ser menor que el superior')
        }
        
        if (!isFinite(a) || !isFinite(b)) {
            errores.push('Los límites deben ser números finitos')
        }
        
        if (Math.abs(a) > 100 || Math.abs(b) > 100) {
            errores.push('Los límites deben estar entre -100 y 100')
        }
        
        return {
            esValida: errores.length === 0,
            errores,
            mensaje: errores.length === 0 ? 'Límites válidos' : errores.join('; ')
        }
    }
    
    // ✅ VERIFICAR POSICIÓN X
    verificarPosicionX(x, a, b) {
        const errores = []
        
        if (x < a || x > b) {
            errores.push('La posición x debe estar entre los límites')
        }
        
        if (!isFinite(x)) {
            errores.push('La posición x debe ser un número finito')
        }
        
        return {
            esValida: errores.length === 0,
            errores,
            mensaje: errores.length === 0 ? 'Posición válida' : errores.join('; ')
        }
    }
    
    // ✅ VERIFICAR FUNCIÓN
    verificarFuncion(funcion, dominio) {
        const errores = []
        const { inicio, fin } = dominio
        const puntosPrueba = 20
        
        for (let i = 0; i <= puntosPrueba; i++) {
            const x = inicio + (fin - inicio) * i / puntosPrueba
            
            try {
                const y = funcion.evaluar(x)
                if (!isFinite(y)) {
                    errores.push(`La función no es finita en x = ${x.toFixed(2)}`)
                    break
                }
            } catch (error) {
                errores.push(`Error evaluando función en x = ${x.toFixed(2)}`)
                break
            }
        }
        
        return {
            esValida: errores.length === 0,
            errores,
            mensaje: errores.length === 0 ? 'Función válida' : errores.join('; ')
        }
    }
    
    // ✅ VERIFICAR CÁLCULOS
    verificarCalculos(calculos) {
        const errores = []
        const advertencias = []
        
        // Verificar que todos los valores sean finitos
        if (!isFinite(calculos.valorFuncion)) {
            errores.push('El valor de la función no es finito')
        }
        
        if (!isFinite(calculos.integralAcumulada)) {
            errores.push('La integral acumulada no es finita')
        }
        
        if (!isFinite(calculos.derivadaIntegral)) {
            errores.push('La derivada de la integral no es finita')
        }
        
        // Verificar que la diferencia sea razonable
        if (calculos.diferenciaVerificacion > 1) {
            advertencias.push('La diferencia de verificación es alta')
        }
        
        return {
            esValida: errores.length === 0,
            errores,
            advertencias,
            mensaje: errores.length === 0 ? 'Cálculos válidos' : errores.join('; ')
        }
    }
    
    // ✅ VERIFICAR ANIMACIÓN
    verificarAnimacion(estadoAnimacion) {
        const errores = []
        
        if (estadoAnimacion.velocidad < 0.1 || estadoAnimacion.velocidad > 5) {
            errores.push('La velocidad de animación debe estar entre 0.1 y 5')
        }
        
        if (estadoAnimacion.posicion < 0 || estadoAnimacion.posicion > 1) {
            errores.push('La posición de animación debe estar entre 0 y 1')
        }
        
        return {
            esValida: errores.length === 0,
            errores,
            mensaje: errores.length === 0 ? 'Animación válida' : errores.join('; ')
        }
    }
    
    // ✅ VERIFICAR LOGROS
    verificarLogros(logros, datos) {
        const logrosDesbloqueados = []
        
        logros.forEach(logro => {
            if (!logro.desbloqueado && logro.condicion(datos)) {
                logro.desbloquear()
                logrosDesbloqueados.push(logro)
            }
        })
        
        return {
            logrosDesbloqueados,
            totalLogros: logros.length,
            logrosDesbloqueadosCount: logros.filter(l => l.desbloqueado).length
        }
    }
    
    // ✅ VERIFICACIÓN COMPLETA
    verificarCompleta(estado, configuracion) {
        const verificaciones = {
            limites: this.verificarLimites(estado.limiteA, estado.limiteB),
            posicion: this.verificarPosicionX(estado.posicionX, estado.limiteA, estado.limiteB),
            calculos: this.verificarCalculos(estado.obtenerCalculos()),
            animacion: this.verificarAnimacion(estado.obtenerEstadoAnimacion())
        }
        
        const esCompletaValida = Object.values(verificaciones).every(v => v.esValida)
        
        return {
            esCompletaValida,
            verificaciones,
            mensaje: esCompletaValida ? 'Todas las verificaciones pasaron' : 'Hay errores de verificación'
        }
    }
    
    // ✅ OBTENER MENSAJE DE VERIFICACIÓN
    obtenerMensajeVerificacion(esValida, diferencia, tolerancia) {
        if (esValida) {
            return `✅ Teorema verificado (diferencia: ${diferencia.toFixed(6)} < ${tolerancia})`
        } else {
            return `❌ Teorema no verificado (diferencia: ${diferencia.toFixed(6)} > ${tolerancia})`
        }
    }
    
    // ✅ OBTENER EXPLICACIÓN DEL TEOREMA
    obtenerExplicacionTeorema() {
        return {
            titulo: 'Primer Teorema Fundamental del Cálculo',
            enunciado: 'Si f es continua en [a,b] y F(x) = ∫[a,x] f(t)dt, entonces F\'(x) = f(x)',
            interpretacion: 'La derivada de la integral es la función original',
            aplicaciones: [
                'Conectar integración con derivación',
                'Calcular integrales usando antiderivadas',
                'Resolver ecuaciones diferenciales'
            ]
        }
    }
    
    // ✅ OBTENER CASOS ESPECIALES
    obtenerCasosEspeciales() {
        return [
            {
                titulo: 'Función Constante',
                descripcion: 'Si f(x) = c, entonces F(x) = c(x-a) y F\'(x) = c',
                ejemplo: 'f(x) = 2, F(x) = 2(x-a), F\'(x) = 2'
            },
            {
                titulo: 'Función Lineal',
                descripcion: 'Si f(x) = mx + b, entonces F(x) = m(x²-a²)/2 + b(x-a)',
                ejemplo: 'f(x) = 2x + 1, F(x) = x² - a² + x - a'
            },
            {
                titulo: 'Función Cuadrática',
                descripcion: 'Si f(x) = ax² + bx + c, entonces F(x) = a(x³-a³)/3 + b(x²-a²)/2 + c(x-a)',
                ejemplo: 'f(x) = x², F(x) = (x³-a³)/3'
            }
        ]
    }
    
    // ✅ FORMATEAR NÚMERO
    formatearNumero(numero, decimales = null) {
        const dec = decimales || this.precision
        return Number(numero.toFixed(dec))
    }
    
    // ✅ OBTENER CONFIGURACIÓN
    obtenerConfiguracion() {
        return {
            tolerancia: this.tolerancia,
            precision: this.precision
        }
    }
    
    // ✅ ACTUALIZAR CONFIGURACIÓN
    actualizarConfiguracion(configuracion) {
        if (configuracion.tolerancia) this.tolerancia = configuracion.tolerancia
        if (configuracion.precision) this.precision = configuracion.precision
    }
}

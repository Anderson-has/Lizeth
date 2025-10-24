/**
 * SERVICIO: CalculadoraPTFC
 * RESPONSABILIDAD: Solo cálculos matemáticos del Primer Teorema Fundamental del Cálculo
 * SRP: Solo lógica de cálculo, no presentación ni coordinación
 */
export class CalculadoraPTFC {
    constructor() {
        this.precision = 1000
        this.tolerancia = 0.001
        this.metodoIntegracion = 'trapecio'
    }
    
    // ✅ FUNCIONES MATEMÁTICAS PREDEFINIDAS
    obtenerFuncionesDisponibles() {
        return {
            cuadratica: {
                nombre: 'Cuadrática',
                formula: 'f(x) = 0.5x² - 2x + 3',
                evaluar: (x) => 0.5 * x * x - 2 * x + 3,
                derivada: (x) => x - 2,
                antiderivada: (x) => (x * x * x) / 6 - x * x + 3 * x,
                dominio: { inicio: -2, fin: 6 }
            },
            cubica: {
                nombre: 'Cúbica',
                formula: 'f(x) = 0.1x³ - 0.5x² + 2',
                evaluar: (x) => 0.1 * x * x * x - 0.5 * x * x + 2,
                derivada: (x) => 0.3 * x * x - x,
                antiderivada: (x) => 0.025 * x * x * x * x - (x * x * x) / 6 + 2 * x,
                dominio: { inicio: -3, fin: 5 }
            },
            seno: {
                nombre: 'Seno',
                formula: 'f(x) = 2sin(x) + 3',
                evaluar: (x) => 2 * Math.sin(x) + 3,
                derivada: (x) => 2 * Math.cos(x),
                antiderivada: (x) => -2 * Math.cos(x) + 3 * x,
                dominio: { inicio: 0, fin: 2 * Math.PI }
            },
            exponencial: {
                nombre: 'Exponencial',
                formula: 'f(x) = e^(0.3x)',
                evaluar: (x) => Math.exp(0.3 * x),
                derivada: (x) => 0.3 * Math.exp(0.3 * x),
                antiderivada: (x) => Math.exp(0.3 * x) / 0.3,
                dominio: { inicio: -2, fin: 4 }
            },
            polinomio: {
                nombre: 'Polinómica',
                formula: 'f(x) = -0.1(x-2)³ + 2(x-2) + 4',
                evaluar: (x) => -0.1 * Math.pow(x - 2, 3) + 2 * (x - 2) + 4,
                derivada: (x) => -0.3 * Math.pow(x - 2, 2) + 2,
                antiderivada: (x) => -0.025 * Math.pow(x - 2, 4) + Math.pow(x - 2, 2) + 4 * x,
                dominio: { inicio: -1, fin: 5 }
            }
        }
    }
    
    // ✅ EVALUAR FUNCIÓN DE FORMA SEGURA
    evaluarFuncion(funcion, x) {
        try {
            const resultado = funcion.evaluar(x)
            return isFinite(resultado) ? resultado : 0
        } catch (error) {
            console.warn('Error evaluando función:', error)
            return 0
        }
    }
    
    // ✅ CALCULAR INTEGRAL USANDO REGLA DEL TRAPECIO
    calcularIntegral(funcion, a, x, precision = null) {
        const prec = precision || this.precision
        
        if (x <= a) return 0
        
        const h = (x - a) / prec
        let suma = 0
        
        // Regla del trapecio compuesta
        for (let i = 0; i < prec; i++) {
            const t1 = a + i * h
            const t2 = a + (i + 1) * h
            const f1 = this.evaluarFuncion(funcion, t1)
            const f2 = this.evaluarFuncion(funcion, t2)
            suma += (f1 + f2) / 2 * h
        }
        
        return suma
    }
    
    // ✅ CALCULAR DERIVADA USANDO DIFERENCIAS FINITAS
    calcularDerivada(funcion, x, h = 0.0001) {
        const f1 = this.evaluarFuncion(funcion, x - h)
        const f2 = this.evaluarFuncion(funcion, x + h)
        return (f2 - f1) / (2 * h)
    }
    
    // ✅ CALCULAR TODOS LOS VALORES DEL TEOREMA
    calcularTeoremaCompleto(funcion, a, x, precision = null) {
        const inicioTiempo = Date.now()
        
        // Evaluar función en x
        const valorFuncion = this.evaluarFuncion(funcion, x)
        
        // Calcular integral acumulada F(x) = ∫[a,x] f(t)dt
        const integralAcumulada = this.calcularIntegral(funcion, a, x, precision)
        
        // Calcular derivada de la integral F'(x)
        const derivadaIntegral = this.calcularDerivadaIntegral(funcion, a, x)
        
        // Verificar el teorema: F'(x) = f(x)
        const diferencia = Math.abs(derivadaIntegral - valorFuncion)
        const verificacionExitosa = diferencia < this.tolerancia
        
        const tiempoCalculo = Date.now() - inicioTiempo
        
        return {
            valorFuncion: this.formatearNumero(valorFuncion),
            integralAcumulada: this.formatearNumero(integralAcumulada),
            derivadaIntegral: this.formatearNumero(derivadaIntegral),
            diferenciaVerificacion: this.formatearNumero(diferencia),
            verificacionExitosa,
            tiempoCalculo,
            precision: precision || this.precision
        }
    }
    
    // ✅ CALCULAR DERIVADA DE LA INTEGRAL
    calcularDerivadaIntegral(funcion, a, x, h = 0.0001) {
        const integral1 = this.calcularIntegral(funcion, a, x - h)
        const integral2 = this.calcularIntegral(funcion, a, x + h)
        return (integral2 - integral1) / (2 * h)
    }
    
    // ✅ GENERAR DATOS PARA GRÁFICA
    generarDatosGrafica(funcion, a, b, densidadPuntos = 200) {
        const datos = []
        const paso = (b - a) / densidadPuntos
        
        for (let i = 0; i <= densidadPuntos; i++) {
            const x = a + i * paso
            const y = this.evaluarFuncion(funcion, x)
            const integral = this.calcularIntegral(funcion, a, x)
            
            datos.push({
                x: this.formatearNumero(x),
                y: this.formatearNumero(y),
                integral: this.formatearNumero(integral)
            })
        }
        
        return datos
    }
    
    // ✅ GENERAR DATOS PARA ANIMACIÓN
    generarDatosAnimacion(funcion, a, b, numFrames = 100) {
        const frames = []
        const paso = (b - a) / numFrames
        
        for (let i = 0; i <= numFrames; i++) {
            const x = a + i * paso
            const progreso = i / numFrames
            
            const frame = {
                x: this.formatearNumero(x),
                progreso,
                tiempo: i * 16.67 // 60 FPS
            }
            
            frames.push(frame)
        }
        
        return frames
    }
    
    // ✅ VALIDAR LÍMITES
    validarLimites(a, b) {
        const errores = []
        
        if (a >= b) {
            errores.push('El límite inferior debe ser menor que el superior')
        }
        
        if (!isFinite(a) || !isFinite(b)) {
            errores.push('Los límites deben ser números finitos')
        }
        
        return {
            esValida: errores.length === 0,
            errores
        }
    }
    
    // ✅ VALIDAR FUNCIÓN
    validarFuncion(funcion, dominio) {
        const errores = []
        const { inicio, fin } = dominio
        const puntosPrueba = 10
        
        for (let i = 0; i <= puntosPrueba; i++) {
            const x = inicio + (fin - inicio) * i / puntosPrueba
            const y = this.evaluarFuncion(funcion, x)
            
            if (!isFinite(y)) {
                errores.push(`La función no es finita en x = ${x}`)
                break
            }
        }
        
        return {
            esValida: errores.length === 0,
            errores
        }
    }
    
    // ✅ FORMATEAR NÚMERO
    formatearNumero(numero, decimales = 4) {
        return Number(numero.toFixed(decimales))
    }
    
    // ✅ OBTENER CONFIGURACIÓN
    obtenerConfiguracion() {
        return {
            precision: this.precision,
            tolerancia: this.tolerancia,
            metodoIntegracion: this.metodoIntegracion
        }
    }
    
    // ✅ ACTUALIZAR CONFIGURACIÓN
    actualizarConfiguracion(configuracion) {
        if (configuracion.precision) this.precision = configuracion.precision
        if (configuracion.tolerancia) this.tolerancia = configuracion.tolerancia
        if (configuracion.metodoIntegracion) this.metodoIntegracion = configuracion.metodoIntegracion
    }
}

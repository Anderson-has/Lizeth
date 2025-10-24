/**
 * CalculadoraAditividad - Servicio que maneja todos los cálculos matemáticos de aditividad
 * RESPONSABILIDAD ÚNICA: Solo cálculos matemáticos
 */
export class CalculadoraAditividad {
    constructor() {
        // Funciones matemáticas disponibles con sus integrales exactas
        this.funciones = {
            "x": {
                nombre: "x",
                calcular: (x) => x,
                integral: (a, b) => (b * b - a * a) / 2
            },
            "x²": {
                nombre: "x²",
                calcular: (x) => x * x,
                integral: (a, b) => (b * b * b - a * a * a) / 3
            },
            "x³": {
                nombre: "x³",
                calcular: (x) => x * x * x,
                integral: (a, b) => (b * b * b * b - a * a * a * a) / 4
            },
            "sin(x)": {
                nombre: "sin(x)",
                calcular: (x) => Math.sin(x),
                integral: (a, b) => -Math.cos(b) + Math.cos(a)
            },
            "cos(x)": {
                nombre: "cos(x)",
                calcular: (x) => Math.cos(x),
                integral: (a, b) => Math.sin(b) - Math.sin(a)
            },
            "√x": {
                nombre: "√x",
                calcular: (x) => Math.sqrt(Math.max(0, x)),
                integral: (a, b) => (2 * Math.pow(b, 1.5) - 2 * Math.pow(Math.max(0, a), 1.5)) / 3
            },
            "eˣ": {
                nombre: "eˣ",
                calcular: (x) => Math.exp(x),
                integral: (a, b) => Math.exp(b) - Math.exp(a)
            }
        }
    }
    
    // Calcular integral sobre [a, c]
    calcularIntegralAC(funcion, a, c) {
        const func = this.funciones[funcion]
        if (!func) throw new Error(`Función ${funcion} no encontrada`)
        return func.integral(a, c)
    }
    
    // Calcular integral sobre [a, b]
    calcularIntegralAB(funcion, a, b) {
        const func = this.funciones[funcion]
        if (!func) throw new Error(`Función ${funcion} no encontrada`)
        return func.integral(a, b)
    }
    
    // Calcular integral sobre [b, c]
    calcularIntegralBC(funcion, b, c) {
        const func = this.funciones[funcion]
        if (!func) throw new Error(`Función ${funcion} no encontrada`)
        return func.integral(b, c)
    }
    
    // Calcular suma de integrales [a,b] + [b,c]
    calcularSumaIntegrales(funcion, a, b, c) {
        const integralAB = this.calcularIntegralAB(funcion, a, b)
        const integralBC = this.calcularIntegralBC(funcion, b, c)
        return integralAB + integralBC
    }
    
    // Calcular todos los valores necesarios para la verificación
    calcularTodosLosValores(funcion, a, b, c) {
        const integralAC = this.calcularIntegralAC(funcion, a, c)
        const integralAB = this.calcularIntegralAB(funcion, a, b)
        const integralBC = this.calcularIntegralBC(funcion, b, c)
        const sumaAB_BC = integralAB + integralBC
        
        return {
            integralAC: integralAC,
            integralAB: integralAB,
            integralBC: integralBC,
            sumaAB_BC: sumaAB_BC
        }
    }
    
    // Calcular valor de función en un punto
    calcularValorFuncion(funcion, x) {
        const func = this.funciones[funcion]
        if (!func) throw new Error(`Función ${funcion} no encontrada`)
        return func.calcular(x)
    }
    
    // Generar datos para el gráfico
    generarDatosGrafico(funcion, a, c, numPuntos = 200) {
        const func = this.funciones[funcion]
        if (!func) throw new Error(`Función ${funcion} no encontrada`)
        
        const datos = []
        const paso = (c - a) / (numPuntos - 1)
        
        for (let i = 0; i < numPuntos; i++) {
            const x = a + i * paso
            const y = func.calcular(x)
            datos.push({ x, y })
        }
        
        return datos
    }
    
    // Determinar en qué intervalo está un punto
    determinarIntervalo(x, a, b, c) {
        if (x < a) return "fuera"
        if (x <= b) return "ab"
        if (x <= c) return "bc"
        return "fuera"
    }
    
    // Obtener información de una función
    obtenerInformacionFuncion(funcion) {
        return this.funciones[funcion] || null
    }
    
    // Obtener todas las funciones disponibles
    obtenerFuncionesDisponibles() {
        return Object.keys(this.funciones)
    }
    
    // Verificar si una función es válida
    esFuncionValida(funcion) {
        return funcion in this.funciones
    }
}


/**
 * CalculadoraInversionLimites - Servicio que calcula las áreas para la propiedad de inversión de límites
 * RESPONSABILIDAD ÚNICA: Solo cálculos matemáticos
 */
export class CalculadoraInversionLimites {
    constructor() {
        this.funcionesDisponibles = {
            "x": (x) => x,
            "x²": (x) => x * x,
            "x³": (x) => x * x * x,
            "sin(x)": (x) => Math.sin(x),
            "cos(x)": (x) => Math.cos(x),
            "√x": (x) => Math.sqrt(Math.max(0, x)),
            "eˣ": (x) => Math.exp(x),
            "ln(x)": (x) => Math.log(Math.max(0.001, x))
        }
    }
    
    // Calcular área normal ∫[a→b] f(x)dx
    calcularAreaNormal(funcion, a, b) {
        const f = this.funcionesDisponibles[funcion]
        if (!f) return 0
        
        // Integración numérica usando regla del trapecio
        const n = 1000 // Número de intervalos
        const h = (b - a) / n
        let suma = 0
        
        for (let i = 0; i <= n; i++) {
            const x = a + i * h
            const peso = (i === 0 || i === n) ? 1 : 2
            suma += peso * f(x)
        }
        
        return (h / 2) * suma
    }
    
    // Calcular área invertida ∫[b→a] f(x)dx
    calcularAreaInvertida(funcion, a, b) {
        // ∫[b→a] f(x)dx = -∫[a→b] f(x)dx
        return -this.calcularAreaNormal(funcion, a, b)
    }
    
    // Calcular ambas áreas
    calcularAreas(funcion, a, b) {
        const areaNormal = this.calcularAreaNormal(funcion, a, b)
        const areaInvertida = this.calcularAreaInvertida(funcion, a, b)
        
        return {
            areaNormal,
            areaInvertida,
            diferencia: Math.abs(areaInvertida + areaNormal)
        }
    }
    
    // Generar datos para el gráfico
    generarDatosGrafico(funcion, a, b) {
        const f = this.funcionesDisponibles[funcion]
        if (!f) return []
        
        const datos = []
        const n = 200 // Número de puntos
        const paso = (b - a) / n
        
        for (let i = 0; i <= n; i++) {
            const x = a + i * paso
            const y = f(x)
            datos.push({ x, y })
        }
        
        return datos
    }
    
    // Obtener funciones disponibles
    obtenerFuncionesDisponibles() {
        return Object.keys(this.funcionesDisponibles)
    }
    
    // Calcular valor de función en un punto
    calcularValorFuncion(funcion, x) {
        const f = this.funcionesDisponibles[funcion]
        return f ? f(x) : 0
    }
}

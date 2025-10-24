/**
 * SERVICIO: CalculadoraComparacion
 * RESPONSABILIDAD: Solo cálculos matemáticos para la propiedad de comparación
 * SRP: Solo cálculos, no maneja estado ni renderizado
 */
export class CalculadoraComparacion {
    constructor() {
        this.funcionesDisponibles = {
            "x": (x) => x,
            "x²": (x) => x * x,
            "x³": (x) => x * x * x,
            "√x": (x) => Math.sqrt(Math.max(0, x)),
            "sin(x)": (x) => Math.sin(x),
            "cos(x)": (x) => Math.cos(x),
            "eˣ": (x) => Math.exp(x),
            "ln(x)": (x) => Math.log(Math.max(0.001, x)),
            "2x": (x) => 2 * x,
            "3x": (x) => 3 * x,
            "x/2": (x) => x / 2
        }
    }

    // Calcular integrales de ambas funciones
    calcularIntegrales(funcionF, funcionG, limiteA, limiteB) {
        const integralF = this.calcularIntegral(funcionF, limiteA, limiteB)
        const integralG = this.calcularIntegral(funcionG, limiteA, limiteB)
        const diferencia = integralF - integralG

        return {
            integralF,
            integralG,
            diferencia,
            comparacion: {
                fMayorQueG: integralF > integralG,
                gMayorQueF: integralG > integralF,
                iguales: Math.abs(diferencia) < 0.0001
            }
        }
    }

    // Calcular integral usando regla del trapecio
    calcularIntegral(funcion, limiteA, limiteB) {
        const f = this.funcionesDisponibles[funcion]
        if (!f) return 0

        const n = 1000 // Número de subdivisiones
        const h = (limiteB - limiteA) / n
        let suma = 0

        // Regla del trapecio
        for (let i = 0; i <= n; i++) {
            const x = limiteA + i * h
            const y = f(x)
            
            if (i === 0 || i === n) {
                suma += y
            } else {
                suma += 2 * y
            }
        }

        return (h / 2) * suma
    }

    // Generar datos para el gráfico
    generarDatosGrafico(funcionF, funcionG, limiteA, limiteB) {
        const f = this.funcionesDisponibles[funcionF]
        const g = this.funcionesDisponibles[funcionG]
        
        if (!f || !g) return []

        const puntos = 200
        const paso = (limiteB - limiteA) / puntos
        const datos = []

        for (let i = 0; i <= puntos; i++) {
            const x = limiteA + i * paso
            const yF = f(x)
            const yG = g(x)
            
            datos.push({
                x,
                yF,
                yG,
                diferencia: yF - yG
            })
        }

        return datos
    }

    // Calcular valor de función en un punto específico
    calcularValorFuncion(funcion, x) {
        const f = this.funcionesDisponibles[funcion]
        return f ? f(x) : 0
    }

    // Obtener funciones disponibles
    obtenerFuncionesDisponibles() {
        return Object.keys(this.funcionesDisponibles)
    }

    // Verificar si una función es válida
    esFuncionValida(funcion) {
        return this.funcionesDisponibles.hasOwnProperty(funcion)
    }

    // Obtener información de una función
    obtenerInfoFuncion(funcion) {
        const ejemplos = {
            "x": "Función lineal",
            "x²": "Función cuadrática",
            "x³": "Función cúbica",
            "√x": "Función raíz cuadrada",
            "sin(x)": "Función seno",
            "cos(x)": "Función coseno",
            "eˣ": "Función exponencial",
            "ln(x)": "Función logarítmica"
        }

        return {
            nombre: funcion,
            descripcion: ejemplos[funcion] || "Función personalizada",
            esValida: this.esFuncionValida(funcion)
        }
    }
}

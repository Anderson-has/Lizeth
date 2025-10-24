/**
 * DetectorHoverAditividad - Detector que maneja eventos de hover en el gráfico de aditividad
 * RESPONSABILIDAD ÚNICA: Solo detección de hover
 */
export class DetectorHoverAditividad {
    constructor(estado, configuracion) {
        this.estado = estado
        this.configuracion = configuracion
    }
    
    // Detectar punto hover
    detectarPuntoHover(evento, canvas, transformador) {
        if (!canvas || !transformador) {
            return null
        }
        
        const rect = canvas.getBoundingClientRect()
        const x = evento.clientX - rect.left
        const y = evento.clientY - rect.top
        
        // Convertir coordenadas del canvas a matemáticas
        const puntoMatematico = transformador.canvasAMatematicas(x, y)
        
        // Calcular valor de la función en ese punto
        const funcion = this.estado.obtenerFuncionSeleccionada()
        const valorFuncion = this.calcularValorFuncion(funcion, puntoMatematico.x)
        
        // Determinar intervalo
        const limites = this.estado.obtenerLimites()
        const intervalo = this.determinarIntervalo(puntoMatematico.x, limites.a, limites.b, limites.c)
        
        return {
            x: puntoMatematico.x,
            y: puntoMatematico.y,
            valorFuncion: valorFuncion,
            intervalo: intervalo,
            coordenadasCanvas: { x, y }
        }
    }
    
    // Calcular valor de función
    calcularValorFuncion(funcion, x) {
        const funciones = {
            "x": (x) => x,
            "x²": (x) => x * x,
            "x³": (x) => x * x * x,
            "sin(x)": (x) => Math.sin(x),
            "cos(x)": (x) => Math.cos(x),
            "√x": (x) => Math.sqrt(Math.max(0, x)),
            "eˣ": (x) => Math.exp(x)
        }
        
        const func = funciones[funcion]
        return func ? func(x) : 0
    }
    
    // Determinar en qué intervalo está el punto
    determinarIntervalo(x, a, b, c) {
        if (x < a) return "fuera"
        if (x <= b) return "ab"
        if (x <= c) return "bc"
        return "fuera"
    }
    
    // Obtener información del intervalo
    obtenerInformacionIntervalo(intervalo, limites) {
        const informacion = {
            "fuera": {
                nombre: "Fuera del intervalo",
                color: "#6b7280",
                descripcion: "Punto fuera del rango de integración"
            },
            "ab": {
                nombre: `[${limites.a}, ${limites.b}]`,
                color: "#3b82f6",
                descripcion: "Primer subintervalo (área azul)"
            },
            "bc": {
                nombre: `[${limites.b}, ${limites.c}]`,
                color: "#10b981",
                descripcion: "Segundo subintervalo (área verde)"
            }
        }
        
        return informacion[intervalo] || informacion["fuera"]
    }
    
    // Verificar si el punto está dentro del área de dibujo
    estaDentroDelArea(evento, canvas) {
        const rect = canvas.getBoundingClientRect()
        const x = evento.clientX - rect.left
        const y = evento.clientY - rect.top
        
        return x >= 0 && x <= canvas.width && y >= 0 && y <= canvas.height
    }
}

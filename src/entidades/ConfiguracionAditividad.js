/**
 * ConfiguracionAditividad - Entidad que almacena la configuración de la visualización de aditividad
 * RESPONSABILIDAD ÚNICA: Solo almacenar configuración
 */
export class ConfiguracionAditividad {
    constructor() {
        // Configuración de colores (tema verde-azul-púrpura)
        this.colores = {
            funcion: "#8b5cf6",      // Púrpura para f(x)
            areaAB: "#3b82f6",       // Azul para área [a,b]
            areaBC: "#10b981",       // Verde para área [b,c]
            lineaA: "#6b7280",       // Gris para línea a
            lineaB: "#ef4444",       // Rojo para línea b (punto de división)
            lineaC: "#6b7280",       // Gris para línea c
            hover: "#f59e0b"         // Naranja para hover
        }
        
        // Configuración de opacidades
        this.opacidades = {
            areaAB: 0.5,
            areaBC: 0.5,
            funcion: 1.0
        }
        
        // Configuración de líneas
        this.grosorLineas = {
            funcion: 3,
            referencia: 2,
            hover: 2
        }
        
        // Configuración de sliders
        this.sliderB = {
            min: 0.1,
            max: 9.9,
            paso: 0.1,
            valorInicial: 2
        }
        
        // Configuración de límites
        this.limites = {
            a: { min: -10, max: 10, paso: 0.1, valorInicial: 0 },
            c: { min: -10, max: 10, paso: 0.1, valorInicial: 4 }
        }
        
        // Configuración de funciones disponibles
        this.funcionesDisponibles = {
            "x": { nombre: "x", color: "#3b82f6" },
            "x²": { nombre: "x²", color: "#10b981" },
            "x³": { nombre: "x³", color: "#8b5cf6" },
            "sin(x)": { nombre: "sin(x)", color: "#f59e0b" },
            "cos(x)": { nombre: "cos(x)", color: "#ef4444" },
            "√x": { nombre: "√x", color: "#06b6d4" },
            "eˣ": { nombre: "eˣ", color: "#84cc16" }
        }
        
        // Configuración del área de dibujo
        this.areaDibujo = {
            x: 60,              // Posición X del área de dibujo (margen izquierdo)
            y: 20,              // Posición Y del área de dibujo (margen superior)
            ancho: 800,
            alto: 400,
            margenIzquierdo: 60,
            margenDerecho: 20,
            margenSuperior: 20,
            margenInferior: 60
        }
        
        // Configuración de escalas
        this.escalas = {
            x: { min: -10, max: 10 },
            y: { min: -10, max: 10 }
        }
        
        // Configuración de tooltip
        this.tooltip = {
            ancho: 200,
            alto: 80,
            colorFondo: "#1f2937",
            colorTexto: "#f9fafb",
            radioBordes: 8
        }
        
        // Configuración de tolerancia
        this.toleranciaVerificacion = 0.001
    }
    
    // Getters
    obtenerColores() {
        return this.colores
    }
    
    obtenerOpacidades() {
        return this.opacidades
    }
    
    obtenerGrosorLineas() {
        return this.grosorLineas
    }
    
    obtenerConfiguracionSliderB() {
        return this.sliderB
    }
    
    obtenerConfiguracionLimites() {
        return this.limites
    }
    
    obtenerFuncionesDisponibles() {
        return this.funcionesDisponibles
    }
    
    obtenerAreaDibujo() {
        return this.areaDibujo
    }
    
    obtenerEscalas() {
        return this.escalas
    }
    
    obtenerConfiguracionTooltip() {
        return this.tooltip
    }
    
    obtenerToleranciaVerificacion() {
        return this.toleranciaVerificacion
    }
    
    calcularEscalas(intervaloX, intervaloY) {
        const area = this.obtenerAreaDibujo()
        return {
            escalaX: area.ancho / (intervaloX.max - intervaloX.min),
            escalaY: area.alto / (intervaloY.max - intervaloY.min)
        }
    }
    
    // Actualizar escalas dinámicamente
    actualizarEscalas(limiteA, limiteC) {
        const rango = Math.abs(limiteC - limiteA)
        const margen = rango * 0.1
        
        this.escalas.x.min = limiteA - margen
        this.escalas.x.max = limiteC + margen
        
        // Calcular rango Y basado en la función
        this.escalas.y.min = -Math.max(Math.abs(limiteA), Math.abs(limiteC))
        this.escalas.y.max = Math.max(Math.abs(limiteA), Math.abs(limiteC))
    }
}

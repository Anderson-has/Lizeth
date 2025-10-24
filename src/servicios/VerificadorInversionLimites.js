/**
 * VerificadorInversionLimites - Servicio que verifica la propiedad de inversión de límites
 * RESPONSABILIDAD ÚNICA: Solo validación de propiedades matemáticas
 */
export class VerificadorInversionLimites {
    constructor() {
        this.tolerancia = 0.001 // Tolerancia para comparaciones numéricas
    }
    
    // Verificar la propiedad: ∫[a→b] f(x)dx = -∫[b→a] f(x)dx
    verificarPropiedad(areaNormal, areaInvertida) {
        const diferencia = Math.abs(areaInvertida + areaNormal)
        const esValida = diferencia < this.tolerancia
        
        return {
            esValida,
            diferencia,
            areaNormal,
            areaInvertida,
            mensaje: this.obtenerMensajeVerificacion(esValida, diferencia)
        }
    }
    
    // Obtener mensaje de verificación
    obtenerMensajeVerificacion(esValida, diferencia) {
        if (esValida) {
            return `✅ La inversión de límites se cumple correctamente (diferencia: ${diferencia.toFixed(6)})`
        } else {
            return `❌ La inversión de límites no se cumple (diferencia: ${diferencia.toFixed(6)})`
        }
    }
    
    // Verificar con cálculos directos
    verificarConCalculos(calculadora, funcion, a, b) {
        const areaNormal = calculadora.calcularAreaNormal(funcion, a, b)
        const areaInvertida = calculadora.calcularAreaInvertida(funcion, a, b)
        
        return this.verificarPropiedad(areaNormal, areaInvertida)
    }
    
    // Obtener explicación de la propiedad
    obtenerExplicacion() {
        return {
            titulo: "Propiedad de Inversión de Límites",
            formula: "∫[a→b] f(x)dx = -∫[b→a] f(x)dx",
            explicacion: "Al intercambiar los límites de integración, el resultado cambia de signo.",
            ejemplo: "Si ∫[0→2] x dx = 2, entonces ∫[2→0] x dx = -2"
        }
    }
    
    // Obtener casos especiales
    obtenerCasosEspeciales() {
        return [
            {
                titulo: "Límites iguales",
                descripcion: "Si a = b, entonces ∫[a→a] f(x)dx = 0",
                formula: "∫[a→a] f(x)dx = 0"
            },
            {
                titulo: "Función impar",
                descripcion: "Para funciones impares, ∫[-a→a] f(x)dx = 0",
                formula: "∫[-a→a] f(x)dx = 0 (si f es impar)"
            },
            {
                titulo: "Función par",
                descripcion: "Para funciones pares, ∫[-a→a] f(x)dx = 2∫[0→a] f(x)dx",
                formula: "∫[-a→a] f(x)dx = 2∫[0→a] f(x)dx (si f es par)"
            }
        ]
    }
}

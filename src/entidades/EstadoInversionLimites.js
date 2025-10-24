/**
 * EstadoInversionLimites - Entidad que maneja el estado de la propiedad de inversión de límites
 * RESPONSABILIDAD ÚNICA: Solo almacenar y gestionar datos de estado
 */
export class EstadoInversionLimites {
    constructor() {
        // Límites de integración
        this.limiteA = 0
        this.limiteB = 2
        
        // Función a integrar
        this.funcion = "x"
        
        // Resultados de cálculo
        this.areaNormal = 0      // ∫[a→b] f(x)dx
        this.areaInvertida = 0   // ∫[b→a] f(x)dx
        
        // Verificación de la propiedad
        this.verificacion = null
        
        // Estado de validación
        this.esValida = false
        this.mensajeVerificacion = ""
        
        // Datos del gráfico
        this.datosGrafico = []
        this.puntoHover = null
    }
    
    // Getters
    obtenerLimites() {
        return {
            a: this.limiteA,
            b: this.limiteB
        }
    }
    
    obtenerFuncion() {
        return this.funcion
    }
    
    obtenerResultados() {
        return {
            areaNormal: this.areaNormal,
            areaInvertida: this.areaInvertida
        }
    }
    
    obtenerVerificacion() {
        return this.verificacion
    }
    
    obtenerDatosGrafico() {
        return this.datosGrafico
    }
    
    obtenerPuntoHover() {
        return this.puntoHover
    }
    
    // Setters
    actualizarLimites(a, b) {
        this.limiteA = a
        this.limiteB = b
    }
    
    actualizarFuncion(funcion) {
        this.funcion = funcion
    }
    
    establecerResultados(areaNormal, areaInvertida) {
        this.areaNormal = areaNormal
        this.areaInvertida = areaInvertida
    }
    
    establecerVerificacion(verificacion) {
        this.verificacion = verificacion
        this.esValida = verificacion.esValida
        this.mensajeVerificacion = verificacion.mensaje
    }
    
    establecerDatosGrafico(datos) {
        this.datosGrafico = datos
    }
    
    establecerPuntoHover(punto) {
        this.puntoHover = punto
    }
    
    limpiarPuntoHover() {
        this.puntoHover = null
    }
    
    // Validación
    validarLimites() {
        return this.limiteA !== this.limiteB
    }
    
    // Reiniciar
    reiniciar() {
        this.limiteA = 0
        this.limiteB = 2
        this.funcion = "x"
        this.areaNormal = 0
        this.areaInvertida = 0
        this.verificacion = null
        this.esValida = false
        this.mensajeVerificacion = ""
        this.datosGrafico = []
        this.puntoHover = null
    }
}

/**
 * EstadoAditividad - Entidad que almacena el estado de la visualización de aditividad
 * RESPONSABILIDAD ÚNICA: Solo almacenar datos de estado
 */
export class EstadoAditividad {
    constructor() {
        // Función seleccionada
        this.funcionSeleccionada = "x²"
        
        // Límites de integración
        this.limiteA = 0
        this.limiteB = 2
        this.limiteC = 4
        
        // Cálculos realizados
        this.integralAC = 0
        this.integralAB = 0
        this.integralBC = 0
        this.sumaAB_BC = 0
        
        // Estado de verificación
        this.verificacionExitosa = false
        this.tolerancia = 0.001
        
        // Estado de validación
        this.limitesValidos = true
        this.mensajeError = ""
        
        // Datos del gráfico
        this.datosGrafico = []
        this.puntoHover = null
    }
    
    // Getters
    obtenerFuncionSeleccionada() {
        return this.funcionSeleccionada
    }
    
    obtenerLimites() {
        return {
            a: this.limiteA,
            b: this.limiteB,
            c: this.limiteC
        }
    }
    
    obtenerCalculos() {
        return {
            integralAC: this.integralAC,
            integralAB: this.integralAB,
            integralBC: this.integralBC,
            sumaAB_BC: this.sumaAB_BC
        }
    }
    
    obtenerVerificacion() {
        return {
            exitosa: this.verificacionExitosa,
            tolerancia: this.tolerancia
        }
    }
    
    obtenerEstadoValidacion() {
        return {
            valida: this.limitesValidos,
            mensaje: this.mensajeError
        }
    }
    
    obtenerDatosGrafico() {
        console.log('EstadoAditividad - Obteniendo datos del gráfico:', this.datosGrafico?.length || 0, 'puntos')
        return this.datosGrafico
    }
    
    obtenerPuntoHover() {
        return this.puntoHover
    }
    
    // Setters
    establecerFuncionSeleccionada(funcion) {
        this.funcionSeleccionada = funcion
    }
    
    establecerLimites(a, b, c) {
        this.limiteA = a
        this.limiteB = b
        this.limiteC = c
    }
    
    establecerCalculos(integralAC, integralAB, integralBC, sumaAB_BC) {
        this.integralAC = integralAC
        this.integralAB = integralAB
        this.integralBC = integralBC
        this.sumaAB_BC = sumaAB_BC
    }
    
    establecerVerificacion(exitosa) {
        this.verificacionExitosa = exitosa
    }
    
    establecerEstadoValidacion(valida, mensaje = "") {
        this.limitesValidos = valida
        this.mensajeError = mensaje
    }
    
    establecerDatosGrafico(datos) {
        console.log('EstadoAditividad - Estableciendo datos del gráfico:', datos?.length || 0, 'puntos')
        this.datosGrafico = datos
        console.log('EstadoAditividad - Datos establecidos:', this.datosGrafico?.length || 0, 'puntos')
    }
    
    establecerPuntoHover(punto) {
        this.puntoHover = punto
    }
    
    // Validación de límites
    validarLimites() {
        if (this.limiteA >= this.limiteB || this.limiteB >= this.limiteC) {
            this.establecerEstadoValidacion(false, "⚠️ Los límites deben cumplir: a < b < c")
            return false
        }
        this.establecerEstadoValidacion(true)
        return true
    }
}


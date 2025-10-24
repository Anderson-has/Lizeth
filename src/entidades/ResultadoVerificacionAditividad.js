/**
 * ResultadoVerificacionAditividad - Entidad que almacena el resultado de la verificación de aditividad
 * RESPONSABILIDAD ÚNICA: Solo almacenar resultados de verificación
 */
export class ResultadoVerificacionAditividad {
    constructor() {
        this.verificacionExitosa = false
        this.diferencia = 0
        this.tolerancia = 0.001
        this.mensaje = ""
        this.colorIndicador = "#ef4444" // Rojo por defecto
        this.icono = "❌"
    }
    
    // Getters
    obtenerVerificacionExitosa() {
        return this.verificacionExitosa
    }
    
    obtenerDiferencia() {
        return this.diferencia
    }
    
    obtenerTolerancia() {
        return this.tolerancia
    }
    
    obtenerMensaje() {
        return this.mensaje
    }
    
    obtenerColorIndicador() {
        return this.colorIndicador
    }
    
    obtenerIcono() {
        return this.icono
    }
    
    // Setters
    establecerVerificacion(integralAC, sumaAB_BC, tolerancia = 0.001) {
        this.diferencia = Math.abs(integralAC - sumaAB_BC)
        this.tolerancia = tolerancia
        this.verificacionExitosa = this.diferencia < tolerancia
        
        if (this.verificacionExitosa) {
            this.mensaje = "La propiedad de aditividad se cumple"
            this.colorIndicador = "#10b981" // Verde
            this.icono = "✅"
        } else {
            this.mensaje = "Los valores no coinciden"
            this.colorIndicador = "#ef4444" // Rojo
            this.icono = "❌"
        }
    }
    
    // Método para obtener resumen
    obtenerResumen() {
        return {
            exitosa: this.verificacionExitosa,
            diferencia: this.diferencia,
            tolerancia: this.tolerancia,
            mensaje: this.mensaje,
            color: this.colorIndicador,
            icono: this.icono
        }
    }
    
    // Método para formatear valores
    formatearValores() {
        return {
            diferencia: this.diferencia.toFixed(6),
            tolerancia: this.tolerancia.toFixed(6),
            cumple: this.verificacionExitosa ? "Sí" : "No"
        }
    }
}


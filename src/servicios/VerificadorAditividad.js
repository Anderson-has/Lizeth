/**
 * VerificadorAditividad - Servicio que verifica la propiedad de aditividad
 * RESPONSABILIDAD ÚNICA: Solo verificación de propiedades matemáticas
 */
export class VerificadorAditividad {
    constructor() {
        this.toleranciaPorDefecto = 0.001
    }
    
    // Verificar la propiedad de aditividad
    verificarAditividad(integralAC, sumaAB_BC, tolerancia = null) {
        const tol = tolerancia || this.toleranciaPorDefecto
        const diferencia = Math.abs(integralAC - sumaAB_BC)
        return diferencia < tol
    }
    
    // Calcular la diferencia entre los valores
    calcularDiferencia(integralAC, sumaAB_BC) {
        return Math.abs(integralAC - sumaAB_BC)
    }
    
    // Verificar con información detallada
    verificarConDetalles(integralAC, sumaAB_BC, tolerancia = null) {
        const tol = tolerancia || this.toleranciaPorDefecto
        const diferencia = this.calcularDiferencia(integralAC, sumaAB_BC)
        const exitosa = diferencia < tol
        
        return {
            exitosa: exitosa,
            diferencia: diferencia,
            tolerancia: tol,
            mensaje: exitosa ? 
                "La propiedad de aditividad se cumple" : 
                "Los valores no coinciden",
            icono: exitosa ? "✅" : "❌",
            color: exitosa ? "#10b981" : "#ef4444"
        }
    }
    
    // Verificar múltiples casos
    verificarMultiplesCasos(casos, tolerancia = null) {
        const resultados = []
        
        for (const caso of casos) {
            const resultado = this.verificarConDetalles(
                caso.integralAC, 
                caso.sumaAB_BC, 
                tolerancia
            )
            resultados.push({
                ...caso,
                verificacion: resultado
            })
        }
        
        return resultados
    }
    
    // Verificar con diferentes tolerancias
    verificarConTolerancias(integralAC, sumaAB_BC, tolerancias) {
        const resultados = []
        
        for (const tolerancia of tolerancias) {
            const resultado = this.verificarConDetalles(integralAC, sumaAB_BC, tolerancia)
            resultados.push({
                tolerancia: tolerancia,
                ...resultado
            })
        }
        
        return resultados
    }
    
    // Obtener estadísticas de verificación
    obtenerEstadisticas(resultados) {
        const exitosas = resultados.filter(r => r.exitosa).length
        const total = resultados.length
        const porcentaje = (exitosas / total) * 100
        
        return {
            exitosas: exitosas,
            total: total,
            porcentaje: porcentaje,
            todasExitosas: exitosas === total
        }
    }
    
    // Establecer nueva tolerancia por defecto
    establecerToleranciaPorDefecto(tolerancia) {
        this.toleranciaPorDefecto = tolerancia
    }
    
    // Obtener tolerancia por defecto
    obtenerToleranciaPorDefecto() {
        return this.toleranciaPorDefecto
    }
}


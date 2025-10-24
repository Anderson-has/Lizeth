/**
 * SERVICIO: FunctionScaler
 * RESPONSABILIDAD: Escalar funciones personalizadas para visualización
 * SRP: Solo maneja el escalado de funciones, no validación ni renderizado
 */
export class FunctionScaler {
    constructor() {
        this.samplePoints = 100
        this.maxRange = 8 // Rango visible [-4, 4]
    }

    // ✅ ESCALAR FUNCIÓN PARA VISUALIZACIÓN
    scaleFunction(func, domain, range) {
        try {
            const originalFunc = new Function('x', `return ${func}`)
            
            // Muestrear la función en el dominio
            const { minVal, maxVal, isValid } = this.sampleFunction(originalFunc, domain)
            
            if (!isValid) {
                return (x) => 0 // Función constante si no es válida
            }
            
            // Calcular factores de escalado
            const originalRange = maxVal - minVal
            const targetRange = range[1] - range[0]
            
            if (originalRange === 0) {
                return (x) => (range[0] + range[1]) / 2 // Función constante
            }
            
            const scale = targetRange / originalRange
            const offset = range[0] - minVal * scale
            
            return (x) => {
                try {
                    const result = originalFunc(x)
                    if (!isFinite(result)) return 0
                    
                    const scaledResult = result * scale + offset
                    return Math.max(range[0], Math.min(range[1], scaledResult))
                } catch {
                    return 0
                }
            }
        } catch (error) {
            console.error('Error escalando función:', error)
            return (x) => 0
        }
    }

    // ✅ MUESTREAR FUNCIÓN EN EL DOMINIO
    sampleFunction(func, domain) {
        let minVal = Infinity
        let maxVal = -Infinity
        let validPoints = 0
        
        for (let i = 0; i <= this.samplePoints; i++) {
            const x = domain[0] + (i / this.samplePoints) * (domain[1] - domain[0])
            try {
                const y = func(x)
                if (isFinite(y)) {
                    minVal = Math.min(minVal, y)
                    maxVal = Math.max(maxVal, y)
                    validPoints++
                }
            } catch {
                // Ignorar puntos problemáticos
            }
        }
        
        return {
            minVal: minVal === Infinity ? 0 : minVal,
            maxVal: maxVal === -Infinity ? 0 : maxVal,
            isValid: validPoints > 0
        }
    }

    // ✅ ESCALAR FUNCIÓN CON RANGO DINÁMICO
    scaleFunctionDynamic(func, domain, targetRange = [-4, 4]) {
        try {
            const originalFunc = new Function('x', `return ${func}`)
            
            // Muestrear función
            const { minVal, maxVal, isValid } = this.sampleFunction(originalFunc, domain)
            
            if (!isValid) {
                return (x) => 0
            }
            
            // Calcular rango dinámico basado en la función
            const originalRange = maxVal - minVal
            const padding = originalRange * 0.1 // 10% de padding
            
            const adjustedMin = minVal - padding
            const adjustedMax = maxVal + padding
            const adjustedRange = adjustedMax - adjustedMin
            
            if (adjustedRange === 0) {
                return (x) => 0
            }
            
            const scale = (targetRange[1] - targetRange[0]) / adjustedRange
            const offset = targetRange[0] - adjustedMin * scale
            
            return (x) => {
                try {
                    const result = originalFunc(x)
                    if (!isFinite(result)) return 0
                    
                    const scaledResult = result * scale + offset
                    return Math.max(targetRange[0], Math.min(targetRange[1], scaledResult))
                } catch {
                    return 0
                }
            }
        } catch (error) {
            console.error('Error en escalado dinámico:', error)
            return (x) => 0
        }
    }

    // ✅ OBTENER ESTADÍSTICAS DE LA FUNCIÓN
    getFunctionStats(func, domain) {
        try {
            const originalFunc = new Function('x', `return ${func}`)
            const { minVal, maxVal, isValid } = this.sampleFunction(originalFunc, domain)
            
            if (!isValid) {
                return {
                    min: 0,
                    max: 0,
                    range: 0,
                    isValid: false
                }
            }
            
            return {
                min: minVal,
                max: maxVal,
                range: maxVal - minVal,
                isValid: true
            }
        } catch (error) {
            return {
                min: 0,
                max: 0,
                range: 0,
                isValid: false
            }
        }
    }

    // ✅ ESCALAR FUNCIÓN CON LÍMITES DE SEGURIDAD
    scaleFunctionSafe(func, domain, range, maxValue = 1e6) {
        try {
            const originalFunc = new Function('x', `return ${func}`)
            
            return (x) => {
                try {
                    const result = originalFunc(x)
                    
                    // Verificar límites de seguridad
                    if (!isFinite(result) || Math.abs(result) > maxValue) {
                        return 0
                    }
                    
                    // Escalado simple si está dentro del rango
                    if (result >= range[0] && result <= range[1]) {
                        return result
                    }
                    
                    // Escalar proporcionalmente
                    const scale = (range[1] - range[0]) / (2 * maxValue)
                    const scaledResult = result * scale
                    
                    return Math.max(range[0], Math.min(range[1], scaledResult))
                } catch {
                    return 0
                }
            }
        } catch (error) {
            return (x) => 0
        }
    }
}


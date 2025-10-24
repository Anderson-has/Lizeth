/**
 * SERVICIO: CustomFunctionManager
 * RESPONSABILIDAD: Gestionar funciones personalizadas completas
 * SRP: Solo maneja la gestión de funciones personalizadas, no validación ni escalado
 */
export class CustomFunctionManager {
    constructor(validator, scaler) {
        this.validator = validator
        this.scaler = scaler
        this.functionCache = new Map()
        this.validationCache = new Map()
    }

    // ✅ CREAR FUNCIÓN PERSONALIZADA
    createCustomFunction(func, domain, range) {
        try {
            // Validar sintaxis
            const syntaxResult = this.validator.validateSyntax(func)
            if (!syntaxResult.valid) {
                throw new Error(`Error de sintaxis: ${syntaxResult.error}`)
            }

            // Validar variables
            const variablesResult = this.validator.validateVariables(func)
            if (!variablesResult.valid) {
                throw new Error(`Error de variables: ${variablesResult.error}`)
            }

            // Validar rango
            const rangeResult = this.validator.validateRange(func, domain[0], domain[1])
            if (!rangeResult.valid) {
                throw new Error(`Error de rango: ${rangeResult.error}`)
            }

            // Escalar función
            const scaledFunc = this.scaler.scaleFunction(func, domain, range)
            
            // Obtener estadísticas
            const stats = this.scaler.getFunctionStats(func, domain)

            return {
                original: func,
                scaled: scaledFunc,
                domain,
                range,
                stats,
                isValid: true,
                createdAt: Date.now()
            }
        } catch (error) {
            return {
                original: func,
                scaled: (x) => 0,
                domain,
                range,
                stats: { min: 0, max: 0, range: 0, isValid: false },
                isValid: false,
                error: error.message,
                createdAt: Date.now()
            }
        }
    }

    // ✅ VALIDAR FUNCIÓN CON CACHÉ
    validateFunctionCached(func, domain) {
        const key = `${func}_${domain[0]}_${domain[1]}`
        
        if (this.validationCache.has(key)) {
            return this.validationCache.get(key)
        }
        
        const result = this.validator.validateComplete(func, domain[0], domain[1])
        this.validationCache.set(key, result)
        
        return result
    }

    // ✅ OBTENER FUNCIÓN ESCALADA CON CACHÉ
    getScaledFunction(func, domain, range) {
        const key = `${func}_${domain[0]}_${domain[1]}_${range[0]}_${range[1]}`
        
        if (this.functionCache.has(key)) {
            return this.functionCache.get(key)
        }
        
        const scaledFunc = this.scaler.scaleFunction(func, domain, range)
        this.functionCache.set(key, scaledFunc)
        
        return scaledFunc
    }

    // ✅ LIMPIAR CACHÉ
    clearCache() {
        this.functionCache.clear()
        this.validationCache.clear()
    }

    // ✅ OBTENER ESTADÍSTICAS DE USO
    getUsageStats() {
        return {
            cachedFunctions: this.functionCache.size,
            cachedValidations: this.validationCache.size,
            totalMemory: this.estimateMemoryUsage()
        }
    }

    // ✅ ESTIMAR USO DE MEMORIA
    estimateMemoryUsage() {
        let totalSize = 0
        
        // Estimar tamaño del caché de funciones
        for (const [key, func] of this.functionCache) {
            totalSize += key.length * 2 // UTF-16
            totalSize += 100 // Estimación para la función
        }
        
        // Estimar tamaño del caché de validaciones
        for (const [key, validation] of this.validationCache) {
            totalSize += key.length * 2
            totalSize += validation.error ? validation.error.length * 2 : 0
        }
        
        return totalSize
    }

    // ✅ OBTENER FUNCIONES POPULARES
    getPopularFunctions() {
        return [
            { name: 'x²', code: 'x**2', usage: 45, description: 'Función cuadrática' },
            { name: 'sin(x)', code: 'Math.sin(x)', usage: 32, description: 'Seno' },
            { name: 'x³', code: 'x**3', usage: 28, description: 'Función cúbica' },
            { name: 'e^x', code: 'Math.exp(x)', usage: 15, description: 'Exponencial' },
            { name: 'ln(x)', code: 'Math.log(x)', usage: 12, description: 'Logaritmo natural' }
        ]
    }

    // ✅ OBTENER ERRORES COMUNES
    getCommonErrors() {
        return [
            { error: 'Sintaxis inválida', count: 23, examples: ['x**', 'sin(x'] },
            { error: 'Variable no permitida', count: 18, examples: ['y**2', 'Math.random()'] },
            { error: 'División por cero', count: 15, examples: ['1/x', 'x/0'] },
            { error: 'Función no definida', count: 12, examples: ['Math.sen(x)', 'Math.tan(x)'] }
        ]
    }

    // ✅ OBTENER SUGERENCIAS INTELIGENTES
    getSmartSuggestions(currentFunc, domain) {
        const suggestions = []
        
        // Si la función está vacía, sugerir funciones básicas
        if (!currentFunc || currentFunc.trim() === '') {
            return this.validator.getFunctionSuggestions().slice(0, 4)
        }
        
        // Si hay un error de sintaxis, sugerir correcciones
        const syntaxResult = this.validator.validateSyntax(currentFunc)
        if (!syntaxResult.valid) {
            if (currentFunc.includes('**') && !currentFunc.includes('**2')) {
                suggestions.push({ name: 'x²', code: 'x**2', description: 'Completar potencia' })
            }
            if (currentFunc.includes('sin') && !currentFunc.includes('Math.')) {
                suggestions.push({ name: 'sin(x)', code: 'Math.sin(x)', description: 'Usar Math.sin' })
            }
        }
        
        // Si la función es válida, sugerir extensiones
        if (syntaxResult.valid) {
            if (currentFunc.includes('x**2')) {
                suggestions.push({ name: 'x² + 1', code: 'x**2 + 1', description: 'Agregar constante' })
            }
            if (currentFunc.includes('Math.sin')) {
                suggestions.push({ name: 'sin(x) + cos(x)', code: 'Math.sin(x) + Math.cos(x)', description: 'Agregar coseno' })
            }
        }
        
        return suggestions
    }

    // ✅ EXPORTAR FUNCIÓN
    exportFunction(customFunction) {
        return {
            function: customFunction.original,
            domain: customFunction.domain,
            range: customFunction.range,
            stats: customFunction.stats,
            isValid: customFunction.isValid,
            exportedAt: Date.now()
        }
    }

    // ✅ IMPORTAR FUNCIÓN
    importFunction(functionData) {
        try {
            const { function: func, domain, range } = functionData
            
            // Validar datos importados
            if (!func || !domain || !range) {
                throw new Error('Datos de función incompletos')
            }
            
            // Crear función personalizada
            return this.createCustomFunction(func, domain, range)
        } catch (error) {
            return {
                original: '',
                scaled: (x) => 0,
                domain: [-4, 4],
                range: [-4, 4],
                stats: { min: 0, max: 0, range: 0, isValid: false },
                isValid: false,
                error: `Error importando función: ${error.message}`,
                createdAt: Date.now()
            }
        }
    }
}


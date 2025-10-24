/**
 * SERVICIO: FunctionValidator
 * RESPONSABILIDAD: Validar funciones matemáticas personalizadas
 * SRP: Solo maneja la validación de funciones, no renderizado ni cálculos
 */
export class FunctionValidator {
    constructor() {
        this.allowedVars = ['x']
        this.allowedFunctions = ['Math', 'cos', 'sin', 'tan', 'exp', 'log', 'sqrt', 'abs']
        this.allowedConstants = ['Math.PI', 'Math.E']
    }

    // ✅ VALIDAR SINTAXIS BÁSICA
    validateSyntax(func) {
        try {
            // Verificar que no esté vacía
            if (!func || func.trim() === '') {
                return { valid: false, error: 'La función no puede estar vacía' }
            }

            // Crear función JavaScript
            const testFunc = new Function('x', `return ${func}`)
            
            // Probar con un valor simple
            const testValue = testFunc(1)
            
            if (!isFinite(testValue)) {
                return { valid: false, error: 'La función produce valores no finitos' }
            }
            
            return { valid: true, error: '' }
        } catch (error) {
            return { valid: false, error: 'Sintaxis inválida. Verifica la expresión matemática' }
        }
    }

    // ✅ VALIDAR VARIABLES PERMITIDAS
    validateVariables(func) {
        try {
            // Extraer todas las variables y funciones del código
            const userVars = func.match(/[a-zA-Z_][a-zA-Z0-9_]*/g) || []
            
            // Filtrar variables no permitidas
            const invalidVars = userVars.filter(v => 
                !this.allowedVars.includes(v) && 
                !v.startsWith('Math.') && 
                !this.allowedFunctions.includes(v) &&
                !this.allowedConstants.includes(v)
            )
            
            if (invalidVars.length > 0) {
                return { 
                    valid: false, 
                    error: `Variables no permitidas: ${invalidVars.join(', ')}. Solo usa 'x' y funciones como Math.cos, Math.sin, etc.` 
                }
            }
            
            return { valid: true, error: '' }
        } catch (error) {
            return { valid: false, error: 'Error al validar variables' }
        }
    }

    // ✅ VALIDAR RANGO DE LA FUNCIÓN
    validateRange(func, a, b) {
        try {
            const testFunc = new Function('x', `return ${func}`)
            const numPoints = 20
            const step = (b - a) / numPoints
            
            for (let i = 0; i <= numPoints; i++) {
                const x = a + i * step
                const y = testFunc(x)
                
                if (!isFinite(y)) {
                    return { 
                        valid: false, 
                        error: `Discontinuidad en x ≈ ${x.toFixed(2)}` 
                    }
                }
                
                if (Math.abs(y) > 1e6) {
                    return { 
                        valid: false, 
                        error: `Valores muy grandes cerca de x ≈ ${x.toFixed(2)}` 
                    }
                }
            }
            
            return { valid: true, error: '' }
        } catch (error) {
            return { valid: false, error: 'Error al evaluar la función en el rango especificado' }
        }
    }

    // ✅ VALIDACIÓN COMPLETA
    validateComplete(func, a, b) {
        // 1. Validar sintaxis
        const syntaxResult = this.validateSyntax(func)
        if (!syntaxResult.valid) {
            return syntaxResult
        }

        // 2. Validar variables
        const variablesResult = this.validateVariables(func)
        if (!variablesResult.valid) {
            return variablesResult
        }

        // 3. Validar rango
        const rangeResult = this.validateRange(func, a, b)
        if (!rangeResult.valid) {
            return rangeResult
        }

        return { valid: true, error: '' }
    }

    // ✅ OBTENER SUGERENCIAS DE FUNCIONES
    getFunctionSuggestions() {
        return [
            { name: 'x²', code: 'x**2', description: 'Función cuadrática' },
            { name: 'x³', code: 'x**3', description: 'Función cúbica' },
            { name: 'sin(x)', code: 'Math.sin(x)', description: 'Seno' },
            { name: 'cos(x)', code: 'Math.cos(x)', description: 'Coseno' },
            { name: 'e^x', code: 'Math.exp(x)', description: 'Exponencial' },
            { name: 'ln(x)', code: 'Math.log(x)', description: 'Logaritmo natural' },
            { name: '√x', code: 'Math.sqrt(x)', description: 'Raíz cuadrada' },
            { name: '|x|', code: 'Math.abs(x)', description: 'Valor absoluto' }
        ]
    }

    // ✅ OBTENER EJEMPLOS DE FUNCIONES COMPLEJAS
    getComplexExamples() {
        return [
            { name: 'sin(x²)', code: 'Math.sin(x**2)', description: 'Seno de x al cuadrado' },
            { name: 'e^(-x)', code: 'Math.exp(-x)', description: 'Exponencial negativa' },
            { name: 'x·sin(x)', code: 'x * Math.sin(x)', description: 'x por seno de x' },
            { name: 'sin(x) + cos(x)', code: 'Math.sin(x) + Math.cos(x)', description: 'Suma de funciones trigonométricas' },
            { name: 'x² + 2x + 1', code: 'x**2 + 2*x + 1', description: 'Polinomio cuadrático' }
        ]
    }
}


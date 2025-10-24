/**
 * SERVICIO: CalculadoraSegundoTeorema
 * RESPONSABILIDAD: Realizar cálculos específicos del Segundo Teorema Fundamental del Cálculo
 * SRP: Solo maneja lógica de cálculo, no almacena datos ni maneja presentación
 */
export class CalculadoraSegundoTeorema {
    constructor() {
        this.toleranciaNumerica = 0.01
        this.pasoDerivada = 1e-5
        this.puntosPrueba = [-2, -1, 0, 1, 2]
    }

    // ✅ VALIDAR FUNCIÓN PERSONALIZADA
    validarFuncionPersonalizada(funcion) {
        try {
            // Verificar sintaxis
            const testFunc = new Function('x', `return ${funcion}`)
            const testValue = testFunc(1)
            
            if (!isFinite(testValue)) {
                return { valida: false, error: 'La función produce valores no finitos' }
            }

            // Verificar variables permitidas
            const variablesPermitidas = ['x']
            const funcionesPermitidas = ['Math', 'cos', 'sin', 'tan', 'exp', 'log', 'sqrt', 'abs', 'pow']
            const variablesEncontradas = funcion.match(/[a-zA-Z_][a-zA-Z0-9_]*/g) || []
            const variablesInvalidas = variablesEncontradas.filter(v => 
                !variablesPermitidas.includes(v) && 
                !v.startsWith('Math.') && 
                !funcionesPermitidas.includes(v)
            )
            
            if (variablesInvalidas.length > 0) {
                return { 
                    valida: false, 
                    error: `Variables no permitidas: ${variablesInvalidas.join(', ')}. Solo usa 'x' y funciones como Math.cos, Math.sin, etc.` 
                }
            }

            return { valida: true, error: '' }
        } catch (error) {
            return { valida: false, error: 'Sintaxis inválida en la función' }
        }
    }

    // ✅ VALIDAR ANTIDERIVADA
    validarAntiderivada(antiderivadaUsuario, funcionOriginal) {
        try {
            // Verificar que no contenga integrales indefinidas
            if (antiderivadaUsuario.includes('∫') || 
                antiderivadaUsuario.includes('integral') || 
                antiderivadaUsuario.includes('dx')) {
                return { 
                    valida: false, 
                    error: 'No ingreses integrales indefinidas. Solo la función F(x)' 
                }
            }

            // Verificar sintaxis
            const testFunc = new Function('x', `return ${antiderivadaUsuario}`)
            const testValue = testFunc(1)
            
            if (!isFinite(testValue)) {
                return { valida: false, error: 'La antiderivada produce valores no finitos' }
            }

            // Verificar que la derivada de F(x) sea igual a f(x)
            for (const x of this.puntosPrueba) {
                try {
                    const derivadaNumerica = this.calcularDerivadaNumerica(testFunc, x)
                    const valorOriginal = funcionOriginal(x)
                    
                    if (!isFinite(derivadaNumerica) || !isFinite(valorOriginal)) {
                        return { valida: false, error: 'La función produce valores no finitos' }
                    }
                    
                    if (Math.abs(derivadaNumerica - valorOriginal) > this.toleranciaNumerica) {
                        return { 
                            valida: false, 
                            error: `La derivada de F(x) no es igual a f(x) en x = ${x}. Derivada: ${derivadaNumerica.toFixed(4)}, Original: ${valorOriginal.toFixed(4)}` 
                        }
                    }
                } catch (error) {
                    return { valida: false, error: 'Error al evaluar la antiderivada' }
                }
            }
            
            return { valida: true, error: '' }
        } catch (error) {
            return { valida: false, error: 'Sintaxis inválida en la antiderivada' }
        }
    }

    // ✅ CALCULAR DERIVADA NUMÉRICA
    calcularDerivadaNumerica(funcion, x) {
        const h = this.pasoDerivada
        return (funcion(x + h) - funcion(x - h)) / (2 * h)
    }

    // ✅ EVALUAR FUNCIÓN EN UN PUNTO
    evaluarFuncion(funcion, x) {
        try {
            if (typeof funcion === 'function') {
                return funcion(x)
            } else if (typeof funcion === 'string') {
                const func = new Function('x', `return ${funcion}`)
                return func(x)
            }
            return 0
        } catch (error) {
            return 0
        }
    }

    // ✅ EVALUAR ANTIDERIVADA EN LÍMITES
    evaluarAntiderivadaEnLimites(antiderivada, a, b) {
        try {
            const funcion = new Function('x', `return ${antiderivada}`)
            const valorA = funcion(a)
            const valorB = funcion(b)
            
            if (!isFinite(valorA) || !isFinite(valorB)) {
                return { 
                    exitosa: false, 
                    error: 'La antiderivada produce valores no finitos en los límites',
                    valorA: 0,
                    valorB: 0,
                    resultado: 0
                }
            }
            
            const resultado = valorB - valorA
            
            return {
                exitosa: true,
                error: '',
                valorA,
                valorB,
                resultado
            }
        } catch (error) {
            return {
                exitosa: false,
                error: 'Error al evaluar la antiderivada en los límites',
                valorA: 0,
                valorB: 0,
                resultado: 0
            }
        }
    }

    // ✅ CALCULAR INTEGRAL DEFINIDA
    calcularIntegralDefinida(funcion, a, b) {
        try {
            // Usar el Segundo Teorema Fundamental: ∫[a,b] f(x)dx = F(b) - F(a)
            const antiderivada = this.obtenerAntiderivada(funcion)
            if (!antiderivada) {
                return {
                    exitosa: false,
                    error: 'No se puede determinar la antiderivada automáticamente',
                    resultado: 0
                }
            }
            
            const evaluacion = this.evaluarAntiderivadaEnLimites(antiderivada, a, b)
            return {
                exitosa: evaluacion.exitosa,
                error: evaluacion.error,
                resultado: evaluacion.resultado,
                antiderivada,
                valorA: evaluacion.valorA,
                valorB: evaluacion.valorB
            }
        } catch (error) {
            return {
                exitosa: false,
                error: 'Error al calcular la integral definida',
                resultado: 0
            }
        }
    }

    // ✅ OBTENER ANTIDERIVADA CONOCIDA
    obtenerAntiderivada(funcion) {
        // Para funciones conocidas, retornar la antiderivada
        if (funcion === Math.sin) return '-cos(x)'
        if (funcion === Math.cos) return 'sin(x)'
        if (funcion === Math.exp) return 'exp(x)'
        
        // Para funciones personalizadas, no podemos determinar automáticamente
        return null
    }

    // ✅ VERIFICAR CORRECCIÓN DE ANTIDERIVADA
    verificarCorreccionAntiderivada(antiderivadaUsuario, antiderivadaCorrecta) {
        // Normalizar las expresiones para comparación
        const normalizar = (expr) => expr.replace(/\s+/g, '').toLowerCase()
        const usuarioNormalizada = normalizar(antiderivadaUsuario)
        const correctaNormalizada = normalizar(antiderivadaCorrecta)
        
        return usuarioNormalizada === correctaNormalizada
    }

    // ✅ CALCULAR MÉTRICAS DE RENDIMIENTO
    calcularMetricasRendimiento(tiempoInicio, tiempoFin, intentos, correcto) {
        const tiempoTotal = (tiempoFin - tiempoInicio) / 1000 // en segundos
        const velocidad = correcto ? tiempoTotal : null
        const eficiencia = intentos > 0 ? (correcto ? 1 / intentos : 0) : 0
        
        return {
            tiempoTotal,
            velocidad,
            eficiencia,
            intentos,
            correcto
        }
    }

    // ✅ GENERAR PUNTOS PARA GRÁFICA
    generarPuntosGrafica(funcion, a, b, numPuntos = 100) {
        const puntos = []
        const paso = (b - a) / (numPuntos - 1)
        
        for (let i = 0; i < numPuntos; i++) {
            const x = a + i * paso
            const y = this.evaluarFuncion(funcion, x)
            puntos.push({ x, y })
        }
        
        return puntos
    }

    // ✅ CALCULAR ÁREA BAJO LA CURVA
    calcularAreaBajoCurva(funcion, a, b, metodo = 'trapecio', numPuntos = 1000) {
        const puntos = this.generarPuntosGrafica(funcion, a, b, numPuntos)
        let area = 0
        
        if (metodo === 'trapecio') {
            for (let i = 0; i < puntos.length - 1; i++) {
                const x1 = puntos[i].x
                const x2 = puntos[i + 1].x
                const y1 = puntos[i].y
                const y2 = puntos[i + 1].y
                
                // Solo sumar si y >= 0 (área positiva)
                if (y1 >= 0 && y2 >= 0) {
                    area += (x2 - x1) * (y1 + y2) / 2
                }
            }
        }
        
        return area
    }

    // ✅ VALIDAR EVALUACIÓN EN LÍMITES
    validarEvaluacionLimites(evaluacionA, evaluacionB, antiderivada, a, b) {
        try {
            // Verificar que sean números válidos
            const numA = parseFloat(evaluacionA)
            const numB = parseFloat(evaluacionB)
            
            if (isNaN(numA) || isNaN(numB)) {
                return { 
                    valida: false, 
                    error: 'Los valores deben ser números válidos' 
                }
            }
            
            if (!isFinite(numA) || !isFinite(numB)) {
                return { 
                    valida: false, 
                    error: 'Los valores deben ser finitos' 
                }
            }
            
            // Verificar que coincidan con la evaluación real de la antiderivada
            const evaluacionReal = this.evaluarAntiderivadaEnLimites(antiderivada, a, b)
            if (!evaluacionReal.exitosa) {
                return { 
                    valida: false, 
                    error: 'Error al evaluar la antiderivada' 
                }
            }
            
            const tolerancia = 0.1
            if (Math.abs(numA - evaluacionReal.valorA) > tolerancia) {
                return { 
                    valida: false, 
                    error: `F(${a}) no es correcto. Valor esperado: ${evaluacionReal.valorA.toFixed(4)}` 
                }
            }
            
            if (Math.abs(numB - evaluacionReal.valorB) > tolerancia) {
                return { 
                    valida: false, 
                    error: `F(${b}) no es correcto. Valor esperado: ${evaluacionReal.valorB.toFixed(4)}` 
                }
            }
            
            return { valida: true, error: '' }
        } catch (error) {
            return { 
                valida: false, 
                error: 'Error al validar la evaluación' 
            }
        }
    }
}


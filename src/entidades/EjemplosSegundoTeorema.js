/**
 * ENTIDAD: EjemplosSegundoTeorema
 * RESPONSABILIDAD: Almacenar y gestionar ejemplos específicos del Segundo Teorema Fundamental del Cálculo
 * SRP: Solo maneja datos de ejemplos, no realiza cálculos ni renderizado
 */
export class EjemplosSegundoTeorema {
    constructor() {
        this.ejemplos = {
            seno: {
                id: 'seno',
                titulo: 'Integral de sin(x)',
                descripcion: 'Calcular ∫[0, π] sin(x) dx usando el Segundo Teorema Fundamental',
                dificultad: 'basico',
                funcion: 'sin(x)',
                antiderivada: '-cos(x)',
                limiteA: 0,
                limiteB: Math.PI,
                evaluacionA: '-cos(0) = -1',
                evaluacionB: '-cos(π) = 1',
                resultado: 2,
                explicacion: 'La antiderivada de sin(x) es -cos(x). Evaluando en los límites: -cos(π) - (-cos(0)) = 1 - (-1) = 2',
                pasos: [
                    {
                        numero: 1,
                        titulo: 'Identificar la función',
                        descripcion: 'f(x) = sin(x)',
                        formula: 'f(x) = sin(x)',
                        explicacion: 'Queremos integrar la función seno desde 0 hasta π'
                    },
                    {
                        numero: 2,
                        titulo: 'Encontrar la antiderivada',
                        descripcion: 'F(x) = -cos(x)',
                        formula: 'F(x) = -cos(x)',
                        explicacion: 'La antiderivada de sin(x) es -cos(x) porque (-cos(x))\' = sin(x)'
                    },
                    {
                        numero: 3,
                        titulo: 'Evaluar en los límites',
                        descripcion: 'F(0) y F(π)',
                        formula: 'F(0) = -cos(0) = -1\nF(π) = -cos(π) = 1',
                        explicacion: 'Evaluamos la antiderivada en los puntos límite del intervalo'
                    },
                    {
                        numero: 4,
                        titulo: 'Calcular la diferencia',
                        descripcion: 'F(π) - F(0)',
                        formula: '∫[0,π] sin(x) dx = F(π) - F(0) = 1 - (-1) = 2',
                        explicacion: 'Aplicamos la fórmula del Segundo Teorema Fundamental'
                    }
                ],
                pistas: [
                    'Recuerda que la derivada de -cos(x) es sin(x)',
                    'Evalúa cuidadosamente cos(0) y cos(π)',
                    'El resultado debe ser un número positivo'
                ],
                variaciones: [
                    {
                        titulo: 'Con diferentes límites',
                        limiteA: 0,
                        limiteB: Math.PI / 2,
                        resultado: 1,
                        explicacion: '∫[0,π/2] sin(x) dx = -cos(π/2) - (-cos(0)) = 0 - (-1) = 1'
                    }
                ]
            },
            
            coseno: {
                id: 'coseno',
                titulo: 'Integral de cos(x)',
                descripcion: 'Calcular ∫[0, π/2] cos(x) dx usando el Segundo Teorema Fundamental',
                dificultad: 'basico',
                funcion: 'cos(x)',
                antiderivada: 'sin(x)',
                limiteA: 0,
                limiteB: Math.PI / 2,
                evaluacionA: 'sin(0) = 0',
                evaluacionB: 'sin(π/2) = 1',
                resultado: 1,
                explicacion: 'La antiderivada de cos(x) es sin(x). Evaluando en los límites: sin(π/2) - sin(0) = 1 - 0 = 1',
                pasos: [
                    {
                        numero: 1,
                        titulo: 'Identificar la función',
                        descripcion: 'f(x) = cos(x)',
                        formula: 'f(x) = cos(x)',
                        explicacion: 'Queremos integrar la función coseno desde 0 hasta π/2'
                    },
                    {
                        numero: 2,
                        titulo: 'Encontrar la antiderivada',
                        descripcion: 'F(x) = sin(x)',
                        formula: 'F(x) = sin(x)',
                        explicacion: 'La antiderivada de cos(x) es sin(x) porque (sin(x))\' = cos(x)'
                    },
                    {
                        numero: 3,
                        titulo: 'Evaluar en los límites',
                        descripcion: 'F(0) y F(π/2)',
                        formula: 'F(0) = sin(0) = 0\nF(π/2) = sin(π/2) = 1',
                        explicacion: 'Evaluamos la antiderivada en los puntos límite del intervalo'
                    },
                    {
                        numero: 4,
                        titulo: 'Calcular la diferencia',
                        descripcion: 'F(π/2) - F(0)',
                        formula: '∫[0,π/2] cos(x) dx = F(π/2) - F(0) = 1 - 0 = 1',
                        explicacion: 'Aplicamos la fórmula del Segundo Teorema Fundamental'
                    }
                ],
                pistas: [
                    'La derivada de sin(x) es cos(x)',
                    'Recuerda que sin(0) = 0 y sin(π/2) = 1',
                    'Este es un ejemplo clásico de integración trigonométrica'
                ],
                variaciones: [
                    {
                        titulo: 'Con límites simétricos',
                        limiteA: -Math.PI / 2,
                        limiteB: Math.PI / 2,
                        resultado: 2,
                        explicacion: '∫[-π/2,π/2] cos(x) dx = sin(π/2) - sin(-π/2) = 1 - (-1) = 2'
                    }
                ]
            },
            
            exponencial: {
                id: 'exponencial',
                titulo: 'Integral de e^x',
                descripcion: 'Calcular ∫[0, 1] e^x dx usando el Segundo Teorema Fundamental',
                dificultad: 'intermedio',
                funcion: 'e^x',
                antiderivada: 'e^x',
                limiteA: 0,
                limiteB: 1,
                evaluacionA: 'e^0 = 1',
                evaluacionB: 'e^1 = e',
                resultado: Math.E - 1,
                explicacion: 'La antiderivada de e^x es e^x. Evaluando en los límites: e^1 - e^0 = e - 1',
                pasos: [
                    {
                        numero: 1,
                        titulo: 'Identificar la función',
                        descripcion: 'f(x) = e^x',
                        formula: 'f(x) = e^x',
                        explicacion: 'Queremos integrar la función exponencial desde 0 hasta 1'
                    },
                    {
                        numero: 2,
                        titulo: 'Encontrar la antiderivada',
                        descripcion: 'F(x) = e^x',
                        formula: 'F(x) = e^x',
                        explicacion: 'La antiderivada de e^x es e^x porque (e^x)\' = e^x'
                    },
                    {
                        numero: 3,
                        titulo: 'Evaluar en los límites',
                        descripcion: 'F(0) y F(1)',
                        formula: 'F(0) = e^0 = 1\nF(1) = e^1 = e',
                        explicacion: 'Evaluamos la antiderivada en los puntos límite del intervalo'
                    },
                    {
                        numero: 4,
                        titulo: 'Calcular la diferencia',
                        descripcion: 'F(1) - F(0)',
                        formula: '∫[0,1] e^x dx = F(1) - F(0) = e - 1',
                        explicacion: 'Aplicamos la fórmula del Segundo Teorema Fundamental'
                    }
                ],
                pistas: [
                    'La función exponencial es su propia antiderivada',
                    'Recuerda que e^0 = 1 y e^1 = e ≈ 2.718',
                    'El resultado será e - 1'
                ],
                variaciones: [
                    {
                        titulo: 'Con límites negativos',
                        limiteA: -1,
                        limiteB: 1,
                        resultado: Math.E - 1 / Math.E,
                        explicacion: '∫[-1,1] e^x dx = e^1 - e^(-1) = e - 1/e'
                    }
                ]
            },
            
            polinomio: {
                id: 'polinomio',
                titulo: 'Integral de x²',
                descripcion: 'Calcular ∫[0, 2] x² dx usando el Segundo Teorema Fundamental',
                dificultad: 'intermedio',
                funcion: 'x²',
                antiderivada: 'x³/3',
                limiteA: 0,
                limiteB: 2,
                evaluacionA: '0³/3 = 0',
                evaluacionB: '2³/3 = 8/3',
                resultado: 8/3,
                explicacion: 'La antiderivada de x² es x³/3. Evaluando en los límites: 2³/3 - 0³/3 = 8/3 - 0 = 8/3',
                pasos: [
                    {
                        numero: 1,
                        titulo: 'Identificar la función',
                        descripcion: 'f(x) = x²',
                        formula: 'f(x) = x²',
                        explicacion: 'Queremos integrar la función cuadrática desde 0 hasta 2'
                    },
                    {
                        numero: 2,
                        titulo: 'Encontrar la antiderivada',
                        descripcion: 'F(x) = x³/3',
                        formula: 'F(x) = x³/3',
                        explicacion: 'La antiderivada de x² es x³/3 porque (x³/3)\' = x²'
                    },
                    {
                        numero: 3,
                        titulo: 'Evaluar en los límites',
                        descripcion: 'F(0) y F(2)',
                        formula: 'F(0) = 0³/3 = 0\nF(2) = 2³/3 = 8/3',
                        explicacion: 'Evaluamos la antiderivada en los puntos límite del intervalo'
                    },
                    {
                        numero: 4,
                        titulo: 'Calcular la diferencia',
                        descripcion: 'F(2) - F(0)',
                        formula: '∫[0,2] x² dx = F(2) - F(0) = 8/3 - 0 = 8/3',
                        explicacion: 'Aplicamos la fórmula del Segundo Teorema Fundamental'
                    }
                ],
                pistas: [
                    'Para x^n, la antiderivada es x^(n+1)/(n+1)',
                    'En este caso: x² → x³/3',
                    'Verifica que (x³/3)\' = x²'
                ],
                variaciones: [
                    {
                        titulo: 'Con límites diferentes',
                        limiteA: 1,
                        limiteB: 3,
                        resultado: 26/3,
                        explicacion: '∫[1,3] x² dx = 3³/3 - 1³/3 = 27/3 - 1/3 = 26/3'
                    }
                ]
            },
            
            trigonometrica: {
                id: 'trigonometrica',
                titulo: 'Integral de sin²(x)',
                descripcion: 'Calcular ∫[0, π] sin²(x) dx usando el Segundo Teorema Fundamental',
                dificultad: 'avanzado',
                funcion: 'sin²(x)',
                antiderivada: 'x/2 - sin(2x)/4',
                limiteA: 0,
                limiteB: Math.PI,
                evaluacionA: '0/2 - sin(0)/4 = 0',
                evaluacionB: 'π/2 - sin(2π)/4 = π/2',
                resultado: Math.PI / 2,
                explicacion: 'La antiderivada de sin²(x) es x/2 - sin(2x)/4. Evaluando: π/2 - sin(2π)/4 - (0/2 - sin(0)/4) = π/2',
                pasos: [
                    {
                        numero: 1,
                        titulo: 'Identificar la función',
                        descripcion: 'f(x) = sin²(x)',
                        formula: 'f(x) = sin²(x)',
                        explicacion: 'Queremos integrar la función seno al cuadrado desde 0 hasta π'
                    },
                    {
                        numero: 2,
                        titulo: 'Encontrar la antiderivada',
                        descripcion: 'F(x) = x/2 - sin(2x)/4',
                        formula: 'F(x) = x/2 - sin(2x)/4',
                        explicacion: 'Usando la identidad sin²(x) = (1 - cos(2x))/2, la antiderivada es x/2 - sin(2x)/4'
                    },
                    {
                        numero: 3,
                        titulo: 'Evaluar en los límites',
                        descripcion: 'F(0) y F(π)',
                        formula: 'F(0) = 0/2 - sin(0)/4 = 0\nF(π) = π/2 - sin(2π)/4 = π/2',
                        explicacion: 'Evaluamos la antiderivada en los puntos límite del intervalo'
                    },
                    {
                        numero: 4,
                        titulo: 'Calcular la diferencia',
                        descripcion: 'F(π) - F(0)',
                        formula: '∫[0,π] sin²(x) dx = F(π) - F(0) = π/2 - 0 = π/2',
                        explicacion: 'Aplicamos la fórmula del Segundo Teorema Fundamental'
                    }
                ],
                pistas: [
                    'Usa la identidad sin²(x) = (1 - cos(2x))/2',
                    'La antiderivada de 1/2 es x/2',
                    'La antiderivada de -cos(2x)/2 es -sin(2x)/4'
                ],
                variaciones: [
                    {
                        titulo: 'Con cos²(x)',
                        funcion: 'cos²(x)',
                        antiderivada: 'x/2 + sin(2x)/4',
                        resultado: Math.PI / 2,
                        explicacion: '∫[0,π] cos²(x) dx también es π/2 por simetría'
                    }
                ]
            }
        }
        
        this.categorias = {
            basico: {
                nombre: 'Básico',
                descripcion: 'Ejemplos fundamentales con funciones simples',
                color: '#10B981',
                ejemplos: ['seno', 'coseno']
            },
            intermedio: {
                nombre: 'Intermedio',
                descripcion: 'Ejemplos con funciones más complejas',
                color: '#F59E0B',
                ejemplos: ['exponencial', 'polinomio']
            },
            avanzado: {
                nombre: 'Avanzado',
                descripcion: 'Ejemplos con técnicas especiales',
                color: '#EF4444',
                ejemplos: ['trigonometrica']
            }
        }
    }

    // ✅ OBTENER EJEMPLO POR ID
    obtenerEjemplo(id) {
        return this.ejemplos[id] || null
    }

    // ✅ OBTENER TODOS LOS EJEMPLOS
    obtenerTodosLosEjemplos() {
        return Object.values(this.ejemplos)
    }

    // ✅ OBTENER EJEMPLOS POR DIFICULTAD
    obtenerEjemplosPorDificultad(dificultad) {
        return Object.values(this.ejemplos).filter(ejemplo => ejemplo.dificultad === dificultad)
    }

    // ✅ OBTENER EJEMPLOS POR CATEGORÍA
    obtenerEjemplosPorCategoria(categoria) {
        const ejemplosCategoria = this.categorias[categoria]?.ejemplos || []
        return ejemplosCategoria.map(id => this.ejemplos[id]).filter(Boolean)
    }

    // ✅ OBTENER CATEGORÍAS
    obtenerCategorias() {
        return this.categorias
    }

    // ✅ OBTENER EJEMPLO ALEATORIO
    obtenerEjemploAleatorio(dificultad = null) {
        let ejemplosDisponibles = Object.values(this.ejemplos)
        
        if (dificultad) {
            ejemplosDisponibles = ejemplosDisponibles.filter(ejemplo => ejemplo.dificultad === dificultad)
        }
        
        if (ejemplosDisponibles.length === 0) {
            return null
        }
        
        const indiceAleatorio = Math.floor(Math.random() * ejemplosDisponibles.length)
        return ejemplosDisponibles[indiceAleatorio]
    }

    // ✅ OBTENER SIGUIENTE EJEMPLO
    obtenerSiguienteEjemplo(ejemploActual) {
        const ejemplos = Object.values(this.ejemplos)
        const indiceActual = ejemplos.findIndex(ejemplo => ejemplo.id === ejemploActual.id)
        
        if (indiceActual === -1 || indiceActual === ejemplos.length - 1) {
            return ejemplos[0] // Volver al primero
        }
        
        return ejemplos[indiceActual + 1]
    }

    // ✅ OBTENER EJEMPLO ANTERIOR
    obtenerEjemploAnterior(ejemploActual) {
        const ejemplos = Object.values(this.ejemplos)
        const indiceActual = ejemplos.findIndex(ejemplo => ejemplo.id === ejemploActual.id)
        
        if (indiceActual === -1 || indiceActual === 0) {
            return ejemplos[ejemplos.length - 1] // Ir al último
        }
        
        return ejemplos[indiceActual - 1]
    }

    // ✅ OBTENER ESTADÍSTICAS
    obtenerEstadisticas() {
        const ejemplos = Object.values(this.ejemplos)
        const total = ejemplos.length
        
        const porDificultad = ejemplos.reduce((acc, ejemplo) => {
            acc[ejemplo.dificultad] = (acc[ejemplo.dificultad] || 0) + 1
            return acc
        }, {})
        
        return {
            total,
            porDificultad,
            categorias: Object.keys(this.categorias).length
        }
    }

    // ✅ BUSCAR EJEMPLOS
    buscarEjemplos(termino) {
        const ejemplos = Object.values(this.ejemplos)
        const terminoLower = termino.toLowerCase()
        
        return ejemplos.filter(ejemplo => 
            ejemplo.titulo.toLowerCase().includes(terminoLower) ||
            ejemplo.descripcion.toLowerCase().includes(terminoLower) ||
            ejemplo.funcion.toLowerCase().includes(terminoLower)
        )
    }

    // ✅ OBTENER EJEMPLO CON PASOS DETALLADOS
    obtenerEjemploConPasos(id) {
        const ejemplo = this.obtenerEjemplo(id)
        if (!ejemplo) return null
        
        return {
            ...ejemplo,
            pasosDetallados: ejemplo.pasos.map((paso, index) => ({
                ...paso,
                esUltimo: index === ejemplo.pasos.length - 1,
                esPrimero: index === 0
            }))
        }
    }
}

